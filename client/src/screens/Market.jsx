import {useState} from "react"
import {useSelector} from "react-redux";
import {Container, Row} from 'react-bootstrap'
import TradingViewWidget from 'react-tradingview-widget';

import {CoinBox, Loader} from "components";
import {COINS} from "../constants";

function Market() {
    const {data: coins} = useSelector(store => store.binance);

    const [coin, setCoin] = useState(COINS.btc)

    const onChangeCoinHandler = (coin) => setCoin(coin);

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <Container fluid>
                    <Row className="gy-5">
                        {
                            Object.values(coins).length > 0
                                ? Object.values(coins).map((_coin,index) => {
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
                                : <Loader variant='light'/>
                        }
                    </Row>
                </Container>
                <div className="mt-5 w-100" style={{ height: 400 }}>
                    <TradingViewWidget
                        symbol={coin === COINS.btc ? "BINANCE:BTCUSDT" : "BINANCE:ETHUSDT"}
                        interval="D"
                        timezone="Etc/UTC"
                        theme="Dark"
                        // style="1"
                        locale="en"
                        // toolbar_bg="rgb(22, 26, 30)"
                        // enable_publishing={false}
                        // hide_side_toolbar={false}
                        // allow_symbol_change={true}
                        // hotlist={false}
                        autosize
                    />
                </div>
            </div>
        </div>
    </>
}

export default Market
