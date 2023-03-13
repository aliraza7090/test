import _ from "lodash";
import kucoinApi from "kucoin-node-api";

import {UserModel} from "#models/user.model";
import {BotSetting} from "#models/bot_setting.model";
import {Transaction} from "#models/transactions.model";
import extractApiKeys from "#utils/common/extractApiKeys";
import {myLogger} from "#utils/logger";
/*
 * {
 * clientOid: Unique order id created by users to identify their orders, e.g. UUID required (string),
 * symbol: a valid trading symbol code. e.g. ETH-BTC (string),
 * type: [Optional] limit or market (default is market) (string)
 * remark: [Optional] remark for the order, length cannot exceed 100 utf8 characters (string)
 * stp: [Optional] self trade prevention , CN, CO, CB or DC (string),
 * size: [Optional] Desired amount in base currency
 * funds: [Optional] The desired amount of quote currency to use
 * }
 * @param params
 */

const buyOrder = async ({
                            orderParams,
                            _id,
                            user,
                            investment,
                            setting_id,
                            currentPrice = 0,
                        }) => {

    const {api} = await UserModel.findById(user, {'api.ku_coin': 1});
    const config = extractApiKeys(api, 'ku_coin');
    await kucoinApi.init(config);

    await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: true}})
    console.log("CALLED")
    await kucoinApi?.placeOrder(orderParams)
        // Block Run if Order Successfully Bought
        .then(async response => {
            if (response?.code !== '200000') {
                await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: false}})
                throw new Error(response.msg);
            }
            await kucoinApi.init(config);
            const orderId = response?.data?.orderId;

            await kucoinApi?.getOrderById({id: orderId})
                .then(async _response => {
                    if (_response?.code !== '200000') {
                        throw new Error(_response.msg);
                    }

                    // Save Response in kucoin log file
                    myLogger.kucoin.info(JSON.stringify(_response?.data))
                    // Update Bot Setting that Order was Bought
                    // await BotSetting.findByIdAndUpdate(setting_id, {hasPurchasedCoins: true})
                    //Destructuring Transaction Data
                    const {id, symbol, type, side, dealFunds, timeInForce, clientOid, dealSize} = _response?.data;
                    const doc = {
                        symbol: symbol.replace("-", ""),
                        orderId: id,
                        clientOrderId: clientOid,
                        price: currentPrice,
                        origQty: dealSize,
                        cummulativeQuoteQty: dealFunds,
                        timeInForce: timeInForce,
                        type: type,
                        side: _.upperCase(side),
                        bot: _id, user: user
                    }

                    /*TODO:: Remove this testing Logger*/
                    myLogger.kucoinTesting.error(JSON.stringify({
                        side: "buy",
                        setting_id,
                        price: currentPrice,
                        qty: Number(dealFunds),
                        size: Number(dealSize)
                    }))

                    await BotSetting.findByIdAndUpdate(setting_id, {
                        $set: {raw: {price: currentPrice, qty: Number(dealFunds), size: Number(dealSize)}},
                        $push: {"stats.buy": currentPrice}
                    })
                    // Create the Transaction of Order
                    await new Transaction(doc).save()
                    console.log('BOUGHT')
                }).catch(error => console.log(error.message, 'Get Order id failed'))
        })
        // Block Run if Order has been failed with some issue
        .catch(error => {
            console.log(error?.message, 'Buy Order Failed')
        });
};


export default buyOrder