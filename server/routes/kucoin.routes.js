import express from "express";
import {
    closeOrder,
    createNewOrder,
    getAccounts, getOrder,
    ordersList,
    priceChangeIn24hrStatistics,
    priceTickler, testOrder
} from "#controllers/kucoin.controller";
import authMiddleware from "#middlewares/auth.middleware";

const kucoinRoutes = express.Router();


kucoinRoutes.get('/testing', authMiddleware,testOrder);
kucoinRoutes.get('/accounts', authMiddleware,getAccounts);
kucoinRoutes.get('/priceTickler', authMiddleware,priceTickler)
kucoinRoutes.get('/24hrPriceTickler', authMiddleware,priceChangeIn24hrStatistics);
kucoinRoutes.get('/orders-list', authMiddleware,ordersList);
kucoinRoutes.post('/order', authMiddleware,createNewOrder);
kucoinRoutes.post('/order/close', authMiddleware,closeOrder);
kucoinRoutes.get('/orders/:order_id', authMiddleware,getOrder);


export default kucoinRoutes