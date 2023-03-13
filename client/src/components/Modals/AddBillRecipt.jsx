import React, {useEffect, useState} from "react";
import _ from "lodash"
import Modal from "react-bootstrap/Modal";
import {Form} from "react-bootstrap";
import {useMutation} from "react-query";
import {apis} from "../../services";
import {toast} from "react-toastify";
import {showToastError} from "../../utils";

export default function AddBillRecipt({show, handleClose, refetch, bill_Id, profit}) {
  useEffect(() => {
    setData((prevState) => ({prevState, bill_Id: bill_Id, profit: profit}));
  }, [bill_Id]);

  const {isLoading, mutate} = useMutation('biil',apis.addUserBillRecipt, {
    onError: (error) => showToastError(error),
    onSuccess: ({status}) => {
      if (status === 200) {
        toast.success("User Bill Recipt Added Successfully");
        setData("");
        refetch();
        handleClose();
      }
    },
  });

  const [data, setData] = useState({
    bill_Id: bill_Id,
    profit: _.round(profit, 3),
    transaction_Id: "",
  });

  const onChangeHandler = (e) => {
    const {name, value} = e.target;
    setData((prevData) => ({...prevData, [name]: value}));
  };

  const onSubmitHandler = (e) => {
    e.preventDefault();
    mutate(data);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose} centered className="custom-modal">
        <Modal.Header>
          <Modal.Title>Add User Bill Recipt</Modal.Title>
          <div className="close-btn" onClick={handleClose}>
            <i className="fa-solid fa-xmark"></i>
          </div>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={onSubmitHandler}>
            <Form.Group className="mb-3" controlId="profitPercentage">
              <Form.Label>Transaction Id</Form.Label>
              <Form.Control
                required
                name="transaction_Id"
                onChange={onChangeHandler}
                type="string"
                className="custom-input"
                value={data.transaction_Id}
                placeholder="Enter Transaction Id"
              />
            </Form.Group>
            <Form.Group className="mb-3" controlId="profit">
              <Form.Label>Profit Bill Amount</Form.Label>
              <Form.Control name='profit' type="string" className='custom-input' value={_.round(data.profit, 3)}
                            disabled/>
            </Form.Group>

            <Form.Group className="mt-5 text-center">
              {isLoading ? (
                <button
                  type="submit"
                  disabled
                  className="custom-btn primary-btn round-btn"
                >
                  Loading
                </button>
              ) : (
                <button
                  type="submit"
                  className="custom-btn primary-btn round-btn"
                >
                  Add Bill Recipt
                </button>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}
