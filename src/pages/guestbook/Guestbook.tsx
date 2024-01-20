// Guestbook.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GuestBookDto } from '../../dto/UserDto';

interface GuestbookProps {
    toUserId: number;
  }

  const Guestbook: React.FC<GuestbookProps> = ({ toUserId }) => {
    const [guestbooks, setGuestbooks] = useState<GuestBookDto[]>([]);
    const [newGuestbook, setNewGuestbook] = useState('');
  
    useEffect(() => {
      const fetchGuestbooks = async () => {
        try {
          const response = await axios.get(`/api/users/${toUserId}/guestbooks`);
          setGuestbooks(response.data);
        } catch (error) {
          console.error('error:', error);
        }
      };
  
      fetchGuestbooks();
    }, [toUserId]);
  
    const handleAddGuestbook = async () => {
      try {
        const response = await axios.post(`/api/users/${toUserId}/guestbooks`, { content: newGuestbook });
        setGuestbooks([...guestbooks, response.data]);
        setNewGuestbook('');
      } catch (error) {
        console.error('error:', error);
      }
    };
  
    const handleUpdateGuestbook = async (guestbookId: number, updateContent: string) => {
      try {
        const response = await axios.put(`/api/users/${toUserId}/guestbooks/${guestbookId}`, { content: updateContent });
        setGuestbooks((prevGuestbooks) =>
          prevGuestbooks.map((guestbook) =>
          guestbook.id === guestbookId ? { ...guestbook, content: response.data.content } : guestbook
          )
        );
      } catch (error) {
        console.error('error:', error);
      }
    };
  
    const handleDeleteGuestbook = async (guestbookId: number) => {
      try {
        await axios.delete(`/api/users/${toUserId}/guestbooks/${guestbookId}`);
        setGuestbooks((prevGuestbooks) => prevGuestbooks.filter((guestbook) => guestbook.id !== guestbookId));
      } catch (error) {
        console.error('error:', error);
      }
    };
  
    return (
      <div>
        <h4>방명록</h4>
        <textarea
          value={newGuestbook}
          onChange={(e) => setNewGuestbook(e.target.value)}
          placeholder="방명록을 작성해주세요."
        />
        <button onClick={handleAddGuestbook}>Add guestbook</button>
  
        {guestbooks.map((guestbook) => (
          <div key={guestbook.id}>
            <p>
              <strong>{guestbook.nickname}</strong> | {guestbook.content} ({guestbook.createdAt})
            </p>
            <button onClick={() => { 
                 const updatedContent = prompt('수정할 내용을 입력하세요.', guestbook.content) || ''; 
                 handleUpdateGuestbook(guestbook.id, updatedContent);
                 }}>
              Edit
            </button>
            <button onClick={() => handleDeleteGuestbook(guestbook.id)}>Delete</button>
          </div>
        ))}
      </div>
    );
  };
  
  export default Guestbook;