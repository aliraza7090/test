import express from "express";
import {
    closeOrder,
    createOrderTest,
    exchangeInfo,
    getAccountInformation, getAllOrders, getUSDTBalance,
    newOrder,
    priceChangeIn24hrStatistics,
    priceTickler, testApi
} from "#controllers/binance.controller";
import authMiddleware from "#middlewares/auth.middleware";


const binanceRoutes = express.Router()

binanceRoutes.get('/account', authMiddleware, getAccountInformation)
binanceRoutes.post('/new_order', authMiddleware, newOrder)
binanceRoutes.post('/close_order', authMiddleware, closeOrder)
binanceRoutes.get('/create_order_test', authMiddleware, createOrderTest)
binanceRoutes.get('/exchange_info', authMiddleware, exchangeInfo)
binanceRoutes.get('/priceTickler', authMiddleware, priceTickler)
binanceRoutes.get('/24hrPriceTickler', authMiddleware, priceChangeIn24hrStatistics)
binanceRoutes.get('/all_orders', authMiddleware, getAllOrders)
binanceRoutes.get('/balance', authMiddleware, getUSDTBalance)
binanceRoutes.get('/testApi', testApi);

export default binanceRoutes
