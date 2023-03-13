import {EXCHANGES} from "../constants";

const getExchangeCoinsValues = (exchange = '', binance = [], kucoins = []) => {
    if (exchange === EXCHANGES.binance)
        return binance;
    else if (exchange === EXCHANGES.kuCoin)
        return kucoins;
    else
        return []
};


export default getExchangeCoinsValues