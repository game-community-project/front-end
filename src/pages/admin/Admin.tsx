import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.module.css'
import axios from "axios";
import { useState } from "react";

const headerHolder = {
	access: '',
	refresh: '',
}

function ButtonAdminLogin() {
	const loginData = {
		email: 'japgo@naver.com',
		password: '1234',
	}

	const login = async () => {
		try {
			const loginUrl = 'http://localhost:8080/api/users/login';
			const resp = await axios.post(loginUrl, loginData);
			if (resp.status == 200) {
				const access = resp.headers.access;
				const refresh = resp.headers.refresh;

				localStorage.setItem('access', access);
				localStorage.setItem('refresh', refresh);
				// headerHolder.access = access;
				// headerHolder.refresh = refresh;
			}
			else {
				alert("로그인 실패");
			}
		}
		catch (error) {
			console.error('exception : ', error);
		}
	}

	return (
		<div>
			<Button onClick={login}>로그인</Button>
		</div>
	)
}

function Admin() {
	return (
		<Container>
			<br />
			<ButtonAdminLogin />
			<br />
			<ButtonReportedPosts />
			<br />
			<FormFindUser />
			<br />
			<FormUserInfo />
		</Container>
	)
}

function FormFindUser() {
	const [nickname, setNickname] = useState('');

	const accessToken = localStorage.getItem('access');
	const refreshToken = localStorage.getItem('refresh');

	const find = async () => {
		try {
			const url = "http://localhost:8080/api/admin/users/" + nickname;
			const resp = await axios.get(url, {
				headers: {
					access: accessToken,
					refresh: refreshToken,
				}
			});

			console.log( 'get user data : ', resp );
		}
		catch (error) {
			console.error( 'find user error : ', error);
		}
	}

	return (
		<Container>
			<Form>
				<Row>
					<Col>
						<Form.Label>User Nickname</Form.Label>
					</Col>
					<Col>
						<Form.Control type="text" placeholder="Enter User Nickname" onChange={(e) => setNickname(e.target.value)} />
					</Col>
					<Col>
						<Button variant="primary" type="submit" onClick={find}>Find</Button>
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
						<DatePicker selected={new Date()} onChange={() => { }} />
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
