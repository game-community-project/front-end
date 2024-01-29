import React, {useState} from 'react';
import axios from 'axios';
import {useNavigate} from 'react-router-dom';

const CreateTeam: React.FC = () => {
  const navigate = useNavigate();
  const [teamName, setTeamName] = useState('');
  const [teamIntroduction, setTeamIntroduction] = useState('');


  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {name, value} = e.target;
    switch (name) {
      case 'teamName':
        setTeamName(value);
        break;
      case 'teamIntroduction':
        setTeamIntroduction(value);
        break;
      default:
        break;
    }
  };

  const handleSubmit = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');

      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요');
        navigate('/');
        return;
      }

      const response = await axios.post(
          'https://spartagameclub.shop/api/teams',
          {
            teamName: teamName,
            teamIntroduction: teamIntroduction,
          },
          {
            headers: {
              'Content-Type': 'application/json',
              'Access': `${accessToken}`,
              'Refresh': `${refreshToken}`,
            },
          }
      );

      if (response.status === 200) {
        console.log(response);
        const teamId = response.data.data.teamId;
        console.log('팀 생성 성공');
        alert('팀 생성 성공');
        navigate(`/teams/${teamId}`);
        console.log(teamId);
      } else {
        console.error('팀 생성 실패');
        alert('팀 생성 실패');
      }
    } catch (error) {
      console.error('네트워크 에러' + error);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  return (
      <div className="container mt-5">
        <div className="mb-3 d-flex flex-column align-items-start">
          <label htmlFor="teamName" className="form-label mb-2">
            팀 이름
          </label>
          <input
              type="text"
              className="form-control mb-3"
              id="teamName"
              name="teamName"
              onChange={handleInputChange}
              placeholder="팀 이름을 입력해주세요"
          />

          <label htmlFor="teamIntroduction" className="form-label mb-2">
            팀 소개
          </label>
          <input
              type="text"
              className="form-control mb-3"
              id="teamIntroduction"
              name="teamIntroduction"
              onChange={handleInputChange}
              placeholder="팀 소개를 입력해주세요"
          />

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
};

export default CreateTeam;
