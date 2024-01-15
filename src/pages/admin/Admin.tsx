import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.module.css'

function Admin() {
	return (
		<Container>
			<br/>
			<ButtonReportedPosts />
			<br/>
			<FormFindUser />
			<br/>
			<FormUserInfo />
		</Container>
	)
}

function FormFindUser() {
	return (
		<Container>
			<Form>
				<Row>
					<Col>
						<Form.Label>User Nickname</Form.Label>
					</Col>
					<Col>
						<Form.Control type="text" placeholder="Enter User Nickname" />
					</Col>
					<Col>
						<Button variant="primary" type="submit">Find</Button>
					</Col>
				</Row>
			</Form>
		</Container>
	)
}

function ButtonReportedPosts() {
	const navigate = useNavigate();
	const goToReportedPosts = () => {
		navigate("/admin/reported_posts");
	}

	return (
		<Container>
			<Button variant="warning" onClick={goToReportedPosts}>신고된 게시글 보기</Button>
		</Container>
	)
}

function FormUserInfo() {
	return (
		<Container>
			<Form>
				<Row className="mb-3">
					<Form.Group as={Col} controlId="formGridEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" placeholder="Enter email" />
					</Form.Group>

					<Form.Group as={Col} controlId="formGridNickname">
						<Form.Label>Nickname</Form.Label>
						<Form.Control type="text" placeholder="Nickname" />
					</Form.Group>
				</Row>

				<Form.Group className="mb-3" controlId="formGridIntroduction">
					<Form.Label>Introduction</Form.Label>
					<Form.Control placeholder="Introduction" />
				</Form.Group>

				<Row className="mb-3">
					<Form.Group as={Col} controlId="formGridRanking">
						<Form.Label>Ranking</Form.Label>
						<Form.Control />
					</Form.Group>

					<Form.Group as={Col} controlId="formGridBlockDate">
						<Form.Label>Block Date</Form.Label>
						<DatePicker selected={new Date()} onChange={()=>{}} />
					</Form.Group>
				</Row>

				<Button variant="danger" type="submit">
					Block User
				</Button>
			</Form>
		</Container>
	);
}

export default Admin;