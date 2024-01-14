import { Nav, Button, Container, Form, Navbar, NavDropdown } from 'react-bootstrap';
import { NavLink } from 'react-router-dom'

function TopNav() {
	return (
		<Navbar expand="lg" className="bg-body-tertiary .App">
			<Container fluid>
				<Navbar.Brand>Eight</Navbar.Brand>
				<Navbar.Toggle aria-controls="navbarScroll" />
				<Navbar.Collapse id="navbarScroll">
					<Nav
						className="me-auto my-2 my-lg-0"
						style={{ maxHeight: '500px' }}
						navbarScroll
					>
						<Nav.Link><NavLink to='/'>Home</NavLink></Nav.Link>
						<Nav.Link><NavLink to='/news'>News</NavLink></Nav.Link>
						<NavDropdown title="PC게임" id="navbarScrollingDropdown">
							<NavDropdown.Item href="/pc_game#lol">LOL</NavDropdown.Item>
							<NavDropdown.Item href="/pc_game#valorant">발로란트</NavDropdown.Item>
							<NavDropdown.Divider/>
							<NavDropdown.Item href="/pc_game#brawl_stars">브롤스타즈
							</NavDropdown.Item>
						</NavDropdown>
						<Nav.Link><NavLink to='/console_game'>콘솔게임</NavLink></Nav.Link>
						<Nav.Link><NavLink to='/mobile_game'>모바일게임</NavLink></Nav.Link>
						<Nav.Link><NavLink to='/request'>요청</NavLink></Nav.Link>
					</Nav>
					<Form className="d-flex">
						<Form.Control
							type="search"
							placeholder="Search"
							className="me-2"
							aria-label="Search"
						/>
						<Button variant="outline-success">Search</Button>
					</Form>
				</Navbar.Collapse>
			</Container>
		</Navbar>
	)
}

export default TopNav;