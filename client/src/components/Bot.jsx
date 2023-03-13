import {memo} from "react";
import {Col, Form} from "react-bootstrap";
import {getEstimatedTime, textColorClass} from "utils";
import {RISKS, STAGES} from "../constants";

const Bot = memo((props) => {

    const {coin, createdAt, isActive, risk, investment, status,day, stopBot, _id, exchange, profit, user, no,setting, entryPrice = 0,loss} = props;

    if (!status) return null;

    const {days, minutes, hours} = getEstimatedTime(createdAt);
    const botOnlineStatus = isActive ? 'text-green' : 'text-red';
    const totalProfit = profit || loss;

    const renderTime = () => `
    ${days && `${days}D`}
    ${minutes && `${hours}H`}
    ${minutes && `${minutes}M`}
    `

    return (
        <Col className="col-12 mt-5">
            <div className="main-statistics">
                <div className="padding-normal-l-r-t-b">
                    <div className='d-flex justify-content-between'>
                        <div>
                            <p className="text-gray f-18 mb-0">
                                {no}. {STAGES[risk]}
                            </p>
                        </div>
                        <div>
                            <Form.Check
                                className="custom-switch"
                                type="switch"
                                id="custom-switch"
                                label=""
                                checked={isActive}
                                onChange={() => stopBot({id: _id, exchange: exchange, user_id: user})}
                            />
                        </div>
                    </div>
                    <h3>{coin}/USDT</h3>
                    <div className="mb-2">
                        <i className={`fa-solid fa-circle ${botOnlineStatus}`}></i>
                        <span className="text-gray"> {renderTime()}</span>
                    </div>
                    {/*<p className="primary-text f-18  mb-0">Max Investment reached. Adjust the limit to continue the DCA.</p>*/}
                </div>
                <div className="other-bg">
                    <div className="invest-profit">
                        <div className="inner">
                            <div className="d-flex gap-5">
                                <div className='text-center'>
                                    <p className="gray-text f-18 mb-0">Investment USDT</p>
                                    <h2>{investment}</h2>
                                </div>
                                <div className='text-center'>
                                    <p className="gray-text f-18 mb-0">Price ({coin}-USDT)</p>
                                    <h2>{entryPrice}</h2>
                                </div>
                                <div className='text-center'>
                                    <p className="gray-text f-18 mb-0">No. of Days Orders</p>
                                    <h2>{day}</h2>
                                </div>
                            </div>
                        </div>
                        <div className="inner">
                            <p className="gray-text f-18 mb-0">Total Profit USDT</p>
                            <h2 className={textColorClass(profit)}>
                                {profit}
                            </h2>
                        </div>
                    </div>
                </div>
                {
                    !isActive &&
                    <ul className="statistic-list">
                        <li>
                            <span>Price ({coin}-USDT)</span>
                            <span>0</span>
                        </li>
                        <li>
                            <span>No. of Days Orders</span>
                            <span>{day}</span>
                        </li>
                        <li>
                            <span>Profit/Grid Q1</span>
                            <span>{totalProfit} USDT </span>
                        </li>
                    </ul>
                }

            </div>
        </Col>
    )
})


export default Bot;
