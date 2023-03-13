import _ from "lodash";
import logger from "#utils/logger";
import cache from "#utils/common/Cache";
import {BOT_STATUS} from "#constants/index";
import {UserModel} from "#models/user.model";
import {BotSetting} from "#models/bot_setting.model";
import extractApiKeys from "#utils/common/extractApiKeys";
import createOrderParams from "#utils/binance/createOrderParams";

export default async function testBuyOrder({symbol, investment, setting_id, bot_id, user_id, currentPrice}) {
  const {api} = await UserModel.findById(user_id, {'api.binance': 1});
  const {apiKey, secret} = extractApiKeys(api);

  cache.set(_.toString(setting_id), BOT_STATUS.COINS_PURCHASED)

  // Order Buy Params
  const params = createOrderParams({
      symbol,
      investment
    }, secret,
    false);

  await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: true}})

  setTimeout(async () => {
    const qty = 0.001;
    const size = 0.1;
    logger.binance.info(`Purchased on price ${currentPrice}`)

    await BotSetting.findByIdAndUpdate(setting_id, {
      $set: {
        hasPurchasedCoins: true,
        raw: {
          price: currentPrice,
          qty,
          size,
        }
      },
      $push: {"stats.buy": currentPrice}
    })

    logger.binanceTesting.error(JSON.stringify({
      side: "buy",
      setting_id,
      price: currentPrice,
      qty,
      size
    }));

    console.log('BOUGHT')
  }, 500)
}
