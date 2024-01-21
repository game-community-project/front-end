
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const UpdateTeam: React.FC = () => {
  const { teamId = '' } = useParams();
  const [teamName, setTeamName] = useState('');
  const [teamIntroduction, setTeamIntroduction] = useState('');
  const [gameName, setGameName] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/teams/${teamId}`);
        if (response.status === 200) {
          const { teamName, teamIntroduction ,gameName} = response.data.data;
          console.log(response);
          setTeamName(teamName);
          setTeamIntroduction(teamIntroduction);
          setGameName(gameName);
        } else {
          console.error('팀 정보를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('팀 정보를 불러오는 도중 에러 발생:', error);
      }
    };

    fetchTeamInfo();
  }, [teamId]);

  const handleUpdateTeam = async () => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요');
        navigate('/');
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Access': `${accessToken}`,
        },
      };

      const data = {
        teamName: teamName,
        teamIntroduction: teamIntroduction,
        gameName: gameName
      };

      const response = await axios.patch(`http://localhost:8080/api/teams/${teamId}`, data, config);
      if (response.status === 200) {
        console.log('팀 수정 성공');
        alert('팀 수정 성공');
        navigate(`/teams/${teamId}`);
      } else {
        console.error('팀 수정 실패');
        alert('팀 수정 실패');
      }
    } catch (error) {
      console.error('팀 수정 도중 에러 발생:', error);
      alert('팀 수정 도중 에러 발생');
    }
  };

  return (
      <div className="container mt-4">
          <h2>팀 수정</h2>

  <div className="mt-4">
  <label htmlFor="teamName" className="form-label">
      팀 이름:
      </label>
      <input
  type="text"
  id="teamName"
  className="form-control"
  value={teamName}
  onChange={(e) => setTeamName(e.target.value)}
  />
  </div>

  <div className="mt-4">
  <label htmlFor="teamIntroduction" className="form-label">
      팀 소개:
      </label>
      <textarea
  id="teamIntroduction"
  className="form-control"
  value={teamIntroduction}
  onChange={(e) => setTeamIntroduction(e.target.value)}
  />
  </div>

  <div className="mt-3">
  <button className="btn btn-warning" onClick={handleUpdateTeam}>
      팀 수정
  </button>
  </div>

  </div>
);
};

export default UpdateTeam;
