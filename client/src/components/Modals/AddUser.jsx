import React, {useState} from 'react';
import {toast} from "react-toastify";
import {useMutation} from "react-query";
import {Form, Modal} from "react-bootstrap";

import {apis} from "services"
import {showToastError} from "utils";

export default function AddUser({show, handleClose, refetch, isSubAdmin}) {

    const {isLoading, mutate} = useMutation('User Registration',apis.registration, {
        onError: error => showToastError(),
        onSuccess: ({data: user, headers, status}) => {
            if (status === 201) {
                toast.success('Added Successful');
                refetch();
                handleClose();
            }
        }
    });
    const [data, setData] = useState({name: '', email: '', password: ''});

    const onChangeHandler = (e) => {
        const {name, value} = e.target;
        setData(prevData => ({...prevData, [name]: value}));
    };

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const formData = {...data, role: isSubAdmin ? 'SUB_ADMIN' : 'USER'};
        mutate(formData);
    };

    const namePlaceHolder = `Input ${isSubAdmin ? 'Sub Admin' : 'User'} Name`;
    // const selectOptions = <option>{isSubAdmin ? 'SUB_ADMIN' : 'USER'}</option>

    return (
        <>
            <Modal show={show} onHide={handleClose} centered className='custom-modal'>
                <Modal.Header>
                    <Modal.Title>Add {isSubAdmin ? 'Sub Admin' : 'User'}</Modal.Title>
                    <div className="close-btn" onClick={handleClose}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmitHandler}>
                        <Form.Group className="mb-3" controlId="name">
                            <Form.Control name='name' onChange={onChangeHandler} type="text" className='custom-input'
                                          placeholder={namePlaceHolder}/>
                        </Form.Group>
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Control name="email" onChange={onChangeHandler} type="email" className='custom-input'
                                          placeholder="Email Address"/>
                        </Form.Group>
                        <Form.Group onChange={onChangeHandler} className="mb-3" controlId="password">
                            <Form.Control name="password" type="password" className='custom-input'
                                          placeholder="Password"/>
                        </Form.Group>
                        {/*<Form.Group onChange={onChangeHandler} className="mb-3" controlId="password">
                            <Form.Select onChange={onChangeHandler} required className='custom-input'
                                         aria-label="Default select example" name="role" id="role" disabled defaultValue={isSubAdmin ? 'SUB_ADMIN' : 'USER'}
                                         hidden
                            >
                                <option selected>{isSubAdmin ? 'SUB_ADMIN' : 'USER'}</option>
                                {selectOptions}
                            </Form.Select>
                        </Form.Group>*/}

                        <Form.Group className="mt-5 text-center">
                            {isLoading ?
                                <>
                                    <button type="submit" disabled
                                            className="custom-btn primary-btn round-btn">Loading
                                    </button>
                                </> :
                                <>
                                    <button type="submit" className="custom-btn primary-btn round-btn">Done</button>
                                </>}
                        </Form.Group>
                    </Form>
                </Modal.Body>

            </Modal>
        </>
    );
}
