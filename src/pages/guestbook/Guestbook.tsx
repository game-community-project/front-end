// Guestbook.tsx

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { GuestBookDto } from '../../dto/UserDto';
import { useParams } from 'react-router-dom';
import './Guestbook.css';

const Guestbook: React.FC = () => {
  const [comments, setComments] = useState<GuestBookDto[]>([]);
  const [newComment, setNewComment] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [error, setError] = useState('');

  const { userId } = useParams();

  //유저 검증 
  useEffect(() => {
    const getUserData = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setComments(response.data.guestBookList);
      } catch (error) {
        console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
      }
    };

    // userId 존재하면 사용자 정보를 가져옴
    if (userId) {
      getUserData();
    }
  }, [userId]);


  useEffect(() => {
    if (userId  && isLoggedIn()) {
      getComments(userId , page);
      createComment();
    } else {
      console.error('로그인한 유저만 작성이 가능합니다.', error);
    }
  }, [page, userId ]);

  const isLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return !!accessToken && !!refreshToken;
  };

  const getComments = async (userId: string, page: number) => {
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
            수정
          </button>
          <button onClick={() => deleteComment(comment.id)}>삭제</button>
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