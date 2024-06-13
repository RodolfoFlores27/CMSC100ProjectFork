import Cookies from "universal-cookie";
import axios from "axios";
import React, { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';

export default function Dashboard() {
  const username = localStorage.getItem("username");
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is logged in
    const checkLoggedIn = async () => {
      try {
        const response = await axios.post(
          "http://localhost:3001/check-if-logged-in",
          {},
          { withCredentials: true }
        );
        const body = response.data;
        setIsLoggedIn(body.isLoggedIn);
      } catch (err) {
        alert(err.message);
      }
    };

    checkLoggedIn();
  }, [navigate]);

  function logout() {
    const cookies = new Cookies();
    cookies.remove("authToken");
    localStorage.removeItem("username");
    localStorage.removeItem("email")
    setIsLoggedIn(false);
    navigate("/");
  }

  return (
    <>
      {isLoggedIn ? (
        <div>
          <p>Welcome to the dashboard, {username}!</p>
          <button onClick={logout}>Log Out</button>
        </div>
      ) : (
        <p>Not Logged In!</p>
      )}
    </>
  );
}