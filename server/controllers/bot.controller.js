/*****  Packages  *****/
import _ from "lodash";
/*****  Modules  *****/
import asyncHandlerMiddleware from "#middlewares/asyncHandler.middleware";
import {Bot, validate} from "#models/bot.model";
import {UserModel} from "#models/user.model";
import {BotSetting, validate as validateSetting} from "#models/bot_setting.model";
import assignProfit from "#utils/common/assignProfit";
import {EXCHANGES, INDICATORS, OPERATION} from "#constants/index";
import closeSingleOrderBinance from "#utils/binance/closeSingleOrderBinance";
import closeSingleOrderKucoin from "#utils/kucoin/closeSingleOrderKucoin";
import {subAdminUsers} from "#models/sub_admin_users";

/**
 @desc     Create Bot
 @route    POST /api/bots
 @access   Private
 */
const createBot = asyncHandlerMiddleware(async (req, res) => {
    const {error} = validate(req.body);

    if (error)
        return res.status(400).send(error.details[0].message)

    const isUserExist = await UserModel.findById(req.body.user);
    if (!isUserExist)
        return res.status(404).send('User not found')


    const {user, indicator, risk, investment, price, coin} = req.body;

    if (investment < 10)
        return res.status(400).send(`investment must be greater than and equal to 10`);

    /*NOTE:: Creating Bot Setting 1*/
    const manualInvestment = 11 // TODO:: Should be in percentage
    const rsiInvestment = 0 // TODO:: Should be in percentage
    const trailingInvestment = 0 // TODO:: Should be in percentage

    req['body']['availableBalance'] = investment - manualInvestment; // for manual order

    // NOTE:: 1 Manual Bot Settings Param
    //Low Should be current price
    const settingParams1 = {
        user,
        indicator,
        risk,
        low: _.round(price), // must be selected coin current price
        up: coin === 'BTC'
            ? _.round(price) + 20
            : _.round(price) + 6, //// must be selected coin current price + 5
        investment: manualInvestment,
        operation: OPERATION[0],
        isActive: true
    } //Manual
    // NOTE:: 2 AUTO Bot Settings Params
    const settingParams2 = {
        ...settingParams1,
        low: 0,
        up: 0,
        investment: trailingInvestment,
        operation: OPERATION[1],
        isActive: false,
        user,
        indicator: INDICATORS[1]
    } //Trailing
    const settingParams3 = {
        ...settingParams1,
        low: 0,
        up: 0,
        indicator: INDICATORS[0],
        investment: rsiInvestment,
        operation: OPERATION[1],
        isActive: false
    } // RSI

    const {error: settingError} = validateSetting(settingParams1);

    if (settingError)
        return res.status(400).send(settingError.details[0].message)


    const settings = await Promise.all([
        asyncSaveBotSetting(settingParams1),
        asyncSaveBotSetting(settingParams2),
        asyncSaveBotSetting(settingParams3)
    ]);

    req.body.setting = settings;
    req['body']['entryPrice'] = price;

    await new Bot(_.pick(req.body, [
        'indicator',
        'risk',
        'exchange',
        'coin',
        'investment',
        'entryPrice',
        'day',
        'stop_at',
        'status',
        'user',
        'setting',
        'availableBalance',
        'isActive'
    ])).save()

    res
        .status(200)
        .send('Bot successfully created')
})

/**
 @desc      Get All Bots
 @route     GET /api/bots
 @access    Private
 */
const getAllBots = asyncHandlerMiddleware(async (req, res) => {
    const filter = {isDeleted: false};
    const role = req.user?.role;

    if (role === 'SUB_ADMIN') {
        const subAdmin = await subAdminUsers.findOne({sub_admin: req?.user?._id});
        filter['user'] = {$in: subAdmin?.users};
    }

    const bots = await Bot.find(filter).populate("user").populate('setting', 'risk investment operation low up takeProfit indicator isActive time stats');
    const _bots = await assignProfit(bots);

    res.status(200).send(_bots);
})

/**
 @desc      Update Bot
 @route     PUT /api/bots/:id
 @access    Private
 */
const updateBot = asyncHandlerMiddleware(async (req, res) => {
    const id = req.params.id;

    const bot = await Bot.findByIdAndUpdate(id, _.pick(req.body, ['status', 'stop', 'isActive']));

    if (!bot)
        return res.status(200).send(`Bot with id ${id} does not exist`)

    return res.status(200).send('Bot Successfully updated');

});

/**
 @desc      Delete Bot
 @route     DELETE /api/bots/:id
 @access    Private
 */
const deleteBot = asyncHandlerMiddleware(async (req, res) => {
    const id = req.params.id;

    const bot = await Bot.findByIdAndRemove(id);

    if (!bot)
        return res.status(200).send(`Bot with id ${id} does not exist`)

    return res.status(200).send('Bot Successfully deleted');
})


/**
 @desc      GET User Bots
 @route     GET /api/bots/:user_id
 @access    Private
 */
