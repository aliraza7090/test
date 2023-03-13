import {useState} from "react"
import {Col, Container, Row} from 'react-bootstrap'
import {DailyProfit, PaidHistoryTabs, TotalProfit, Winrate} from "components";
import _ from "lodash";
import {useQuery} from "react-query";
import {toast} from "react-toastify";

import {apis} from "services";
import {COINS,EXCHANGES, DAILY_PROFIT_DAYS, TOTAL_PROFIT_DAYS} from "../constants";
import { useSelector } from "react-redux";

function UserProfit() {

    const {data: kucoins, balance: _balance} = useSelector(store => store.kucoin);

    const {
        data: adminData,
        refetch
    } = useQuery(['getAllProfitAndLossAdmin'], () => apis.profitLossAccountDetailsAdmin(tab))
    const record = adminData?.data || [];
    
    
    const [tab, setTab] = useState(EXCHANGES.binance)
    
    
    const [coin, setCoin] = useState(COINS.btc) // ['BTC', 'ETH']




    //const [tab, setTab] = useState(COINS.eth)
    
    const [profitDays, setProfitDays] = useState({totalProfitDays: 7, dailyProfitDays: 30});

    const {data: response, isLoading} = useQuery([tab], apis.profitLossAccountDetails, {
        onError: (error) => toast.error(error),
        /*onSuccess: ({data, status}) => {
            console.log({data, status});
        }*/
    });
    const profitDaysHandler = (key, value) => setProfitDays(prevState => ({...prevState, [key]: value}));

    //Destructuring Data;
    const data = _.get(response, 'data', {});

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <Container fluid>
                   <PaidHistoryTabs tab={tab} setTab={setTab}/>
                    <Row className="gy-3">

                        <Col lg={6}>
                            <div className="normal-box mt-4">
                                <div className="chart-filter">
                                <ul className="ul">
                                        {_.values(TOTAL_PROFIT_DAYS).map((days, index) =>
                                            <li key={index}>
                                                <a href={"#!"}
                                                   className={days === profitDays.totalProfitDays ? 'active' : ''}
                                                   onClick={() => profitDaysHandler('totalProfitDays', days)}
                                                >
                                                    {days} Days</a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className='flex-text-between'>
                                    <h3>Total Profit</h3>
                                    <a href='#' className='gray-anchor'>Updated each hour</a>
                                </div>
                                <div className="chart-main">
                                    <TotalProfit days={profitDays?.totalProfitDays} data={data?.totalProfit}/>
                                </div>
                            </div>
                        </Col>
                        <Col lg={6}>
                            <div className="normal-box mt-4">
                                <div className="chart-filter">
                                <ul className="ul">
                                        {_.values(DAILY_PROFIT_DAYS).map((days, index) =>
                                            <li key={index}>
                                                <a href={"#!"}
                                                   className={days === profitDays.dailyProfitDays ? 'active' : ''}
                                                   onClick={() => profitDaysHandler('dailyProfitDays', days)}
                                                >
                                                    {days} Days</a>
                                            </li>
                                        )}
                                    </ul>
                                </div>
                                <div className='flex-text-between'>
                                    <h3>Daily Profit</h3>
                                    <a href='#' className='gray-anchor'>Updated on real time</a>
                                </div>
                                <div className="chart-main">
                                    <DailyProfit  days={profitDays.dailyProfitDays} data={data?.dailyProfit}/>
                                </div>
                            </div>
                        </Col>
                        <Col lg={12}>
                            <div className="normal-box mt-4">

                                <div className='flex-text-between'>
                                    <h3>Winrate</h3>
                                    <a href='#' className='gray-anchor'>Updated each hour</a>
                                </div>
                                <div className="chart-main">
                                    <Winrate  data={data?.Winrate}/>
                                </div>
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

export default UserProfit