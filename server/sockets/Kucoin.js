import _ from "lodash";

import {Bot} from "#models/bot.model";
import kucoinSDK from 'kucoin-node-api'
import {getEnv} from "#utils/common/env";
import inRange from "#utils/common/inRange";
import stopBot from "#utils/binance/stopBot";
import buyOrder from "#utils/kucoin/buyOrder";
import sellOrder from "#utils/kucoin/sellOrder";
import {BOT_STATUS, EXCHANGES, INDICATORS} from "#constants/index";
import createOrderParams from "#utils/kucoin/createOrderParams";
import fetchRSIValues from "#utils/taapi/fetchRSIValues";
import {BotSetting} from "#models/bot_setting.model";

const map = new Map();

const kuCoinSocket = () => {
    const config = {
        apiKey: getEnv() || '',
        secretKey: getEnv() || '',
        passphrase: getEnv() || '',
        environment: getEnv('KUCOIN_ENVIRONMENT')
    }

    kucoinSDK.init(config);

    const getSymbol = (symbol) => symbol === 'ETH-USDT' ? 'ETH' : 'BTC';
    const kucoinSymbol = (symbol) => symbol === 'ETH' ? 'ETH-USDT' : 'BTC-USDT'

    const cb = _.debounce(async (msg) => {
        let data = JSON.parse(msg);

        const _symbol = data.topic?.split(':')?.[1];
        const symbol = getSymbol(_symbol);

        // is Data Present
        if (data?.data) {
            const {price} = data.data;
            const currentPrice = _.floor(price);

            const bots = await Bot.aggregate([
                {
                    "$lookup": {
                        "from": "bot_settings",
                        "localField": "setting",
                        "foreignField": "_id",
                        "as": "setting"
                    }
                },
                {"$unwind": "$setting"},
                {
                    "$match": {
                        "$or": [
                            {"setting.low": currentPrice},
                            {"setting.up": {"$gte": currentPrice}},
                            {"stop_at": {"$lte": currentPrice}},
                        ],
                        "$and": [
                            {"setting.isActive": true},
                            {"isActive": true},
                            {"status": true},
                            {"coin": symbol},
                            {"exchange": EXCHANGES[1]}
                        ]
                    }
                }
            ]);

            bots.length > 0 ? await Promise.all(bots.map(async (bot) => {
                const {setting, stop_at, _id, user} = bot;
                const {
                    low,
                    up,
                    hasPurchasedCoins,
                    investment,
                    _id: setting_id,
                    operation,
                    takeProfit,
                    indicator,
                    time,
                    raw
                } = setting;


                const stopCondition = currentPrice <= stop_at;
                const sellCondition = currentPrice >= up;

                //NOTE:: Automatic Bot Operations block
                if (operation === 'AUTO') {
                    // NOTE:: INDICATORS[1] = 'TRAILING'
                    if (indicator === INDICATORS[1]) {
                        // NOTE:: TRAILING LOGGER
                        console.log({u: up, l: low, c: currentPrice, s: stop_at, r: bots.length}, 'T')

                        //NOTE:: Order Sell Block (TRAILING)
                        if (hasPurchasedCoins) {
                            if (sellCondition) {

                                const orderParams = createOrderParams({
                                    size: raw?.size,
                                    symbol: kucoinSymbol(symbol),
                                }, true);


                                const sellOrderParams = {_id, user, symbol, setting_id, orderParams, currentPrice};

                                await sellOrder(sellOrderParams, {raw, investment});
                            } else if (stopCondition) {
                                await stopBot({setting_id, currentPrice})
                            }
                        }
                        //NOTE:: Buy & Stop loss Logic Block (TRAILING)
                        else {
                            const buyCondition = low === currentPrice;


                            //NOTE:: Buy Logic Block (TRAILING)
                            if (buyCondition) {

                                const orderParams = createOrderParams({
                                    funds: investment,
                                    symbol: kucoinSymbol(symbol),
                                }, false)

                                const buyOrderParams = {
                                    _id,
                                    user,
                                    symbol,
                                    investment,
                                    setting_id,
                                    orderParams,
                                    currentPrice
                                };

                                await buyOrder(buyOrderParams)

                            }
                            //NOTE::Stop loss Logic Block
                            else if (stopCondition) {
                                await stopBot({setting_id, currentPrice})
                            }
                        }
                    } else if (indicator === INDICATORS[0]) // NOTE:: INDICATORS[0] = 'RSI' Block
                    {
                        const params = {
                            exchange: _.lowerCase(EXCHANGES[1]), // kucoin
                            symbol: symbol.concat('/USDT'),
                            interval: time
                        }

                        const rsi = await fetchRSIValues(params);

                        console.log({u: up, l: low, rsi: _.round(rsi?.value), s: stop_at, r: bots?.length}, 'R')


                        const sellConditionRSI = _.round(rsi.value) >= up //NOTE:: RSI overbought condition

                        console.log(`STATUS ->`,map.get(setting_id));

                        if (hasPurchasedCoins) {
                            if(
                                map.get(setting_id) !== undefined &&
                                map.get(setting_id) === BOT_STATUS.COMPLETED
                            )
                                return ;


                            if (sellConditionRSI) {
                                map.set(setting_id,BOT_STATUS.COMPLETED)
                                const orderParams = createOrderParams({
                                    size: raw?.size,
                                    symbol: kucoinSymbol(symbol),
                                }, true);
                                const sellOrderParams = {
                                    _id,
                                    user,
                                    symbol,
                                    setting_id,
                                    orderParams,
                                    currentPrice
                                };
                                await sellOrder(sellOrderParams, {raw, investment});
                            } else if (stopCondition) {
                                await stopBot({setting_id, currentPrice})
                            }
                        }
                        //NOTE:: Buy & Stop loss Logic Block (RSI)
                        else {
                            // const stopCondition = currentPrice <= stop_at;
                            const min = low - 5;
                            const buyCondition = inRange(_.round(rsi.value), min, low); //NOTE:: RSI oversold condition

                            if(
                                map.get(setting_id) !== undefined &&
                                map.get(setting_id) === BOT_STATUS.IN_PROCESS
                            )
                                return ;


                            if (buyCondition) {
                                map.set(setting_id, BOT_STATUS.IN_PROCESS)
                                const orderParams = createOrderParams({
                                    funds: investment,
                                    symbol: kucoinSymbol(symbol),
                                }, false);
                                const buyOrderParams = {
                                    _id,
                                    user,
                                    symbol,
                                    setting_id,
                                    investment,
                                    orderParams,
                                    currentPrice
                                };
                                await buyOrder(buyOrderParams)
                            }
                            //NOTE::Stop loss Logic Block
                            else if (stopCondition) {
                                await stopBot({setting_id, currentPrice})
                            }
                        }
                    }
                } else // Manual Bot Block
                {
                    // NOTE:: MANUAL LOGGER
                    console.log({u: up, l: low, c: currentPrice, s: stop_at, r: bots.length}, 'M')
                    if (hasPurchasedCoins) {
                        const takePriceCondition = currentPrice === takeProfit && takeProfit !== 0;

                        const orderParams = createOrderParams({
                            size: raw?.size,
                            symbol: kucoinSymbol(symbol),
                        }, true);

                        const sellOrderParams = {_id, user, symbol, setting_id, orderParams, currentPrice};

                        if (takePriceCondition) {
                            await sellOrder(sellOrderParams, {raw, investment, isManual: true});
                        } else if (currentPrice >= up) {
                            await sellOrder(sellOrderParams, {raw, investment, isManual: true});
                        } else if (stopCondition) {
                            await stopBot({setting_id, currentPrice})
                        }
                    } else {
                        const min = low - 2;
                        const buyCondition = inRange(currentPrice, min, low);

                        if (buyCondition) {

                            const orderParams = createOrderParams({
                                funds: investment,
                                symbol: kucoinSymbol(symbol),
                            }, false)

                            const buyOrderParams = {
                                _id,
                                user,
                                symbol,
                                investment,
                                setting_id,
                                orderParams,
                                currentPrice
                            };

                            await buyOrder(buyOrderParams)

                        } else if (stopCondition) {
                            await stopBot({setting_id, currentPrice})
                        }
                    }
                }
            })) : 0;
        }
    }, 1200, {maxWait: 1200, trailing: true, leading: false})

    // Price Tickler
    kucoinSDK?.initSocket({topic: "ticker", symbols: ["BTC-USDT", 'ETH-USDT']}, cb);
};

export default kuCoinSocket