const getUserBots = asyncHandlerMiddleware(async (req, res) => {
    const filter = {isDeleted: false};

    const user_id = req.params.user_id;

    if (user_id)
        filter['user'] = user_id;


    const bots = await Bot.find(filter);
    const _bots = await assignProfit(bots);


    res.status(200).send(_bots);

});

/**
 @desc      GET User Open Order Bots
 @route     GET /api/bots/open-orders
 @access    Private
 */
const openOrdersUserBots = asyncHandlerMiddleware(async (req, res) => {
    const filter = {isActive: true, isDeleted: false};

    const user = req?.user?._id;

    if (user)
        filter['user'] = user;


    const openOrders = await Bot.find(filter).populate('setting');
    const bots = await assignProfit(openOrders);

    res.status(200).send(bots)
});

/**
 @desc      GET User Close Order Bots
 @route     GET /api/bots/close-orders
 @access    Private
 */
const closeOrdersUserBots = asyncHandlerMiddleware(async (req, res) => {
    const filter = {isActive: false, isDeleted: false};

    const user = req?.user?._id;

    if (user)
        filter['user'] = user;

    if (req?.query?.currency)
        filter['currency'] = req?.query?.currency;

    console.log(filter);

    const closeOrders = await Bot.find(filter).populate('setting');
    const bots = await assignProfit(closeOrders)

    res.status(200).send(bots);
});

/**
 @desc      Update Bot and Settings
 @route     PUT /api/bots/settings/:id
 @access    Private
 */
const updateBotAndSetting = asyncHandlerMiddleware(async (req, res) => {
    const id = req.params.id;
    const {bot, botSetting, user_id, hasToCloseOrder} = req.body;

    if (hasToCloseOrder) {
        await Promise.all(hasToCloseOrder.map(async setting_id => {
            const result = bot.exchange === EXCHANGES[0]
                ? await closeSingleOrderBinance({bot_id: id, user_id, setting_id})
                : await closeSingleOrderKucoin({bot_id: id, user_id, setting_id})
        }));
    }


    const rsi = botSetting['rsi'];
    const manual = botSetting['manual'];
    const trailing = botSetting['trailing'];

    const rsiBotId = rsi['_id'];
    const manualBotId = manual['_id'];
    const trailingBotId = trailing['_id'];

    const rsiProfit = rsi?.['profit'] || 0;
    const manualProfit = manual?.['profit'] || 0;
    const trailingProfit = trailing?.['profit'] || 0;


    const isActive = rsi['isActive'] || manual['isActive'] || trailing['isActive'];

    const availableBalance = (() => {
        let total = rsiProfit + manualProfit + trailingProfit;
        if (rsi['isActive']) {
            total += Number(rsi['investment']);
        } else {
            rsi['investment'] = 0
        }
        if (manual['isActive']) {
            total += Number(manual['investment']);
        } else {
            manual['investment'] = 0
        }

        if (trailing['isActive']) {
            total += Number(trailing['investment']);
        } else {
            trailing['investment'] = 0
        }

        return Number(bot.investment) - total;
    })()


    await Promise.all([
        updateMyBot(id, {...bot, isActive, availableBalance}),
        updateRSIBotSetting(rsiBotId, botSetting['rsi']),
        updateManualBotSetting(manualBotId, botSetting['manual']),
        updateTrailingBotSetting(trailingBotId, botSetting['trailing']),
    ]);

    res.send('Setting Successfully updated');
})

/**
 @desc      Get Bot Stats
 @route     PUT /api/bots/settings/stats/:id
 @access    Private
 */
const getBotStats = asyncHandlerMiddleware(async (req, res) => {
    const botSetting = await BotSetting.findById(req?.params.id, {stats: 1});

    res.status(200).send(botSetting);
})


export {
    createBot,
    getAllBots,
    updateBot,
    deleteBot,
    getUserBots,
    getBotStats,
    openOrdersUserBots,
    closeOrdersUserBots,
    updateBotAndSetting
}

/*Util*/
const asyncSaveBotSetting = async (setting) => await new BotSetting(setting).save()
    .then(record => record._id)
    .catch(error => {
        console.log('Error in asyncSaveBotSetting', error.message);
        return null
    })

const updateMyBot = async (id, data) => await Bot.findByIdAndUpdate(id, _.pick(data, ['configured_by', 'isActive', 'availableBalance']), {new: true});
const updateManualBotSetting = async (id, data) => await BotSetting.findByIdAndUpdate(id, _.pick(data, ['risk', 'investment', 'operation', 'low', 'up', 'isActive', 'takeProfit']), {new: true});
const updateTrailingBotSetting = async (id, data) => await BotSetting.findByIdAndUpdate(id, _.pick(data, ['risk', 'investment', 'operation', 'low', 'up', 'isActive']), {new: true});
const updateRSIBotSetting = async (id, data) => await BotSetting.findByIdAndUpdate(id, _.pick(data, ['risk', 'investment', 'operation', 'low', 'up', 'isActive', 'time']), {new: true});
