import { useState } from "react"
import { NavLink } from "react-router-dom"
import { Col, Container, Dropdown, Form, Row } from 'react-bootstrap'
import { imageURL } from "../../hooks"
import TradingViewWidget, { Themes } from 'react-tradingview-widget';
import { AutoTabs } from "../../components";

function Trailing() {
    const [box,setBox] = useState('low');

    return <>
        {/*<div className="dashboard-main custom-scroll">
            <div className="section">
                <h3 className="section-title">SETUP BOT</h3>
                <AutoTabs active={'automatic'}/>
                <div className="mt-4">
                    <button className="custom-btn transparent-btn"><i class="fa-solid fa-plus plus-icon"></i><span>Add new values</span></button>
                </div>
                <div className="mt-5">
                    <Container fluid>
                        <Row className="gy-5">
                            <Col lg={4} md={6}>
                                <div className={"bot-box pointer "+(box == 'low' && 'active')} onClick={()=>setBox('low')}>
                                    <h4 className="heading">Low Risk</h4>
                                    <div className="inner-main">
                                        <div className="inner">
                                            <span>Buy</span>
                                            <h4>00000</h4>
                                        </div>
                                        <div className="inner">
                                            <span>Sell</span>
                                            <h4>00000</h4>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} md={6}>
                                <div className={"bot-box pointer "+(box == 'moderate' && 'active')} onClick={()=>setBox('moderate')}>
                                    <h4 className="heading">Moderate Risk</h4>
                                    <div className="inner-main">
                                    <div className="inner">
                                            <span>Buy</span>
                                            <h4>00000</h4>
                                        </div>
                                        <div className="inner">
                                            <span>Sell</span>
                                            <h4>00000</h4>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                            <Col lg={4} md={6}>
                                <div className={"bot-box pointer "+(box == 'high' && 'active')} onClick={()=>setBox('high')}>
                                    <h4 className="heading">High Risk</h4>
                                    <div className="inner-main">
                                    <div className="inner">
                                            <span>Buy</span>
                                            <h4>00000</h4>
                                        </div>
                                        <div className="inner">
                                            <span>Sell</span>
                                            <h4>00000</h4>
                                        </div>
                                    </div>
                                </div>
                            </Col>
                        </Row>
                    </Container>

                </div>

            </div>
            <div className="risk-main custom-scroll">
                <Container fluid>
                    <Row>
                        <Col lg={4}>
                            <div className="risk-inner ">
                                <h4 className="heading">Low Risk</h4>
                                <div className="inner-main">
                                    <div className="inner">
                                        <span>Buy</span>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                        <h4>00000</h4>

                                    </div>
                                    <div className="inner">
                                        <span>Sell</span>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4}>
                        <div className="risk-inner ">
                                <h4 className="heading">Moderate Risk</h4>
                                <div className="inner-main">
                                    <div className="inner">
                                        <span>Buy</span>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                        <h4>00000</h4>

                                    </div>
                                    <div className="inner">
                                        <span>Sell</span>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                    </div>
                                </div>
                            </div>
                        </Col>
                        <Col lg={4}>
                        <div className="risk-inner ">
                                <h4 className="heading">High Risk</h4>
                                <div className="inner-main">
                                    <div className="inner">
                                        <span>Buy</span>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                        <h4>00000</h4>

                                    </div>
                                    <div className="inner">
                                        <span>Sell</span>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </div>
        </div>*/}
    </>
}

export default Trailing