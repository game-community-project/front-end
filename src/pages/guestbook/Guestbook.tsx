// Guestbook.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GuestBookDto } from '../../dto/UserDto';
import './Guestbook.css';

interface GuestbookProps {
  userId: number;
  isLoggedIn: boolean; // 로그인 여부를 받아오는 prop 추가
}

const Guestbook: React.FC<GuestbookProps> = ({ userId, isLoggedIn }) => {
  const [comments, setComments] = useState<GuestBookDto[]>([]);
  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchComments();
  }, [page, userId]);

const fetchComments = async () => {
  try {
    const response = await axios.get(`http://localhost:8080/api/users/${userId}/guestbooks?page=${page}&size=10&sortBy=createdAt&isAsc=true`);
    if (response.data && Array.isArray(response.data.data)) {
      setComments(response.data.data);
      setTotalPages(response.data.totalPages);
    } else {
      // 오류 처리
      console.error('데이터 형식이 이상합니다', response.data);
    }
  } catch (error) {
    console.error('error:', error);
  }
}

  const createComment = async () => {
    try {
      if (!isLoggedIn) {
        setError('로그인이 필요합니다.'); // 로그인이 안 된 경우 에러 처리
        return;
      }
      const response = await axios.post(`http://localhost:8080/api/users/${userId}/guestbooks`, { content: newComment });
      setComments([...comments, response.data]);
      setNewComment('');
    } catch (error) {
      console.error('error:', error);
    }
  };

  const modifyComment = async (guestbookId: number, updateContent: string) => {
    try {
      const response = await axios.patch(`http://localhost:8080/api/users/${userId}/guestbooks/${guestbookId}`, { content: updateContent });
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
      await axios.delete(`http://localhost:8080/api/users/${userId}/guestbooks/${guestbookId}`);
      setComments((prevGuestbooks) => prevGuestbooks.filter((guestbook) => guestbook.id !== guestbookId));
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <div>
        {error && <div className="error">{error}</div>}
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