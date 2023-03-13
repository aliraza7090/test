import {COINS, EXCHANGES} from "../constants";

const getTradingWidgetSymbol = ({coin = COINS.btc, exchange = EXCHANGES.binance}) => {
    if (exchange === EXCHANGES.binance) {
        return coin === COINS.btc ? 'BITSTAMP:BTCUSDT' : 'BITSTAMP:ETHUSDT'
    } else
        return coin === COINS.btc ? 'KUCOIN:BTCUSDT' : 'KUCOIN:ETHUSDT'
}

export default getTradingWidgetSymbol;