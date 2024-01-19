import React, { useEffect, useState } from 'react';
import { Nav, Container, Form, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';

function TopNav() {
	// 로그인 상태를 추적하기 위해 상태를 사용합니다.
	const [isLoggedIn, setIsLoggedIn] = useState(false);

	useEffect(() => {
		// 페이지 로딩 시 로그인 상태 확인
		const accessToken = localStorage.getItem('accessToken');
	
		if (accessToken) {
		  // 저장소에 유효한 access 토큰이 있다면 로그인 상태로 간주
		  setIsLoggedIn(true);
		}
	  }, []);

	return (
		<Navbar expand="lg" className="bg-body-tertiary .App">
			<Container fluid>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav
						className="me-auto my-2 my-lg-0"
						style={{ maxHeight: '400px', margin: '10 auto 10 auto' }}
						navbarScroll
					>
						<Nav.Link><NavLink to='/'>Home</NavLink></Nav.Link>
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
						<Nav.Link><NavLink to='/request'>요청</NavLink></Nav.Link>
					</Nav>
					<Form className="d-flex">
						{/* 로그인 상태에 따라 링크를 조건부로 렌더링합니다. */}
						{!isLoggedIn ? (
							<>
								<Nav.Link><NavLink to='/signup'>회원가입</NavLink></Nav.Link>
								<span className="mx-2"></span>
								<Nav.Link><NavLink to='/login'>로그인</NavLink></Nav.Link>
							</>
						) : (
							<>
								<Nav.Link><NavLink to='/my_page'>내 정보</NavLink></Nav.Link>
								<span className="mx-2"></span>
								<Nav.Link><NavLink to='/logout'>로그아웃</NavLink></Nav.Link>
							</>
						)}
					</Form>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}

export default TopNav;
