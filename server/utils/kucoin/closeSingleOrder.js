import _ from 'lodash'
import {Bot} from "#models/bot.model";
import {BotSetting} from "#models/bot_setting.model";

const closeSingleOrder = async ({setting_id, bot_id, user_id}) => {
    if (_.isEmpty(setting_id) || _.isEmpty(bot_id) || _.isEmpty(user_id)) {
        throw new Error(`Invalid Parameters provided in closeSingleOrder`);
    }

    const bot = await Bot.findById(bot_id);

    // if bot not found
    if (!bot) {
        throw new Error(`Bot doesn't exist with id ${bot_id}`)
    }

    const bot_setting = await BotSetting.findOne({_id: setting_id, isActive: true});

    // if bot setting not found
    if (_.isEmpty(bot_setting)) {
        throw new Error(`Bot Setting doesn't exist with id ${setting_id}`)
    }

    //TODO:: setup bot investment and profit etc
    if(_.isEmpty(bot_setting?.raw)){
        //NOTE:: Block if user still not purchased coins
        return BotSetting.findByIdAndUpdate(setting_id, {$set: {isActive: false}});
    };

    ///NOTE:: ==========        SETUP CLOSING KUCOIN ORDER PARAMS      ==========
    const {investment, raw} = bot_setting
    const {coin} = bot;

    const size = raw.size;
    const symbol = coin + '-USDT'


    const sellOrderParams = {}
};


export default closeSingleOrder