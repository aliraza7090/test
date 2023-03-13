import {useState} from "react"
import {Row} from 'react-bootstrap'
import {imageURL} from "../hooks"
import TradingViewWidget from 'react-tradingview-widget';
import {useSelector} from "react-redux";
import {CoinBox} from "../components";
import {COINS} from "../constants";

function CoinMarket() {
    const [coin, setCoin] = useState(COINS.btc) // ['BTC', 'ETH']

    const {data: coins, balance} = useSelector(store => store.binance)

    const onChangeCoinHandler = (coin) => setCoin(coin);

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                {/*<div className="head-main">
                    <div className="head-section">
                        <div className="balance-section">
                            <span>Total Balance</span>
                            <div className="coin-detail">
                                <img src={imageURL('binance.png')} alt="Binance"/>
                                <h3> {balance}</h3>
                            </div>
                            <div className="up-and-down">
                                <div className="inner">
                                    <i className="fa-solid fa-caret-up text-green"></i>
                                    <h5>{coins?.BTC?.high}</h5>
                                </div>
                                <div className="inner">
                                    <i className="fa-solid fa-caret-down text-red"></i>
                                    <h5>{coins?.BTC?.low}</h5>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>*/}
                <Row className="my-5">
                    {
                        Object.values(coins).length > 0
                            ? Object.values(coins).map((_coin, index) => {
                                const symbol = _coin.symbol?.toUpperCase();
                                const change = _coin.change;
                                const active_class = symbol === coin
                                    ? "box-active"
                                    : ''
                                const change_class = change > 0
                                    ? `fa-caret-up text-green`
                                    : `fa-caret-down text-red`
                                return <CoinBox
                                    key={index}
                                    {..._coin}
                                    active_class={active_class}
                                    change_class={change_class}
                                    onChange={onChangeCoinHandler}
                                    symbol={symbol}
                                />
                            })
                            : null
                    }
                </Row>
                <div className="mt-2">
                    <TradingViewWidget
                        width="100%"
                        height={441}
                        symbol={coin === COINS.btc ? "BITSTAMP:BTCUSDT" : "BITSTAMP:ETHUSDT"}
                        interval="D"
                        timezone="Etc/UTC"
                        theme="Dark"
                        // style="1"
                        locale="en"
                        toolbar_bg="rgb(22, 26, 30)"
                        enable_publishing={false}
                        hide_side_toolbar={false}
                        allow_symbol_change={true}
                        hotlist={false}
                    />
                </div>
            </div>
        </div>
    </>
}

export default CoinMarket
