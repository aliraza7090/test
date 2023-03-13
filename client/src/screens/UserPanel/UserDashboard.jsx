import { AssetAllocation, BotProfitPieChart, DailyProfit, ProfitDistribution, TotalProfit } from "components";
import Winrate from "components/Winrate";
import _ from 'lodash'
import { useState } from "react"
import { Col, Container, Row } from 'react-bootstrap'
import { useQuery } from "react-query";
import { toast } from "react-toastify";
import { DAILY_PROFIT_DAYS, Q_LIST, TOTAL_PROFIT_DAYS } from "../../constants";
import { apis } from "../../services";
import textColorClass from "../../utils/textColorClass";


function UserDashboard() {
    const [ tab, setTab ] = useState( 'binance' );
    const [ profitDays, setProfitDays ] = useState( { totalProfitDays :7, dailyProfitDays :7 } );

    const profitDaysHandler = ( key, value ) => setProfitDays( prevState => ( { ...prevState, [ key ] :value } ) );

    const { data :details } = useQuery( [ tab ], apis.userDashboard, {
        onError :( error ) => toast.error( error )
        /*onSuccess: ({status, data}) => {
         console.log({status, data})
         }*/
    } );

    const data = _.get( details, 'data', [] );

    return <>
    <div className = 'dashboard-main custom-scroll'>
      <div className = 'section'>
        <Container fluid>
          <div className = 'bot-tabs mt-3 mb-5'>
            <ul className = 'justify-content-start'>
              <li>
                <a
                    className = { tab === 'binance' ? "active" : '' } href = { "#!" }
                    onClick = { () => setTab( 'binance' ) }>Binance</a>
              </li>
                {/*<li>
                 <a className={tab === 'kucoin' ? "active" : ''} href={"#!"}
                 onClick={() => setTab('kucoin')}>KuCoin</a>
                 </li>*/ }
            </ul>
          </div>
          <Row className = 'gy-3'>
            <Col lg = { 12 }>
              <div className = 'normal-box'>
                <h3>Total Running Bot ({ data?.totalRunningBots })</h3>
                <div className = 'inner-main'>
                  <div className = 'inner'>
                    <p className = 'm-0'>Total Profit USDT</p>
                    <span
                        className = { `big-font ${ textColorClass( data?.totalProfitPrice ) }` }>{ data?.totalProfitPrice }</span>
                  </div>
                  <div className = 'inner'>
                    <p>Running Assets USDT</p>
                    <span className = ''>{ data?.runningAssets }</span>
                  </div>
                  <div className = 'inner'>
                    <p>Today’s Profit USDT</p>
                    <span
                        className = { textColorClass( data?.todayProfitPrice ) }>{ data?.todayProfitPrice }</span>
                  </div>
                </div>
              </div>
            </Col>
            <Col lg = { 6 }>
              <div className = 'normal-box mt-4'>
                <div className = 'chart-filter'>
                  <ul className = 'ul'>
                    { _.values( TOTAL_PROFIT_DAYS ).map( ( days, index ) =>
                        <li key = { index }>
                        <a
                            href = { "#!" }
                            className = { days === profitDays.totalProfitDays ? 'active' : '' }
                            onClick = { () => profitDaysHandler( 'totalProfitDays', days ) }
                        >
                                                                                      { days } Days ({ Q_LIST[ days ] })
                        </a>
                      </li>
                    ) }
                  </ul>
                </div>
                <div className = 'flex-text-between'>
                  <h3>Total Profit ({ data?.totalProfitChart?.[ profitDays?.totalProfitDays ] })</h3>
                  <a href = { "#!" } className = 'gray-anchor'>Updated each hour</a>
                </div>
                <div className = 'chart-main'>
                  <TotalProfit
                      data = { data?.[ 'totalProfit' ]?.[ profitDays?.[ 'totalProfitDays' ] || 0 ] }
                      total = { data?.[ 'totalProfitChart' ]?.[ profitDays?.[ 'totalProfitDays' ] || 0 ] }
                  />
                </div>
              </div>
            </Col>
            <Col lg = { 6 }>
              <div className = 'normal-box mt-4'>
                <div className = 'chart-filter'>
                  <ul className = 'ul'>
                    { _.values( DAILY_PROFIT_DAYS ).map( ( days, index ) =>
                        <li key = { index }>
                        <a
                            href = { "#!" }
                            className = { days === profitDays.dailyProfitDays ? 'active' : '' }
                            onClick = { () => profitDaysHandler( 'dailyProfitDays', days ) }
                        >
                        { days } Days ({ Q_LIST[ days ] })
                        </a>
                      </li>
                    ) }
                  </ul>
                </div>
                <div className = 'flex-text-between'>
                  <h3>Daily Profit ({ data?.dailyProfitChart?.[ profitDays?.dailyProfitDays ] })</h3>
                  <a href = { '!#' } className = 'gray-anchor'>Updated on real time</a>
                </div>
                <div className = 'chart-main'>
                  <DailyProfit
                      data = { data?.[ 'dailyProfit' ]?.[ profitDays?.[ "dailyProfitDays" ] || 0 ] }
                      total = { data?.[ 'dailyProfitChart' ]?.[ profitDays?.[ "dailyProfitDays" ] || 0 ] }
                  />
                </div>
              </div>
            </Col>
            <Col lg = { 12 }>
              <div className = 'normal-box mt-4'>
                <div className = 'flex-text-between'>
                  <h3>Profit Distribution</h3>
                  <a href = { '#!' } className = 'gray-anchor'>Updated on real time</a>
                </div>
                <div className = 'chart-main'>
                  <ProfitDistribution data = { data?.profitDistribution } />
                </div>
              </div>
            </Col>
            <Col lg = { 12 }>
              <div className = 'normal-box mt-4'>
                <div className = 'flex-text-between'>
                  <h3>Winrate</h3>
                  <a href = { '#!' } className = 'gray-anchor'>Updated each hour</a>
                </div>
                <div className = 'chart-main'>
                  {/* <img src={imageURL('winrate.png')} className="chart-img"/> */ }
                    <Winrate data = { data?.winrate } />
                </div>
              </div>
            </Col>
            <Col lg = { 12 }>
              <div className = 'normal-box mt-4'>

                <div className = 'flex-text-between'>
                  <h3>Asset Allocation</h3>
                  <a href = { '#!' } className = 'gray-anchor'>Details</a>
                </div>
                <div className = 'chart-main'>
                  <AssetAllocation data = { data?.assetAllocation } />
                </div>
              </div>
            </Col>
            <Col lg = { 12 }>
              <div className = 'normal-box mt-4'>
                <BotProfitPieChart data = { data?.botProfit } />
              </div>
            </Col>
          </Row>
        </Container>
        <div className = 'mt-5'>

        </div>
      </div>
    </div>
  </>
}

export default UserDashboard
