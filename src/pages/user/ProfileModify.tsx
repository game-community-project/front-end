// User.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserDto } from '../../dto/UserDto';
import { Button, Card, Col, Container, Form, Row } from 'react-bootstrap';
import { access } from 'fs';
import { useNavigate } from 'react-router-dom';


const ProfileModify: React.FC = () => {
  const [user, setUser] = useState<UserDto | null>(null);
  const [profile_url, setProfileURL] = useState<string>('');
  const [introduction, setIntroduction] = useState<string>('');
  const [nowPassword, setNowPassword] = useState<string>('');
  const [newPassword, setNewPassword] = useState<string>('');
  const [checkPassword, setCheckPassword] = useState<string>('');

  const navigate = useNavigate();

  // 저장된 토큰 가져오기
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 서버의 유저 정보 가져오기 엔드포인트 URL
        const fetchUserUrl = 'http://localhost:8080/api/users/profile';

        // Axios를 사용하여 GET 요청 보내기
        const response = await axios.get(fetchUserUrl, {
          headers: {
            access: accessToken, // 액세스 토큰을 Authorization 헤더에 추가
            refresh: refreshToken, // 리프레시 토큰을 사용하는 경우, 필요한 경우에만 추가
          },
        });

        // 서버에서 받은 유저 정보를 상태에 저장
        setUser(response.data.data);
      } catch (error) {
        // 네트워크 오류 또는 다른 예외 처리
        console.error('에러 발생:', error);
      }
    };

    fetchUserData();
    if( user !== null ){
      setIntroduction(user.introduction)
      setProfileURL(user.profile_url)
    }
  }, []); // useEffect의 두 번째 매개변수가 빈 배열인 경우 컴포넌트가 마운트될 때 한 번만 실행

  const handleRegistration = async () => {
    try {
      // profile url과 introduction을 묶어서 POST 요청 보내기
      const userPayload = { introduction, profile_url };
      const userResponse = await axios.patch('http://localhost:8080/api/users/profile', userPayload, {
        headers: { access: accessToken, refresh: refreshToken, },
      }
      );
      console.log('User Update Response:', userResponse.data);


      if (nowPassword !== '' || newPassword !== '' || checkPassword !== '') {
        if (nowPassword !== '' && newPassword !== '' && checkPassword !== '') {
          // password와 checkPassword를 묶어서 따로 POST 요청 보내기
          const passwordPayload = { nowPassword, newPassword, checkPassword };
          const passwordResponse = await axios.put('http://localhost:8080/api/users/password', passwordPayload, {
            headers: { access: accessToken, refresh: refreshToken, },
          }
          );

          console.log('Password Update Response:', passwordResponse.data);
        }
        else {
          alert('비밀번호는 공란일 수 없습니다.')
          return;
        }
      }

      // 필요한 추가 작업 수행 (예: 리다이렉션, 상태 업데이트 등)
      navigate('/');
    } catch (error) {
      // 네트워크 오류 또는 다른 예외 처리
      console.log(error)
      alert('프로필 수정')
    }
  };

  const rowStyle = { marginBottom: '20px' };
  return (
    <Container>
      <h1>Profile Modify</h1>
      {user ? (
        <Card>
          <Card.Body>
          <Row style={rowStyle}>
              <Form.Group as={Col} controlId="formGridProfileImage">
                <img
                  src={user.profile_url} // 사용자의 profile_url을 이미지 소스로 사용
                  alt="Profile"
                  style={{ maxWidth: '100%', maxHeight: '200px' }} // 이미지의 최대 크기 설정 (옵션)
                />
              </Form.Group>
            </Row>
            <Row style={rowStyle}>
              <Form.Group as={Col} controlId="formGridProfileUrl">
                <Form.Label>Profile URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder='Enter New Profile URL'
                  onChange={(e) => setProfileURL(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row style={rowStyle}>
              <Form.Group as={Col} controlId="formGridNickname">
                <Form.Label>Nickname</Form.Label>
                <Form.Control type="text" placeholder={user.nickname} readOnly/>
              </Form.Group>
              <Form.Group as={Col} controlId="formGridNowPassword">
                <Form.Label>Now Password</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Now Password"
                  onChange={(e) => setNowPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridNewPassword">
                <Form.Label>New Password</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter New Password"
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </Form.Group>
              <Form.Group as={Col} controlId="formGridPasswordCheck">
                <Form.Label>Check Password</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Enter Check New Password"
                  onChange={(e) => setCheckPassword(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row style={rowStyle}>
              <Form.Group as={Col} controlId="formGridIntroduction">
                <Form.Label>Introduction</Form.Label>
                <Form.Control
                  type="text"
                  placeholder='Enter New Introduction'
                  onChange={(e) => setIntroduction(e.target.value)}
                />
              </Form.Group>
            </Row>
            <Row >
              <Form.Group as={Col} className="d-flex justify-content-end">
                <Button variant="warning" onClick={handleRegistration}>등록</Button>
              </Form.Group>
            </Row>
          </Card.Body>
        </Card>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
};

export default ProfileModify;
