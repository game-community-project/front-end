import React, { useEffect } from 'react';

const Logout = () => {
  useEffect(() => {
    const handleLogout = async () => {
      try {
        const accessToken = localStorage.getItem('accessToken');

        // 토큰이 만료되었는지 확인
        const isTokenExpired = isExpired(accessToken);

        if (isTokenExpired) {
          // 토큰이 만료된 경우, 로그인 페이지로 리다이렉트 또는 필요한 처리 수행
          window.location.replace('/login');
          return;
        }

        // 만료되지 않은 토큰이라면 로그아웃 요청 수행
        const response = await fetch('http://localhost:8080/api/users/logout', {
          method: 'DELETE',
          headers: {
            'Access': `${accessToken}`,
          },
        });

        if (response.ok) {
          // 토큰을 로컬 저장소에서 삭제
          localStorage.removeItem('accessToken');

          // 로그아웃이 성공하면 리다이렉트 또는 다른 작업 수행
          window.location.replace('/');
        } else {
          // 로그아웃 실패 시에 대한 처리
          console.error('로그아웃 실패');
        }
      } catch (error) {
        // 예외 처리
        console.error('로그아웃 요청 중 오류 발생', error);
      }
    };

    // 컴포넌트가 마운트되면 로그아웃 요청 수행
    handleLogout();
  }, []);

  // 토큰 만료 여부를 확인하는 함수
  const isExpired = (token: string | null) => {
    if (!token) {
      // 토큰이 존재하지 않으면 만료된 것으로 간주
      return true;
    }
  
    try {
      // 토큰을 디코딩하여 페이로드를 얻음
      const payload = JSON.parse(atob(token.split('.')[1]));
  
      // 만료 시간(exp)이 현재 시간보다 이전인지 확인
      const currentTimestamp = Math.floor(Date.now() / 1000); // 초 단위로 변환
      return payload.exp < currentTimestamp;
    } catch (error) {
      console.error('토큰 페이로드 디코딩 또는 파싱 중 오류 발생', error);
      return true; // 디코딩 또는 파싱 오류를 만료된 토큰으로 처리
    }
  };

  return (
    <div>
      <p>로그아웃 중...</p>
    </div>
  );
};

export default Logout;
