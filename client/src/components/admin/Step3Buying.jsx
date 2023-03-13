import _ from "lodash";
import React, {memo, useCallback} from 'react'
import {Col, Container, Row} from "react-bootstrap";
import {useQuery} from "react-query";

import {apis} from "services";
import Loader from "../Loader";

const Step3Buying = ({risk, isManualTab, setting_id}) => {
    const {data: response, isLoading} = useQuery([setting_id], apis.getBotStats, {enabled: !!setting_id, refetchInterval: 2000});

    const stats = _.get(response, 'data.stats', {buy: [], sell: []});

    const generateData = useCallback(
        ({risk, stats}, type = 'MANUAL') => {
            const showData = risk === _.upperCase(type);

            if(!stats) return <></>


            return (
                <Col lg={4}>
                    <div className="risk-inner ">
                        <h4 className="heading">{type} {type !== "MANUAL" ? "" : "Risk"}</h4>
                        <div className="inner-main">
                            <div className="inner">
                                <span>Buy</span>
                                {(showData && stats.buy.length) > 0
                                    ? stats.buy.map((value, index) => <h4 key={index}>{_.round(value)}</h4>)
                                    : <>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                    </>
                                }
                            </div>
                            <div className="inner">
                                <span>Sell</span>
                                {(showData && stats.sell.length) > 0
                                    ? stats.sell.map((value, index) => <h4 key={index}>{_.round(value)}</h4>)
                                    : <>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                        <h4>00000</h4>
                                    </>
                                }
                            </div>
                        </div>
                    </div>
                </Col>
            )
        },
        [stats],
    );


    if(isLoading) return <Loader variant="light"/>

    return (
        <div className="risk-main custom-scroll">
            <Container fluid>
                <Row>
                    {(() => {
                        if (isManualTab)
                            return generateData({stats, risk: 'MANUAL'}, 'Manual')
                        else
                            return <>
                                {generateData({stats, risk}, 'Low')}
                                {generateData({stats, risk}, 'Moderate')}
                                {generateData({stats, risk}, 'High')}
                            </>
                    })()}
                </Row>
            </Container>
        </div>
    )
};


export default memo(Step3Buying);