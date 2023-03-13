import moment from "moment";
import { Col , Form , Row } from "react-bootstrap";
import { getEstimatedTime , profitPercentage } from "utils";
import { STAGES } from "../constants";


const Order = ( props ) => {
    const {
        coin ,
        createdAt ,
        updatedAt ,
        day ,
        profit ,
        loss ,
        risk ,
        isActive ,
        investment ,
        setting ,
        _id ,
        exchange ,
        stopBot ,
        tab ,
        user ,
        entryPrice = 0 ,
        no = 1
    } = props;

    const totalProfit = profit || loss;
    const percentage = profitPercentage( profit , loss , investment )
    const { days , minutes , hours } = getEstimatedTime( createdAt , isActive ? undefined : moment( updatedAt ) );

    const renderTime = () => `
    ${ days > 0 ? `${ days }D` : '' }
    ${ minutes > 0 ? `${ hours }H` : '' }
    ${ minutes > 0 ? `${ minutes }M` : '0M' }
    `

    return (
        <Row className = 'gy-3'>
            <Col className = 'col-12'>
                <div className = 'main-statistics'>
                    <div className = 'padding-normal-l-r-t-b'>
                        <div className = 'd-flex justify-content-between'>
                            <p className = 'text-gray f-18 mb-0'>{ no }. { STAGES[ risk ] }</p>
                            { tab === 'open' && <div>
                                <Form.Check
                                    className = 'custom-switch'
                                    type = 'switch'
                                    id = 'custom-switch'
                                    label = ''
                                    checked = { isActive }
                                    onChange = { () => stopBot( { id : _id , exchange : exchange , user_id : user } ) }
                                />
                            </div> }
                        </div>
                        <h3>{ coin }/USDT</h3>
                        <div className = 'mb-2'>
                            <i className = { `fa-solid fa-circle text-${ isActive ? 'green' : 'red' }` }></i>
                            <span className = 'text-gray'> { renderTime() }</span>
                        </div>
                        {/*<p className="primary-text f-18 mb-0">0 arbitrages in 24 hours/Total 0 arbitrages</p>*/ }
                    </div>
                    <div className = 'other-bg'>
                        <div className = 'invest-profit'>
                            <div className = 'inner'>
                                <div className = 'd-flex gap-5'>
                                    <div className = 'text-center'>
                                        <p className = 'gray-text f-18 mb-0'>Investment USDT</p>
                                        <h2>{ investment }</h2>
                                    </div>
                                    <div className = 'text-center'>
                                        <p className = 'gray-text f-18 mb-0'>Price ({ coin }-USDT)</p>
                                        <h2>{ entryPrice }</h2>
                                    </div>
                                    <div className = 'text-center'>
                                        <p className = 'gray-text f-18 mb-0'>No. of Days Orders</p>
                                        <h2>{ day }</h2>
                                    </div>
                                </div>
                            </div>
                            <div className = 'inner'>
                                <p className = 'gray-text f-18 mb-0'>Total Profit USDT</p>
                                <h2 className = { `text-${ totalProfit > 0 ? 'green' : 'red' } red text-center` }>{ totalProfit }
                                    <sub>{ percentage }%</sub></h2>
                            </div>
                        </div>
                    </div>
                    {
                        !isActive &&
                        <ul className = 'statistic-list'>
                            <li>
                                <span>Price ({ coin }-USDT)</span>
                                <span>{ entryPrice }</span>
                            </li>
                            <li>
                                <span>No. of Days Orders</span>
                                <span>{ day }</span>
                            </li>
                            <li>
                                <span>Profit/Grid Q1</span>
                                <span>{ totalProfit } USDT </span>
                            </li>
                        </ul>
                    }
                </div>
            </Col>
        </Row>
    )
};

export default Order;
