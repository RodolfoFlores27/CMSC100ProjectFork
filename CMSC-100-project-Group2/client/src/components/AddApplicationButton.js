import React, { useState } from "react";
import { Button, Modal, Form, Alert } from "react-bootstrap";
import axios from "axios";

const AddApplicationButton = ({ updateApplications, setShowSuccess }) => {
  const [showModal, setShowModal] = useState(false);
  const [link, setLink] = useState("");
  const studentNumber = localStorage.getItem("studentNumber");

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setLink("");
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    try {
      const applicationsResponse = await axios.get("http://localhost:3001/get-all-applications");
      const applications = applicationsResponse.data;

      const hasPendingApplication = applications.some(
        (application) => application.studentId === studentNumber && application.status === "Pending"
      );

      if (hasPendingApplication) {
        console.log("There is already a pending application for the current user.");
        return;
      }

      const usersResponse = await axios.get("http://localhost:3001/get-all-users");
      const users = usersResponse.data.users;
      const student = users.find((user) => user.studentNumber === studentNumber);

      if (!student) {
        console.log("Student not found.");
        return;
      }

      const id = student._id;
      console.log("User ID:", id);

      const applicationResponse = await axios.post("http://localhost:3001/add-application", {
        studentId: id,
        link: link,
      });

      if (applicationResponse.data.success) {
        setShowSuccess(true); // Set the showSuccess state to true
        handleCloseModal();
        updateApplications(); // Invoke the callback function to update the applications list
      } else {
        console.log("Error:", applicationResponse.data.errMessage);
      }
    } catch (err) {
      console.log("Error:", err.message);
    }
  };

  return (
    <>
      <Button variant="primary" onClick={handleShowModal}>
        Open Application
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Open Application</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleFormSubmit}>
            <Form.Group controlId="studentNumber">
              <Form.Label>Student Number</Form.Label>
              <Form.Control type="text" value={studentNumber} readOnly />
            </Form.Group>
            <Form.Group controlId="link">
              <Form.Label>Link</Form.Label>
              <Form.Control type="text" value={link} onChange={(e) => setLink(e.target.value)} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
         
          <Button variant="primary" type="submit" onClick={handleFormSubmit}>
            Submit
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default AddApplicationButton;