import _ from "lodash";
import BinanceSocketClient from "#sockets/BinanceSocketClient";


const getBinanceCoinPrice = async (symbol) => {
  const streamName = symbol === "BTCUSDT" ? "btcusdt@aggTrade" : "ethusdt@aggTrade";
  const socketClient = new BinanceSocketClient(`ws/${streamName}`, 'wss://stream.binance.us:9443/');

  return await new Promise((resolve, reject) => {
    socketClient.setHandler("aggTrade", (params) => {
      const {p: price} = params;
      console.log({price},"########")
      resolve(_.round(price, 2));
    })
  }).then(response => response)
    .catch(error => console.error(`Error in getBinanceCoinPrice`, error))
};

export default getBinanceCoinPrice
