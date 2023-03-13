/*****  USERS  *****/
export const USER_ROLES = ['ADMIN', 'USER', 'SUB_ADMIN'];
export const JWT_ERRORS = ['']
export const TOKEN_EXPIRE_TIME = '1d'
export const BOT_CONFIGURED_BY = ['ADMIN', 'SUB_ADMIN', "AUTOMATIC"];
// export const BOT_STATUS = {READY_TO_SOLD_COINS: "BOUGHT", READY_TO_PURCHASE_COINS: "readyToPurchaseCoins"}
export const BOT_STATUS = {COINS_PURCHASED: true, COIN_SOLD: false}

/*****  BOT  *****/
export const INDICATORS = ['RSI', 'TRAILING'];
export const RISKS = ['LOW', 'MODERATE', 'HIGH'];
export const STAGES = {LOW: 'Q1', MODERATE: 'Q2', HIGH: 'Q3', DEFAULT: '?'}
export const EXCHANGES = ['BINANCE', 'KUCOIN'];
export const COINS = ['BTC', 'ETH'];
export const OPERATION = ['MANUAL', 'AUTO'];

export const SOCKET_EVENTS = {
  hit_binance_api: "HIT_BINANCE_API",
  send_binance_api_data: "SEND_BINANCE_API_DATA",
  HIT_KUCOIN_API: "HIT_KUCOIN_API",
  SEND_KUCOIN_API_DATA: "SEND_KUCOIN_API_DATA",
  GET_BINANCE_STATS: "GET_BINANCE_STATS",
  GET_BINANCE_ACCOUNT_BALANCE: "GET_BINANCE_ACCOUNT_BALANCE"
}

export const TAAPI_SYMBOLS = ['BTC/USDT', 'ETH/USDT'];

export const BINANCE_INTERVAL = ['1s', '1m', '3m', '5m', '15m', '30m', '1h', '2h', '4h', '6h', '8h', '12h', '1d', '3d', '1w', '1M']

export const KUCOIN_SYMBOLS = ['BTC-USDT', 'ETH-USDT']

export const KUCOIN_INTERVAL = ['1min', '3min', '5min', '15min', '30min', '1hour', '2hour', '4hour', '6hour', '8hour', '12hour', '1day', '1week'];


export const ORIGINS = ['http://localhost:3000', 'http://crypto-bot.pluton.ltd']
export const SOCKET_ORIGINS = ['http://localhost:*', 'http://crypto-bot.pluton.ltd:*', 'https://cryptobot-backend.herokuapp.com:*']



export const PYTHON_SERVER_BASE_URL = 'https://binance-us-ywhfq.ondigitalocean.app'
export const DOMAIN = "http://137.184.28.166:5000/"
// export const DOMAIN = "http://localhost:5000/"

//BIANNCE CONSTANTS
export const BINANCE_US_SOCKET_URL = "wss://stream.binance.us:9443"
export const BINANCE_API_BASE_URL = 'https://api.binance.us';


// KUCOINS CONSTANTS
export const KUCOIN_API_BASE_URL = 'https://api.kucoin.com'
export const ACCOUNT_INFORMATION_ENDPOINT = "/api/v1/accounts"
