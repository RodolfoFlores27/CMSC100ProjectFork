import React, { useState, useEffect } from "react";
import { Container, Col, Row, Button, Table } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CreateApproverButton from "../../components/CreateApproverButton";
import SearchBar from "../../components/SearchBar";
import SetAdviserButton from "../../components/SetAdviserButton";
import EditUserButton from "../../components/EditUserButton";

const Admin = () => {
  const [applications, setApplications] = useState([]);
  const [searchResults, setSearchResults] = useState([]);
  const email = localStorage.getItem("email");
  const [admin, setAdmin] = useState(null);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [sortBy, setSortBy] = useState(null);
  const RedirectingMessage = () => (
    <p className="text-muted mt-3">Redirecting to login shortly...</p>
  );
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Users setup
        const usersResponse = await axios.get("http://localhost:3001/get-all-users");
        const users = usersResponse.data.users;

        // set logged approver based on email item
        const admin = users.find((user) => user.email === email && user.userType === "Admin");
        setAdmin(admin);
      } catch (error) {
        console.log("Error:", error.message);
      }
    };

    fetchData();
  }, [email]);

  useEffect(() => {
    const redirectTimeout = setTimeout(() => {
      if (!admin) {
        navigate("/login"); // Replace "/login" with your login page route
      }
    }, 3000); // Adjust the timeout value (in milliseconds) as needed

    return () => clearTimeout(redirectTimeout);
  }, [admin, navigate]);
  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await axios.get("http://localhost:3001/get-all-applications");
        const allApplications = response.data;

        // Filter out closed applications
        const openApplications = allApplications.filter(application => application.status !== "Closed");

        setApplications(openApplications);
      } catch (err) {
        console.log("Error:", err.message);
      }
    };

    fetchApplications();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get("http://localhost:3001/get-all-users");
        const usersData = response.data.users;
        setUsers(usersData);
      } catch (error) {
        console.log("Error:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const approveApplication = async (applicationId) => {
    try {
      const response = await axios.post("http://localhost:3001/edit-application-status", {
        applicationId: applicationId,
        status: "Cleared",
        notificationMessage: "Application approved",
      });

      if (response.data.success) {
        // Application status updated successfully
        // Update the applications state to reflect the updated status
        const updatedApplications = applications.map(application => {
          if (application._id === applicationId) {
            return { ...application, status: "Cleared" };
          }
          return application;
        });
        setApplications(updatedApplications);
      } else {
        console.log(response.data.errMessage);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const rejectApplication = async (applicationId) => {
    try {
      const response = await axios.post("http://localhost:3001/edit-application-status", {
        applicationId: applicationId,
        status: "Closed",
        notificationMessage: "Application rejected",
      });

      if (response.data.success) {
        // Application status updated successfully
        // Update the applications state to remove the rejected application
        const updatedApplications = applications.filter(application => application._id !== applicationId);
        setApplications(updatedApplications);
      } else {
        console.log(response.data.errMessage);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleSearch = (users) => {
    setSearchResults(users);
  };

  const handleDeleteUser = async (userId) => {
    try {
      const response = await axios.post("http://localhost:3001/delete-user", {
        userId: userId,
      });

      if (response.data.success) {
        // User deleted successfully
        // Update the users state to remove the deleted user
        const updatedUsers = users.filter(user => user._id !== userId);
        setUsers(updatedUsers);
      } else {
        console.log(response.data.errMessage);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleEditUser = async (userId, updatedData) => {
    try {
      const response = await axios.post("http://localhost:3001/edit-user", {
        userId: userId,
        ...updatedData,
      });

      if (response.data.success) {
        // User updated successfully
        // You can perform any additional actions here, such as updating the UI or refetching the users
        console.log("User updated:", response.data.updatedUser);
      } else {
        console.log(response.data.errMessage);
      }
    } catch (error) {
      console.log("Error:", error.message);
    }
  };

  const handleSortByName = () => {
    if (sortBy === "name") {
      // Already sorting by name, reverse the order
      setApplications([...applications].reverse());
    } else {
      // Sort by name in ascending order
      const sortedApplications = [...applications].sort((a, b) => {
        const applicantA = users.find((user) => user._id === a.studentId);
        const applicantB = users.find((user) => user._id === b.studentId);
  
        if (applicantA && applicantB) {
          return applicantA.firstName.localeCompare(applicantB.firstName);
        } else {
          return 0; // Handle the case when either applicant is undefined
        }
      });
      setApplications(sortedApplications);
    }
    setSortBy("name");
  };
  const handleSortByStudentNumber = () => {
    if (sortBy === "studentNumber") {
      // Already sorting by student number, reverse the order
      setApplications([...applications].reverse());
    } else {
      // Sort by student number in ascending order
      const sortedApplications = [...applications].sort((a, b) => {
        const applicantA = users.find((user) => user._id === a.studentId);
        const applicantB = users.find((user) => user._id === b.studentId);
  
        if (applicantA && applicantB) {
          return applicantA.studentNumber.localeCompare(applicantB.studentNumber);
        } else {
          return 0; // Handle the case when either applicant is undefined
        }
      });
      setApplications(sortedApplications);
    }
    setSortBy("studentNumber");
  };
  
  return (
    <Container>
      {admin ? (
    <>
      <Container className="mt-5 mb-3 pb-4 d-flex flex-column align-items-left border-bottom">
        <Row>
          <Col xs={7}>
            <h1>ADMIN</h1>
          </Col>
          <Col xs={3} className="d-flex justify-content-end align-items-start"></Col>
        </Row>
      </Container>
      <Container>
        <div>
          <h3>Applications</h3>
          <button type="button" onClick={handleSortByName}>
            Sort by Name
          </button>{" "}
          <button type="button" onClick={handleSortByStudentNumber}>
            Sort by Student Number
          </button>
          <br />
          <Table striped bordered>
            <thead>
              <tr>
                <th>#</th>
                <th>Student Name</th>
                <th>Student Number</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {applications.map((application, index) => {
                const applicant = users.find((user) => user._id === application.studentId);

                return (
                  <tr key={application._id}>
                    <td>{index + 1}</td>
                    <td>{applicant ? `${applicant.firstName} ${applicant.lastName}` : ""}</td>
                    <td>{applicant ? applicant.studentNumber : ""}</td>
                    <td>{application.status}</td>
                    <td>
                      {application.status === "Pending" && (
                        <>
                          <Button variant="success" onClick={() => approveApplication(application._id)}>
                            Approve
                          </Button>{" "}
                          <Button variant="danger" onClick={() => rejectApplication(application._id)}>
                            Reject
                          </Button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </Table>
        </div>
        <div>
          <h3>User Search</h3>
          <SearchBar onSearch={handleSearch} searchResults={searchResults} />
          <Table striped bordered>
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                <th>User Type</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((user) => (
                <tr key={user._id}>
                  <td>{`${user.firstName} ${user.lastName}`}</td>
                  <td>{user.studentNumber}</td>
                  <td>{user.userType}</td>
                  <td>
                    <EditUserButton userId={user._id} onEdit={handleEditUser} />{" "}
                    <Button variant="danger" onClick={() => handleDeleteUser(user._id)}>
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <br />
        <Row className="mt-4">
          <Col className="col-auto">
            <CreateApproverButton />
          </Col>
          <Col className="col-auto">
            <SetAdviserButton />
          </Col>
        </Row>
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

export default Admin;