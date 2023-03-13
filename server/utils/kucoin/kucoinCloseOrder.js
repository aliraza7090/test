import {Bot} from "#models/bot.model";
import closeSingleOrderKucoin from "#utils/kucoin/closeSingleOrderKucoin";

const kucoinCloseOrder = async ({bot_id, user_id}) => {
    const bot = await Bot.findById(bot_id);

    if (!bot) // if bot not found
        await Promise.reject(`Bot doesn't exist with id ${bot_id}`);

    const {coin, setting: setting_ids} = bot;

    return await Promise.all(setting_ids.map(async (_setting_id) => {
        const setting_id = typeof _setting_id === "object"
            ? _setting_id.toHexString()
            : _setting_id

        return await closeSingleOrderKucoin({setting_id, user_id, bot_id});
    }));
};

export default kucoinCloseOrder