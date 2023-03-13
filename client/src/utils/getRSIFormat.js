import _ from 'lodash'
import {EXCHANGES} from "../constants";

const getRSIFormatTime = (time, exchange) => _.lowerCase(exchange) === _.lowerCase(EXCHANGES.binance)
    ? TIME[time]
    : KUCOIN_TIME[time];

const TIME = {
    '1 second': '1s',
    '1 minute': '1m',
    '3 minutes': '3m',
    '5 minutes': '5m',
    '15 minutes': '15m',
    '30 minutes': '30m',
    '1 hour': '1h',
    '2 hours': '2h',
    '4 hours': '4h',
    '6 hours': '6h',
    '8 hours': '8h',
    '12 hours': '12h',
    '1 day': '1d',
    '3 day': '3d',
    '1 week': '1w',
}

const KUCOIN_TIME = {
    '1 minute': '1min',
    '3 minutes': '3min',
    '5 minutes': '5min',
    '15 minutes': '15min',
    '30 minutes': '30min',
    '1 hour': '1hour',
    '2 hours': '2hour',
    '4 hours': '4hour',
    '6 hours': '6hour',
    '8 hours': '8hour',
    '12 hours': '12hour',
    '1 day': '1day',
    '1 week': '1week'
}

export default getRSIFormatTime