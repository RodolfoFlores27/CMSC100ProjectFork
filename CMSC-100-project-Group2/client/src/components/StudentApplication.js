import React, { useState, useEffect } from "react";
import { Container, Button, Table, Alert, Modal } from "react-bootstrap";
import axios from "axios";
import AddApplicationButton from "./AddApplicationButton";
import PrintPDFButton from "./PrintPDFButton";

const StudentApplication = () => {
    const [applications, setApplications] = useState([]);
    const [showSuccess, setShowSuccess] = useState(false);
    const [showCloseSuccess, setShowCloseSuccess] = useState(false);
    const [showResubmitModal, setShowResubmitModal] = useState(false);
    const [student, setStudent] = useState(null);
    const email = localStorage.getItem("email");

    const fetchStudentApplications = async () => {
        try {
            const usersResponse = await axios.get("http://localhost:3001/get-all-users");
            const users = usersResponse.data.users;

            const loggedInStudent = users.find((user) => user.email === email);
            const student = users.find((user) => user.email === email && user.userType === "Student");
            setStudent(student);
            if (!loggedInStudent) {
                console.log("Logged-in student not found.");
                return;
            }

            const applicationsResponse = await axios.get("http://localhost:3001/get-all-applications");
            const applications = applicationsResponse.data;

            const studentApplications = applications.filter(
                (application) => application.studentId === loggedInStudent._id && application.status !== "Closed"
            );

            setApplications(studentApplications);
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    useEffect(() => {
        fetchStudentApplications();
    }, [email]);

    const closeApplicationStatus = async (applicationId) => {
        try {
            const response = await axios.post("http://localhost:3001/edit-application-status", {
                applicationId: applicationId,
                status: "Closed",
                notificationMessage: "Application closed",
            });

            if (response.data.success) {
                // Update the applications state by removing the closed application
                setApplications((prevApplications) => {
                    return prevApplications.filter((application) => application._id !== applicationId);
                });

                setShowCloseSuccess(true); // Set the showCloseSuccess state to true
            } else {
                console.log(response.data.errMessage);
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    const updateApplications = async () => {
        try {
            await fetchStudentApplications();
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    const handleOpenResubmitModal = () => {
        setShowResubmitModal(true);
    };

    const handleCloseResubmitModal = () => {
        setShowResubmitModal(false);
    };
    const resubmitApplication = async (applicationId) => {
        try {
            const response = await axios.post("http://localhost:3001/edit-application-status", {
                applicationId: applicationId,
                status: "Pending",
                notificationMessage: "Application resubmitted",
            });

            if (response.data.success) {
                // Update the applications state
                setApplications((prevApplications) => {
                    return prevApplications.map((application) => {
                        if (application._id === applicationId) {
                            return {
                                ...application,
                                status: "Pending",
                            };
                        }
                        return application;
                    });
                });

                setShowSuccess(true);
            } else {
                console.log(response.data.errMessage);
            }
        } catch (error) {
            console.log("Error:", error.message);
        }
    };

    return (
        <Container>
            <h3>Application Details</h3>
            {showCloseSuccess && (
                <div className="centered-alert">
                    <Alert variant="success" onClose={() => setShowCloseSuccess(false)} dismissible>
                        Application Closed Successfully
                    </Alert>
                </div>
            )}
            {showSuccess && (
                <div className="centered-alert">
                    <Alert variant="success" onClose={() => setShowSuccess(false)} dismissible>
                        Application Added Successfully
                    </Alert>
                </div>
            )}
            {applications.length > 0 ? (
                <Table striped bordered>
                    <thead>
                        <tr>
                            <th>Step</th>
                            <th>Remarks</th>
                            <th>Status</th>
                            <th>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {applications.map((application, index) => (
                            <tr key={index}>
                                <td>{application.step}</td>
                                <td>
                                    {application.remarks.map((remark, index) => (
                                        <div key={index}>
                                            <p>{remark.remark}</p>
                                            <p>Date: {remark.date}</p>
                                            <p>
                                                Commenter: {remark.commenterFName} {remark.commenterLName}
                                            </p>
                                        </div>
                                    ))}
                                </td>
                                <td>{application.status}</td>
                                <td>
                                <Button variant="danger" onClick={() => closeApplicationStatus(application._id)}>
                                                Close
                                            </Button>
                                    {application.status === "Open" && (
                                        <div>
                                            <Button variant="primary" onClick={() => resubmitApplication(application._id)}>
                                                Resubmit
                                            </Button>
                                        </div>
                                    )}
                                    {application.status === "Cleared" && (
                                        <PrintPDFButton
                                            name={`${student.firstName} ${student.lastName}`}
                                            studentNumber={student.studentNumber}
                                            academicAdviser={student.adviser}
                                            clearanceOfficer="Chuck Norris"
                                        />
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            ) : (
                <p>Currently no applications.</p>
            )}

            {!applications.some(
                (application) => application.status === "Pending" || application.status === "Cleared"
            ) && (
                    <AddApplicationButton updateApplications={updateApplications} setShowSuccess={setShowSuccess} />
                )}

            {/* Resubmit Modal */}
            <Modal show={showResubmitModal} onHide={handleCloseResubmitModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Resubmit Application</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>RESUBMIT</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleCloseResubmitModal}>
                        Close
                    </Button>
                    <Button variant="primary">Submit</Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default StudentApplication;
