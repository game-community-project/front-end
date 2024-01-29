import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';


const AddUserToTeam: React.FC = () => {
  const {teamId} = useParams();
  const [nickname, setNickname] = useState('');
  const [teamMembers, setTeamMembers] = useState<string[] | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        const response = await axios.get(`https://spartagameclub.shop/api/teams/${teamId}/users`);
        if (response.status === 200) {
          setTeamMembers(response.data.data);
        } else {
          console.error('팀 멤버 정보를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('팀 멤버 정보를 불러오는 도중 에러 발생:', error);
      }
    };

    fetchTeamMembers();
  }, [teamId]);

  const handleAddUser = async () => {
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
        nickname: nickname,
      };

      const response = await axios.post(`https://spartagameclub.shop/api/teams/${teamId}/addUser?nickname=${nickname}`, data, config);
      if (response.status === 200) {
        alert('유저 추가 성공');
        navigate(`/teams/${teamId}`)

      } else {
        alert('유저 추가 실패');
      }
    } catch (error) {
      alert('해당 유저는 존재하지 않습니다.');
    }
  };

  return (
      <div className="container mt-4">
        <h2>유저 추가</h2>

        <div className="mt-4">
          <label htmlFor="username" className="form-label">
            추가할 유저의 닉네임:
          </label>
          <input
              type="text"
              id="nickname"
              className="form-control"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
          />
        </div>

        <div className="mt-3">
          <button className="btn btn-primary" onClick={handleAddUser}>
            유저 추가
          </button>
        </div>

        <div className="mt-4">
          <h3>팀 멤버</h3>
          {teamMembers !== null ? (
              <ul className="list-group">
                {teamMembers.length > 0 ? (
                    teamMembers.map((member, index) => (
                        <li key={index} className="list-group-item">
                          {member}
                        </li>
                    ))
                ) : (
                    <p>팀 멤버 없음</p>
                )}
              </ul>
          ) : (
              <p>Loading...</p>
          )}
        </div>

      </div>
  );
};

export default AddUserToTeam;
