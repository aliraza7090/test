import _ from "lodash";
import kuCoinApi from 'kucoin-node-api';
import extractApiKeys from "#utils/common/extractApiKeys";

const getKucoinAccountBalance = async (params = {type: 'trade', currency: 'USDT'}, apiKeys) => {
    const config = extractApiKeys(apiKeys, 'ku_coin')
    kuCoinApi.init(config);
    return await kuCoinApi?.getAccounts(params)
        .then(response => _.round(response?.data?.[0]?.available, 4))
        .catch(error => {
            if (error?.isAxiosError) {
                const data = error?.response?.data;
                /*TODO:: Temp turn off*/
                // console.log(`Error in getKucoinAccountBalance()`, data?.msg);
                return 0
            }
            console.log(error.message);
            return 0;
        });
};


export default getKucoinAccountBalance