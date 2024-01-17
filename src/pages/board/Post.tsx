import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { PostDto } from '../../dto/Post';

import likeImage from '../../images/like_image.png';
import unlikeImage from '../../images/unlike_image.png';

import './Post.css';

const Post: React.FC = () => {
    const { postId } = useParams();
    const [post, setPost] = useState<PostDto | null>(null);
    const [likeCount, setLikeCount] = useState<number>(0);
    const [unlikeCount, setUnlikeCount] = useState<number>(0);

    useEffect(() => {
        getPost(postId);
    }, [postId]);

    const getPost = async (id: string | undefined) => {
        const res = await axios.get(`http://51.21.48.160:8080/api/posts/${postId}`);
        setPost(res.data.data);
        setLikeCount(res.data.data.postLike);
        setUnlikeCount(res.data.data.postUnlike);
    };

    // 좋아요(true) 또는 싫어요(false)
    const isLike = async (isLike: boolean) => {
        try {
            const res = await axios.post(`http://51.21.48.160:8080/api/posts/${postId}/like?isLike=${isLike}`);

            console.log(isLike);
            if (isLike == true) {
                setLikeCount(res.data.data.postLike);
            } else {
                setUnlikeCount(res.data.data.postUnlike);
            }
        } catch (error) {
            console.error('Error:', error);
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
                </div>
            )}
        </>
    );
};

export default Post;