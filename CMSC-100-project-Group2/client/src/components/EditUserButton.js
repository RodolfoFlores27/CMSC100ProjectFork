import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";

const EditUserButton = ({ userId, onEdit }) => {
  const [showModal, setShowModal] = useState(false);
  const [firstName, setFirstName] = useState("");
  const [middleName, setMiddleName] = useState("");
  const [lastName, setLastName] = useState("");

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    // Clear form fields when closing the modal
    setFirstName("");
    setMiddleName("");
    setLastName("");
  };

  const handleSubmit = () => {
    const updatedData = {
      firstName: firstName,
      middleName: middleName,
      lastName: lastName,
    };
    onEdit(userId, updatedData);
    setShowModal(false);
  };

  return (
    <>
      <Button variant="primary" onClick={handleShowModal}>
        Edit
      </Button>

      <Modal show={showModal} onHide={handleCloseModal}>
        <Modal.Header closeButton>
          <Modal.Title>Edit User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formFirstName">
              <Form.Label>First Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter first name"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formMiddleName">
              <Form.Label>Middle Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter middle name"
                value={middleName}
                onChange={(e) => setMiddleName(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="formLastName">
              <Form.Label>Last Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter last name"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default EditUserButton;