import {createHmac} from "crypto";
import formatQuery from "#utils/common/formatQuery";

const createSignature = ({
                             secret = "",
                             passphrase = "",
                             apiKey = "",
                             endpoint = '',
                             method = 'GET',
                             body = '',
                             timestamp = Date.now().toString(),
                         }) => {

    const sign = ['GET', 'DELETE'].includes(method)
        ? timestamp + method + endpoint + formatQuery(body)
        : timestamp + method + endpoint + JSON.stringify(body)

    console.log({sign})

    const KC_API_SIGN = createHmac('sha256', secret).update(sign).digest('base64')
    const KC_API_PASSPHRASE = createHmac('sha256', secret).update(passphrase).digest('base64')
    return {
        'Content-Type': 'application/json',
        "KC-API-KEY": apiKey,
        "KC-API-SIGN": KC_API_SIGN,
        'KC-API-TIMESTAMP': timestamp,
        "KC-API-PASSPHRASE": KC_API_PASSPHRASE,
        "KC-API-KEY-VERSION": "2"
    };

};


export default createSignature