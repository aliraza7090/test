import _ from "lodash";

import {Bot} from "#models/bot.model";
import inRange from "#utils/common/inRange";
import stopBot from "#utils/binance/stopBot";
import buyOrder from "#utils/binance/buyOrder";
import sellOrder from "#utils/binance/sellOrder";
import {BotSetting} from "#models/bot_setting.model";
import {BOT_STATUS, EXCHANGES, INDICATORS} from "#constants/index";
import fetchRSIValues from "#utils/taapi/fetchRSIValues";
import logger from "#utils/logger";
import cache from "#utils/common/Cache";
import testBuyOrder from "#utils/binance/testBuyOrder";
import testSellOrder from "#utils/binance/testSellOrder";

const isTestMode = false;

const main = async ({currentPrice, coin, symbol}) => {
  try {
    const bots = await Bot.aggregate([
      {
        $lookup: {
          from: "bot_settings",
          localField: "setting",
          foreignField: "_id",
          as: "setting"
        }
      },
      {$unwind: "$setting"},
      {
        $match: {
          $or: [
            {"setting.low": currentPrice},
            {"setting.up": {$gte: currentPrice}},
            {"stop_at": {$lte: currentPrice}},
          ],
          $and: [
            {"setting.isActive": true},
            {"isActive": true},
            {"status": true},
            {"coin": coin},
            {"exchange": EXCHANGES[0]}
          ]
        }
      }
    ]);

    // console.log({BOT: bots.length})

    if (bots?.length === 0)
      return;


    await Promise.all(bots.map(async (bot) => {
      const {stop_at, _id: bot_id, user, risk} = bot;
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
      } = bot?.setting || {};

      //Setting up Constants for Params
      const quantity = raw?.qty;
      const params = {symbol, bot_id, setting_id, currentPrice, user_id: user}
      const sellOrderParams = {...params, quantity}
      const buyOrderParams = {...params, investment}
      const stopCondition = currentPrice <= stop_at;
      const sellCondition = currentPrice >= up;

      //NOTE:: Automatic Bot Operations block
      if (operation === 'AUTO') {
        // NOTE:: INDICATORS[1] = 'TRAILING'
        if (indicator === INDICATORS[1]) {
          // NOTE:: TRAILING LOGGER
          console.log({u: up, l: low, c: currentPrice, s: stop_at, r: bots.length}, 'T');


          //NOTE:: Order Sell Block (TRAILING)
          if (hasPurchasedCoins) {
            if (sellCondition) {
              if (cache.get(_.toString(setting_id)) === BOT_STATUS.COIN_SOLD) {
                logger.binanceTesting.error("Double Selling Called")
                return;
              }
              isTestMode
                  ? await testSellOrder(sellOrderParams, {raw, investment,risk})
                  : await sellOrder(sellOrderParams, {raw, investment,risk})
            } else if (stopCondition) {
              await stopBot({setting_id, currentPrice})
            }
          }

          //NOTE:: Buy & Stop loss Logic Block (TRAILING)
          else {
            const min = symbol === 'ETHUSDT' ? low - 1 : low - 3;
            const max = symbol === 'ETHUSDT' ? low : low;

            const buyCondition = inRange(currentPrice, min, max);
            // const buyCondition = low === currentPrice;


            //NOTE:: Buy Logic Block (TRAILING)
            if (buyCondition) {
              if (cache.get(_.toString(setting_id)) === BOT_STATUS.COINS_PURCHASED) {
                logger.binanceTesting.error("Double Buying Called")
                return;
              }

              isTestMode
                  ? await testBuyOrder(buyOrderParams)
                  : await buyOrder(buyOrderParams)
            }
            //NOTE::Stop loss Logic Block
            else if (stopCondition) {
              await stopBot({setting_id, currentPrice})
            }
          }
        } else if (indicator === INDICATORS[0]) // NOTE:: INDICATORS[0] = 'RSI' Block
        {
          const params = {
            exchange: EXCHANGES[0], // binance
            symbol: symbol.replace('USDT', '/USDT'),
            interval: time
          }

          const rsi = await fetchRSIValues(params);
          const value = rsi.value || 0;

          console.log({u: up, l: low, rsi: value, c: currentPrice, s: stop_at, r: bots?.length}, 'R')

          const sellConditionRSI = value >= up //NOTE:: RSI overbought condition
          if (hasPurchasedCoins) {
            if (sellConditionRSI) {
              if (cache.get(_.toString(setting_id)) === BOT_STATUS.COIN_SOLD) {
                logger.binanceTesting.error("Double Selling Called")
                return;
              }

              isTestMode
                  ? await testSellOrder(sellOrderParams, {raw, investment,risk})
                  : await sellOrder(sellOrderParams, {raw, investment,risk})

            } else if (stopCondition) {
              await stopBot({setting_id, currentPrice})
            }
          }
          //NOTE:: Buy & Stop loss Logic Block (RSI)
          else {
            // const stopCondition = currentPrice <= stop_at;
            const min = low - 1;
            const buyCondition = inRange(value, min, low); //NOTE:: RSI oversold condition

            if (buyCondition) {
              if (cache.get(_.toString(setting_id)) === BOT_STATUS.COINS_PURCHASED) {
                logger.binanceTesting.error("Double Buying Called")
                return;
              }

              isTestMode
                  ? await testBuyOrder(buyOrderParams)
                  : await buyOrder(buyOrderParams)
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

        const min = symbol === 'ETHUSDT' ? low - 2 : low - 2;
        const max = symbol === 'ETHUSDT' ? low : low;
        const buyCondition = inRange(currentPrice, min, max);
        // const buyCondition = low === currentPrice;
        if (hasPurchasedCoins) {
          const takePriceCondition = currentPrice === takeProfit && takeProfit !== 0;

          if (takePriceCondition) {
            if (cache.get(_.toString(setting_id)) === BOT_STATUS.COIN_SOLD) {
              logger.binanceTesting.error("Double Selling Called")
              return;
            }

            isTestMode
                ? await testSellOrder(sellOrderParams, {raw, investment,risk, isManual: true})
                : await sellOrder(sellOrderParams, {raw, investment,risk, isManual: true});


            await BotSetting.findByIdAndUpdate(setting_id, {isActive: false, investment: 0})
          } else if (currentPrice >= up) {
            if (cache.get(_.toString(setting_id)) === BOT_STATUS.COIN_SOLD) {
              logger.binanceTesting.error("Double Selling Called")
              return;
            }

            isTestMode
                ? await testSellOrder(sellOrderParams, {raw, investment,risk, isManual: true})
                : await sellOrder(sellOrderParams, {raw, investment,risk, isManual: true});

            await BotSetting.findByIdAndUpdate(setting_id, {isActive: false, investment: 0})
          } else if (stopCondition) {
            await stopBot({setting_id, currentPrice})
          }
        } else if (buyCondition) {
          if (cache.get(_.toString(setting_id)) === BOT_STATUS.COINS_PURCHASED) {
            logger.binanceTesting.error("Double Buying Called")
            return;
          }
          isTestMode
              ? await testBuyOrder(buyOrderParams)
              : await buyOrder(buyOrderParams)
        } else if (stopCondition) {
          await stopBot({setting_id, currentPrice})
        }
      }
    }))
  } catch (e) {
    console.error(e);
  }
}

export {main}
