import { title } from 'process';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

const UpdatePostForm = () => {
  const navigate = useNavigate();
  const { postId } = useParams();
  const [postData, setPostData] = useState({
    postTitle: '',
    postContent: '',
  });

  useEffect(() => {
  }, [postId]);

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => {
    const { name, value } = e.target;
    setPostData({
      ...postData,
      [name]: value,
    });
  };

  const handleFormSubmit = async (e: { preventDefault: () => void; }) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('requestDto', new Blob([JSON.stringify(postData)], { type: "application/json" }));

    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요');
        navigate("/");
        return;
      }

      const response = await fetch(`http://localhost:8080/api/posts/${postId}`, {
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

  const handleSuccess = (postId : number) => {
    console.log('게시글 수정 성공');
    alert('게시글 수정 성공');
    navigate(`/api/posts/${postId}`);
  };

  const handleFailure = () => {
    console.error('게시글 수정 실패');
    alert('게시글 수정 실패');
    // window.location.reload()
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <div className="container mt-5">
      <form onSubmit={handleFormSubmit}>
        <div className="mb-3">
          <label htmlFor="postTitle" className="form-label">
            제목
          </label>
          <input
            type="text"
            className="form-control"
            id="postTitle"
            name="postTitle"
            placeholder="제목을 입력해주세요"
            value={postData.postTitle}
            onChange={handleInputChange}
          />
        </div>
        <div className="mb-3">
          <label htmlFor="postContent" className="form-label">
            내용
          </label>
          <textarea
            className="form-control"
            id="postContent"
            name="postContent"
            rows={4}
            placeholder="내용을 입력해주세요"
            value={postData.postContent}
            onChange={handleInputChange}
          ></textarea>
        </div>
        <div className="mb-3 d-flex justify-content-center">
          <button type="submit" className="btn btn-primary me-2">
            확인
          </button>
          <button type="button" className="btn btn-secondary">
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdatePostForm;