import React, {useEffect, useState} from 'react';
import Modal from 'react-bootstrap/Modal';
import {Form} from "react-bootstrap";
import {useMutation} from "react-query";
import {apis} from "../../services"
import {toast} from "react-toastify";
import {showToastError} from "../../utils";
import _ from "lodash"

export default function AddBill({show, handleClose, refetch, userId, userDetails}) {


    const {isLoading, mutate} = useMutation(apis.addUserBill, {
        onError: error => showToastError(error),
        onSuccess: ({status}) => {
            if (status === 201) {
                toast.success('User Bill Added Successfully');
                refetch();
                handleClose();
            }
        }
    });
    const [data, setData] = useState({
        user: userId,
        profitPercentage: 0,
        userProfit: userDetails?.profit,
        // userProfit: 20,
        amount: 0,
        startDate: new Date()?.toISOString()?.split("T")?.[0],
        endDate: ""
    });


    useEffect(() => {
        if (data.profitPercentage > 0) {
            setData(prevState => ({...prevState, amount: (prevState.profitPercentage * prevState.userProfit) / 100}))
        }
    }, [data.profitPercentage]);


    const onChangeHandler = (e) => {
        const {name, value} = e.target;
        setData(prevData => ({...prevData, [name]: value}));
    };


    const onSubmitHandler = (e) => {
        e.preventDefault();
        mutate(data);
    }


    return (
        <>
            <Modal show={show} onHide={handleClose} centered className='custom-modal'>
                <Modal.Header>
                    <Modal.Title>Add User Bill</Modal.Title>
                    <div className="close-btn" onClick={handleClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmitHandler}>

                        <Form.Group className="mb-3" controlId="profitPercentage">
                            <Form.Label>Profit Percentage</Form.Label>
                            <Form.Control required name='profitPercentage' onChange={onChangeHandler} type="number"
                                          className='custom-input' value={data.profitPercentage}
                                          placeholder="Enter Percentage of Profit Amount"
                            />
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="profit">
                            <Form.Label>Profit</Form.Label>
                            <Form.Control name='profit' type="number" className='custom-input' value={_.round(data.userProfit,3)}
                                          disabled/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="amount">
                            <Form.Label>Total Payment Amount</Form.Label>
                            <Form.Control name='amount' type="number" className='custom-input' value={_.round(data.amount,3)}
                                          disabled/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="startDate">
                            <Form.Label>Start Date</Form.Label>
                            <Form.Control required name='startDate' onChange={onChangeHandler} type="date"
                                          value={data.startDate}
                                          className='custom-input'
                                          placeholder="Start Date"/>
                        </Form.Group>

                        <Form.Group className="mb-3" controlId="endDate">
                            <Form.Label>End Date</Form.Label>
                            <Form.Control required name='endDate' onChange={onChangeHandler} type="date"
                                          className='custom-input' value={data.endDate}
                                          placeholder="End Date"/>
                        </Form.Group>

                        <Form.Group className="mt-5 text-center">

                            {isLoading
                                ? <button type="submit" disabled
                                          className="custom-btn primary-btn round-btn">Loading</button>
                                :
                                <button type="submit" className="custom-btn primary-btn round-btn">Create Bill</button>
                            }
                        </Form.Group>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    );
}
