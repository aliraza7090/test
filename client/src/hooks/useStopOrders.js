import _ from 'lodash'
import {apis} from "services";
import {toast} from "react-toastify";
import {useMutation} from "react-query";

import {showToastError} from "utils";
import {EXCHANGES} from "../constants";

const useStopOrders = (exchange, cb) => {
    const func = exchange === _.upperCase(EXCHANGES.binance)
        ? apis.binanceCloseOrder
        : apis.kucoinCloseOrder;

    const {mutate: closeOrder, isLoading: closingOrder} = useMutation(['closeBot'], func, {
        onError: (error) => showToastError(error),
        onSuccess: () => {
            toast.success('Bot Stopped')
            cb();
        }
    });

    return {closeOrder, closingOrder}
};

export default useStopOrders