import _ from "lodash";
import winston from "winston";
import kucoinApi from "kucoin-node-api";

import {UserModel} from "#models/user.model";
import {BotSetting} from "#models/bot_setting.model";
import {Transaction} from "#models/transactions.model";
import extractApiKeys from "#utils/common/extractApiKeys";
import handleBotStatus from "#utils/common/handleBotStatus";
import {Bot} from "#models/bot.model";

const sellOrder = async ({
                             orderParams,
                             _id,
                             user,
                             setting_id,
                             currentPrice = 0,
                         }, {raw, investment, isManual = false}) => {
    const {api} = await UserModel.findById(user, {'api.ku_coin': 1});
    const config = extractApiKeys(api, 'ku_coin');

    await kucoinApi.init(config);

    // Update Bot Setting that Order was Bought
    await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: false}})
    await kucoinApi?.placeOrder(orderParams)
        // Block Run if Order Successfully Bought
        .then(async response => {
            if (response?.code !== '200000') {
                await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: true}})
                throw new Error(response.msg)
            }

            kucoinApi.init(config);
            const orderId = response?.data?.orderId;

            await kucoinApi?.getOrderById({id: orderId})
                .then(async (_response) => {
                    if (_response?.code !== '200000') {
                        throw new Error(_response.msg)
                    }

                    // Save Response in kucoin log file
                    myLogger.kucoin.info(JSON.stringify(_response?.data))

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
                    const profit = Number(dealFunds) - raw.qty
                    const availableBalance = Number(investment) + Number(profit);

                    /*TODO:: Remove this testing Logger*/
                    myLogger.kucoinTesting.error(JSON.stringify({
                        side: "sell",
                        profit,
                        investment,
                        oldQty: raw.qty,
                        availableBalance,
                        price: currentPrice,
                        qty: Number(dealFunds),
                        size: Number(dealSize)
                    }))

                    if (isManual) {
                        //NOTE:: Updating BotSetting in Manual Configuration
                        await BotSetting.findByIdAndUpdate(setting_id, {
                            $inc: {profit: profit},
                            $unset: {raw: 1},
                            $set: {isActive: false, investment: 0,hasPurchasedCoins: false},
                            $push: {"stats.sell": currentPrice}
                        });
                        //NOTE:: Updating Bot in Manual Configuration
                        await Bot.findByIdAndUpdate(_id, {"$inc": {"availableBalance": availableBalance}})
                    } else {
                        //NOTE:: Updating BotSetting in RSI and Trailing Configuration
                        await BotSetting.findByIdAndUpdate(setting_id, {
                            $set: {hasPurchasedCoins: false},
                            $inc: {profit: profit},
                            $unset: {raw: 1},
                            $push: {"stats.sell": currentPrice}
                        })
                        //NOTE:: Updating Bot in RSI and Trailing Configuration
                        await Bot.findByIdAndUpdate(_id, {"$inc": {"availableBalance": profit}});
                    }

                    // Create the Transaction of Order
                    await new Transaction(doc).save()
                    await handleBotStatus(_id)
                    console.log('SOLD')
                })
                .catch(error => {
                    console.log('Error in sell Order (Kucoin) getOrderById', error);
                })
        })
        // Block Run if Order has been failed with some issue
        .catch(error => {
            console.log(error.message, 'Sell Order Failed')
        });
}

export default sellOrder
