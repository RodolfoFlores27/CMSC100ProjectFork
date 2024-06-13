import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Form, Button, Container, Card } from "react-bootstrap";
import "./login.css";

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    const credentials = {
      email: email,
      password: password,
    };

    axios
    .post('http://localhost:3001/login', credentials)
    .then((response) => {
      if (!response.data.success) {
        alert(response.data.errMessage);
      } else {
        const { token, username, userType, studentNumber } = response.data;
        document.cookie = `authToken=${token}; path=/; max-age=3600;`;
        localStorage.setItem("token", token);
        localStorage.setItem('username', username);
        localStorage.setItem("studentNumber", studentNumber);
        localStorage.setItem('email', email);
        localStorage.setItem("userType", userType)
        console.log(email)
        alert('Successfully logged in');
        console.log(userType)
        // userTypes => Student, Adviser, ClearanceOfficer, Admin
        
        if (userType === 'Student') {
          navigate('/studentpage');
        } else if (userType === 'Adviser') {
          navigate('/approverpage');
        } else if (userType === 'Clearance Officer') {
          navigate('/clearanceOfficer');
        } else if (userType === 'Admin') {
          navigate('/adminpage');
        }
      }
    })
    .catch((err) => {
      alert(err.message);
    });
}

function handleEmailChange(e) {
  setEmail(e.target.value);
}

function handlePasswordChange(e) {
  setPassword(e.target.value);
}
  return (
    <Container className="login-container">
      <Card>
        <Card.Header>
          <h2>Login</h2>
        </Card.Header>
        <Card.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="formBasicEmail">
              <Form.Label>Email address</Form.Label>
              <Form.Control
                required
                type="email"
                placeholder="Enter email"
                value={email}
                onChange={handleEmailChange}
              />
              <Form.Text className="text-muted">
                We'll never share your email with anyone else.
              </Form.Text>
            </Form.Group>

            <Form.Group className="mb-3" controlId="formBasicPassword">
              <Form.Label>Password</Form.Label>
              <Form.Control
                required
                type="password"
                placeholder="Password"
                value={password}
                onChange={handlePasswordChange}
              />
            </Form.Group>
            <Button variant="primary" type="submit">
              Submit
            </Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}
