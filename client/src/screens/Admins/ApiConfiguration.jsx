import React, {useEffect, useState} from "react";

import _ from "lodash";
import {toast} from "react-toastify";
import {useMutation, useQuery} from "react-query";
import {Col, Container, Form, Row} from "react-bootstrap";
import {useLocation, useNavigate} from "react-router-dom";

import {apis} from "services";
import {imageURL} from "hooks";
import apisValidation from "validations/apisValidation";


const INITIAL_STATE = {
    binance: {
        apiKey: '', secret: ''
    },
    ku_coin: {
        apiKey: '', secret: '', passphrase: ''
    }
}

const ApiConfiguration = () => {
    const navigate = useNavigate();
    const {state} = useLocation();

    const [apiKeys, setApiKeys] = useState(INITIAL_STATE);
    const {refetch} = useQuery([state?.userId], apis.fetchUserApiKeys, {
        enabled: false,
        onSuccess: ({data, status}) => {
            if (status === 200) {
                const keys = _.get(data, 'api', INITIAL_STATE);
                setApiKeys(keys)
            }
        }
    });
    const {mutate, isLoading} = useMutation(['updateUserApiKeys'], apis.updateUserApiKeys, {
        onSuccess: ({data}) => toast.success(data)
    });

    const onSubmitHandler = (e) => {
        e.preventDefault();


        const {error} = apisValidation(apiKeys);
        if (error) return toast.error(error.details[0].message);

        mutate({id: state?.userId, body: {api: apiKeys}});
        // setKeys(INITIAL_STATE)
    }

    useEffect(() => {
        (async () => {
            if (state)
                await refetch()
            else {
                toast.warn('Access Denied')
                navigate('/')
            }
        })()
    }, [state]);

    const onChangeHandler = (event, exchange) => {
        const {name, value} = event.target;
        setApiKeys(prevState => ({...prevState, [exchange]: {...prevState[exchange], [name]: value}}));
    };

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <Container fluid>
                    <div className="binance chain-api-main">
                        <img src={imageURL('binance-logo.png')} alt="Binance" className="img"/>
                        <Form onSubmit={onSubmitHandler}>
                            <Row>
                                <Col lg={6}>
                                    <div className="box-main">
                                        <div className="custom-box">
                                            <div className="flex-center">
                                                <h3>API Secret</h3>
                                                <div className="input-with-icon mt-3">
                                                    <input type="text"
                                                           name="secret"
                                                           placeholder='****************************************************'
                                                           value={apiKeys?.binance?.secret}
                                                           onChange={(e) => onChangeHandler(e, 'binance')}
                                                    />
                                                    <div className="inner-icon" title='copy'><i
                                                        className="fa-regular fa-copy"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                                <Col lg={6}>
                                    <div className="box-main">
                                        <div className="custom-box">
                                            <div className="flex-center">
                                                <h3>API Key</h3>
                                                <div className="input-with-icon mt-3">
                                                    <input type="text"
                                                           name="apiKey"
                                                           placeholder='****************************************************'
                                                           value={apiKeys?.binance?.apiKey}
                                                           onChange={(e) => onChangeHandler(e, 'binance')}
                                                    />
                                                    <div className="inner-icon">
                                                        <i className="fa-regular fa-copy"></i>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Col>
                            </Row>
                            {/*<Row>
                                <div className="kucoin chain-api-main">
                                    <img src={imageURL('kucoin.png')} alt="KuCoin" className="img"/>
                                    <Row>
                                        <Col lg={6}>
                                            <div className="box-main">
                                                <div className="custom-box">
                                                    <div className="flex-center">
                                                        <h3>API Secret</h3>
                                                        <div className="input-with-icon mt-3">
                                                            <input type="text"
                                                                   name="secret"
                                                                   placeholder='****************************************************'
                                                                   value={apiKeys?.ku_coin?.secret}
                                                                   onChange={(e) => onChangeHandler(e, 'ku_coin')}
                                                            />
                                                            <div className="inner-icon">
                                                                <i className="fa-regular fa-copy"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={6}>
                                            <div className="box-main">
                                                <div className="custom-box">
                                                    <div className="flex-center">
                                                        <h3>API Key</h3>
                                                        <div className="input-with-icon mt-3">
                                                            <input type="text"
                                                                   name="apiKey"
                                                                   placeholder='****************************************************'
                                                                   value={apiKeys?.ku_coin?.apiKey}
                                                                   onChange={(e) => onChangeHandler(e, 'ku_coin')}
                                                            />
                                                            <div className="inner-icon">
                                                                <i className="fa-regular fa-copy"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                        <Col lg={12}>
                                            <div className="box-main">
                                                <div className="custom-box">
                                                    <div className="flex-center">
                                                        <h3>Passphrase</h3>
                                                        <div className="input-with-icon mt-3">
                                                            <input type="text"
                                                                   name="passphrase"
                                                                   placeholder='****************************************************'
                                                                   value={apiKeys?.ku_coin?.passphrase}
                                                                   onChange={(e) => onChangeHandler(e, 'ku_coin')}
                                                            />
                                                            <div className="inner-icon">
                                                                <i className="fa-regular fa-copy"></i>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </Col>
                                    </Row>

                                </div>
                            </Row>*/}
                            <Row className='offset-md-4 mt-4'>
                                        <Col md={6}>
                                            <button className='custom-btn primary-btn mt-2 w-100' disabled={isLoading}>
                                                {isLoading ? 'Submitting' : 'Submit'}
                                            </button>
                                        </Col>
                                    </Row>
                        </Form>
                    </div>
                </Container>
            </div>
        </div>
    </>
};


export default ApiConfiguration;
