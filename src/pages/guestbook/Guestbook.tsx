// Guestbook.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GuestBookDto } from '../../dto/UserDto';
import './Guestbook.css';

interface GuestbookProps {
    toUserId: number;
  }

  const Guestbook: React.FC<GuestbookProps> = ({ toUserId }) => {
    const [comments, setComments] = useState<GuestBookDto[]>([]);
    const [newComment, setNewComment] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
  
    useEffect(() => {
      fetchComments();
        }, [page, toUserId]);

      const fetchComments = async () => {
        try {
          const response = await axios.get(`http://localhost:8080/api/users/${toUserId}/guestbooks?page=${page}&size=10&sortBy=createdAt&isAsc=true`);
          setComments(response.data);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('error:', error);
        } 
      }
      
    const createComment = async () => {
      try {
        const response = await axios.post(`http://localhost:8080/api/users/${toUserId}/guestbooks`, { content: newComment });
        setComments([...comments, response.data]);
        setNewComment('');
      } catch (error) {
        console.error('error:', error);
      }
    };
  
    const modifyComment = async (guestbookId: number, updateContent: string) => {
      try {
        const response = await axios.patch(`http://localhost:8080/api/users/${toUserId}/guestbooks/${guestbookId}`, { content: updateContent });
        setComments((prevComments) =>
        prevComments.map((guestbook) =>
          guestbook.id === guestbookId ? { ...guestbook, content: response.data.content } : guestbook
          )
        );
      } catch (error) {
        console.error('error:', error);
      }
    };
  
    const deleteComment = async (guestbookId: number) => {
      try {
        await axios.delete(`http://localhost:8080/api/users/${toUserId}/guestbooks/${guestbookId}`);
        setComments((prevGuestbooks) => prevGuestbooks.filter((guestbook) => guestbook.id !== guestbookId));
      } catch (error) {
        console.error('error:', error);
      }
    };
  
    return (
      <div>
        <div className="title">
        <h4>🔅방명록🔅</h4>
        </div>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="방명록을 작성해주세요."
        />
        <button onClick={createComment}>작성하기</button>
  
        {comments.map((comment) => (
          <div key={comment.id}>
            <p>
              <strong>{comment.nickname}</strong> | {comment.content} ({comment.createdAt})
            </p>
            <button onClick={() => { 
                 const updatedContent = prompt('수정할 내용을 입력하세요.', comment.content) || ''; 
                 modifyComment(comment.id, updatedContent);
                 }}>
              Edit
            </button>
            <button onClick={() => deleteComment(comment.id)}>Delete</button>
          </div>
        ))}

        <div>
        {Array.from({ length: totalPages }, (_, index) => (
          <button key={index + 1} onClick={() => setPage(index + 1)}>
            {index + 1}
          </button>
        ))}
      </div>

      </div>
    );
  };
  
  export default Guestbook;