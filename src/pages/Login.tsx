import axios from 'axios';
import React, { useState } from 'react';
import { Form, FormControl, InputGroup, Col, Row, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

// Import createBrowserHistory from '@remix-run/router' is not used in this component

function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // 확인 버튼: 로그인
  const Confirm = async () => {
    try {
      console.log('formData:', formData);

      const response = await fetch(`http://localhost:8080/api/users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
        }),
      });

      console.log(response);

      if (response.ok) {
        const refresh = response.headers.get('refresh');
        const access = response.headers.get('access');
        localStorage.setItem('accessToken', access ? access : '');
        localStorage.setItem('refreshToken', refresh ? refresh : '');

        console.log(await response.json()); // Logging the JSON response

        console.log('로그인 성공');
        navigate('/');
      } else {
        console.error('로그인 실패');
        alert('로그인 실패, 다시 시도해주세요.');
      }
    } catch (error) {
      console.error('로그인 중 오류 발생:', error);
    }
  };

  // 취소 버튼 : 돌아가기
  const Cancel = () => {
    console.log('취소하기');
    navigate('/');
  };

  // 카카오로그인
  const handleKakaoLogin = async () => {
    // Kakao OAuth 인증 페이지로 리다이렉트
    window.location.href = `https://kauth.kakao.com/oauth/authorize?client_id=${process.env.REACT_APP_KAKAO_API_KEY}&redirect_uri=${process.env.REACT_APP_API_BASE_URL}&response_type=code`;
  };

  return (
    <Row className="justify-content-center">
      <Col sm={4}>
        <h2 className="text-center mb-4">로그인</h2>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              이메일
            </Form.Label>
            <Col sm={8}>
              <InputGroup>
                <FormControl type="text" name="email" placeholder="이메일을 입력해주세요." onChange={handleChange} />
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>
              비밀번호
            </Form.Label>
            <Col sm={8}>
              <InputGroup>
                <FormControl type="password" name="password" placeholder="비밀번호를 입력해주세요." onChange={handleChange} />
              </InputGroup>
            </Col>
          </Form.Group>

          <Row className="mb-3 justify-content-center">
            <Col sm={{ span: 4 }}>
              <Button variant="primary" className="me-2" onClick={Confirm}>
                확인
              </Button>
              <Button variant="secondary" onClick={Cancel}>
                취소
              </Button>
            </Col>
          </Row>
          <Row className="mb-3 justify-content-center">
            <Col sm={{ span: 4 }}>
              <Button variant="warning" onClick={handleKakaoLogin}>
                카카오 로그인
              </Button>
            </Col>
          </Row>
        </Form>
      </Col>
    </Row>
  );
}

export default Login;
