import _ from "lodash";

import {Bot} from "#models/bot.model";
import binanceApi from "#services/binance";
import {UserModel} from "#models/user.model";
import {BotSetting} from "#models/bot_setting.model";
import {Transaction} from "#models/transactions.model";
import extractApiKeys from "#utils/common/extractApiKeys";
import handleBotStatus from "#utils/common/handleBotStatus";
import createOrderParams from "#utils/binance/createOrderParams";
import {BOT_STATUS, EXCHANGES} from "#constants/index";
import cache from "#utils/common/Cache";
import logger from "#utils/logger";
import {Profit} from "#models/profit.model";

const sellOrder = async ({symbol, quantity, bot_id, user_id, setting_id, currentPrice}, {
  raw,
  investment,
  risk,
  isManual = false
}) => {
  const {api} = await UserModel.findById(user_id, {'api.binance': 1});
  const {apiKey, secret} = extractApiKeys(api);

  cache.set(_.toString(setting_id), BOT_STATUS.COIN_SOLD)

  // Order Sell Params
  const params = createOrderParams({
      symbol,
      quantity
    }, secret,
    true);// Order Sell API
  await binanceApi.createOrder(params, apiKey)
    // Block Run if Order Successfully Sold
    .then(async response => {
      // Save Response in kucoin log file
      logger.binance.info(JSON.stringify(response?.data));
      //Destructuring Transaction Data
      await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: false}})

      const {fills, cummulativeQuoteQty: size, ...restData} = response?.data;
      const {price, tradeId} = fills[0];
      const doc = {...restData, price, size, tradeId, bot: bot_id, user: user_id}

      const profit = Number(size) - raw.size;
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
          $push: {"stats.sell": Number(price)}
        });
        //NOTE:: Updating Bot in Manual Configuration
        await Bot.findByIdAndUpdate(bot_id, {"$inc": {"availableBalance": availableBalance}})
      } else {
        //NOTE:: Updating BotSetting in RSI and Trailing Configuration
        await BotSetting.findByIdAndUpdate(setting_id, {
          $set: {hasPurchasedCoins: false},
          $inc: {profit: profit},
          $unset: {raw: 1},
          $push: {"stats.sell": Number(price)}
        });
        //NOTE:: Updating Bot in RSI and Trailing Configuration
        await Bot.findByIdAndUpdate(bot_id, {"$inc": {"availableBalance": profit}});
      }

      /*TODO:: Remove this testing Logger*/
      logger.binanceTesting.error(JSON.stringify(
        {
          side: "sell",
          setting_id,
          price: price,
          size: restData.cummulativeQuoteQty,
          profit,
          investment,
          oldQty: raw.size,
          availableBalance,
        }
      ))
      // Create the Transaction of Order
      await new Transaction(doc).save()
      await handleBotStatus(bot_id)
      console.log('SOLD')
    })
    // Block Run if Order has been failed with some issue
    .catch(async error => {
      const _error = _.get(error, 'response.data.msg', error);
      console.log(_error, 'Sell Order Failed')
    });
};

export default sellOrder
