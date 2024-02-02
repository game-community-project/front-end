import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import AddCommentForm from './AddCommentForm';
import './Comment.css';
import { useNavigate } from 'react-router-dom';

interface CommentDto {
  commentId: number;
  author: string;
  createdAt: string;
  modifiedAt: string;
  content: string;
  parentAuthor: string;
}

interface Props {
  comments: CommentDto[];
  postId?: string;
}

const Comment: React.FC<Props> = ({ comments, postId }) => {
  const [isReplying, setIsReplying] = useState<{ [key: number]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});
  const [editCommentId, setEditCommentId] = useState<number | null>(null);
  const [editedCommentContent, setEditedCommentContent] = useState<string>(''); // 수정한 댓글 내용을 추적하는 상태
  const navigate = useNavigate();

  const handleReply = (commentId: number) => {
    setIsReplying({ ...isReplying, [commentId]: !isReplying[commentId] });
  };

  const handleReplyContentChange = (commentId: number, value: string) => {
    setReplyContent({ ...replyContent, [commentId]: value });
  };

  const handleSubmitReply = async (commentId: number) => {
    const content = replyContent[commentId];

    const commentRequestDto = {
      content: content,
      parentId: commentId,
      accept: false
    };

    if (!content) {
      console.error('답글 내용을 입력해주세요.');
      alert('답글 내용을 입력해주세요.');
      return;
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요.');
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

      if (!response.ok) {
        throw new Error('답글 생성에 실패했습니다.');
      }

      console.log(`댓글 ${commentId}에 대한 답글이 성공적으로 생성되었습니다.`);
      window.location.reload();

      setIsReplying({ ...isReplying, [commentId]: false });
      setReplyContent({ ...replyContent, [commentId]: '' });
    } catch (error) {
      console.error('답글 생성 오류:', error);
    }
  };

  const handleUpdate = (comment: CommentDto) => {
    setEditCommentId(comment.commentId);
    setEditedCommentContent(comment.content); // 수정할 내용을 해당 댓글의 내용으로 설정
  };

  const handleUpdateSubmit = async (commentId: number, newContent: string) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요.');
        navigate('/login');
        return;
      }

      const response = await fetch(`https://spartagameclub.shop/api/posts/${postId}/comments/${commentId}`, {
        method: 'PATCH',
        body: JSON.stringify({ content: newContent }),
        headers: {
          'Content-Type': 'application/json',
          'Access': accessToken,
          'Refresh': refreshToken,
        },
      });

      if (!response.ok) {
        throw new Error('댓글 수정에 실패했습니다.');
      }

      console.log(`댓글 ${commentId}가 성공적으로 수정되었습니다.`);
      alert("댓글이 성공적으로 수정되었습니다.");
      window.location.reload();

    } catch (error) {
      console.error('댓글 수정 오류:', error);
    }
  };

  const handleDelete = async (commentId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken || !refreshToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요');
        navigate('/login');
        return;
      }

      const response = await fetch(`https://spartagameclub.shop/api/posts/${postId}/comments/${commentId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Access': accessToken,
          'Refresh': refreshToken,
        },
      });

      if (!response.ok) {
        throw new Error('댓글 삭제에 실패했습니다.');
      }

      console.log(`댓글 ${commentId}가 성공적으로 삭제되었습니다.`);
      alert("댓글이 성공적으로 삭제되었습니다.")
      window.location.reload();

    } catch (error) {
      console.error('댓글 삭제 오류:', error);
    }
  };

  return (
      <div className="comments-container">
        {comments.map((comment) => (
            <div key={comment.commentId} className={`comment ${comment.parentAuthor ? 'child-comment' : ''}`}>
              <div>
                <strong>{comment.author}</strong> | 작성시간: {comment.createdAt} | 수정시간: {comment.modifiedAt}
                {comment.parentAuthor && <span> | 대댓글 대상: {comment.parentAuthor}</span>}
              </div>
              <div>{comment.content}</div>
              <Button className="comment-button" variant="outline-secondary" onClick={() => handleReply(comment.commentId)}>
                {isReplying[comment.commentId] ? '답글 작성 숨기기' : '답글 작성'}
              </Button>
              {isReplying[comment.commentId] && (
                  <div className="reply-comment-box">
                    <Form.Group controlId={`reply-${comment.commentId}`} className="mt-3">
                      <Form.Control
                          className={'comment-reply-textarea'}
                          as="textarea"
                          rows={3}
                          placeholder="답글을 작성해 주세요."
                          value={replyContent[comment.commentId] || ''}
                          onChange={(e) => handleReplyContentChange(comment.commentId, e.target.value)}
                      />
                      <Button variant="primary" className={'comment-reply-submit'} onClick={() => handleSubmitReply(comment.commentId)}>
                        답글 작성 완료
                      </Button>
                    </Form.Group>
                  </div>
              )}
              <div className="comment-buttons">
                <Button className="edit-button" variant="outline-info" onClick={() => handleUpdate(comment)}>
                  수정
                </Button>
                <Button className="delete-button" variant="outline-danger" onClick={() => handleDelete(comment.commentId)}>
                  삭제
                </Button>
              </div>
              {editCommentId === comment.commentId && (
                  <div className="edit-comment-form">
                    <Form.Group controlId={`edit-${comment.commentId}`} className="mt-3">
                      <Form.Control
                          className={'edit-comment-textarea'}
                          as="textarea"
                          rows={3}
                          placeholder="댓글을 수정해 주세요."
                          value={editedCommentContent}
                          onChange={(e) => setEditedCommentContent(e.target.value)}
                      />
                      <Button variant="primary" className={'edit-comment-submit'} onClick={() => handleUpdateSubmit(comment.commentId, editedCommentContent)}>
                        수정 완료
                      </Button>
                    </Form.Group>
                  </div>
              )}
            </div>
        ))}
        {postId && <AddCommentForm postId={postId} />}
      </div>
  );
};

export default Comment;
