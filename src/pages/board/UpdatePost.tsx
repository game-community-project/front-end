import { title } from 'process';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Post from './Post';

const UpdatePostForm = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  useEffect(() => {
    // URL이 변경될 때마다 해당 게시물 데이터를 불러옴
    const fetchPostData = async () => {
      try {
        const response = await fetch(`https://spartagameclub.shop/api/posts/${postId}`);
        if (response.ok) {
          const postData = await response.json();

          setPostTitle(postData.data.postTitle);
          setPostContent(postData.data.postContent);
        } else {
          console.error('게시글 데이터를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('네트워크 에러: ', error);  
      }
    };

    fetchPostData();
  }, [postId]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    switch (name) {
      case 'postTitle':
        setPostTitle(value);
        break;
      case 'postContent':
        setPostContent(value);
        break;
      default:
        break;
    }
  };

  const requestData = {
    postTitle: postTitle,
    postContent: postContent,
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedImage(file || null);
  };

  const handleSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('requestDto', new Blob([JSON.stringify(requestData)], { type: "application/json" }));
    if (selectedImage) {
      formData.append('file', selectedImage);
    }

    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요');
        navigate("/");
        return;
      }

      const response = await fetch(`https://spartagameclub.shop/api/posts/${postId}`, {
        method: 'PATCH',
        body: formData,
        headers: {
          'Access': `${accessToken}`,
          'Refresh': `${refreshToken}`,
        }
      }).then(async response => {
        if (response.ok) {
          const responseData = await response.json();
          console.log(responseData);
          const postId = responseData.data.postId;
          handleSuccess(postId);
        } else {
          handleFailure();
        }
      })

    } catch (error) {
      console.error("네트워크 에러" + error);
    }
  };

  const handleSuccess = (postId: number) => {
    console.log('게시글 수정 성공');
    alert('게시글 수정 성공');
    navigate(`/api/posts/${postId}`);
  };

  const handleFailure = () => {
    console.error('게시글 수정 실패');
    alert('게시글 수정 실패');
    window.location.reload()
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      {/* 중복된 폼 제거 */}
      <div className="mb-3 d-flex flex-column align-items-start">
        <label htmlFor="postTitle" className="form-label mb-2">
          
        </label>
        <input
          type="text"
          className="form-control mb-3"
          id="postTitle"
          value={postTitle}
          onChange={(e) => setPostTitle(e.target.value)}
          placeholder="제목을 입력해주세요"
        />

        {/* 이미지 업로드 */}
        <label htmlFor="image" className="form-label me-2 mb-2">
          이미지 업로드
        </label>
        <input
          type="file"
          className="form-control mb-3"
          id="image"
          accept="image/*"
          onChange={handleImageChange}
        />

        <label htmlFor="postContent" className="form-label mb-2">
          내용
        </label>
        <textarea
          className="form-control mb-3"
          id="postContent"
          value={postContent}
          onChange={(e) => setPostContent(e.target.value)}
          rows={4}
          placeholder="내용을 입력해주세요"
        ></textarea>
      </div>
      <div className="mb-3 d-flex justify-content-center">
        <button type="button" className="btn btn-primary me-2" onClick={handleSubmit}>
          확인
        </button>
        <button type="button" className="btn btn-secondary" onClick={handleCancel}>
          취소
        </button>
      </div>
    </div>
  );
}

export default UpdatePostForm;
