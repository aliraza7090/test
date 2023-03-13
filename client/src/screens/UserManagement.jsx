import React, {useState} from "react"
import {apis} from "services"
import _ from "lodash"
import {toast} from "react-toastify";
import {Dropdown} from 'react-bootstrap'
import {useNavigate} from "react-router-dom";
import {useMutation, useQuery} from "react-query";

import {isAdmin} from "utils/user"
import {AddUser, Loader} from "components"
import textColorClass from "../utils/textColorClass";

function UserManagement() {
    const navigate = useNavigate();

    const {data, isLoading, refetch} = useQuery(['getAllUsers'], apis.allUsers);
    const {mutateAsync: deleteUserAndBots} = useMutation('deleteUserAndBots', apis.deleteUserAndBots, {
            onSuccess: async ({data}) => {
                toast.success(data)
                await refetch()
            }
        }
    );


    const users = data?.data || [];

    const [show, setShow] = useState(false);
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleAPIConfiguration = (id) => navigate('/api-configuration', {state: {userId: id}});
    const onDeleteHandler = async (id) => {
        await deleteUserAndBots(id)
        await refetch()
    }

    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <h3 className="section-title">Admin Profile</h3>
                <div className="head-main">
                    <div className="head-section">
                        <div>
                            <h2 className="primary-head">User Management</h2>
                        </div>
                        {isAdmin() ?
                            <div>
                                <button className="custom-btn secondary-btn" onClick={handleShow}>+ Add New User
                                </button>
                            </div> : <></>}

                    </div>
                </div>
                {isLoading ? <Loader variant="light"/>
                    : <>
                        <div className="table-responsive custom-scroll mt-5 min-vh-100">
                            {users?.length > 0 ?
                                <>
                                    <table className="table custom-table">
                                        <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>User Name</th>
                                            <th>Email</th>
                                            <th>Earning</th>
                                            {/*<th>Bot Status</th>*/}
                                            <th>Bills Details</th>
                                            <th>User Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {users.map(({_id, name, email, profit,createdDate}, i) => (
                                            <tr key={_id}>
                                                <td>{i + 1}</td>
                                                <td>{name}</td>
                                                <td>{email}</td>
                                                <td>
                                                    <h6 className={textColorClass(profit)}>{_.round(profit,3)}</h6>
                                                </td>
                                                <td>
                                                    <button className="primary-btn" style={{
                                                        minWidth: '5em',
                                                        borderRadius: 5,
                                                        padding: '0',
                                                        lineHeight: '2.2em'
                                                    }}
                                                            onClick={() => navigate(`/bill-management/${_id}`, {
                                                                state: {profit,createdDate}
                                                            })}
                                                    >
                                                        Bills
                                                    </button>
                                                </td>
                                                <td>
                                                    <Dropdown className="boot-custom-dropdown">
                                                        <Dropdown.Toggle id="dropdown-basic">
                                                            <i className="fa-solid fa-ellipsis"></i>
                                                        </Dropdown.Toggle>
                                                        <Dropdown.Menu>
                                                            <Dropdown.Item
                                                                onClick={() => navigate(`/edit-user?${_id}`)}>
                                                                Edit
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() => onDeleteHandler(_id)}>
                                                                Delete
                                                            </Dropdown.Item>
                                                            <Dropdown.Item
                                                                onClick={() => handleAPIConfiguration(_id)}>
                                                                Input API Credentials
                                                            </Dropdown.Item>
                                                            {/* <Dropdown.Item
                                                                onClick={() => navigate(`/bill-management/${_id}`)}>
                                                                Billing
                                                            </Dropdown.Item>*/}
                                                        </Dropdown.Menu>
                                                    </Dropdown>
                                                </td>
                                            </tr>
                                        ))}
                                        </tbody>
                                    </table>
                                </>
                                :
                                <>
                                    <div className="custom-user">

                                        <p>
                                            No User.
                                        </p>
                                    </div>
                                </>}
                        </div>

                    </>}

            </div>


            <AddUser refetch={refetch} show={show} handleClose={handleClose}/>


            {/* <AssignUserSubAdmin showAdmin={showAdmin} handleCloseAdmin={handleCloseAdmin} user_id = {userAssign} /> */}

        </div>
    </>
}

export default UserManagement
