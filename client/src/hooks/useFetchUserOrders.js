import _ from "lodash";
import {useQuery} from "react-query";

import {apis} from "services";
import {showToastError} from "utils";

const useFetchUserOrders = (status = 'open') => {
    const queryFn = status === 'allBots' ? apis.allBots : apis.userOrdersBot;
    const {
        data,
        refetch: refetchOrders,
        isLoading,
        isRefetching
    } = useQuery([status], queryFn, {onError: showToastError});

    const isFetchingBots = isLoading || isRefetching;
    const userOrders = _.get(data, 'data', []);

    return {isFetchingBots, userOrders, refetchOrders};
}

export default useFetchUserOrders