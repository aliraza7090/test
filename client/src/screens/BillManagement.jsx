import _ from "lodash";
import moment from "moment";
import { useState } from "react";
import { toast } from "react-toastify";
import { Dropdown } from "react-bootstrap";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useMutation, useQuery } from "react-query";

import { apis } from "services";
import { AddBill, Loader } from "components";
import { showToastError } from "../utils";

function BillManagement() {
  const { id } = useParams();
  const { state } = useLocation();
  const navigate = useNavigate();
  const { data, isLoading, refetch } = useQuery([id], apis.getUserBills, {
    enabled: !!id,
    retry: 1,
  });

  const userBills = _.get(data, "data", []);

  const [show, setShow] = useState(false);

  const goBack = () => navigate(-1);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const { mutateAsync: deleteUserAndBill } = useMutation(
    "deleteUserAndBill",
    apis.deleteUserBill,
    {
      onSuccess: async ({ data }) => {
        toast.success(data);
        await refetch();
      },
    }
  );

  const { mutate } = useMutation(
    ["user paid status"],
    apis.updateUserPaidStatus,
    {
      onError: (error) => showToastError(error),
      onSuccess: async ({ status }) => {
        if (status === 200) {
          toast.success("User Paid Status Update Successfully");
          await refetch();
          handleClose();
        }
      },
    }
  );

  return (
    <>
      <div className="dashboard-main custom-scroll">
        <div className="section">
          <h6 className="" role={"button"} onClick={goBack}>
            Go Back
          </h6>
          <div className="head-main">
            <div className="head-section">
              <div>
                <h2 className="primary-head">Bill Management</h2>
              </div>
              <div>
                <button
                  className="custom-btn secondary-btn"
                  onClick={handleShow}
                >
                  + Add New Bill
                </button>
              </div>
            </div>
          </div>
          {isLoading ? (
            <Loader variant="light" />
          ) : (
            <>
              <div className="table-responsive custom-scroll mt-5 min-vh-100">
                {userBills?.length > 0 ? (
                  <>
                    <table className="table custom-table">
                      <thead>
                        <tr>
                          <th>No</th>
                          <th>Name</th>
                          <th>Email</th>
                          <th>User Profit</th>
                          <th>Percentage</th>
                          <th>Bill Amount</th>
                          <th>Start Date</th>
                          <th>End Date</th>
                          <th>Payment Status</th>

                          <th>Transaction Id</th>
                          <th>User Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {userBills.map((item, i) => {
                          return (
                            <tr key={item?._id}>
                              <td>{i + 1}</td>
                              <td>{item?.user?.name}</td>
                              <td>{item?.user?.email}</td>
                              <td>{_.round(item?.userProfit,3)}</td>
                              <td>{item?.profitPercentage}%</td>

                              <td>{_.round(item?.amount,3)}</td>

                              <td>
                                {moment(item?.startDate).format("YYYY-MM-DD")}
                              </td>
                              <td>
                                {moment(item?.endDate).format("YYYY-MM-DD")}
                              </td>
                              <td
                                style={
                                  item?.isPaid === "Paid"
                                    ? { color: "green" }
                                    : item?.isPaid === "Pending"
                                    ? { color: "yellow" }
                                    : { color: "red" }
                                }
                              >
                                {item?.isPaid}

                              </td>

                              <td>{item?.transaction_Id}</td>
                              <td>
                                <Dropdown className="boot-custom-dropdown">
                                  <Dropdown.Toggle id="dropdown-basic">
                                    <i className="fa-solid fa-ellipsis"></i>
                                  </Dropdown.Toggle>
                                  <Dropdown.Menu>
                                    {/* <Dropdown.Item
                                                                onClick={() => onDeleteHandler(_id)}>
                                                                Delete
                                                            </Dropdown.Item> */}
                                    <Dropdown.Item
                                      onClick={() => mutate(item?._id)}
                                    >
                                      Set Paid Status
                                    </Dropdown.Item>
                                    <Dropdown.Item
                                      onClick={() =>
                                        deleteUserAndBill(item?._id)
                                      }
                                    >
                                      Delete
                                    </Dropdown.Item>
                                  </Dropdown.Menu>
                                </Dropdown>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </>
                ) : (
                  <>
                    <div className="custom-user">
                      <p>No Bill Found.</p>
                    </div>
                  </>
                )}
              </div>
            </>
          )}
        </div>
        <AddBill
          refetch={refetch}
          userId={id}
          show={show}
          handleClose={handleClose}
          userDetails={{
            profit: state?.profit,
            createdDate: state?.createdDate,
          }}
        />
      </div>
    </>
  );
}

export default BillManagement;
