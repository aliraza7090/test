import _ from "lodash";
import React, {Fragment} from "react";
import {Col, Dropdown, DropdownButton, Form} from "react-bootstrap";

import {EXCHANGES, INDICATORS, BINANCE_RSI_INTERVAL, KUCOIN_RSI_INTERVAL} from "../../constants";

const SetupBotRiskBox = ({
                             data,
                             risk,
                             setting,
                             onTypeHandler,
                             onSubmitHandler,
                             handleTimeSelect,
                             onChangeBotSettingHandler,
                         }) => {

    const isActive = data.risk === risk;
    const isTrailingActive = data.indicator === INDICATORS.trailing;
    const _class = data.risk === risk ? 'active' : '';
    const coin = data?.coin || '';

    const lowInputLabel = isTrailingActive ? `Buying Price (${coin})` : `RSI Low (${coin})`;
    const highInputLabel = isTrailingActive ? `Selling Price (${coin})` : `RSI Up (${coin})`;

    return (
        <Col lg={4} md={6}>
            <div
                className={`bot-box pointer ${_class}`}
                onClick={() => onTypeHandler('risk', risk)}
            >
                <h4 className="heading">{_.capitalize(risk)} Risk</h4>
                <Form onSubmit={onSubmitHandler}>
                    <div className="inner-main d-flex justify-content-between gap-2">
                        <div className="inner">
                            <span>{lowInputLabel}:</span>
                            {
                                isActive ? (
                                    <Form.Group className="mb-3" controlId="low">
                                        <Form.Control className='custom-input'
                                                      name='low'
                                                      type="number"
                                                      placeholder={lowInputLabel}
                                                      value={setting?.low}
                                                      onChange={onChangeBotSettingHandler}
                                        />
                                    </Form.Group>
                                ) : <h4>00000</h4>
                            }
                        </div>
                        <div className="inner">
                            <span>{highInputLabel}:</span>
                            {isActive ? (
                                <Form.Group className="mb-3" controlId="up">
                                    <Form.Control className='custom-input'
                                                  name='up'
                                                  type="number"
                                                  value={setting?.up}
                                                  placeholder={highInputLabel}
                                                  onChange={onChangeBotSettingHandler}
                                    />
                                </Form.Group>
                            ) : <h4>00000</h4>}
                        </div>
                    </div>
                    {isActive && (
                        <Fragment>
                            <Form.Group className="mb-3" controlId="investment">
                                <Form.Control className='custom-input'
                                              name='investment'
                                              type="number"
                                              placeholder={'Investment'}
                                              value={setting?.investment}
                                              disabled={setting?.isActive}
                                              onChange={onChangeBotSettingHandler}
                                />
                            </Form.Group>
                            <div>
                                {!isTrailingActive && (
                                    <DropdownButton title={setting?.time ? setting?.time : 'Select Time'}
                                                    className='custom-dropdown'>
                                        {data?.exchange === _.upperCase(EXCHANGES.binance)
                                            ? BINANCE_RSI_INTERVAL.map((dropdown, index) =>
                                                <Fragment key={index}>
                                                    <Dropdown.Header>{dropdown.header}</Dropdown.Header>
                                                    {
                                                        dropdown.items.map((item, index) =>
                                                            <Dropdown.Item
                                                                key={index}
                                                                onClick={() => onChangeBotSettingHandler({
                                                                    target: {
                                                                        name: 'time',
                                                                        value: item
                                                                    }
                                                                })}>
                                                                {item}
                                                            </Dropdown.Item>
                                                        )}
                                                </Fragment>)
                                            : KUCOIN_RSI_INTERVAL.map((dropdown, index) =>
                                                <Fragment key={index}>
                                                    <Dropdown.Header>{dropdown.header}</Dropdown.Header>
                                                    {
                                                        dropdown.items.map((item, index) =>
                                                            <Dropdown.Item
                                                                key={index}
                                                                onClick={() => onChangeBotSettingHandler({
                                                                    target: {
                                                                        name: 'time',
                                                                        value: item
                                                                    }
                                                                })}>
                                                                {item}
                                                            </Dropdown.Item>
                                                        )}
                                                </Fragment>)
                                        }
                                    </DropdownButton>
                                )}
                                <div className='d-flex my-2'>
                                    <Form.Check
                                        className="custom-switch"
                                        type="switch"
                                        id="botStatus"
                                        name="botStatus"
                                        label="Bot Status"
                                        checked={setting.isActive}
                                        onChange={onChangeBotSettingHandler}
                                    />
                                </div>
                            </div>
                            {/* <button className='custom-btn primary-btn mt-2 w-100' disabled={isLoading}>
                                {isLoading ? 'Submitting' : 'Submit'}
                            </button>*/}
                        </Fragment>
                    )}
                </Form>
            </div>
        </Col>)
};

export default SetupBotRiskBox