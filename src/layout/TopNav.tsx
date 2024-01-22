import React, { useEffect, useState } from 'react';
import { Nav, Container, Form, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import './TopNav.css'; // Import the CSS file

import { jwtDecode } from "jwt-decode";

interface JwtPayload {
	// 다른 필요한 프로퍼티들도 여기에 추가할 수 있습니다.
	auth?: string; // auth 프로퍼티가 optional하게 포함될 수 있도록 함
	exp?: number;
  }

function TopNav() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const [isAdmin, setIsAdmin] = useState(false);
	const navigate = useNavigate();

	
	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
	
		const handleLogout = () => {
		  // 로그아웃 처리 로직 추가 (예: 토큰 삭제, 로그아웃 API 호출 등)
		  localStorage.removeItem('accessToken');
		  setIsLoggedIn(false);
		};
	
		if (accessToken) {
		  const token = accessToken.substring(7); // "Bearer " 제거
		  const decoded:JwtPayload = jwtDecode(token);
		  const currentTimestamp = Math.floor(Date.now() / 1000);
	
		  if (decoded.exp && decoded.exp < currentTimestamp) {
			// 토큰이 만료되었을 경우 로그아웃 처리
			handleLogout();
		  } else {
			// 토큰이 유효한 경우 로그인 상태로 설정
			setIsLoggedIn(true);
			if (decoded.auth && decoded.auth === 'ADMIN') {
				// 토큰에 'ADMIN' 권한이 있는 경우, isAdmin 상태를 true로 설정
				setIsAdmin(true);
			  }
		  }
		} else {
		  // 토큰이 없는 경우 로그아웃 처리
		  handleLogout();
		}
	  }, []);

	return (
		<Navbar expand="lg" className="top-nav">
			<Container fluid>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav
						className="me-auto my-2 my-lg-0"
						style={{ maxHeight: '400px', margin: '10 auto 10 auto' }}
						navbarScroll
					>
						<Nav.Link><NavLink to='/' style={{ textDecoration: 'none', color: 'inherit' }}>홈</NavLink></Nav.Link>
						<NavDropdown title="PC게임" id="navbarScrollingDropdown">
							<NavDropdown.Item><NavLink to="/pc/lol">LOL</NavLink></NavDropdown.Item>
							<NavDropdown.Item><NavLink to="/pc/val">발로란트</NavLink></NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="콘솔게임" id="navbarScrollingDropdown">
							<NavDropdown.Item><NavLink to="/console/zelda">젤다</NavLink></NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="모바일게임" id="navbarScrollingDropdown">
							<NavDropdown.Item><NavLink to="/mobile/brawl_stars">브롤스타즈</NavLink></NavDropdown.Item>
						</NavDropdown>
						<Nav.Link><NavLink to='/team_promotion' style={{ textDecoration: 'none', color: 'inherit' }}>팀 홍보 게시판</NavLink></Nav.Link>
						<Nav.Link><NavLink to='/request' style={{ textDecoration: 'none', color: 'inherit' }}>요청 게시판</NavLink></Nav.Link>
						{ isAdmin && <Nav.Link><NavLink to='/admin/user_list' style={{ textDecoration: 'none', color: 'inherit' }}>관리자</NavLink></Nav.Link> }
					</Nav>
					<Form className="d-flex">
						{/* 로그인 상태에 따라 링크를 조건부로 렌더링합니다. */}
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