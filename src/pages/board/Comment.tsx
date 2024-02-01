import React, { useState } from 'react';
import { Button, Form } from 'react-bootstrap';
import AddCommentForm from './AddCommentForm';
import './Comment.css';

interface Comment {
  commentId: number;
  author: string;
  createdAt: string;
  modifiedAt: string;
  content: string;
  replies?: Reply[];
}

interface Reply {
  replyId: number;
  author: string;
  createdAt: string;
  modifiedAt: string;
  content: string;
}

interface Props {
  comments: Comment[];
  postId?: string;
}

const Comment: React.FC<Props> = ({ comments, postId }) => {
  const [isReplying, setIsReplying] = useState<{ [key: number]: boolean }>({});
  const [replyContent, setReplyContent] = useState<{ [key: number]: string }>({});

  const handleReply = (commentId: number) => {
    setIsReplying({ ...isReplying, [commentId]: !isReplying[commentId] });
  };

  const handleReplyContentChange = (commentId: number, value: string) => {
    setReplyContent({ ...replyContent, [commentId]: value });
  };

  const handleSubmitReply = (commentId: number) => {
    // Handle reply submission here
    // Implement the logic to submit the reply
    console.log(`Reply content for comment ${commentId}:`, replyContent[commentId]);
  };

  return (
      <div className="comments-container">
        {comments.map((comment) => (
            <div key={comment.commentId} className="comment">
              <div>
                <strong>{comment.author}</strong> | 작성시간: {comment.createdAt} | 수정시간: {comment.modifiedAt}
              </div>
              <div>{comment.content}</div>
              <Button className="comment-button" variant="outline-secondary" onClick={() => handleReply(comment.commentId)}>
                {isReplying[comment.commentId] ? '답글 작성 숨기기' : '답글 작성'}
              </Button>
              {isReplying[comment.commentId] && (
                  <Form.Group controlId={`reply-${comment.commentId}`} className="mt-3">
                    <Form.Control
                        as="textarea"
                        rows={3}
                        placeholder="답글을 작성해 주세요."
                        value={replyContent[comment.commentId] || ''}
                        onChange={(e) => handleReplyContentChange(comment.commentId, e.target.value)}
                    />
                    <Button variant="primary" onClick={() => handleSubmitReply(comment.commentId)}>답글 작성 완료</Button>
                  </Form.Group>
              )}
              {/* Render replies here */}
              {/* 대댓글 렌더링 부분 */}
              {/* 각 댓글 아래에 있는 대댓글을 렌더링하기 위한 코드를 추가합니다. */}
              {comment.replies && comment.replies.map((reply) => (
                  <div key={reply.replyId} className="reply">
                    <div>
                      <strong>{reply.author}</strong> | 작성시간: {reply.createdAt} | 수정시간: {reply.modifiedAt}
                    </div>
                    <div>{reply.content}</div>
                  </div>
              ))}
            </div>
        ))}
        {/* Add comment form */}
        {postId && <AddCommentForm postId={postId} />}

      </div>
  );
};

export default Comment;
