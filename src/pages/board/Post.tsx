import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { PostDto } from '../../dto/Post';

import likeImage from '../../images/like_image.png';
import unlikeImage from '../../images/unlike_image.png';

import './Post.css';

const Post: React.FC = () => {
    const navigate = useNavigate();
    const { postId } = useParams();
    const [post, setPost] = useState<PostDto | null>(null);
    const [userId, setUserId] = useState<string | undefined>(undefined);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [unlikeCount, setUnlikeCount] = useState<number>(0);

    useEffect(() => {
        getPost(postId);
    }, [postId]);

    const getPost = async (id: string | undefined) => {
        const res = await axios.get(`http://localhost:8080/api/posts/${postId}`);

        const postData = res.data.data;

        setPost(res.data.data);
        setLikeCount(res.data.data.postLike);
        setUnlikeCount(res.data.data.postUnlike);

        const userId = postData.userId;
        if (userId) {
        console.log('User ID:', userId);
        setUserId(userId);
        }
    };

    const handleGoToGuestbook  = () => {
        navigate(`/guestbooks/${userId}`)
      }

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

    return (
        <>
            {post && (
                <div className="post-container">
                    <div className="post-content">
                        <h2 className="post-header">{post.postTitle}</h2>
                        <hr />
                        <p className="mb-2 text-muted">
                            {`${post.postAuthor} | 생성시간: ${post.createdAt} | 수정시간: ${post.modifiedAt}`}
                            <div className="goToGuestbook">
                            <button onClick={handleGoToGuestbook} style={{ float: 'right' }}>방명록</button>
                            </div>
                        </p>
                        <hr />
                        <p>{post.postContent}</p>
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
                </div>
            )
            }
        </>
    );
};

export default Post;