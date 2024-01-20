import React, { useEffect, useState } from 'react';
import axios from 'axios';
import S3 from 'react-s3';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PostDto } from '../../dto/Post';

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

interface commentProps {
    onCommentCancel: () => void;
    onCommentComplete: () => void;
}

const Post: React.FC = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState<PostDto | null>(null);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [unlikeCount, setUnlikeCount] = useState<number>(0);
    const [isWriteComment, setIsWriteComment] = useState(false);

    useEffect(() => {
        getPost(postId);
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
                    postImageUrl: imageUrl, // 이미지 URL 추가
                });
            } else {
                setPost(postData);
            }

            setLikeCount(postData.postLike);
            setUnlikeCount(postData.postUnlike);
        } catch (error) {
            console.error('에러:', error);
        }
    };
    // 좋아요(true) 또는 싫어요(false)
    const isLike = async (isLike: boolean) => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            console.log(accessToken);
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                alert('로그인하고 이용해주세요')
                navigate("/");
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access': `${accessToken}`,
                },
            };

            const res = await axios.post(`http://localhost:8080/api/posts/${postId}/like?isLike=${isLike}`, {}, config);

            window.location.reload();

        } catch (error) {
            console.error('에러:', error);
        }
    };

    // 게시글 삭제
    const deletePost = async () => {
        try {
            const accessToken = localStorage.getItem('accessToken');
            if (!accessToken) {
                console.error('액세스 토큰이 없습니다.');
                alert('로그인하고 이용해주세요');
                navigate("/");
                return;
            }

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Access': `${accessToken}`,
                },
            };

            await axios.delete(`http://localhost:8080/api/posts/${postId}`, config);
            navigate(`/pc/lol`);
            window.location.reload();


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

    return (
        <>
            {post && (
                <div className="post-container">
                    <div className="post-content">
                        <h2 className="post-header">{post.postTitle}</h2>
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
                        <Link to={`/modify_post/${postId}`} className="btn btn-primary">
                            수정
                        </Link>
                        <button className="btn btn-delete" onClick={deletePost}>
                            삭제
                        </button>
                    </div>
                    <Button variant='outline-primary' onClick={handleWriteCommentView}>댓글 작성</Button>
                </div>
            )
            }
                {isWriteComment && (<CommentView onCommentCancel={handleWriteCommentHide} onCommentComplete={saveComment}/>)}
        </>
    );
};

export default Post;

function CommentView({ onCommentCancel: onCommentCancel, onCommentComplete: onCommentComplete }: commentProps) {
    const [comment, setComment] = useState('');

    return (
        <div className='post-container'>
            <Button variant='outline-primary' onClick={onCommentComplete} >작성 완료</Button>{' '}
            <Button variant='outline-warning' onClick={onCommentCancel} >작성 취소</Button>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                <Form.Control placeholder='댓글을 작성해 주세요.' as="textarea" rows={3} onChange={e=>setComment(e.target.value)} />
            </Form.Group>
        </div>
    )
}

function saveComment() {
    alert('댓글!')
}