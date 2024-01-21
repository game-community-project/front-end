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

  const { userId = '' } = useParams<{ userId?: string }>();

  //유저 검증 
  useEffect(() => {
    const getUser = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/users/${userId}`);
        setComments(response.data.guestBookList || []);
      } catch (error) {
        console.error('사용자 정보를 가져오는 데 실패했습니다.', error);
      }
    };

    // userId 존재하면 사용자 정보를 가져옴
    if (userId && isLoggedIn()) {
      getUser();
    }
  }, [userId]);

  const isLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return !!accessToken && !!refreshToken;
  };

  useEffect(() => {
    if (userId) {
      createComment();
      getComments(userId , page);
    } else {
      console.error('로그인한 유저만 작성이 가능합니다.', error);
    }
  }, [page, userId ]);


  const getComments = async (userId: string, page: number) => {
    try {

      const response = await axios.get(`http://localhost:8080/api/users/${userId}/guestbooks?page=${page}&size=10&sortBy=createdAt&isAsc=true`);
 
        setComments(response.data.data.content);
        setTotalPages(response.data.totalPages);
      
    } catch (error) {
      console.error('error:', error);
    }
  }

const createComment = async () => {
  try {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken) {
      console.error('액세스 토큰이 없습니다.');
      return;
    }

    const response = await axios.post(`http://localhost:8080/api/users/${userId}/guestbooks`, { content: newComment },
    {
      headers: {
        'Access': `${accessToken}`,
        'Refresh': `${refreshToken}`,
      },
    }
  );
  
    await getComments(userId, page);
    setNewComment('');
  } catch (error) {
    console.error('댓글 작성 중 오류 발생:', error);
    }
  }

  const modifyComment = async (userId: string, commentId: number, updateContent: string) => {
    try {
      if (commentId == null) {
        console.error('유효하지 않은 commentId:', commentId);
        return;}
      const response = await axios.patch(`http://localhost:8080/api/users/${userId}/guestbooks/${commentId}`, { content: updateContent });
      setComments((prevComments) =>
        prevComments.map((comment) =>
          comment.id === commentId ? { ...comment, content: response.data.content } : comment
        )
      );
    } catch (error) {
      console.error('error:', error);
    }
  };
  
  const deleteComment = async (userId: string, commentId: number) => {
    try {
      if (commentId == null) {
        console.error('유효하지 않은 commentId:', commentId);
        return;}
      await axios.delete(`http://localhost:8080/api/users/${userId}/guestbooks/${commentId}`);
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
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

      {comments && comments.map((comment) => (
        <div key={comment.id}>
          <p>
            <strong>{comment.nickname}</strong> | {comment.content} ({comment.createdAt})
          </p>
          <button
            onClick={() => {
              const updatedContent = prompt('수정할 내용을 입력하세요.', comment.content) || '';
              modifyComment(userId, comment.id, updatedContent);
            }}
          >
            수정
          </button>
          <button onClick={() => deleteComment(userId, comment.id)}>삭제</button>
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