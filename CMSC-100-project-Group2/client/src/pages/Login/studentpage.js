import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import ShowUserData from "../../components/showUserData";
import StudentApplication from "../../components/StudentApplication";
import NotificationButton from "../../components/NotificationButton";

const Student = () => {
  const email = localStorage.getItem("email");
  const [student, setStudent] = useState(null);
  const navigate = useNavigate();
  const RedirectingMessage = () => (
    <p className="text-muted mt-3">Redirecting to login shortly...</p>
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await axios.get("http://localhost:3001/get-all-users");
        const users = usersResponse.data.users;

        const student = users.find((user) => user.email === email && user.userType === "Student");
        setStudent(student);
      } catch (error) {
        console.log("Error:", error.message);
      }
    };

    fetchData();
  }, [email]);

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (!student) {
        navigate("/login"); // Replace "/login" with your login page route
      }
    }, 3000);

    return () => clearTimeout(redirectTimeout);
  }, [student, navigate]);

  return (
    <Container>
      {student ? (
        <>
          <Container className="mt-5 mb-3 pb-4 d-flex flex-column align-items-left border-bottom">
            <Row className="align-items-center">
              <Col>
                <ShowUserData />
              </Col>
              <Col className="d-flex justify-content-end">
                <NotificationButton notifIds={student.notifications} student={student} />
              </Col>
            </Row>
          </Container>
          <Container>
            <StudentApplication />
          </Container>
        </>
      ) : (
        <Container className="d-flex flex-column align-items-center justify-content-center mt-5">
          <h5 className="text-danger">Authorization Error</h5>
          <RedirectingMessage />
        </Container>
      )}
    </Container>
  );
};

export default Student;