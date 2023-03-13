import _ from "lodash";
import BinanceSocketClient from "#sockets/BinanceSocketClient";


const getCoinStats = async (symbol) => {
  const streamName = symbol === "BTCUSDT" ? "btcusdt@ticker" : "ethusdt@ticker";
  const socketClient = new BinanceSocketClient(`ws/${streamName}`,'wss://stream.binance.us:9443/');

  return await new Promise((resolve, reject) => {
    socketClient.setHandler("24hrTicker", (params) => {
      const data = {}
      const {
        p: priceChange,
        P: percentChange,
        w: averagePrice,
        c: close,
        b: bestBid,
        h: high,
        l: low,
        v: volume,
        n: numTrades
      } = params;

      data['low'] = _.round(low, 2).toFixed(2);
      data['high'] = _.round(high, 2).toFixed(2);
      data['close'] = _.round(close, 2).toFixed(2);
      data['volume'] = _.round(volume, 2).toFixed(2);
      data['bestBid'] = _.round(bestBid, 2).toFixed(2);
      data['change'] = _.round(priceChange, 2).toFixed(2);
      data['numTrades'] = _.round(numTrades, 2).toFixed(2);
      data['averagePrice'] = _.round(averagePrice, 2).toFixed(2);
      data['changePercentage'] = _.round(percentChange, 2).toFixed(2);

      resolve(data);
    })
  }).then(response => response)
    .catch(error => console.log({error}))
};

export default getCoinStats
