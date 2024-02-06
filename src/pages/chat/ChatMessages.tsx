// ChatMessages.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ChatMessageDto } from '../../dto/ChatMessageDto';
import { UserDto } from '../../dto/UserDto';

interface ChatMessagesProps {
  chatRoomId: number;
}

const ChatMessages: React.FC<ChatMessagesProps> = ({ chatRoomId }) => {
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [messageInput, setMessageInput] = useState('');
  const { userId = '' } = useParams<{ userId?: string }>();
  const accessToken = localStorage.getItem('accessToken');
  const refreshToken = localStorage.getItem('refreshToken');
  const [user, setUser] = useState<UserDto | null>(null); // UserDto 형태로 유저 정보를 저장

  useEffect(() => {
  const fetchUserData = async () => {
    try {
      const fetchUserUrl = `https://spartagameclub.shop/api/users/profile`;

      const response = await axios.get(fetchUserUrl, {
        headers: {
          access: accessToken,
          refresh: refreshToken,
        },
      });

      setUser(response.data.data);
    } catch (error) {
      console.error('에러 발생:', error);
    }
  };
  fetchUserData();
  }, []); // useEffect의 두 번째 매개변수가 빈 배열인 경우 컴포넌트가 마운트될 때 한 번만 실행

  const getChatMessages = async () => {
    try {
      const response = await axios.get(`https://spartagameclub.shop/api/chat/${chatRoomId}/messages`, {
        headers: {
          access: accessToken,
          refresh: refreshToken,
        },
      });

      setMessages(response.data.data);
    } catch (error) {
      console.error(`채팅방(${chatRoomId})의 메세지를 불러오는 데 실패했습니다.`, error);
    }
  };

  const sendMessage = async () => {
    try {
      await axios.post(`https://spartagameclub.shop/api/chat/saveChat/${chatRoomId}`, {
        chatContent: messageInput,
      }, {
        headers: {
          access: accessToken,
          refresh: refreshToken,
        },
      });

      setMessageInput('');
      // 메시지를 전송한 후에 즉시 메시지를 조회
      getChatMessages();
    } catch (error) {
      console.error(`메세지 전송에 실패했습니다.`, error);
    }
  };

  useEffect(() => {
    // 초기 로딩 시 메시지 가져오기
    getChatMessages();

    // 일정 간격으로 메시지를 주기적으로 조회 (예: 5초마다)
    const intervalId = setInterval(() => {
      getChatMessages();
    }, 5000); // 5초 간격, 필요에 따라 조절

    return () => clearInterval(intervalId); // 컴포넌트 언마운트 시 clearInterval
  }, [chatRoomId, accessToken, refreshToken]);

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '60px' }}>
      <ul className="chat-list" style={{ listStyle: 'none', padding: 0, textAlign: 'center', width: '80%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        {messages.map((message) => (
          <li key={message.id} style={{ marginBottom: '10px', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: message.nickname === user?.nickname ? 'flex-end' : 'flex-start',
                marginLeft: '8px',  // 왼쪽에 8px 마진 추가
                marginRight: '8px', // 오른쪽에 8px 마진 추가
              }}
            >
              <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#3498db' }}>{message.nickname}</p>
              <p style={{ fontSize: '12px', color: '#555' }}>{message.createdAt}</p>
              <p style={{ color: '#333', backgroundColor: message.nickname === user?.nickname ? '#f2f2f2' : '#e0f7fa', padding: '10px', borderRadius: '8px' }}>{message.chatContent}</p>
            </div>
          </li>
        ))}
      </ul>
  
      <div className="message-input" style={{ display: 'flex', alignItems: 'center', marginTop: '20px' }}>
        <input
          type="text"
          value={messageInput}
          onChange={(e) => setMessageInput(e.target.value)}
          style={{ padding: '8px', marginRight: '10px', borderRadius: '5px', border: '1px solid #ccc', width: '300px' }}
        />
        <button
          onClick={sendMessage}
          style={{
            padding: '8px 15px',
            backgroundColor: '#3498db',
            color: '#fff',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
          }}
        >
          전송
        </button>
      </div>
    </div>
  );
};

export default ChatMessages;
