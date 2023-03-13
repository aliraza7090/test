import {
    AssetAllocation,
    BotProfitPieChart,
    CoinBox,
    DailyProfit,
    Loader,
    ProfitDistribution,
    TotalProfit,
    Winrate
} from "components";
import _ from "lodash";
import { useEffect, useState } from "react"
import { Col, Container, Row } from 'react-bootstrap'
import { useQuery } from "react-query";
import { useSelector } from "react-redux";
import TradingViewWidget from 'react-tradingview-widget';
import { getExchangeCoinsValues, getTradingWidgetSymbol, textColorClass } from "utils";
import { COINS, DAILY_PROFIT_DAYS, EXCHANGES, Q_LIST, TOTAL_PROFIT_DAYS } from "../constants";
import { apis } from "../services"


function Dashboard() {

    const { data :coins } = useSelector( store => store.binance );
    const { data :kucoins, balance :_balance } = useSelector( store => store.kucoin );

    const {
        isLoading,
        isRefetching,
        data :adminData,
        refetch
    } = useQuery( [ 'getAllProfitAndLossAdmin' ], () => apis.profitLossAccountDetailsAdmin( tab ) )
    //const record = adminData?.data || [];
    const [ tab, setTab ] = useState( EXCHANGES.binance )

    const record = _.get( adminData, 'data', [] );

    const [ coin, setCoin ] = useState( COINS.btc ) // ['BTC', 'ETH']
    const [ profitDays, setProfitDays ] = useState( { totalProfitDays :7, dailyProfitDays :7 } );


    const profitDaysHandler = ( key, value ) => setProfitDays( prevState => ( { ...prevState, [ key ] :value } ) );
    const onChangeCoinHandler = ( coin ) => setCoin( coin );

    useEffect( () => {
        refetch()
    }, [ tab, refetch ] );

    return <>
    <div className = 'dashboard-main custom-scroll'>
      <div className = 'section'>
        <Container fluid>
          <div className = 'bot-tabs mt-3 mb-5'>
            <ul className = 'justify-content-start'>
              <li>
                <a
                    className = { tab === 'Binance' && "active" } href = { '#!' }
                    onClick = { () => setTab( EXCHANGES.binance ) }>Binance</a>
              </li>
                {/*<li>
                 <a className={tab === 'kuCoin' && "active"} href={'#!'}
                 onClick={() => setTab(EXCHANGES.kuCoin)}>KuCoin</a>
                 </li>*/ }
            </ul>
          </div>
          <Row className = 'gy-5'>
            {

                _.values( getExchangeCoinsValues( tab, coins, kucoins ) ).length > 0
                    ? _.values( getExchangeCoinsValues( tab, coins, kucoins ) ).map( ( _coin ) => {
                        const symbol = _coin.symbol?.toUpperCase();
                        const change = _coin.change;
                        const active_class = symbol === coin
                            ? "box-active"
                            : ''
                        const change_class = change > 0
                            ? `fa-caret-up text-green`
                            : `fa-caret-down text-red`
                        return <CoinBox
                            { ..._coin }
                            active_class = { active_class }
                            change_class = { change_class }
                            onChange = { onChangeCoinHandler }
                            symbol = { symbol }
                        />
                    } )
                    : null
            }
          </Row>
          <div className = 'mt-5 mb-4'>
            <TradingViewWidget
                width = '100%'
                height = { 441 }
                symbol = { getTradingWidgetSymbol( { coin, exchange :tab } ) }
                interval = 'D'
                timezone = 'Etc/UTC'
                theme = 'Dark'
                locale = 'en'
                toolbar_bg = 'rgb(22, 26, 30)'
                enable_publishing = { false }
                hide_side_toolbar = { false }
                allow_symbol_change = { true }
                hotlist = { false }
            />
          </div>
            {
                ( isLoading || isRefetching )
                    ? <Loader variant = 'light' />
                    : <Row className = 'gy-3 mt-1'>
                <Col lg = { 12 }>
                  <div className = 'normal-box'>
                    <h3>Total Running Bot ({ record?.totalRunningBots })</h3>
                    <div className = 'inner-main'>
                      <div className = 'inner'>
                        <p className = 'm-0'>Total Profit USDT</p>
                        <span className = { `big-font ${ textColorClass( record?.totalProfitPrice ) }` }>
                                            { record?.totalProfitPrice }
                                        </span>
                      </div>
                      <div className = 'inner'>
                        <p>Running Assets USDT</p>
                        <span className = ''>{ record?.runningAssets }</span>
                      </div>
                      <div className = 'inner'>
                        <p>Today’s Profit USDT</p>
                        <span
                            className = { textColorClass( record?.todayProfitPrice ) }>{ record?.todayProfitPrice }</span>
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
                              { days } Days ({ Q_LIST[ days ] })</a>
                          </li>
                        ) }
                      </ul>
                    </div>
                    <div className = 'flex-text-between'>
                      <h3>Total Profit ({ record?.totalProfitChart?.[ profitDays?.totalProfitDays ] })</h3>
                      <a href = { '#!' } className = 'gray-anchor'>Updated each hour</a>
                    </div>
                    <div className = 'chart-main'>
                      <TotalProfit
                          data = { record?.[ 'totalProfit' ]?.[ profitDays?.[ 'totalProfitDays' ] || 0 ] }
                          total = { record?.[ 'totalProfitChart' ]?.[ profitDays?.[ 'totalProfitDays' ] || 0 ] }
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
                      <h3>Daily Profit ({ record?.dailyProfitChart?.[ profitDays?.dailyProfitDays ] })</h3>
                      <a href = { '#!' } className = 'gray-anchor'>Updated on real time</a>
                    </div>
                    <div className = 'chart-main'>
                      <DailyProfit
                          data = { record?.[ 'dailyProfit' ]?.[ profitDays?.[ "dailyProfitDays" ] || 0 ] }
                          total = { record?.[ 'dailyProfitChart' ]?.[ profitDays?.[ "dailyProfitDays" ] || 0 ] }
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
                      <ProfitDistribution data = { record?.profitDistribution } />
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
                        <Winrate data = { record?.winrate } />
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
                      <AssetAllocation data = { record?.assetAllocation } />

                    </div>
                  </div>
                </Col>
                <Col lg = { 12 }>
                  <div className = 'normal-box mt-4'>
                    <BotProfitPieChart data = { record?.botProfit } />
                  </div>
                </Col>
              </Row>
            }
        </Container>
        <div className = 'mt-5'>

        </div>
      </div>
    </div>
  </>
}

export default Dashboard
