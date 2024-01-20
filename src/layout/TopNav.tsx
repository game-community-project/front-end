import React, { useEffect, useState } from 'react';
import { Nav, Container, Form, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink, useNavigate } from 'react-router-dom';
import './TopNav.css'; // Import the CSS file

function TopNav() {
	const [isLoggedIn, setIsLoggedIn] = useState(false);
	const navigate = useNavigate();

	useEffect(() => {
		const accessToken = localStorage.getItem('accessToken');
		if (accessToken) {
			setIsLoggedIn(true);
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
							<NavDropdown.Item href="/pc/lol">LOL</NavDropdown.Item>
							<NavDropdown.Item href="/pc/val">발로란트</NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="콘솔게임" id="navbarScrollingDropdown">
							<NavDropdown.Item href="/console/zelda">젤다</NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="모바일게임" id="navbarScrollingDropdown">
							<NavDropdown.Item href="/mobile/brawl_stars">브롤스타즈</NavDropdown.Item>
						</NavDropdown>
						<Nav.Link><NavLink to='/team_promotion' style={{ textDecoration: 'none', color: 'inherit' }}>팀 홍보 게시판</NavLink></Nav.Link>
						<Nav.Link><NavLink to='/request' style={{ textDecoration: 'none', color: 'inherit' }}>요청 게시판</NavLink></Nav.Link>
						<Nav.Link><NavLink to='/admin' style={{ textDecoration: 'none', color: 'inherit' }}>관리자</NavLink></Nav.Link>
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