import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.module.css'
import axios from "axios";
import { useState } from "react";
import { UserDto } from "../../dto/UserDto";

interface AdminProps { }

interface FormFindUserProps {
	onUserChange: (newUser: UserDto) => void;
}

interface FormUserInfoProps {
	userData: UserDto;
}

function Admin(props: AdminProps) {
	const [user, setUser] = useState<UserDto>();

	const handlerUserChange = (newUser: UserDto) => {
		setUser(newUser);
	}

	return (
		<Container>
			<br />
			<ButtonReportedPosts />
			<br />
			<FormFindUser onUserChange={handlerUserChange} />
			<br />
			{ user && <FormUserInfo userData={user} /> }
		</Container>
	)
}

function FormFindUser({ onUserChange }: FormFindUserProps) {

	const [nickname, setNickname] = useState('');

	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');

	const find = async () => {
		try {
			const url = `http://localhost:8080/api/admin/users/${nickname}`;
			const resp = await axios.get(url, {
				headers: {
					access: accessToken,
					refresh: refreshToken,
				}
			});
			const userDto: UserDto = resp.data.data;
			onUserChange(userDto);
		}
		catch (error) {
			if (axios.isAxiosError(error)) {
				alert(error.response?.data?.message || '유저 조회에 실패하였습니다.');
			} else {
				console.error('find user error : ', error);
				alert('유저 조회에 실패하였습니다.');
			}
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
						<Button variant="primary" type="button" onClick={find} >Find</Button>
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

function FormUserInfo({ userData }: FormUserInfoProps) {

	return (
		<Container>
			<Form>
				<Row className="mb-3">
					<Form.Group as={Col} controlId="formGridEmail">
						<Form.Label>Email</Form.Label>
						<Form.Control type="email" placeholder="Email" value={userData.email}/>
					</Form.Group>

					<Form.Group as={Col} controlId="formGridNickname">
						<Form.Label>Nickname</Form.Label>
						<Form.Control type="text" placeholder="Nickname" value={userData.nickname} />
					</Form.Group>
				</Row>

				<Form.Group className="mb-3" controlId="formGridIntroduction">
					<Form.Label>Introduction</Form.Label>
					<Form.Control placeholder="Introduction" value={userData.introduction} />
				</Form.Group>

				<Row className="mb-3">
					<Form.Group as={Col} controlId="formGridRanking">
						<Form.Label>Ranking</Form.Label>
						<Form.Control value={userData.ranking}/>
					</Form.Group>

					<Form.Group as={Col} controlId="formGridBlockDate">
						<Form.Label>Block Date</Form.Label>
						<br/>
						<DatePicker selected={new Date()} value={userData.block_date} onChange={() => { }} />
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
