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
  const [gameType, setGameType] = useState('');
  const [gameName, setGameName] = useState('');
  const [boardName, setBoardName] = useState('');
  const [postTitle, setPostTitle] = useState('');
  const [postContent, setPostContent] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const handleGameTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameType(e.target.value);
  };

  const handleGameNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setGameName(e.target.value);
  };

  const handleBoardNameChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBoardName(e.target.value);
  };

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
        navigate("/");
        return;
      }

      const formData = new FormData();
      formData.append('requestDto', new Blob([JSON.stringify(requestData)], { type: "application/json" }));
      if (selectedImage) {
        formData.append('file', selectedImage);
      }

      const response = fetch(`http://51.21.48.160:8080/api/posts?gameType=${gameType}&gameName=${gameName}&boardName=${boardName}`, {
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
    navigate(`/api/posts/${postId}`);
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
      {/* 중첩된 폼 제거 */}
      <div className="mb-3 d-flex">
        <div className="me-3">
          <label htmlFor="gameType" className="form-label">
            게임 타입 선택
          </label>
          <select
            className="form-select"
            id="gameType"
            value={gameType}
            onChange={handleGameTypeChange}
          >
            <option value="">
              게임 타입 선택
            </option>
            <option value="PC_GAME">PC게임</option>
            <option value="CONSOLE_GAME">콘솔게임</option>
            <option value="MOBILE_GAME">모바일게임</option>
            <option value="EMPTY_TYPE">없음</option>
          </select>
        </div>
        <div className="me-3">
          <label htmlFor="gameName" className="form-label">
            게임 선택
          </label>
          <select
            className="form-select"
            id="gameName"
            value={gameName}
            onChange={handleGameNameChange}
          >
            <option value="">
              게임 선택
            </option>
            <option value="LEAGUE_OF_LEGEND">리그오브레전드</option>
            <option value="VALORANT">발로란트</option>
            <option value="THE_LEGEND_OF_ZELDA_TEARS_OF_THE_KINGDOM">젤다의 전설 티어스 오브 더 킹덤</option>
            <option value="BRAWL_STARS">브롤스타즈</option>
            <option value="EMPTY_NAME">없음</option>
          </select>
        </div>
        <div>
          <label htmlFor="boardName" className="form-label">
            게시판 선택
          </label>
          <select
            className="form-select"
            id="boardName"
            value={boardName}
            onChange={handleBoardNameChange}
          >
            <option value="">
              게시판 선택
            </option>
            <option value="FREE_BOARD">자유 게시판</option>
            <option value="FIND_USER_BOARD">팀원 찾기 게시판</option>
            <option value="GROUP_PROMOTION_BOARD">팀 홍보 게시판</option>
            <option value="REQUIRED_BOARD">요청 게시판</option>
          </select>
        </div>
      </div>

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
    </div>
  );
}

export default CreatePost;
