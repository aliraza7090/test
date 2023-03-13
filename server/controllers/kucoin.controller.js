import kucoinApi from "kucoin-node-api"
import extractApiKeys from "#utils/common/extractApiKeys";
import handleBotStatus from "#utils/common/handleBotStatus";
import asyncHandlerMiddleware from "#middlewares/asyncHandler.middleware";
import kucoinCloseOrder from "#utils/kucoin/kucoinCloseOrder";
import kuCoinApi from "#services/kucoin";

/**
 @desc     Kucoin Accounts
 @route    GET /api/kucoin/account
 @access   Private
 */
const getAccounts = asyncHandlerMiddleware(async (req, res) => {
    const api = req?.user?.api;
    const endpoint = req?.originalUrl

    const credentials = extractApiKeys(api, 'kucoinApi');
    const response = await kuCoinApi.accountInformation(req.query,credentials);

    if (response?.code === '200000')
        return res.status(200).send(response?.data)

    res.status(400).send(response);
});

/**
 @desc     Create new Order
 @route    GET /api/kucoin/order
 @access   Private
 */
const createNewOrder = asyncHandlerMiddleware(async (req, res) => {
    const api = req?.user?.api;
    const config = extractApiKeys(api, 'ku_coin')
    await kucoinApi.init(config);

    const response = await kucoinApi.placeOrder(req.body);

    if (response?.code === '200000')
        return res.status(200).send(response?.data);

    res.status(400).send(response);


    console.log(response);
    res.status(200).send(response?.data)
});

/**
 @desc     24hr Ticker Price Change Statistics
 @route    GET /api/kucoin/24hrPriceTickler?symbol=BTC-USDT
 @access   Private
 */

const priceChangeIn24hrStatistics = asyncHandlerMiddleware(async (req, res) => {
    const api = req?.user?.api;
    const config = extractApiKeys(api, 'ku_coin')
    await kucoinApi.init(config);

    const symbol = req.query.symbol;
    const response = await kucoinApi.get24hrStats(symbol);

    if (response?.code === '200000')
        return res.status(200).send(response?.data)

    res.status(400).send(response);
})

/**
 @desc     Symbol Price Change Ticker Statistics
 @route    GET /api/kucoin/priceTickler?symbol=ETH-USDT
 @access   Private
 */
const priceTickler = asyncHandlerMiddleware(async (req, res) => {
    const api = req?.user?.api;
    const config = extractApiKeys(api, 'ku_coin')
    await kucoinApi.init(config);
    const symbol = req.query.symbol || '';

    const {data} = await kucoinApi.getTicker(symbol);

    res.status(200).send(data)
})

/**
 @desc     List orders
 @route    GET /api/kucoin/orders-list
 @access   Private
 */
const ordersList = asyncHandlerMiddleware(async (req, res) => {
    const api = req?.user?.api;
    const config = extractApiKeys(api, 'ku_coin')
    await kucoinApi.init(config);

    const response = await kucoinApi.getOrders();

    if (response?.code === '200000')
        return res.status(200).send(response?.data)

    res.status(400).send(response);
});

/**
 @desc     Get an order
 @route    GET /api/kucoin/orders/order_id
 @access   Private
 */
const getOrder = asyncHandlerMiddleware(async (req, res) => {
    const api = req?.user?.api;
    const config = extractApiKeys(api, 'ku_coin')
    await kucoinApi.init(config);
    const id = req.params.order_id;

    const response = await kucoinApi.getOrderById({id});

    if (response?.code === '200000')
        return res.status(200).send(response?.data)

    res.status(400).send(response);
});

/**
 @desc     Close Order
 @route    POST /api/kucoin/order/close
 @access   Private
 */
const closeOrder = asyncHandlerMiddleware(async (req, res) => {
    const {botId, user_id} = req.body;

    const result = await kucoinCloseOrder({bot_id: botId, user_id});
    await handleBotStatus(botId);

    res.status(200).send(result);
});

/**
 @desc     Create Testing Order
 @route    GET /api/kucoin/testing
 @access   Private
 */
const testOrder = asyncHandlerMiddleware(async (req, res) => {
    // let response = await kucoinApi.placeOrder(req.body);
    let response = {code: '200000', data: {"orderId": "6389f070a2646900013d3681"}}
    if (response?.code !== '200000')
        return console.log(`Error Occurred while create new order`, response);

    const id = response?.data?.orderId;
    console.log({id});
    response = await kucoinApi.getOrderById({id})

    if (response.code !== '200000')
        return console.log(`Error Occurred while getting order details`, response);

    res.status(200).send(response?.data);
})

export {
    getAccounts,
    createNewOrder,
    priceChangeIn24hrStatistics,
    priceTickler,
    ordersList,
    getOrder,
    testOrder,
    closeOrder
}
