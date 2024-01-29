import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.module.css'
import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { UserDto } from "../../dto/UserDto";

interface AdminProps { }

interface FormFindUserProps {
	onUserChange: (newUser: UserDto) => void;
	nickname: string;
}

interface FormUserInfoProps {
	userData: UserDto;
}


function UserInfo(props: AdminProps) {
	const [user, setUser] = useState<UserDto>();
	const { param_nick } = useParams();
	const [nickname, setNickname] = useState(param_nick ? param_nick : '');
	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');

	const handlerUserChange = (newUser: UserDto) => {
		setUser(newUser);
	}

	useEffect(() => {
		// 페이지가 처음 로드될 때 nickname이 있으면 해당 사용자 정보를 가져와서 설정
		if (param_nick) {
			setNickname(param_nick);
			fetchData();
		}
	}, [param_nick]);

  const fetchData = async () => {
    try {
      const url = `http://localhost:8080/api/admin/users/${nickname}`;
      const resp = await axios.get(url, {
        headers: {
          access: accessToken,
          refresh: refreshToken,
        }
      });
      const userDto: UserDto = resp.data.data;
      // 부모 컴포넌트로 유저 정보 전달
      handlerUserChange(userDto);
    } catch (error) {
    }
  }

	return (
		<Container>
			<br />
			<ButtonReportedPosts />
			<br />
			<FormFindUser nickname={nickname} onUserChange={handlerUserChange} />
			<br />
			{user ? (<FormUserInfo userData={user} />) : (<p>해당 유저가 존재하지 않습니다.</p>) }
		</Container>
	)
}




function FormFindUser({ onUserChange, nickname }: FormFindUserProps) {
	const accessToken = localStorage.getItem('accessToken');
	const refreshToken = localStorage.getItem('refreshToken');
	const nicknameInputRef = useRef<HTMLInputElement | null>(null);

	const [user, setUser] = useState<UserDto>();
	const navigate = useNavigate();

	const find = async () => {
		navigate( `/admin/${nickname}` );
		window.location.reload();
	}

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		find();
	  };

	  useEffect(() => {
		// Set focus when the component mounts
		if (nicknameInputRef.current) {
		  nicknameInputRef.current.focus();
		}
	  }, []); // Empty dependency array ensures this effect runs only once on mount
	
	
	return (
		<Container>
			<Form>
				<Row>
					<Col>
						<Form.Label>User Nickname</Form.Label>
					</Col>
					<Col>
						<Form.Control ref={nicknameInputRef} type="text" placeholder="Enter User Nickname" onChange={(e) => nickname=e.target.value} defaultValue={nickname} />
					</Col>
					<Col>
						<Button variant="primary" type="submit" onClick={find} >Find</Button>
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
						<Form.Control type="email" placeholder="Email" value={userData.email} />
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
						<Form.Control value={userData.ranking} />
					</Form.Group>

					<Form.Group as={Col} controlId="formGridBlockDate">
						<Form.Label>Block Date</Form.Label>
						<br />
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

export default UserInfo;
