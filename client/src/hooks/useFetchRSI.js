import {useEffect, useState} from "react";

import _ from "lodash";
import {useQuery} from "react-query";

import {apis} from "services";

const useFetchRSI = ({coin = null, time = null, exchange = '',refetchInterval = 1500}) => {
    const [enabled, setEnable] = useState(false);

    useEffect(() => {
        if (coin && time) {
            setEnable(true);
        }

        return () => setEnable(false)
    }, [coin, time]);

    const {
        data: rsiResponse, refetch: refetchRSIValue, isRefetching, isLoading
    } = useQuery([_.lowerCase(exchange), `${coin}/USDT`, time], apis.getRSIValues, {
        enabled,
        refetchInterval
    });

    const rsiValue = _.get(rsiResponse, 'data.value', 0);
    const fetchingRSIValue = isLoading;


    return {rsiValue, fetchingRSIValue, refetchRSIValue}
};

export default useFetchRSI;