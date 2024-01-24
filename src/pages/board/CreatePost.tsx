import axios from 'axios';
import { request } from 'http';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface MyCustomRequestOptions extends RequestInit {
  gameType: string;
  gameName: string;
  boardName: string;
}

function CreatePost() {
  const navigate = useNavigate();
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

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

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedImage(file || null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLButtonElement>) => {
    event.preventDefault();

    const requestData = {
      postTitle: postTitle,
      postContent: postContent,
    };

    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요');
        navigate("/login");
        return;
      }

      const formData = new FormData();
      formData.append('requestDto', new Blob([JSON.stringify(requestData)], { type: "application/json" }));
      if (selectedImage) {
        formData.append('file', selectedImage);
      }

      const response = fetch(`http://51.21.48.160:8080/api/posts`, {
        method: 'POST',
        body: formData,
        headers: {
          //'Content-Type': 'multipart/form-data', << 사용하면 안됨!!!
          'Access': `${accessToken}`,
          'Refresh': `${refreshToken}`,
        },
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
    console.log('게시글 작성 성공');
    alert('게시글 작성 성공');
    navigate(`/post/${postId}`);
  };

  const handleFailure = () => {
    console.error('게시글 작성 실패');
    alert('게시글 작성 실패');
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
          제목
        </label>
        <input
          type="text"
          className="form-control mb-3"
          id="postTitle"
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

export default CreatePost;
