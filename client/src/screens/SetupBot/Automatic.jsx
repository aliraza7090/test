import {Col, Container, Row} from "react-bootstrap";
import {RISKS} from "../../constants";
import {SetupBotRiskBox} from "../../components/admin";
import React from "react";

const Automatic = ({
                       handleTimeSelect,
                       data,
                       onSubmitHandler,
                       onTypeHandler,
                       setting,
                       onChangeBotSettingHandler
                   }) => {
    return (
        <>
            <div className="mt-5">
                <Container fluid>
                    <Row className="gy-5">
                        {RISKS.map((risk, index) =>
                            <SetupBotRiskBox
                                key={index}
                                risk={risk}
                                data={data}
                                setting={setting}
                                onTypeHandler={onTypeHandler}
                                onSubmitHandler={onSubmitHandler}
                                handleTimeSelect={handleTimeSelect}
                                onChangeBotSettingHandler={onChangeBotSettingHandler}
                            />)}
                    </Row>
                </Container>
            </div>
        </>
    )
};


export default Automatic;