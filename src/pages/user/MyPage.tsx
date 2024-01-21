// User.tsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { UserDto } from '../../dto/UserDto';
import { Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';



const MyPage: React.FC = () => {
  const [user, setUser] = useState<UserDto | null>(null);
  const navigate = useNavigate();

  const handleGoToGuestbook  = () => {
    navigate("/guestbook")
  }

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 서버의 유저 정보 가져오기 엔드포인트 URL
        const fetchUserUrl = `http://51.21.48.160:8080/api/users/profile`;

        // 저장된 토큰 가져오기
        const accessToken = localStorage.getItem('accessToken');
        const refreshToken = localStorage.getItem('refreshToken');

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
  }, []); // useEffect의 두 번째 매개변수가 빈 배열인 경우 컴포넌트가 마운트될 때 한 번만 실행


  const goToProfileModify = () => {
    navigate("/profile_modify")
  }

  return (
    <div>
      <h1>My Page</h1>
      {user ? (
        <>
          <div>
            <strong>Nickname:</strong> {user.nickname}
          </div>
          <div>
            <strong>Introduction:</strong> {user.introduction}
          </div>
          <div>
            <strong>Profile URL:</strong> {user.profile_url}
          </div>
          <div>
            <strong>Guest Book:</strong>
            {user.guestBookList && user.guestBookList.length > 0 ? (
              user.guestBookList.map((guestBook) => (
                <div key={guestBook.id}>
                  <p>
                    <strong>Nickname:</strong> {guestBook.nickname}
                  </p>
                  <p>
                    <strong>Content:</strong> {guestBook.content}
                  </p>
                  <p>
                    <strong>Created At:</strong> {guestBook.createdAt}
                  </p>
                </div>
              ))
            ) : (
              <p>No guest book entries.</p>
            )}
          </div>
        </>
      ) : (
        <p>Loading...</p>
      )}
    <Button variant="warning" onClick={goToProfileModify}>수정</Button>
    <button onClick={handleGoToGuestbook}>방명록</button>
    </div>
  );
};

export default MyPage;
