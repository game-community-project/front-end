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
        const response = await axios.get(`http://51.21.48.160:8080/api/users/${userId}`);
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

      const response = await axios.get(`http://51.21.48.160:8080/api/users/${userId}/guestbooks?page=${page}&size=10&sortBy=createdAt&isAsc=true`);
 
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

    const response = await axios.post(`http://51.21.48.160:8080/api/users/${userId}/guestbooks`, { content: newComment },
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
      const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    if (!accessToken) {
      console.error('액세스 토큰이 없습니다.');
      return;
    }

      if (commentId == null) {
        console.error('유효하지 않은 commentId:', commentId);
        return;
      }

      const response = await axios.patch(`http://51.21.48.160:8080/api/users/${userId}/guestbooks/${commentId}`, { content: updateContent },
      {
        headers: {
          'Access': `${accessToken}`,
          'Refresh': `${refreshToken}`,
        },
      });
      
      await getComments(userId, page);


    } catch (error) {
      console.error('error:', error);
    }
  };
  
  const deleteComment = async (userId: string, commentId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
  
      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        return;
      }

      if (commentId == null) {
        console.error('유효하지 않은 commentId:', commentId);
        return;}
      await axios.delete(`http://51.21.48.160:8080/api/users/${userId}/guestbooks/${commentId}`,
      {
        headers: {
          'Access': `${accessToken}`,
          'Refresh': `${refreshToken}`,
        },
      });
      
      setComments((prevComments) => prevComments.filter((comment) => comment.id !== commentId));
    } catch (error) {
      console.error('error:', error);
    }
  };

  return (
    <div className="box">
      {error && <div className="error">{error}</div>}
      <div className="title">
        <p>
          <strong style={{ fontSize: '1.2rem' }}>
            🚨 부적절한 내용은 신고의 대상이 될 수 있습니다.
          </strong>
        </p>
      </div>
      <div className="comment-section">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="방명록을 작성해주세요."
        />
       
          <button className="create"
          style={{marginBottom:'30px'}}
          onClick={createComment}>작성하기</button>
        
      </div>

      {comments &&
        comments.map((comment) => (
          <div key={comment.id} className="comment">
            <p>
              <strong>{comment.nickname}</strong> | {comment.content} ({comment.createdAt})
            </p>
            <div className="actions">
              <button
                onClick={() => {
                  const updatedContent = prompt('수정할 내용을 입력하세요.', comment.content) || '';
                  modifyComment(userId, comment.id, updatedContent);
                }}
              >
                수정
              </button>
              <button style={{ marginLeft: '5px' }}
              onClick={() => deleteComment(userId, comment.id)}>삭제</button>
            </div>
          </div>
        ))}

      <div className="pagination">
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