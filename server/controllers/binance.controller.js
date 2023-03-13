import axios from "axios";
import binanceApi from "#services/binance";
import {UserModel} from "#models/user.model";
import extractApiKeys from "#utils/common/extractApiKeys";
import handleBotStatus from "#utils/common/handleBotStatus";
import getBinanceParams from "#utils/binance/getBinanceParams";
import convertToQueryParams from "#utils/common/convertToQueryParams";
import asyncHandlerMiddleware from "#middlewares/asyncHandler.middleware";
import binanceCloseOrder from "#utils/binance/binanceCloseOrder";

/**
 @desc     Binance Balances
 @route    GET /api/binance/balance
 @access   Private
 */
/*const getBinanceBalances = asyncHandlerMiddleware(async (req, res) => {
    const result = await binance.balance();
    res.status(200).send(_.pick(result, ['BTC', 'ETH']));
});*/

/**
 @desc     Binance Prices
 @route    GET /api/binance/balance
 @access   Private
 */
/*const getBinancePrice = asyncHandlerMiddleware(async (req, res) => {
    const result = await binance.prices('BTCUSDT');
    console.log(result);
    res.status(200).send(_.pick(result, ['BTCUSDT', 'ETHUSDT']));
})*/

/**
 @desc     GET account information
 @route    GET /api/binance/account
 @access   Private
 */
const getAccountInformation = asyncHandlerMiddleware(async (req, res) => {
    const {apiKey, secret} = extractApiKeys(req?.user?.api);

    if (!(apiKey && secret)) {
        return res.status(400).send('Please Add binance api keys');
    }

    const params = getBinanceParams(req.query, secret);
    const {data, status} = await binanceApi.accountInformation(params, apiKey);
    res.status(status).send(data)
});

/**
 @desc     POST Place order
 @route    POST /api/binance/account
 @access   Private
 */

const newOrder = asyncHandlerMiddleware(async (req, res) => {
    const {apiKey, secret} = extractApiKeys(req?.user?.api);

    if (!(apiKey && secret)) {
        return res.status(400).send('Please Add binance api keys');
    }

    const params = getBinanceParams(req.body, secret);
    const {status, data} = await binanceApi.createOrder(params, apiKey);

    res.status(status).send(data);
})

/**
 @desc     Place order (test)
 @route    GET /api/binance/create_order_test
 @access   Private
 */

const createOrderTest = asyncHandlerMiddleware(async (req, res) => {
    const params = getBinanceParams(req.body);

    const inputData = req.body;
    /*const {
        data: exchangeApiData,
        status: exchangeApiStatusCode
    } = await binanceApi.exchangeInfo(`symbol=${req?.body?.symbol}`);*/

    // Return Error if exchange info api failed
    /*if (exchangeApiStatusCode !== 200)
        new Error('exchange info api failed');*/

    const {status: priceApiStatus, data: priceApiData} = await binanceApi.priceTickler(`symbol=${req?.body?.symbol}`);
    const price = Number(inputData['price']);
    const quantity = Number(inputData['quantity']);
    const currentPrice = Number(priceApiData['price']);
    const minimumPrice = currentPrice * 0.2;
    const maximumPrice = currentPrice * 0.5;

    const minimumQuantity = price / currentPrice;

    //Throw Error if the purchase price is less than 'minimumPrice' and greater than 'maximumPrice'
    // if(!(price >= minimumPrice && price <= maximumPrice))
    //     throw new Error(`Price must be in between ${minimumPrice} and ${maximumPrice}`)


    console.log({minimumQuantity, currentPrice})


    // Return Error if priceApiData api failed
    if (priceApiStatus !== 200)
        new Error('Price tickler api failed');


    // const filters = exchangeApiData['symbols'][0]['filters'];

    /*filters.forEach((filter) => {
        if(filter?.filterType === "PERCENT_PRICE"){
            const price = Number(inputData['price']);
            const currentPrice = Number(priceApiData['price']);
            const minimumPrice = Number(filter['multiplierDown']) * currentPrice;
            const maximumPrice = Number(filter['multiplierUp']) * currentPrice;
            console.log({minimumPrice,maximumPrice});

            //Throw Error if the purchase price is less than 'minimumPrice' and greater than 'maximumPrice'
            if(!(price >= minimumPrice && price <= maximumPrice))
                throw new Error(`Price must be in between ${minimumPrice} and ${maximumPrice}`)

        }
    })*/

    const {status, data} = await binanceApi.createTestOrder(params);
    res.status(status).send(data);
});


