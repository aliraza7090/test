import { Col, Row } from "react-bootstrap"

export default function Questions({type})
{
    return <>
        <Row className="gy-3">
            <Col className="col-12">
                <div className="main-statistics">
                    <div className="padding-normal-l-r-t-b">
                        <p className="text-gray f-18 mb-0">Q</p>
                        <h3>BTC/USDT</h3>
                        <div className="mb-2">
                            <i className={"fa-solid fa-circle "+(type === 'close-order' ? 'text-red' : 'text-green')}></i>
                            <span className="text-gray"> 6D 12H 51M</span>
                        </div>
                        <p className="primary-text f-18  mb-0">Max Investment reached. Adjust the limit to continue the DCA.</p>
                    </div>
                    <div className="other-bg">
                        <div className="invest-profit">
                            <div className="inner">
                                <p className="gray-text f-18 mb-0">Investment USDT</p>
                                <h2>24</h2>
                            </div>
                            <div className="inner">
                                <p className="gray-text f-18 mb-0">Total Profit USDT</p>
                                <h2 className="text-red">-1.260367 <sub>-5.25%</sub></h2>
                            </div>
                        </div>
                    </div>
                    {
                        type != 'close-order' &&
                        <ul className="statistic-list">
                        <li>
                            <span>Price Range (USDT)</span>
                            <span>13290-24681</span>
                        </li>
                        <li>
                            <span>No. of Days Orders</span>
                            <span>100</span>
                        </li>
                        <li>
                            <span>Profit/Grid Q1</span>
                            <span>0.29%-0.68%</span>
                        </li>
                    </ul>
                    }

                </div>
            </Col>
            <Col className="col-12">
                <div className="main-statistics">
                    <div className="padding-normal-l-r-t-b">
                        <p className="text-gray f-18 mb-0">Q2</p>
                        <h3>ETH/USDT</h3>
                        <div className="mb-2">
                        <i className={"fa-solid fa-circle "+(type == 'close-order' ? 'text-red' : 'text-green')}></i>
                            <span className="text-gray"> 6D 12H 51M</span>
                        </div>
                        <p className="primary-text f-18 mb-0">0 arbitrages in 24 hours/Total 0 arbitrages</p>
                    </div>
                    <div className="other-bg">
                        <div className="invest-profit">
                            <div className="inner">
                                <p className="gray-text f-18 mb-0">Investment USDT</p>
                                <h2>24</h2>
                            </div>
                            <div className="inner">
                                <p className="gray-text f-18 mb-0">Total Profit USDT</p>
                                <h2 className="text-red">-1.260367 <sub>-5.25%</sub></h2>
                            </div>
                        </div>
                    </div>
                    {
                        type != 'close-order' &&
                        <ul className="statistic-list">
                        <li>
                            <span>Price Range (USDT)</span>
                            <span>13290-24681</span>
                        </li>
                        <li>
                            <span>No. of Days Orders</span>
                            <span>100</span>
                        </li>
                        <li>
                            <span>Profit/Grid Q1</span>
                            <span>0.29%-0.68%</span>
                        </li>
                    </ul>
                    }
                </div>
            </Col>
        </Row>
    </>
}
