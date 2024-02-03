import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

interface Props {
  postId: string; // 부모 게시물의 ID
}

const AddCommentForm: React.FC<Props> = ({ postId }) => {
  const [commentContent, setCommentContent] = useState<string>('');
  const navigate = useNavigate();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const commentRequestDto = {
      content: commentContent,
      parentId: 0,
      accept: false
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요');
        navigate('/login');
        return;
      }

      const response = await fetch(`https://spartagameclub.shop/api/posts/${postId}/comments`, {
        method: 'POST',
        body: JSON.stringify(commentRequestDto),
        headers: {
          'Content-Type': 'application/json',
          'Access': accessToken,
          'Refresh': refreshToken,
        },
      });

      if (response.ok) {
        console.log('댓글 작성 성공');
        alert('댓글 작성 성공');
        // 작성한 댓글이 표시된 페이지로 이동
        window.location.reload();
      } else {
        console.error('댓글 작성 실패');
        alert('댓글 작성 실패');
      }
    } catch (error) {
      console.error('네트워크 에러', error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
      <Form onSubmit={handleSubmit}>
        <Form.Group controlId="commentContent">
          <Form.Label>댓글 내용</Form.Label>
          <Form.Control
              as="textarea"
              rows={3}
              value={commentContent}
              onChange={(e) => setCommentContent(e.target.value)}
              placeholder="댓글을 작성해 주세요."
          />
        </Form.Group>
        <Button variant="primary" type="submit">
          댓글 작성
        </Button>
        <Button variant="secondary" onClick={handleCancel}>
          취소
        </Button>
      </Form>
  );
};

export default AddCommentForm;
