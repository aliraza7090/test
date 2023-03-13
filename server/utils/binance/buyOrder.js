import _ from "lodash";

import binanceApi from "#services/binance";
import {UserModel} from "#models/user.model";
import {BotSetting} from "#models/bot_setting.model";
import {Transaction} from "#models/transactions.model";
import extractApiKeys from "#utils/common/extractApiKeys";
import createOrderParams from "#utils/binance/createOrderParams";
import {BOT_STATUS} from "#constants/index";
import cache from "#utils/common/Cache";
import logger from "#utils/logger";

const buyOrder = async ({symbol, investment, setting_id, bot_id, user_id, currentPrice}) => {
  const {api} = await UserModel.findById(user_id, {'api.binance': 1});
  const {apiKey, secret} = extractApiKeys(api);

  cache.set(_.toString(setting_id), BOT_STATUS.COINS_PURCHASED)

  // Order Buy Params
  const params = createOrderParams({
      symbol, investment
    }, secret,
    false);

  await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: true}})
  // Order Buy API
  await binanceApi.createOrder(params, apiKey)
    // Block Run if Order Successfully Bought
    .then(async response => {
      // Save Response in kucoin log file
      logger.binance.info(JSON.stringify(response?.data))
      // Update Bot Setting that Order was Bought
      await BotSetting.findByIdAndUpdate(setting_id, {
        $set: {
          hasPurchasedCoins: true,
          raw: {
            price: Number(response.data.fills[0].price),
            qty: Number(response?.data?.executedQty),
            size: Number(response?.data?.cummulativeQuoteQty),
          }
        },
        $push: {"stats.buy": Number(response?.data?.fills[0]?.price)}
      })
      //Destructuring Transaction Data
      const {fills, executedQty, ...restData} = response?.data;
      const {price, tradeId} = fills[0];
      const doc = {...restData, price, qty: executedQty, tradeId, bot: bot_id, user: user_id}

      /*TODO:: Remove this testing Logger*/
      logger.binanceTesting.error(JSON.stringify({
        side: "buy",
        setting_id,
        price: price,
        qty: executedQty,
        size: restData.cummulativeQuoteQty
      }));

      // Create the Transaction of Order
      await new Transaction(doc).save()
      console.log('BOUGHT')
    })
    // Block Run if Order has been failed with some issue
    .catch(async error => {
      await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: false}})
      const _error = _.get(error, 'response.data', error);
      console.log(_error, 'Buy Order Failed')
    });
}


export default buyOrder;
