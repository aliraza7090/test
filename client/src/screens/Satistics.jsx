import {Col, Container, Row} from 'react-bootstrap'
import TradingViewWidget from 'react-tradingview-widget';
import {useQuery} from "react-query";
import {apis} from "../services";
import {toast} from "react-toastify";
import {useState} from "react";
import textColorClass from "../utils/textColorClass";

const INITIAL_STATE = {
    running: {totalProfitUSDT: 0, assetsUSDT: 0, today: 0},
    history: {total: 0, today: 0},
    totalProfit: 0,
}

function Satistics() {
    const [data, setData] = useState(INITIAL_STATE)
    useQuery(['getAllProfitAndLossAdmin'], apis.profitLossStatisticsAdmin, {
        onError: (error) => toast.alert(error),
        onSuccess: ({data, status}) => {
            if (status === 200)
                setData(data);
        }
    });

    // const data = _.get(response, 'data', {});

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <Container fluid>
                    <Row>
                        <Col lg={12}>
                            <div className="normal-box">
                                <h3>Running</h3>
                                <div className="inner-main">
                                    <div className="inner">
                                        <p className="m-0">Total Profit USDT</p>
                                        <span className={`big-font ${textColorClass(data?.running?.totalProfitUSDT)}`}>
                                            {data?.running?.totalProfitUSDT}
                                        </span>
                                    </div>
                                    <div className="inner">
                                        <p>Running Assets USDT</p>
                                        <span className={`${textColorClass(data?.running?.assetsUSDT)}`}>{data?.running?.assetsUSDT}</span>
                                    </div>
                                    <div className="inner">
                                        <p>Today’s Profit USDT</p>
                                        <span className={textColorClass(data?.running.today)}>
                                            {data?.running.today}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="normal-box mt-4">
                                <h3>History</h3>
                                <div className="inner-main">
                                    <div className="inner">
                                        <p className="m-0">Profit History USDT</p>
                                        <span
                                            className={`big-font ${textColorClass(data?.history?.total)}`}>
                                            {data?.history?.total}
                                        </span>
                                    </div>
                                    <div className="inner">
                                        <p>Today’s Profit USDT</p>
                                        <span className={textColorClass(data?.history.today)}>{data?.history.today}</span>
                                    </div>

                                </div>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="normal-box mt-4">
                                <div className="profit-flex">
                                    <h3>Total Profit</h3>
                                    <h4 className={textColorClass(data?.totalProfit)}>{data?.totalProfit}</h4>
                                </div>
                                <TradingViewWidget
                                    width="100%"
                                    height={441}
                                    symbol="BITSTAMP:BTCUSDT"
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
                                    container_id="tradingview_0cf12"
                                />
                            </div>
                        </Col>
                    </Row>
                </Container>
                <div className="mt-5">

                </div>
            </div>
        </div>
    </>
}

export default Satistics