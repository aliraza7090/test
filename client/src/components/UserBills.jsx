import {useState} from "react";
import _ from "lodash"
import {useQuery} from "react-query";
import {useSelector} from "react-redux";

import {apis} from "services";
import AddBillRecipt from "./Modals/AddBillRecipt";

const UserBills = () => {
  const {user: _user} = useSelector((store) => store.user);

  const [show, setShow] = useState(false);

  const [billData, setBillData] = useState({
    bill_Id: '', profit: ''
  });

  const handleClose = () => setShow(false);
  const handleShow = (id, profit) => {
    setBillData({bill_Id: id, profit: profit});
    setShow(true);

  }


  const {data, isLoading, refetch} = useQuery(
    [_user?._id],
    apis.getUserBills,
    {enabled: !!_user?._id, retry: 1}
  );
  const userBills = data?.data || [];

  return (
    <>
      <div className="row mt-3 text-center">
        <h3>Bill Details</h3>
      </div>

      <div className="section">
        <table className="table table1">
          <thead>
          <tr>
            <th>User Name</th>
            <th>Total profit</th>
            <th>Percentage</th>
            <th>Bill</th>
            <th>Payment Status</th>
            <th>Action</th>
          </tr>
          </thead>
          <tbody>
          {userBills.length > 0 && (
            <>
              {userBills.map((item, i) => {
                return (
                  <tr key={item?._id}>
                    <td>{item?.user?.name}</td>
                    <td>{_.round(item?.userProfit, 3)}</td>
                    <td>{item?.profitPercentage}%</td>

                    <td>{_.round(item?.amount, 3)}</td>

                    <td
                      style={
                        item?.isPaid === "Paid"
                          ? {color: "green"}
                          : item?.isPaid === "Pending"
                            ? {color: "yellow"}
                            : {color: "red"}
                      }
                    >
                      {item?.isPaid}
                    </td>
                    <td>
                      <button disabled={item?.isPaid === "Paid" || item?.isPaid === "Pending"}
                              className="custom-btn secondary-btn p-1"
                              onClick={() => handleShow(item?._id, item?.amount)}
                      >
                        Submit Slip
                      </button>
                    </td>
                  </tr>
                );
              })}
            </>
          )}
          </tbody>
        </table>
        {userBills?.length === 0 && (
          <h6 className="text-white text-center">
            No bills found
          </h6>
        )}
      </div>
      <AddBillRecipt refetch={refetch} bill_Id={billData?.bill_Id} profit={billData?.profit} show={show}
                     handleClose={handleClose}/>
    </>
  );
};

export default UserBills;
