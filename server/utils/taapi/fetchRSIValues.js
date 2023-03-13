import _ from 'lodash'
import axios from "axios";
import {Taapi} from "#models/taapi.model";
import {EXCHANGES, PYTHON_SERVER_BASE_URL} from "#constants/index";

const fetchRSIValues = async (filters = {exchange: '', symbol: '', interval: ''}) => {
  const record = await Taapi.findOne(filters, {value: 1});
  /*Return Value from database*/
  if (record) return record;

  if (_.upperCase(filters.exchange) === EXCHANGES[0]) // Binance Exchange
  {
    try {
      const {interval, symbol} = filters;

      const _symbol = symbol === 'ETH/USDT' ? 'ETHUSDT' : 'BTCUSDT'

      const {
        data,
        status
      } = await axios.get(`${PYTHON_SERVER_BASE_URL}/api/v1/binance_us?symbol=${_symbol}&interval=${interval}`)

      const rsi = _.round(data);

      if (status === 200) {
        await new Taapi({...filters, value: rsi}).save();
        return {value: rsi}
      } else {
        console.log("Unhandled error in fetch RSI")
        // throw new Error(data)
      }
    } catch (error) {
      console.error(`Binance fetchRSIValue crashed`, error.response)
      return {value: 0}
    }
  }
};


export default fetchRSIValues
