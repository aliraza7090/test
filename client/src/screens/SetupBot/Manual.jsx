import React from "react";

import _ from "lodash";
import {Col, Container, Form, Row} from 'react-bootstrap'

function Manual({coin, setting, setBotSetting, onSubmitHandler}) {

    const onChangeHandler = (event) => {
        const {name, value} = event.target;
        name === 'botStatus'
            ? setBotSetting(prevState => ({
                ...prevState,
                manual: {...prevState['manual'], isActive: !prevState['manual']['isActive']}
            }))
            : setBotSetting(prevState => ({...prevState, manual: {...prevState['manual'], [name]: value}}))
    }

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <div className="mt-5">
                    <Container fluid>
                        <Form onSubmit={onSubmitHandler}>
                            <Row className="justify-content-center">
                                <Col lg={4} md={6}>
                                    <div className="bot-box">
                                        <h4 className="heading">Configuration</h4>
                                        <Form onSubmit={onSubmitHandler}>
                                            <span>Low Price in ({coin}):</span>
                                            <Form.Group className="mb-3" controlId="low">
                                                <Form.Control className='custom-input'
                                                              name='low'
                                                              type="number"
                                                              placeholder={'Low'}
                                                              value={setting?.low}
                                                              onChange={onChangeHandler}
                                                              required
                                                />
                                            </Form.Group>

                                            <span>Up Price in ({coin}):</span>
                                            <Form.Group className="mb-3" controlId="low">
                                                <Form.Control className='custom-input'
                                                              name='up'
                                                              type="number"
                                                              placeholder={'Up Price'}
                                                              value={setting?.up}
                                                              onChange={onChangeHandler}
                                                              required
                                                />
                                            </Form.Group>

                                            <span>Investment:</span>
                                            <Form.Group className="mb-3" controlId="low">
                                                <Form.Control className='custom-input'
                                                              type="number"
                                                              name='investment'
                                                              value={setting?.investment}
                                                              onChange={onChangeHandler}
                                                              disabled={setting?.isActive}
                                                              placeholder='Investment Amount (USDT)'
                                                              required
                                                />
                                            </Form.Group>

                                            <span>Take Profit:</span>
                                            <Form.Group className="mb-3" controlId="takeProfit">
                                                <Form.Control className='custom-input'
                                                              type="number"
                                                              name='takeProfit'
                                                              value={setting?.takeProfit}
                                                              placeholder='Take Profit Amount'
                                                              onChange={onChangeHandler}
                                                              required
                                                />
                                            </Form.Group>
                                        </Form>
                                        <div className='d-flex my-2'>
                                            <Form.Check
                                                className="custom-switch"
                                                type="switch"
                                                id="botStatus"
                                                name='botStatus'
                                                label="Bot Status"
                                                checked={setting?.isActive}
                                                onChange={onChangeHandler}
                                            />
                                        </div>
                                        {/*{!setting.hasPurchasedCoins && (
                                            <button className='custom-btn primary-btn mt-2 w-100'
                                                    onClick={onSubmitHandler}>
                                                Close
                                            </button>
                                        )}*/}
                                    </div>
                                </Col>
                            </Row>
                        </Form>
                    </Container>

                </div>

            </div>

        </div>
    </>
}

export default Manual