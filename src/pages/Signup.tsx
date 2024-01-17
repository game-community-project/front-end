import { createBrowserHistory } from "@remix-run/router";
import React, { useState } from "react";
import { Form, FormCheck, FormControl, InputGroup, Col, Row, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const history = createBrowserHistory();

function Signup() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    nickname: "",
    password: "",
    checkPassword: "",
    isAdmin: false,
    adminToken: "",
    authNumber: ""
  });

  const handleChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleAdminCheck = () => {
    setIsAdmin(!isAdmin);
  };

  // 확인버튼을 눌러서 회원가입이 되면 로그인 페이지로 이동
  const Confirm = async () => {
    try {
        const { authNumber, ...formDataWithoutAuthNumber } = formData;
        console.log("formData: formData", formData);
      const response = await fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formDataWithoutAuthNumber),
      });

      const responseBody = await response.json();
      console.log(responseBody);

      if (response.ok) {
        console.log("회원가입 성공!");
        alert('회원가입 성공');
        history.push('/'); 
      } else {
        console.error("회원가입 실패");
      }
    } catch (error) {
      console.error("오류 발생", error);
    }
  };

  // 회원가입 취소
  const Cancel = () => {
    console.log("취소되었습니다!");
    history.push('/');
  };

  // 이메일 발송
  const EmailVerification = async () => {
    try {
      const response = await fetch("http://localhost:8080/api/users/signup/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });

      if (response.ok) {
        console.log("이메일 인증번호 전송 성공!");
        alert('메일이 발송되었습니다.');
      } else {
        console.error("이메일 인증번호 전송 실패");
      }
    } catch (error) {
      console.error("오류 발생", error);
    }
  };    

  // 이메일 인증
  const EmailAuthCheck = async () => {
    try {
      console.log("EmailAuthCheck: formData", formData);
      const response = await fetch("http://localhost:8080/api/users/signup/emailauthcheck", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email,
          authNum: formData.authNumber,
        }),
      });

        const responseBody = await response.json();
        console.log(responseBody);

      if (response.ok) {
        console.log("이메일 인증 성공!");
        alert('이메일이 인증되었습니다.')
      } else {
        console.error("이메일 인증 실패");
        alert('이메일이 인증 실패했습니다. 다시 시도해주세요.')
      }
    } catch (error) {
      console.error("오류 발생", error);
    }
  };

  return (
    <Row className="justify-content-center">
      <Col sm={4}>
        <h2 className="text-center mb-4">회원가입</h2>
        <Form>
          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>이메일</Form.Label>
            <Col sm={8}>
              <InputGroup>
                <Form.Control type="text" name="email" placeholder="이메일을 입력해주세요." onChange={handleChange}/>
                <Button variant="secondary" onClick={EmailVerification}>
                  인증
                </Button>
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>인증번호</Form.Label>
            <Col sm={8}>
            <InputGroup>
                <Form.Control type="text" name="authNumber" placeholder="이메일 인증번호를 입력해주세요." onChange={handleChange} />
                <Button variant="secondary" onClick={EmailAuthCheck}>
                  확인
                </Button>
              </InputGroup>
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>닉네임</Form.Label>
            <Col sm={8}>
              <Form.Control type="text" name="nickname" placeholder="닉네임을 입력해주세요, 4~10글자" onChange={handleChange} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>비밀번호</Form.Label>
            <Col sm={8}>
              <Form.Control type="password" name="password" placeholder="비밀번호를 입력해주세요, 4~16글자" onChange={handleChange} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Form.Label column sm={3}>비밀번호 확인</Form.Label>
            <Col sm={8}>
              <Form.Control type="password" name="checkPassword" placeholder="위의 비밀번호와 같은 값을 입력해주세요." onChange={handleChange} />
            </Col>
          </Form.Group>

          <Form.Group as={Row} className="mb-3">
            <Col sm={{ offset: 4, span: 8 }}>
              <FormCheck
                type="checkbox"
                id="isAdmin"
                label="관리자"
                name="isAdmin"
                checked={isAdmin}
                onChange={handleAdminCheck}
              />
            </Col>
          </Form.Group>

          {isAdmin && (
            <Form.Group as={Row} className="mb-3">
              <Form.Label column sm={3}>관리자 번호</Form.Label>
              <Col sm={8}>
                <InputGroup>
                  <FormControl
                    type="text"
                    name="adminToken"
                    placeholder="관리자 토큰번호를 입력해주세요."
                  />
                </InputGroup>
              </Col>
            </Form.Group>
          )}

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
        </Form>
      </Col>
    </Row>
  );
}

export default Signup;
