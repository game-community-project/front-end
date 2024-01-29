import React, { useEffect, useState } from 'react';
import { Nav, Container, Form, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import './TopNav.css'; // CSS 파일 임포트

import { jwtDecode } from "jwt-decode";

interface JwtPayload {
  auth?: string;
  exp?: number;
}

function TopNav() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');

    const handleLogout = () => {
      localStorage.removeItem('accessToken');
      setIsLoggedIn(false);
    };

    if (accessToken) {
      const token = accessToken.substring(7);
      const decoded: JwtPayload = jwtDecode(token);
      const currentTimestamp = Math.floor(Date.now() / 1000);

      if (decoded.exp && decoded.exp < currentTimestamp) {
        handleLogout();
      } else {
        setIsLoggedIn(true);
        if (decoded.auth && decoded.auth === 'ADMIN') {
          setIsAdmin(true);
        }
      }
    } else {
      handleLogout();
    }
  }, []);

  return (
    <Navbar expand="lg" className="top-nav">
      <Container fluid>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav className="mr-auto my-2 my-lg-0" navbarScroll>
            {isAdmin && <Nav.Link><NavLink to='/admin/user_list' style={{ textDecoration: 'none', color: 'inherit' }}>관리자</NavLink></Nav.Link>}
          </Nav>
          <Form className="d-flex">
            {!isLoggedIn ? (
              <>
                <Nav.Link><NavLink to='/signup' style={{ textDecoration: 'none', color: 'inherit' }}>회원가입</NavLink></Nav.Link>
                <span className="mx-2"></span>
                <Nav.Link><NavLink to='/login' style={{ textDecoration: 'none', color: 'inherit' }}>로그인</NavLink></Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link><NavLink to='/my_page' style={{ textDecoration: 'none', color: 'inherit' }}>내 정보</NavLink></Nav.Link>
                <span className="mx-2"></span>
                <Nav.Link><NavLink to='/logout' style={{ textDecoration: 'none', color: 'inherit' }}>로그아웃</NavLink></Nav.Link>
              </>
            )}
          </Form>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default TopNav;