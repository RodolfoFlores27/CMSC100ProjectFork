import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Container, Navbar, Nav, NavDropdown, Button } from "react-bootstrap";

export default function Home() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(true);

  useEffect(() => {
    axios
      .post(
        "http://localhost:3001/check-if-logged-in",
        {},
        { withCredentials: true }
      )
      .then((response) => {
        const body = response.data;
        setIsLoggedIn(body.isLoggedIn);
      })
      .catch((err) => alert(err.message));
  }, []);

  return (
    <div>
      <h1>Home Page</h1>

      {isLoggedIn ? null : (
        <>
          <Link to="/login">Login</Link>
          <br />
        </>
      )}

      <Link to="/register">Register</Link>
      <br />
      <Link to="/dashboard">Dashboard</Link>
    </div>
  );
}