import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card } from "react-bootstrap";
import axios from "axios";
import "./register.css";


export default function Register() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("");
    const [fname, setfName] = useState("");
    const [mname, setmName] = useState("");
    const [lname, setlName] = useState("");
    const [studnum, setStudNum] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [existingEmails, setExistingEmails] = useState([])
    const [existingStudentNumbers, setExistingStudentNumbers] = useState([])
    // fetch users to get emails and studentNumbers
    useEffect(() => {
        axios.get("http://localhost:3001/get-all-users")
        .then((response) => response.data.users)
        .then((users) => {
            return users.map((u) => {return {email: u.email, studentNumber: u.studentNumber}})
        })
        .then((userData) => {
            const emailsHere = userData.map((user) => user.email)
            const studentNumbersHere = userData.map((user) => user.studentNumber)
            setExistingEmails(emailsHere)
            setExistingStudentNumbers(studentNumbersHere)
            console.log(emailsHere)
            console.log(studentNumbersHere)
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
          });
    }, []) 

    function handleSubmit(e) {
        e.preventDefault();

        console.log(email);
        console.log(password);
        console.log(confirmPassword);

        if (password !== confirmPassword) {
            alert("Password is not the same as confirm password!");
        } else if (password.length < 6) {
            alert("Password must be greater than 6 characters!");
        } else if (existingEmails.includes(email)) {
            alert("Email already exists!")
        } else if (existingStudentNumbers.includes(studnum)) {
            alert("Student number already exists!")
        }
        else {
            console.log("TRYING TO POST")

            axios.post("http://localhost:3001/register", {
                firstName: fname,
                middleName: mname,
                lastName: lname,
                studentNumber: studnum,
                userType: "Student", // Student, Adviser, ClearanceOfficer
                email: email,
                password: password
            })
            .then((response) => {
                // Reset states
                console.log(response);
                setEmail("");
                setfName("");
                setmName("");
                setlName("");
                setStudNum("");
                setPassword("");
                setConfirmPassword("");
            })
            .catch(err => alert(err.message));

            alert("Successfully registered.");
            navigate("/");
        }
    }

    function handleEmailChange(e) {
        setEmail(e.target.value);
    }
    function handleFirstNameChange(e) {
        setfName(e.target.value);
    }
    function handleMiddleNameChange(e) {
        setmName(e.target.value);
    }
    function handleLastNameChange(e) {
        setlName(e.target.value);
    }
    function handleStudNumChange(e) {
        setStudNum(e.target.value);
    }
    function handlePasswordChange(e) {
        setPassword(e.target.value);
    }
    function handleConfirmPasswordChange(e) {
        setConfirmPassword(e.target.value);
    }

    return <Container className="register-container">
        <Card>
            <Card.Header><h2>Register</h2></Card.Header>


            <Card.Body>
                <Form onSubmit={handleSubmit}>

                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label><b>Email address</b></Form.Label>
                        <Form.Control required type="email" placeholder="Enter email" value={email} onChange={handleEmailChange} />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicFirstName">
                        <Form.Label><b>First Name</b></Form.Label>
                        <Form.Control required placeholder="Enter first name" value={fname} onChange={handleFirstNameChange} />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicMiddleName">
                        <Form.Label><b>Middle Name</b></Form.Label>
                        <Form.Control required placeholder="Enter middle name" value={mname} onChange={handleMiddleNameChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicLastName">
                        <Form.Label><b>Last Name</b></Form.Label>
                        <Form.Control required placeholder="Enter last name" value={lname} onChange={handleLastNameChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicStudentNumber">
                        <Form.Label><b>Student Number </b></Form.Label>
                        <Form.Control required placeholder="eg: 2000-12345" value={studnum} onChange={handleStudNumChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label><b>Password</b></Form.Label>
                        <Form.Control required type="password" placeholder="Password" value={password} onChange={handlePasswordChange} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicConfirmPassword">
                        <Form.Label><b>Confirm Password</b></Form.Label>
                        <Form.Control required type="password" placeholder="Confirm Password" value={confirmPassword} onChange={handleConfirmPasswordChange} />
                    </Form.Group>

                    <Button variant="primary" type="submit">
                        Submit
                    </Button>

                </Form>
            </Card.Body>

        </Card>
    </Container>
}