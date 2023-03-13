import axios from "axios";
import {ACCOUNT_INFORMATION_ENDPOINT, KUCOIN_API_BASE_URL} from "#constants/index";
import signature from "#utils/kucoin/createSignature";
import createSignature from "#utils/kucoin/createSignature";
import formatQuery from "#utils/common/formatQuery";


const createAxiosInstance = () => {
    const api = axios.create({
        baseURL: `${KUCOIN_API_BASE_URL}`,
        timeout: 60 * 1000,
    });

    api.interceptors.response.use(
        (response) => response,
        (error) => {
            const message = error?.response?.data;
            error.message = message ?? error.message
            /*if(error?.response?.data?.errors)
                error.errors = error?.response?.data?.errors;*/
            return Promise.reject(error)
        }
    );

    const accountInformation = async (body,credentials) => {
        const endpoint = '/api/v1/accounts'
        const url = endpoint + formatQuery(body);

        const headers = createSignature({
            body,
            endpoint,
            ...credentials
        });

        return api.get(url, {headers})
            .then(response => response?.data)
            .catch(error => error?.response?.data)
    }

    const order = async (body) => {
            //
            /*body = {
                clientOid: '07921312731237',
                side: 'sell',
                symbol: 'BTC',
                type: 'market',
                //size: 20, // Desired amount in base currency
                //funds: 0, //'The desired amount of quote currency to use'
            },*/
            timestamp = Date.now();

        headers['KC-API-SIGN'] = sign(timestamp + 'POST' + endpoint + JSON.stringify(body), '4c9872c8-ff0e-4950-9d0a-7a9c2e326b13')

        console.log(timestamp + 'POST' + endpoint + JSON.stringify(body));

        return api.post(endpoint, {}, {headers: headers})
            .then(response => response.data)
            .catch(error => error.response.data);
    }
    const getAccounts = () => {
        const endpoint = '/api/v2/symbols',
            body = '',
            timestamp = getTimestamp();
        headers['KC-API-SIGN'] = signature(endpoint, body, timestamp,)

        return api.get(endpoint, {headers})
            .then(response => response.data)
            .catch(error => error);
    };
    const get24hrStats = (params) => api.get(`/api/v1/market/stats?${params}`)

    return {getAccounts, order, get24hrStats, accountInformation}
};

const kuCoinApi = createAxiosInstance();

export default kuCoinApi