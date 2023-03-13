import {v4 as uuidv4} from "uuid";

const createOrderParams = ({size, symbol, funds}, isSellOrder = true) => {
    const params = {clientOid: uuidv4(), type: 'market', symbol}
    params['side'] = isSellOrder ? 'sell' : 'buy';

    isSellOrder
        ? params['size'] = size //for sale order
        : params['funds'] = funds // for buy order


    return params
};


export default createOrderParams