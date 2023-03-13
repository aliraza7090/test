import React, {useEffect, useState} from "react";

import {toast} from "react-toastify";
import {useDispatch} from "react-redux";
import {useMutation, useQuery} from "react-query";
import {Col, Container, Form, Row} from 'react-bootstrap'

import {imageURL} from "hooks"
import {apis} from "services";
import {setApiKeys} from "redux/slices/user.slice";
import apisValidation from "validations/apisValidation";

const INITIAL_STATE = {
    binance: {
        apiKey: '', secret: ''
    },
    ku_coin: {
        apiKey: '', secret: '', passphrase: ''
    }
}

function ApiSetting() {
    const dispatch = useDispatch()
    const {data} = useQuery(['api_keys'], apis.getApiKeys);
    const {mutate, isLoading} = useMutation('saveAPiKeys', apis.saveApiKeys, {
        onError: ({message}) => toast.error(message),
        onSuccess: ({status, data}) => {
            if (status === 200) {
                // dispatch(setUser(data.user));
                toast.success(data.message);
                setTimeout(() => {
                    window.location.reload();
                },0)
            }
        }
    });


    useEffect(() => {
        if (data) {
            setKeys(data?.data)
        }
    }, [data]);


    const [keys, setKeys] = useState(INITIAL_STATE);

    const onChangeHandler = (event, exchange) => {
        const {name, value} = event.target;
        setKeys(prevState => ({...prevState, [exchange]: {...prevState[exchange], [name]: value}}));
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();


        const {error} = apisValidation(keys);
        if (error) return toast.error(error.details[0].message);

        dispatch(setApiKeys(keys))
        mutate(keys);
        // setKeys(INITIAL_STATE)
    }

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
                                                           value={keys?.binance?.secret}
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
                                                           value={keys?.binance?.apiKey}
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
                                                                   value={keys?.ku_coin?.secret}
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
                                                                   value={keys?.ku_coin?.apiKey}
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
                                                                   value={keys?.ku_coin?.passphrase}
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
                                    <Row className='offset-md-4 mt-4'>
                                        <Col md={6}>
                                            <button className='custom-btn primary-btn mt-2 w-100' disabled={isLoading}>
                                                {isLoading ? 'Submitting' : 'Submit'}
                                            </button>
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
}

export default ApiSetting
