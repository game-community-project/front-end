import React from 'react';

function UpdatePost() {
  return (
    <div className="container mt-5">
      <form>
        <div className="mb-3">
          <label htmlFor="postTitle" className="form-label">
            제목
          </label>
          <input
            type="text"
            className="form-control"
            id="postTitle"
            placeholder="제목을 입력해주세요"
          />
        </div>
        <div className="mb-3">
          <label htmlFor="postContent" className="form-label">
            내용
          </label>
          <textarea
            className="form-control"
            id="postContent"
            rows={4}
            placeholder="내용을 입력해주세요"
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
}

export default UpdatePost;
