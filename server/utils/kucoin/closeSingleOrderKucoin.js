import _ from "lodash";

import {Bot} from "#models/bot.model";
import sellOrder from "#utils/kucoin/sellOrder";
import {BotSetting} from "#models/bot_setting.model";
import getKucoinPrice from "#utils/kucoin/getKucoinPrice";
import createOrderParams from "#utils/kucoin/createOrderParams";


const closeSingleOrderKucoin = async ({setting_id, bot_id, user_id}) => {
    const bot = await Bot.findById(bot_id);

    if (!bot) // if bot not found
        await Promise.reject(`Bot doesn't exist with id ${bot_id}`);

    const {coin} = bot;

    const bot_setting = await BotSetting.findOne({_id: setting_id, isActive: true});

    if (_.isEmpty(bot_setting)) // if bot not found
        return `Bot Setting doesn't exist with id ${setting_id}`

    ///NOTE:: ==========        CONDITION FOR CHECKING BOT HAS PURCHASED COINS      ==========
    if (_.isEmpty(bot_setting?.raw))
        return BotSetting.findByIdAndUpdate(setting_id, {$set: {isActive: false}});

    ///NOTE:: ==========        STARTING CLOSING KUCOIN ORDER      ==========
    const symbol = coin + '-USDT'
    const {investment, raw} = bot_setting;
    const size = raw.size;
    const orderParams = createOrderParams({size, symbol}, true);
    const currentPrice = await getKucoinPrice(symbol);

    await sellOrder(
        {orderParams, user: user_id, setting_id, _id: bot_id, currentPrice},
        {raw, investment, isManual: true})
    await BotSetting.findByIdAndUpdate(setting_id, {$set: {hasPurchasedCoins: false, isActive: false, investment: 0}});

    return true;
};


export default closeSingleOrderKucoin