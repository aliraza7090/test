import React, {useEffect, useState} from 'react';

import _ from 'lodash';
import {toast} from "react-toastify";
import {useMutation, useQuery} from "react-query";
import {Form, Modal, Table} from "react-bootstrap";

import {apis} from "services"
import {showToastError} from "utils";

export default function AssignUserSubAdmin({showAdmin, handleCloseAdmin, subAdmin, users, refetchAdmins}) {

    const {
        data,
        isLoading: isLoadingUser,
        error,
    } = useQuery(['getAllUsers'], apis.allUsers)

    const userLists = _.get(data, 'data', []);

    const {isLoading, mutate: assignUser} = useMutation(['userAssignToAdmin'], apis.userAssignAdmin, {
        onError: error => showToastError(error),
        onSuccess: ({status}) => {
            if (status === 200) {
                toast.success('Successfully Assigned users');
                refetchAdmins();
                handleCloseAdmin();
            }
        }
    })


    const [selected, setSelected] = useState(users);

    useEffect(() => setSelected(users), [users])


    const onSubmitHandler = (e) => {
        e.preventDefault();
        const data = {users: selected, sub_admin: subAdmin}
        assignUser(data);
    };

    const onSelectHandler = (id) => {
        const currentIndex = selected.indexOf(id);
        if (currentIndex === -1) {
            selected.push(id);
            setSelected([...selected]);
        } else {
            setSelected(selected.filter((_id) => _id !== id));
        }
    };

    return (
        <>
            <Modal show={showAdmin} onHide={handleCloseAdmin} centered className='custom-modal'>
                <Modal.Header>
                    <Modal.Title>Assign User To SubAdmin</Modal.Title>
                    <div className="close-btn" onClick={handleCloseAdmin}>
                        <i className="fa-solid fa-xmark"></i>
                    </div>
                </Modal.Header>
                <Modal.Body>
                    <Form onSubmit={onSubmitHandler}>
                        <div style={{overflow: "auto", maxHeight: "400px"}}>

                            <Table responsive bordered hover size="sm" variant="dark">
                                <thead>
                                <tr>
                                    <th style={{border: "1px solid grey", textAlign: 'center'}}>Name</th>
                                    <th style={{border: "1px solid grey", textAlign: 'center'}}>Email</th>
                                    <th style={{border: "1px solid grey", textAlign: 'center'}}>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                {userLists.length > 0 ? (
                                    userLists.map((item, i) => {
                                        return (
                                            <>
                                                <tr key={item.id}>
                                                    <td style={{textAlign: 'center'}}>{item?.name}</td>

                                                    <td style={{textAlign: 'center'}}>{item?.email}</td>
                                                    <td style={{textAlign: 'center'}}>
                                                        <input type="checkbox" checked={selected?.includes(item._id)}
                                                               onClick={() => onSelectHandler(item?._id)}>

                                                        </input>
                                                    </td>
                                                </tr>
                                            </>
                                        )
                                    })
                                ) : (
                                    <tr style={{textAlign: 'center'}}>
                                        <td colSpan={7}>No Sub Admin</td>
                                    </tr>
                                )}

                                </tbody>
                            </Table>

                        </div>
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
