import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const CreateApproverButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");
  const [studentNumber, setStudentNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [userType, setUserType] = useState("");

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setFirstName("");
    setMiddleName("");
    setLastName("");
    setStudentNumber("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setUserType("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/register", {
        firstName: firstName,
        middleName: middleName,
        lastName: lastName,
        studentNumber: studentNumber,
        userType: userType,
        email: email,
        password: password,
      });

      if (response.data.success) {
        console.log("Approver created successfully");
        handleCloseModal();
      } else {
        console.log("Error:", response.data.errMessage);
      }
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShowModal}>
        Create Approver
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Create Approver</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="firstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="middleName">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="lastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="studentNumber">
              <Form.Label>Student Number</Form.Label>
              <Form.Control
                type="text"
                value={studentNumber}
                onChange={(e) => setStudentNumber(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="upMail">
              <Form.Label>UP Mail</Form.Label>
              <Form.Control
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Form.Group controlId="formBasicConfirmPassword">
                <Form.Label><b>Confirm Password</b></Form.Label>
                <Form.Control
                  required
                  type="password"
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </Form.Group>
            </Form.Group>
            <Form.Group controlId="userType">
              <Form.Label>User Type</Form.Label>
              <Form.Control
                as="select"
                value={userType}
                onChange={(e) => setUserType(e.target.value)}
                required
              >
                <option value="">Select User Type</option>
                <option value="Adviser">Adviser</option>
                <option value="Clearance Officer">Clearance Officer</option>
              </Form.Control>
            </Form.Group>
            <br />
            <div className="d-flex justify-content-end">
              <Button variant="primary" type="submit">
                Create
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CreateApproverButton;
