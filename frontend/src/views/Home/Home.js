import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Modal } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import "./home.css";
import Loader from "../../component/Loader/Loader";
import axios from "axios";

function Home() {
  const { loading, user } = useSelector((state) => state.sessionSlice);

  const [balance, setBalance] = useState(user.balance);
  const [isOpenPopupDeposite, setIsOpenPopupDeposite] = useState(false);
  const [isOpenPopupWithdraw, setIsOpenPopupWithdraw] = useState(false);
  const [amount, setAmount] = useState("");
  const [password, setPassword] = useState("");

  async function Deopsite() {
    setIsOpenPopupDeposite(false);
    const result = await axios.put(`/api/v1/user/deposite?amount=${amount}&password=${password}`);
    if (result.status === 200) {
      setBalance(result.data.finalBalance);
    }
  }

  async function Withdraw() {
    setIsOpenPopupWithdraw(false);
    const result = await axios.put(`/api/v1/user/withdraw?amount=${amount}&password=${password}`);
    if (result.status === 200) {
      setBalance(result.data.finalBalance);
    }
  }

  return loading ? (
    <Loader />
  ) : (
    <>
      <div className="home-container">
        <h1>
          Welcome To Bank {user.firstName} {user.lastName}
        </h1>
        <div className="userOptions">
          <h3 style={{ paddingTop: "20px" }}>Account Number: {user.accountNumber}</h3>
          <h3 style={{ paddingTop: "10px" }}>Balance: {balance}</h3>
          <h2 style={{ paddingTop: "20px" }}>User Options</h2>
          <div className="userOptions-options">
            <div className="userOptions-buttons" onClick={() => setIsOpenPopupDeposite(true)}>
              Deopsite
            </div>
          </div>
          <div className="userOptions-options">
            <div className="userOptions-buttons" onClick={() => setIsOpenPopupWithdraw(true)}>
              Withdraw
            </div>
          </div>
        </div>
      </div>

      <Modal show={isOpenPopupDeposite} centered>
        <Modal.Body>
          <Form>
            <Form.Label>Amount to Deposite</Form.Label>
            <Form.Control type="text" placeholder="500 / 1000/ 2000/ ....." onChange={(e) => setAmount(e.target.value)} required autoFocus autoComplete="new-password" />
            <Form.Label>Enter Account Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={Deopsite}>Deposite</Button>
          <Button onClick={() => setIsOpenPopupDeposite(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>

      <Modal show={isOpenPopupWithdraw} centered>
        <Modal.Body>
          <Form>
            <Form.Label>Amount to Withdraw</Form.Label>
            <Form.Control type="text" placeholder="500 / 1000/ 2000/ ....." onChange={(e) => setAmount(e.target.value)} required autoFocus autoComplete="new-password" />
            <Form.Label>Enter Account Password</Form.Label>
            <Form.Control type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} required />
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button onClick={Withdraw}>Withdraw</Button>
          <Button onClick={() => setIsOpenPopupWithdraw(false)}>Cancel</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default Home;
