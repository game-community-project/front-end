import React, {useEffect, useState} from 'react';
import axios from 'axios';
import {useParams, Link} from 'react-router-dom';

interface TeamInfoData {
  teamId: string;
  teamName: string;
  teamIntroduction: string;
  adminId: number;
}

const TeamInfo: React.FC = () => {
  const {teamId} = useParams();
  const [teamInfo, setTeamInfo] = useState<TeamInfoData | null>(null);
  const [adminName, setAdminName] = useState<string | null>(null);
  const [users, setUsers] = useState<string[] | null>(null);
  const [isTeamAdmin, setIsTeamAdmin] = useState<boolean | null>(null);

  useEffect(() => {
    const fetchTeamInfo = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/teams/${teamId}`);
        if (response.status === 200) {
          setTeamInfo(response.data.data);

          // adminId를 사용하여 admin의 닉네임을 조회
          const adminResponse = await axios.get(`http://localhost:8080/api/users/profile/${response.data.data.teamAdminId}`);
          if (adminResponse.status === 200) {
            setAdminName(adminResponse.data.data.nickname);
          }

          const usersResponse = await axios.get(`http://localhost:8080/api/teams/${teamId}/users`);
          if (usersResponse.status === 200) {
            setUsers(usersResponse.data.data);
          }


          const accessToken = localStorage.getItem('accessToken');
          if (accessToken) {
            const config = {
              headers: {
                'Content-Type': 'application/json',
                'Access': `${accessToken}`,
              },
            };

            const isTeamAdminResponse = await axios.get(`http://localhost:8080/api/teams/${teamId}/admin`, config);
            if (isTeamAdminResponse.status === 200) {
              setIsTeamAdmin(isTeamAdminResponse.data);
            }
          }
        } else {
          console.error('팀 정보를 불러오는 데 실패했습니다.');
        }
      } catch (error) {
        console.error('팀 정보를 불러오는 도중 에러 발생:', error);
      }
    };

    fetchTeamInfo();
  }, [teamId]);

  if (!teamInfo || adminName === null) {
    return <div className="container mt-4">Loading...</div>;
  }

  return (
      <div className="container mt-4">
        <h2>{teamInfo.teamName}</h2>
        <p>{teamInfo.teamIntroduction}</p>
        <p>
          <strong>팀 관리자:</strong> {adminName}
        </p>

        <div className="mt-4">
          <h3>팀 멤버</h3>
          {users !== null ? (
              <ul className="list-group">
                {users.length > 0 ? (
                    users.map((user, index) => (
                        <li key={index} className="list-group-item">
                          {user}
                        </li>
                    ))
                ) : (
                    <p>유저 없음</p>
                )}
              </ul>
          ) : (
              <p>Loading...</p>
          )}
        </div>

        {isTeamAdmin && (
            <div className="mt-4">
              <Link to={`/teams/${teamId}/add_user`} className="btn btn-primary me-2">
                유저 추가
              </Link>
              <Link to={`/teams/${teamId}/kick_user`} className="btn btn-danger">
                유저 추방
              </Link>
            </div>
        )}
      </div>
  );
};

export default TeamInfo;
