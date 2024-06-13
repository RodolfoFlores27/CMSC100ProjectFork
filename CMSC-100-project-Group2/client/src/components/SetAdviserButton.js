import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import axios from "axios";

const SetAdviserButton = () => {
  const [showModal, setShowModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [adviserId, setAdviserId] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setStudentId("");
    setAdviserId("");
    setErrorMessage("");
    setSuccessMessage("");
  };

  const handleStudentIdChange = (event) => {
    setStudentId(event.target.value);
  };

  const handleAdviserIdChange = (event) => {
    setAdviserId(event.target.value);
  };

  const handleSetAdviser = async () => {
    try {
      const response = await axios.post("http://localhost:3001/set-adviser", {
        studentId: studentId,
        adviserId: adviserId
      });

      const { success, updatedStudent, errMessage } = response.data;

      if (success) {
        setSuccessMessage("Adviser assigned successfully");
        // Perform any necessary actions with the updatedStudent data
      } else {
        setErrorMessage(errMessage);
      }
    } catch (error) {
      console.log("Error:", error.message);
      setErrorMessage("Failed to set adviser");
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShowModal}>
        Set Adviser
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Set Adviser</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errorMessage && <p className="text-danger">{errorMessage}</p>}
          {successMessage && <p className="text-success">{successMessage}</p>}
          <Form.Group controlId="adviserId">
            <Form.Label>Adviser ID:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter adviser ID"
              value={adviserId}
              onChange={handleAdviserIdChange}
            />
          </Form.Group>
          <Form.Group controlId="studentId">
            <Form.Label>Student ID:</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter student ID"
              value={studentId}
              onChange={handleStudentIdChange}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Close
          </Button>
          <Button variant="primary" onClick={handleSetAdviser}>
            Set Adviser
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SetAdviserButton;