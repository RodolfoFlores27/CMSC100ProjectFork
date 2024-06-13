import React, { useEffect, useState } from 'react';
import Cookies from 'universal-cookie';
import { Navbar, Nav, Container } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkUserType();
  }, []);

  const checkUserType = () => {
    const userType = localStorage.getItem('userType');
    setUserType(userType);
    setLoading(false);
  };

  const handleLogout = () => {
    const cookies = new Cookies();
    cookies.remove('authToken');
    localStorage.removeItem('username');
    localStorage.removeItem('email');
    localStorage.removeItem('studentNumber');
    localStorage.removeItem('userType');
    setUserType(null);
    navigate('/login');
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Navbar bg="primary" expand="lg" className="fixed-navbar">
      <Container>
        <Navbar.Brand style={{ color: 'white' }} href="/">
          UPLV CLEARANCE
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto d-flex align-items-center">
            {userType !== null ? (
              <Nav.Link style={{ color: 'white' }} onClick={handleLogout}>
                <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                  <p className="mx-2">Logout</p>
                </label>
              </Nav.Link>
            ) : (
              <>
                <Nav.Link style={{ color: 'white' }} href="/login">
                  <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                    <p className="mx-2">Login</p>
                  </label>
                </Nav.Link>
                <Nav.Link style={{ color: 'white' }} href="/register">
                  <label className="d-flex align-items-center" style={{ cursor: 'pointer' }}>
                    <p className="mx-2">Register</p>
                  </label>
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavBar;