import React from 'react';
import Modal from 'react-bootstrap/Modal';
import {imageURL, useStopOrders} from 'hooks';

export default function BotModal({show, handleClose, bot, refetchOrders}) {
    const {id = '', exchange = '', user_id} = bot


    const {closeOrder, closingOrder} = useStopOrders(exchange, () => {
        refetchOrders();
        handleClose();
    })

    const closeOrderHandler = () => {
        closeOrder({botId: id, user_id})
    }

    return (
        <>
            <Modal show={show} onHide={handleClose} centered className='custom-modal'>
                <Modal.Header>
                    <Modal.Title className='text-center'>
                        <div className="text-center">
                            Stop Bot
                        </div>
                    </Modal.Title>
                    <div className="close-btn" onClick={handleClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <h5>Do you want to stop the BTC/USDT DCA bot?</h5>
                    <p className="normal-text gray-text">
                        We will convert about 0.00120674BTC and 0.0000989KuCoin into KuCoin at the optimal price to
                        your <a href="#" className='normal-anchor'>Trading Account</a>
                    </p>
                    <div className="main-list">
                        <div className="inner-list">
                            <div className="coin-flex-main">
                                <div className="inner">
                                    <img src={imageURL('binance.png')} alt=""/>
                                    <span>Binance</span>
                                </div>
                                <div className="inner">
                                    <img src={imageURL('ku.png')} alt=""/>
                                    <span>KuCoin</span>
                                </div>
                            </div>
                            <p className='gray-text mb-0 mt-1'>Return 2 coin(s)</p>
                        </div>
                        <div className="inner-list">
                            <div className="coin-flex-main">
                                <div className="inner">
                                    <img src={imageURL('ku.png')} alt=""/>
                                    <span>Converting into KuCoin at best market price</span>
                                </div>
                            </div>
                            <p className='gray-text mb-0 mt-1'>Due to price fluctuations, the returned amount is subject
                                to the actual execution.</p>
                        </div>
                        <div className="inner-list">
                            <div className="coin-flex-main">
                                <div className="inner">
                                    <img src={imageURL('binance.png')} alt=""/>
                                    <span>Converting into Binance at best market price</span>
                                </div>
                            </div>
                            <p className='gray-text mb-0 mt-1'>Due to price fluctuations, the returned amount is subject
                                to the actual execution.</p>
                        </div>
                    </div>
                    <div className="flex-icon-text mt-2">
                        <i className="fa-solid fa-circle-info primary-text"></i>
                        <p className='primary-text '> Due to market fluctuations, your actual profit will depend on the
                            received amount.</p>

                    </div>
                    <div className="text-center mt-3">
                        <button className="custom-btn primary-btn round-btn" onClick={closeOrderHandler}
                                disabled={closingOrder}
                        >
                            {closingOrder ? 'Processing...' : 'Process'}
                        </button>
                    </div>
                    <div className="text-center mt-3">
                        <button className="custom-btn primary-btn round-btn" onClick={handleClose}>
                            Close
                        </button>
                    </div>
                </Modal.Body>
            </Modal>
        </>
    );
}