/**
 @desc     Exchange Information
 @route    GET /api/binance/exchange_info
 @access   Private
 */

const exchangeInfo = asyncHandlerMiddleware(async (req, res) => {
    const queryString = convertToQueryParams(req.query);
    const {data, status} = await binanceApi.exchangeInfo(queryString)

    res.status(status).send(data)
});

/**
 @desc     Price Ticker
 @route    GET /api/binance/priceTickler
 @access   Private
 */

const priceTickler = asyncHandlerMiddleware(async (req, res) => {
    const queryString = convertToQueryParams(req.query);
    const {data, status} = await binanceApi.priceTickler(queryString);

    res.status(status).send(data);
});


/**
 @desc     24hr Ticker Price Change Statistics
 @route    GET /api/binance/24hrPriceTickler
 @access   Private
 */

const priceChangeIn24hrStatistics = asyncHandlerMiddleware(async (req, res) => {
    const queryString = convertToQueryParams(req.query);
    const {data, status} = await binanceApi.priceChangeIn24hrStatistics(queryString);

    res.status(status).send(data);
});

/**
 @desc     Get All Orders
 @route    GET /api/binance/all_orders
 @access   Private
 */

const getAllOrders = asyncHandlerMiddleware(async (req, res) => {
    const {apiKey, secret} = extractApiKeys(req?.user?.api);

    if (!(apiKey && secret))
        return res.status(400).send('Please Add binance api keys');

    const params = getBinanceParams(req.query, secret);
    const {status, data} = await binanceApi.getAllOrders(params, apiKey)

    res.status(status).send(data);
})

/**
 @desc     Get USDT Balance
 @route    GET /api/binance/balance
 @access   Private
 */

const getUSDTBalance = asyncHandlerMiddleware(async (req, res) => {
    let balances = await binance.balance();

    const isRequireSymbolsFiltration = (req.query?.symbols ? typeof JSON.parse(req.query.symbols) === "object" : false);
    const isRequireSymbolFiltration = (req.query?.symbol ? typeof req.query?.symbol === 'string' : false)

    if (isRequireSymbolsFiltration) //Filtration of multiple symbols
    {
        balances = Object.keys(balances).reduce((obj, symbol) => {
            const records = JSON.parse(req.query.symbols);
            return records.includes(symbol)
                ? obj[symbol] = balances[symbol]
                : obj
        }, {});
    } else if (isRequireSymbolFiltration) // Filter balances and get single balance
    {
        balances = balances[req.query?.symbol];
    }


    res.status(200).send(balances)
});

const testApi = asyncHandlerMiddleware(async (req, res) => {
    const {api} = await UserModel.findById('6384d63511116f4186b74b97', {'api.binance': 1});
    console.log(api);
    res.status(200).send('TESTING');
});

/**
 @desc     POST close order
 @route    POST /api/binance/close_order
 @access   Private
 */
const closeOrder = asyncHandlerMiddleware(async (req, res) => {

    const {botId, user_id} = req.body;
    const result = await binanceCloseOrder({bot_id: botId, user_id});
    await handleBotStatus(botId);

    res.status(200).send(result);
});

export {
    newOrder,
    exchangeInfo,
    priceTickler,
    getAllOrders,
    getUSDTBalance,
    createOrderTest,
    getAccountInformation,
    priceChangeIn24hrStatistics,
    testApi,
    closeOrder
}