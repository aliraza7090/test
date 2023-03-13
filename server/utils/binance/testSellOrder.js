import _ from "lodash";
import logger from "#utils/logger";
import {Bot} from "#models/bot.model";
import cache from "#utils/common/Cache";
import {BOT_STATUS, EXCHANGES} from "#constants/index";
import {UserModel} from "#models/user.model";
import {BotSetting} from "#models/bot_setting.model";
import extractApiKeys from "#utils/common/extractApiKeys";
import handleBotStatus from "#utils/common/handleBotStatus";
import createOrderParams from "#utils/binance/createOrderParams";
import {Profit} from "#models/profit.model";

export default async function testSellOrder({symbol, quantity, bot_id, user_id, setting_id, currentPrice}, {
  raw,
  investment,
  risk,
  isManual = false
}) {
  const {api} = await UserModel.findById(user_id, {'api.binance': 1});
  const {apiKey, secret} = extractApiKeys(api);

  cache.set(_.toString(setting_id), BOT_STATUS.COIN_SOLD)

  // Order Sell Params
  const params = createOrderParams({
      symbol,
      quantity
    }, secret,
    true);// Order Sell API

  setTimeout(async () => {
    const qty = 0.001;
    const size = 0.15;
    logger.binance.info(`Sold on price ${currentPrice}`)

    await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: false}})

    const profit = size - raw.size;
    const availableBalance = Number(investment) + Number(profit);

    await new Profit({
      bot: bot_id,
      user: user_id,
      risk,
      exchange: EXCHANGES[0],
      coin: symbol.replace("USDT",""),
      value: profit
    }).save()

    // Update Bot Setting that Order was Sold

    if (isManual) {
      //NOTE:: Updating BotSetting in Manual Configuration
      await BotSetting.findByIdAndUpdate(setting_id, {
        $inc: {profit: profit},
        $unset: {raw: 1},
        $set: {isActive: false, investment: 0, hasPurchasedCoins: false},
        $push: {"stats.sell": Number(currentPrice)}
      });
      //NOTE:: Updating Bot in Manual Configuration
      await Bot.findByIdAndUpdate(bot_id, {"$inc": {"availableBalance": availableBalance}})
    } else {
      //NOTE:: Updating BotSetting in RSI and Trailing Configuration
      await BotSetting.findByIdAndUpdate(setting_id, {
        $set: {hasPurchasedCoins: false},
        $inc: {profit: profit},
        $unset: {raw: 1},
        $push: {"stats.sell": Number(currentPrice)}
      });
      //NOTE:: Updating Bot in RSI and Trailing Configuration
      await Bot.findByIdAndUpdate(bot_id, {"$inc": {"availableBalance": profit}});

      logger.binanceTesting.error(JSON.stringify(
        {
          side: "sell",
          setting_id,
          price: currentPrice,
          size,
          profit,
          investment,
          oldQty: raw.size,
          availableBalance,
        }
      ))
    }

    await handleBotStatus(bot_id)
    console.log('SOLD')
  }, 500)
}
