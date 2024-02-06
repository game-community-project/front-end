import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { ChatMessageDto } from '../../dto/ChatMessageDto';
import axios from 'axios';

const Chat = () => {
  const { userId = '' } = useParams<{ userId?: string }>();
  const [chatRoomId, setChatRoomId] = useState<number | null>(null);
  const [chatMessages, setMessages] = useState<ChatMessageDto[]>([]);
  const [accessToken, setAccessToken] = useState<string | null>(localStorage.getItem('accessToken'));
  const [refreshToken, setRefreshToken] = useState<string | null>(localStorage.getItem('refreshToken'));
  const [messageInput, setMessageInput] = useState<string>('');

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

  useEffect(() => {
    const createRoom = async () => {
      try {
        const response = await axios.post(
          `https://spartagameclub.shop/api/chat/createRoom/${userId}`,
          {},
          {
            headers: {
                access: accessToken,
                refresh: refreshToken,
            },
          }
        );
        setChatRoomId(response.data.data);
      } catch (error) {
        console.error('Error creating or getting chat room:', error);
      }
    };

    createRoom();
  }, [userId, accessToken]);

  useEffect(() => {
    if (chatRoomId) {
      getChatMessages(); // Call getChatMessages here
    }
  }, [chatRoomId, accessToken]);

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

  return (
    <div className="chat-container" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', paddingBottom: '60px' }}>
     <ul className="chat-list" style={{ listStyle: 'none', padding: 0, textAlign: 'center', width: '60%', maxHeight: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        {chatMessages.map((message) => (
          <li key={message.id} style={{ marginBottom: '10px', width: '100%' }}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                marginLeft: '8px',  // 왼쪽에 8px 마진 추가
                marginRight: '8px', // 오른쪽에 8px 마진 추가
              }}
            >
              <p style={{ margin: '5px 0', fontWeight: 'bold', color: '#3498db' }}>{message.nickname}</p>
              <p style={{ fontSize: '12px', color: '#555' }}>{message.createdAt}</p>
              <p style={{ color: '#333', backgroundColor:'#f2f2f2', padding: '10px', borderRadius: '8px' }}>{message.chatContent}</p>
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

export default Chat;
