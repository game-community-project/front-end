import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PostDto } from '../../dto/Post';
import { format } from 'date-fns';

import likeImage from '../../images/like_image.png';
import unlikeImage from '../../images/unlike_image.png';

import './Post.css';
import { Button, Form } from 'react-bootstrap';

const config = {
    bucketName: process.env.REACT_APP_AWS_BUCKET_NAME,
    region: process.env.REACT_APP_AWS_REGION,
    accessKeyId: process.env.REACT_APP_AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.REACT_APP_AWS_SECRET_ACCESS_KEY,
}

interface CommentDto {
    commentId: number;
    author: string;
    content: string;
    accpet: boolean;
    createdAt: string;
    modifiedAt: string;
}

interface commentProps {
    onCommentCancel: () => void;
    onCommentComplete: () => void;
}

const Post: React.FC = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState<PostDto | null>(null);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [unlikeCount, setUnlikeCount] = useState<number>(0);
    const [isWriteComment, setIsWriteComment] = useState(false);
    const [comments, setComments] = useState<CommentDto[]>([]);
    const [comment, setComment] = useState('');
    const [currentPage, setCurrentPage] = useState<number>(1);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [commentsPerPage] = useState<number>(10);
    const [editingCommentId, setEditingCommentId] = useState<number | null>(null);
    const [editedComment, setEditedComment] = useState<string>('');
    const [acceptCommentId, setAcceptCommentId] = useState<number | null>(null);

    useEffect(() => {
        getPost(postId);
        getComments(postId);
    }, [postId]);

    const getPost = async (id: string | undefined) => {

        try {
          const res = await axios.get(`http://localhost:8080/api/posts/${postId}`);
          const postData = res.data.data;
      
          if (postData.postImageUrl) {
            const urlParts = postData.postImageUrl.split('/');
            const objectKey = urlParts[urlParts.length - 1];
      
            // 이미지가 있다면 S3에서 이미지 URL 생성
            const imageUrl = `https://${config.bucketName}.s3.amazonaws.com/${objectKey}`;
            
            setPost({
                ...postData,
                postImageUrl: imageUrl,
                createdAt: format(new Date(postData.createdAt), 'yyyy-MM-dd HH:mm:ss'),
                modifiedAt: format(new Date(postData.modifiedAt), 'yyyy-MM-dd HH:mm:ss'),
            });
        } else {
            setPost({
                ...postData,
                createdAt: format(new Date(postData.createdAt), 'yyyy-MM-dd HH:mm:ss'),
                modifiedAt: format(new Date(postData.modifiedAt), 'yyyy-MM-dd HH:mm:ss'),
            });
        }
      
          setLikeCount(postData.postLike);
          setUnlikeCount(postData.postUnlike);

          const userId = postData.userId;
          if (userId) {
          console.log('User ID:', userId);
          setUserId(userId);
          }
        } catch (error) {
            console.error('에러:', error);
        }
      };

      const handleGoToGuestbook  = () => {
        navigate(`/guestbooks/${userId}`)
      }

    // 좋아요(true) 또는 싫어요(false)
    const isLike = async (isLike: boolean) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                alert('로그인하고 이용해주세요')
                navigate("/login");
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access': `${accessToken}`,
                },
            };

            const res = await axios.post(`http://localhost:8080/api/posts/${postId}/like?isLike=${isLike}`, {}, config);

            getPost(postId);

        } catch (error) {
            console.error('에러:', error);
        }
    };

    const deletePost = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                alert('로그인하고 이용해주세요');
                navigate(`/login`);
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access': `${accessToken}`,
                },
            };

            await axios.delete(`http://localhost:8080/api/posts/${postId}`, config);
            navigate(`/board`);

        } catch (error) {
            console.error('에러:', error);
        }
    };

    const handleWriteCommentView = () => {
        setIsWriteComment(true);
    }

    const handleWriteCommentHide = () => {
        setIsWriteComment(false);
    }

    const getComments = async (postId: string | undefined, page: number = 1) => {
        try {
            const res = await axios.get(
                `http://localhost:8080/api/posts/${postId}/comments?page=${page}&size=${commentsPerPage}&sortBy=createdAt&isAsc=true`
            );
const formattedComments = res.data.data.content.map((comment: CommentDto) => ({
                ...comment,
                createdAt: format(new Date(comment.createdAt), 'yyyy-MM-dd HH:mm:ss'),
                modifiedAt: format(new Date(comment.modifiedAt), 'yyyy-MM-dd HH:mm:ss'),
            }));

            setComments(formattedComments);
            setTotalPages(res.data.data.totalPages);
        } catch (error) {
            console.error('댓글을 가져오는 중 에러 발생:', error);
        }
    };

    const saveComment = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                alert('댓글을 작성하려면 로그인이 필요합니다.');
                navigate(`/login`);
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access': `${accessToken}`,
                },
            };

            const commentData = {
                content: comment,
            };

            await axios.post(`http://localhost:8080/api/posts/${postId}/comments`, commentData, config);

            getComments(postId);
            setComment('');

        } catch (error) {
            console.error('댓글을 저장하는 중 에러 발생:', error);
        }
    };

    const handleEditComment = (commentId: number) => {
        const selectedComment = comments.find(comment => comment.commentId === commentId);

        if (selectedComment) {
            setEditingCommentId(commentId);
            setEditedComment(selectedComment.content);
        }
    };

    const handleCancelEditComment = () => {
        setEditingCommentId(null);
        setEditedComment('');
    };

    const handleSaveEditedComment = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                alert('댓글을 편집하려면 로그인이 필요합니다.');
                navigate(`/login`);
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access': `${accessToken}`,
                },
            };

            const editedCommentData = {
                content: editedComment,
            };

            await axios.put(`http://localhost:8080/api/posts/${postId}/comments/${editingCommentId}`, editedCommentData, config);

            // 편집 후 댓글 갱신
            getComments(postId);

            // 편집 상태 초기화
            setEditingCommentId(null);
            setEditedComment('');

        } catch (error) {
            console.error('댓글을 편집하는 중 에러 발생:', error);
        }
    };

    const handleDeleteComment = async (commentId: number) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                alert('댓글을 삭제하려면 로그인이 필요합니다.');
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access': `${accessToken}`,
                },
            };

            await axios.delete(`http://localhost:8080/api/posts/${postId}/comments/${commentId}`, config);

            // 삭제 후 댓글 갱신
            getComments(postId);
        } catch (error) {
            console.error('댓글을 삭제하는 중 에러 발생:', error);
        }
    };

    const handleAcceptComment = async (commentId: number) => {

        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                alert('댓글을 채택하려면 로그인이 필요합니다.');
                navigate('/login');
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access': `${accessToken}`,
                },
            };
            
            console.log(accessToken);
            await axios.put(`http://localhost:8080/api/posts/${postId}/comments/${commentId}/accept`, {}, config);
            alert('댓글이 채택되었습니다. 해당 게시글은 마감됩니다.')
            getPost(postId);
            
        } catch (error) {
            console.error(error);
        }
    };


    const handlePageChange = (newPage: number) => {
        setCurrentPage(newPage);
        getComments(postId, newPage);
    };

    return (
        <>
            {post && (
                <div className="post-container">
                    <div className="post-content">
                        <h2 className="post-header">
                            {post.postTitle}
                            <span className={`status-indicator ${post.close ? 'closed' : 'open'}`}>
                                {post.close ? 'close' : 'open'}
                            </span>
                        </h2>
                        <hr />
                        <p className="mb-2 text-muted">
                            {`${post.postAuthor} | 생성시간: ${post.createdAt} | 수정시간: ${post.modifiedAt}`}
                        </p>
                        <hr />
                        <p>{post.postContent}</p>
                        {post.postImageUrl && (
                            <img
                                src={post.postImageUrl}
                                alt="게시물 이미지"
                                className="post-image"
                            />
                        )}
                    </div>
                    <div className="post-actions">
                        <div className="like-dislike">
                            <img
                                src={likeImage}
                                alt="좋아요"
                                onClick={() => isLike(true)}
                            />
                            <img
                                src={unlikeImage}
                                alt="싫어요"
                                onClick={() => isLike(false)}
                            />
                        </div>
                    </div>
                    <div className="post-stats">
                        <span className="post-stat">{post.postLike}</span>
                        <span className="post-stat">{post.postUnlike}</span>
                    </div>
                    <div className="edit-delete-buttons">
                        <button className="btn btn-primary" onClick={handleGoToGuestbook}
                        >방명록
                        </button>
                        <Link to={`/modify_post/${postId}`} className="btn btn-edit">
                            수정
                        </Link>
                        <button className="btn btn-delete" onClick={deletePost}>
                            삭제
                        </button>
                    </div>
                    <Button variant='outline-primary' onClick={handleWriteCommentView}>댓글 작성</Button>
                </div>
            )}
            {isWriteComment && (
                <div className='post-container'>
                    <Button variant='outline-primary' onClick={saveComment} >작성 완료</Button>{' '}
                    <Button variant='outline-warning' onClick={handleWriteCommentHide} >작성 취소</Button>
                    <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                        <Form.Control placeholder='댓글을 작성해 주세요.' as="textarea" rows={3} onChange={e => setComment(e.target.value)} />
                    </Form.Group>
                </div>
            )}
            <div className="comments-container">
                {comments.map(comment => (
                    <div key={comment.commentId} className="post-container">
                        <p>
                            {comment.author} | 작성시간: {comment.createdAt} | 수정시간: {comment.modifiedAt}
                            <div className="comment-actions">
                                <button className="btn-adopt" onClick={() => handleAcceptComment(comment.commentId)}>
                                    채택
                                </button>
                                <span className="spacer" />
                                {editingCommentId !== comment.commentId ? (
                                    <>
                                        <button className="btn-edit" onClick={() => handleEditComment(comment.commentId)}>
                                            수정
                                        </button>
                                        <button className="btn-delete" onClick={() => handleDeleteComment(comment.commentId)}>
                                            삭제
                                        </button>
                                    </>
                                ) : (
                                    <>
                                        <button className="btn-edit" onClick={handleSaveEditedComment}>
                                            확인
                                        </button>
                                        <button className="btn-delete" onClick={handleCancelEditComment}>
                                            취소
                                        </button>
                                    </>
                                )}
                            </div>
                        </p>
                        <hr />
                        {editingCommentId === comment.commentId ? (
                            <textarea value={editedComment} onChange={(e) => setEditedComment(e.target.value)} />
                        ) : (
                            <p>{comment.content}</p>
                        )}
                    </div>
                ))}
                {totalPages > 1 && (
                    <div className="pagination">
                        <span
                            onClick={() => handlePageChange(currentPage - 1)}
                            className={`pagination-button ${currentPage === 1 ? 'disabled' : ''}`}
                        >
                            이전
                        </span>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <span
                                key={index + 1}
                                className={currentPage === index + 1 ? 'active' : ''}
                                onClick={() => handlePageChange(index + 1)}
                            >
                                {index + 1}
                            </span>
                        ))}
                        <span
                            onClick={() => handlePageChange(currentPage + 1)}
                            className={`pagination-button ${currentPage === totalPages ? 'disabled' : ''}`}
                        >
                            다음
                        </span>
                    </div>
                )}
            </div>
        </>
    );
};

export default Post;
