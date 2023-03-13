import _ from "lodash";
import {useState} from "react"
import {useQuery} from "react-query";
import {toast} from "react-toastify";
import {Col, Container, Row} from 'react-bootstrap'

import {apis} from "services";
import {DailyProfit, Loader, PaidHistoryTabs, ProfitDistribution, TotalProfit, Winrate} from "components";
import {COINS, DAILY_PROFIT_DAYS, TOTAL_PROFIT_DAYS} from "../../constants";
import {textColorClass} from "../../utils";

function PLAccount({isAdmin}) {
  const [tab, setTab] = useState(COINS.eth)
  const [profitDays, setProfitDays] = useState({totalProfitDays: 7, dailyProfitDays: 7});

  const {data: response, isLoading, isRefetching} = useQuery([tab], apis.profitLossAccountDetails, {
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
          {
            isLoading || isRefetching
              ? <Loader variant="light"/>
              : <Row className="gy-3">
                <Col lg={12}>
                  <div className="normal-box">
                    <h3>Running ({data?.runningOrders})</h3>
                    <div className="inner-main">
                      <div className="inner">
                        <p className="m-0">Total Profit USDT</p>
                        <span className={`big-font ${textColorClass(data?.totalProfitPrice)}`}>
                                            {data?.totalProfitPrice}
                                        </span>
                      </div>
                      <div className="inner">
                        <p>Running Assets USDT</p>
                        <span>{data?.runningAssets}</span>
                      </div>
                      <div className="inner">
                        <p>Today’s Profit USDT</p>
                        <span className={textColorClass(data?.todayProfitPrice)}>
                                                    {data?.todayProfitPrice}
                                                </span>
                      </div>
                    </div>
                  </div>
                </Col>
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
                      <h3>Total Profit ({data?.totalProfitChart?.[profitDays?.totalProfitDays]})</h3>
                      <a href='#' className='gray-anchor'>Updated each hour</a>
                    </div>
                    <div className="chart-main">
                      <TotalProfit
                        data={data?.['totalProfit']?.[profitDays?.['totalProfitDays'] || 0]}
                        total={data?.['totalProfitChart']?.[profitDays?.['totalProfitDays'] || 0]}
                      />
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
                      <h3>Daily Profit ({data?.dailyProfitChart?.[profitDays?.dailyProfitDays]})</h3>
                      <a href='#' className='gray-anchor'>Updated on real time</a>
                    </div>
                    <div className="chart-main">
                      <DailyProfit
                        data={data?.['dailyProfit']?.[profitDays?.["dailyProfitDays"] || 0]}
                        total={data?.['dailyProfitChart']?.[profitDays?.["dailyProfitDays"] || 0]}
                      />
                    </div>
                  </div>
                </Col>
                <Col lg={12}>
                  <div className="normal-box mt-4">
                    <div className='flex-text-between'>
                      <h3>Profit Distribution</h3>
                      <a href='#' className='gray-anchor'>Updated on real time</a>
                    </div>
                    <div className="chart-main">
                      <ProfitDistribution data={data?.profitDistribution}/>
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
                      <Winrate data={data?.winrate}/>
                    </div>
                  </div>
                </Col>
              </Row>
          }
        </Container>
      </div>
    </div>
  </>
}

export default PLAccount
