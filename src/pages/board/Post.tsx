import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {Link, useNavigate, useParams} from 'react-router-dom';
import {PostDto} from '../../dto/Post';
import {format} from 'date-fns';

import likeImage from '../../images/like_image.png';
import unlikeImage from '../../images/unlike_image.png';

import './Post.css';
import Comment from './Comment';

import {Button, Form} from 'react-bootstrap';


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
  accept: boolean;
  createdAt: string;
  modifiedAt: string;
  parentAuthor:string;
}



const Post: React.FC = () => {
  const navigate = useNavigate();
  const {postId} = useParams();
  const [post, setPost] = useState<PostDto | null>(null);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [likeCount, setLikeCount] = useState<number>(0);
  const [unlikeCount, setUnlikeCount] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [totalPages, setTotalPages] = useState<number>(1);
  const [comments, setComments] = useState<CommentDto[]>([]);
  const [commentsPerPage] = useState<number>(10);
  useEffect(() => {
    getPost(postId);
    getComments(postId);
  }, [postId]);

  const getPost = async (id: string | undefined) => {

    try {
      const res = await axios.get(`https://spartagameclub.shop/api/posts/${postId}`);
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

  const handleGoToGuestbook = () => {
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

      const res = await axios.post(`https://spartagameclub.shop/api/posts/${postId}/like?isLike=${isLike}`, {}, config);

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

      await axios.delete(`https://spartagameclub.shop/api/posts/${postId}`, config);
      navigate(`/board`);

    } catch (error) {
      console.error('에러:', error);
    }
  };
  const getComments = async (postId: string | undefined, page: number = 1) => {
    try {
      const res = await axios.get(
          `https://spartagameclub.shop/api/posts/${postId}/comments?page=${page}&size=${commentsPerPage}&sortBy=createdAt&isAsc=true`
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


  return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
        {post && (
            <div className="post-container">
              <div className="post-content">
                <h2 className="post-header">
                  {post.postTitle}
                  <span className={`status-indicator ${post.close ? 'closed' : 'open'}`}>
                {post.close ? 'close' : 'open'}
              </span>
                </h2>
                <hr/>
                <p className="mb-2 text-muted">
                  {`${post.postAuthor} | 생성시간: ${post.createdAt} | 수정시간: ${post.modifiedAt}`}
                </p>
                <hr/>
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
                <button className="btn btn-primary" onClick={handleGoToGuestbook}>
                  방명록
                </button>
                <Link to={`/modify_post/${postId}`} className="btn btn-edit">
                  수정
                </Link>
                <button className="btn btn-delete" onClick={deletePost}>
                  삭제
                </button>
              </div>
              <Comment comments={comments} postId={postId} getComments={getComments} />

            </div>
        )}
      </div>
  );
};

export default Post;
