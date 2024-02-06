import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { ChatRoomDto } from '../../dto/ChatRoomDto';
import { useParams } from 'react-router-dom';
//import { io, Socket } from 'socket.io-client';
import { UserDto } from '../../dto/UserDto';
import ChatMessages from './ChatMessages';

const ChatRoom: React.FC = () => {
  const [chatRooms, setChatRooms] = useState<ChatRoomDto[]>([]);
  const [selectedChatRoomId, setSelectedChatRoomId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const { userId = '' } = useParams<{ userId?: string }>();
  const [user, setUser] = useState<UserDto | null>(null);

  // 저장된 토큰 가져오기
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');

  // 유저 검증
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // 서버의 유저 정보 가져오기 엔드포인트 URL
        const fetchUserUrl = `https://spartagameclub.shop/api/users/profile`;

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

  useEffect(() => {
    getChatRooms();
  }, []);

  const getChatRooms = async () => {
    try {
      const response = await axios.get(`https://spartagameclub.shop/api/chat/list`, {
        headers: {
          access: accessToken, // 액세스 토큰을 Authorization 헤더에 추가
          refresh: refreshToken, // 리프레시 토큰을 사용하는 경우, 필요한 경우에만 추가
        },
      });

      setChatRooms(response.data.data);
    } catch (error) {
      console.error('채팅방 목록을 불러오는 데 실패했습니다.', error);
    }
  };

  const handleEnterChatRoom = (chatRoomId: number) => {
    // Set the selected chat room ID
    setSelectedChatRoomId(chatRoomId);
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', height: '100vh' }}>
      <div style={{ display: 'flex', flexDirection: 'column', maxWidth: '800px', width: '100%' }}>
        {selectedChatRoomId !== null && <ChatMessages chatRoomId={selectedChatRoomId} />}
        {chatRooms.length > 0 && selectedChatRoomId === null && (
          <div>
            <h2 style={{ color: '#3498db', textAlign: 'center', fontWeight: 'bold' }}>채팅방</h2>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {chatRooms.map((chatRoom) => (
                <li key={chatRoom.id} style={{ borderBottom: '1px solid #ecf0f1', padding: '10px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <p style={{ margin: 0, color: '#2c3e50' }}>{chatRoom.chatName}</p>
                    <button onClick={() => handleEnterChatRoom(chatRoom.id)} style={{ background: '#3498db', color: '#fff', padding: '5px 10px', border: 'none', cursor: 'pointer' }}>
                      Enter
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoom;
