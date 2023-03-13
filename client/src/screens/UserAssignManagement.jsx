import {useState} from "react"
import {useQuery} from "react-query";
import {Dropdown} from 'react-bootstrap'

import {apis} from "services"
import {isAdmin} from "utils/user"
import {AddUser, AssignUserSubAdmin, Loader} from "components"

function UserAssignManagement() {

    const {data, isLoading, refetch: refetchAdmins} = useQuery(['getAllSubAdmin'], apis.allSubAdmin)
    const subAdminUsers = data?.data || [];

    const [modal, setModal] = useState(false);
    const [userAssign, setUserAssign] = useState({sub_admin: '', users: []});

    const toggleModal = () => setModal(prevState => !prevState);

    const [showAdmin, setShowAdmin] = useState(false);
    const handleCloseAdmin = () => setShowAdmin(false);
    const handleShowAdmin = () => setShowAdmin(true);

    const assignUserSubAdmin = (id, userId) => {
        setUserAssign({sub_admin: id, users: userId})
        handleShowAdmin();
    }
    return <>
        <div className="dashboard-main custom-scroll">
            <div className="section">
                <h3 className="section-title">Admin Profile</h3>
                <div className="head-main">
                    <div className="head-section">
                        <div>
                            <h2 className="primary-head">User Assign Management</h2>
                        </div>
                        {isAdmin()
                            ?
                            <button className="custom-btn secondary-btn" onClick={toggleModal}>+ Add Sub Admin</button>
                            : null
                        }

                    </div>
                </div>
                {isLoading ? <Loader variant="light"/>
                    : <>
                        <div className="table-responsive custom-scroll mt-5">
                            {subAdminUsers?.length > 0 ?
                                <>
                                    <table className="table custom-table">
                                        <thead>
                                        <tr>
                                            <th>No</th>
                                            <th>Sub Admin Name</th>
                                            <th>Email</th>
                                            <th>Total Users Assign</th>
                                            <th>User Actions</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {subAdminUsers.map((item, i) => (
                                            <>
                                                <tr key={item?._id}>
                                                    <td>{i + 1}</td>
                                                    <td>{item?.name}</td>
                                                    <td>{item?.email}</td>
                                                    <td>{item?.users_info}</td>
                                                    <td>
                                                        <Dropdown className="boot-custom-dropdown">
                                                            <Dropdown.Toggle id="dropdown-basic">
                                                                <i className="fa-solid fa-ellipsis"></i>
                                                            </Dropdown.Toggle>
                                                            <Dropdown.Menu>
                                                                <Dropdown.Item
                                                                    onClick={() => assignUserSubAdmin(item?._id, item?.users)}>
                                                                    Assign Users</Dropdown.Item>
                                                            </Dropdown.Menu>
                                                        </Dropdown>
                                                    </td>
                                                </tr>
                                            </>
                                        ))}
                                        </tbody>
                                    </table>
                                </>
                                :
                                <>
                                    <div className="custom-user">

                                        <p>
                                            No Sub Admin.
                                        </p>
                                    </div>
                                </>}
                        </div>

                    </>}

            </div>

            <AssignUserSubAdmin
                showAdmin={showAdmin}
                handleCloseAdmin={handleCloseAdmin}
                users={userAssign.users}
                subAdmin={userAssign.sub_admin}
                refetchAdmins={refetchAdmins}
            />
            <AddUser refetch={refetchAdmins} show={modal} handleClose={toggleModal} isSubAdmin={true}/>
        </div>
    </>
}

export default UserAssignManagement
