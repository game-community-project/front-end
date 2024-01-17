import { Nav, Button, Container, Form, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'

function TopNav() {
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
						<Nav.Link><NavLink to='/news'>News</NavLink></Nav.Link>
						<NavDropdown title="PC게임" id="navbarScrollingDropdown">
							<NavDropdown.Item href="/pc/lol">LOL</NavDropdown.Item>
							<NavDropdown.Item href="/pc/val">발로란트</NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="콘솔게임" id="navbarScrollingDropdown">
							<NavDropdown.Item href="/console/zelda">젤다"</NavDropdown.Item>
						</NavDropdown>
						<NavDropdown title="모바일게임" id="navbarScrollingDropdown">
							<NavDropdown.Item href="/mobile/brawl_stars">브롤스타즈
							</NavDropdown.Item>
						</NavDropdown>
						<Nav.Link><NavLink to='/request'>요청</NavLink></Nav.Link>
						<Nav.Link><NavLink to='/admin'>관리자</NavLink></Nav.Link>
					</Nav>
					<Form className="d-flex">
						<Nav.Link><NavLink to='/signup'>회원가입</NavLink></Nav.Link>
						<Nav.Link><NavLink to='/login'>로그인</NavLink></Nav.Link>
						<Nav.Link><NavLink to='/my_page'>내 정보</NavLink></Nav.Link>
					</Form>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default TopNav;