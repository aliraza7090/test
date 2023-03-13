import _ from "lodash";
import {WebsocketClient} from "binance";

import {socketLogger} from "#utils/logger";
import {main} from "#sockets/Binance/main";
import {BINANCE_US_SOCKET_URL} from "#constants/index";

export default function BTC() {
  const wsClient = new WebsocketClient({beautify: true, wsUrl: BINANCE_US_SOCKET_URL}, socketLogger);

  wsClient.on('formattedMessage', async (data) => {
    const {symbol, kline} = data;
    const {close} = kline;

    const currentPrice = _.round(close);
    // console.log(currentPrice);
    const coin = symbol === "BTCUSDT" ? "BTC" : "ETH";

    await main({currentPrice, coin, symbol});
  });

  wsClient.subscribeSpotKline("BTCUSDT", '1s');
}

