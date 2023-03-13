import _kucoinApi from "kucoin-node-api";

const getKucoinPrice = async (symbol) => {
    return _kucoinApi.getTicker(symbol)
        .then(response => response?.data?.price || 0)
        .catch(error => {
            console.log(`Error while getting balance of ${symbol}`, error.message)
            return 0;
        });
};

export default getKucoinPrice