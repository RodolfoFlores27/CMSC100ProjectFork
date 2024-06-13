import { useState, useEffect } from "react";
import { Col } from "react-bootstrap";
import axios from "axios";

const ShowUserData = () => {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:3001/get-all-users");
        const users = response.data.users;

        // Retrieve the email from localStorage
        const email = localStorage.getItem("email");

        // Find the user object with the matching email
        const user = users.find((user) => user.email === email);

        // Set the userData to the user object
        setUserData(user);
      } catch (error) {
        console.error("Error:", error.message);
      }
    };

    fetchData();
  }, []);

  return (
    <Col xs={7}>
      {userData && (
        <>
          <h2>{` ${userData.firstName} ${userData.middleName} ${userData.lastName}`}</h2>
          <h5 className="lead">Email: {userData.email}</h5>
          <h5 className="lead">ID: {userData.studentNumber}</h5>
        </>
      )}
    </Col>
  );
};

export default ShowUserData;