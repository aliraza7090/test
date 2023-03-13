import kucoinApi from "kucoin-node-api";

import extractApiKeys from "#utils/common/extractApiKeys";
import kuCoinApi from "kucoin-node-api";

const getKucoin24hrStats = (symbol,apiKeys) => {
    const config = extractApiKeys(apiKeys, 'ku_coin')
    kuCoinApi.init(config);
    return kucoinApi.get24hrStats(symbol)
        .then(response => response?.data || {})
        .catch(error => {
            if(error.isAxiosError)
                console.log(`Error in getKucoin24hrStats(${symbol})`, error?.response?.data)
            else
                console.log(`Error while getting balance of ${symbol}`, error)
            return {};
        });
};

export default getKucoin24hrStats;