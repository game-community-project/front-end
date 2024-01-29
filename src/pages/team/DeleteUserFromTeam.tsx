import React, {useState, useEffect} from 'react';
import axios from 'axios';
import {useNavigate, useParams} from 'react-router-dom';

const DeleteUserFromTeam: React.FC = () => {
  const {teamId} = useParams();
  const [selectedUser, setSelectedUser] = useState<string | null>(null);
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

  const handleDeleteUser = async () => {
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

      const response = await axios.get('https://spartagameclub.shop/api/users/profile', config);
      const loggedInUserNickname = response.data.data.nickname;

      if (loggedInUserNickname === selectedUser) {
        console.error('본인을 추방할 수 없습니다.');
        alert('본인을 추방할 수 없습니다.');
        return;
      }

      const deleteResponse = await axios.delete(`https://spartagameclub.shop/api/teams/${teamId}/deleteUser?nickname=${selectedUser}`, config);
      if (deleteResponse.status === 200) {
        console.log('유저 삭제 성공');
        alert('유저 삭제 성공');

        // 삭제된 사용자를 이전 상태에서 필터링하여 teamMembers 상태를 업데이트합니다.
        setTeamMembers((prevMembers) => prevMembers?.filter((member) => member !== selectedUser) || null);

        // 선택된 사용자를 초기화하여 드롭다운 값을 재설정합니다.
        setSelectedUser(null);
      } else {
        console.error('유저 삭제 실패');
        alert('유저 삭제 실패');
      }
    } catch (error) {
      console.error('유저 삭제 도중 에러 발생:', error);
      alert('유저 삭제 도중 에러 발생');
    }
  };

  return (
      <div className="container mt-4">
        <h2>유저 삭제</h2>

        <div className="mt-4">
          <label htmlFor="username" className="form-label">
            삭제할 유저 선택:
          </label>
          <select
              id="selectedUser"
              className="form-select"
              value={selectedUser || ''}
              onChange={(e) => setSelectedUser(e.target.value)}
          >
            <option value="" disabled>Select a user</option>
            {teamMembers !== null &&
                teamMembers.map((member, index) => (
                    <option key={index} value={member}>
                      {member}
                    </option>
                ))}
          </select>
        </div>

        <div className="mt-3">
          <button className="btn btn-danger" onClick={handleDeleteUser}>
            유저 삭제
          </button>
        </div>
      </div>
  );
};

export default DeleteUserFromTeam;
