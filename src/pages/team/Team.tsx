import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TeamDto } from '../../dto/Team';
import { Link, useNavigate } from 'react-router-dom';

import './Team.css';

const Team: React.FC = () => {
  const navigate = useNavigate();
  const [teams, setTeams] = useState<TeamDto[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newTeamName, setNewTeamName] = useState('');
  const [userTeams, setUserTeams] = useState<TeamDto[] | null>(null);

  useEffect(() => {
    if (isLoggedIn()) {
      getUserTeams(currentPage);
    } else {
      getTeams(currentPage);
    }
  }, [currentPage]);

  const getTeams = async (page: number) => {
    try {
      const res = await axios.get(`https://spartagameclub.shop/api/teams?page=${page}&size=10&sortBy=teamName&isAsc=true`);
      setTeams(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
      console.log(res);
    } catch (error) {
      console.error('팀 목록을 불러오는데 실패했습니다.', error);
    }
  };

  const getUserTeams = async (page: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요');
        navigate("/");
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Access': `${accessToken}`,
        },
      };

      const res = await axios.get(`https://spartagameclub.shop/api/teams/users?page=${page}&size=10&sortBy=Team&isAsc=true`, config);
      setUserTeams(res.data.data.content);
      setTotalPages(res.data.data.totalPages);

    } catch (error) {
      console.error('팀 목록을 불러오는데 실패했습니다.', error);
    }
  };

  const isLoggedIn = () => {
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');
    return !!accessToken && !!refreshToken;
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const leaveTeam = async (teamId: number) => {
    try {
      const accessToken = localStorage.getItem('accessToken');
      if (!accessToken) {
        console.error('액세스 토큰이 없습니다.');
        alert('로그인하고 이용해주세요');
        navigate("/");
        return;
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          'Access': `${accessToken}`,
        },
      };

      const res = await axios.delete(`https://spartagameclub.shop/api/teams/${teamId}/leave`, config);
      if (res.status === 200) {
        getUserTeams(currentPage);
        alert("팀 탈퇴에 성공하셨습니다.")
        getTeams(currentPage);
      }
    } catch (error) {
      console.error('Error leaving team:', error);
    }
  };

  return (
      <div className="container mt-4">
        <h1 className="mb-4">Team List</h1>

        {isLoggedIn() && userTeams ? (
            <div>
              <ul className="list-group">
                {userTeams.map((team) => (
                    <li key={team.teamId} className="list-group-item">
                      <Link to={`/teams/${team.teamId}`} className="team-link">
                        <h2 className="team-name">{team.teamName}</h2>
                      </Link>
                      <p className="team-introduction">{team.teamIntroduction}</p>
                      <button onClick={() => leaveTeam(team.teamId)} className="btn btn-danger">팀 탈퇴</button>
                    </li>
                ))}
              </ul>

              <div className="pagination mt-3">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <span
                        key={page}
                        className={`page-item ${page === currentPage ? "active" : ""}`}
                        onClick={() => handlePageChange(page)}
                    >
                {page}
              </span>
                ))}
              </div>
            </div>
        ) : teams ? (
            <div>
              <ul className="list-group">
                {teams.map((team) => (
                    <li key={team.teamId} className="list-group-item">
                      <Link to={`/teams/${team.teamId}`} className="team-link">
                        <h2 className="team-name">{team.teamName}</h2>
                      </Link>
                      <p className="team-introduction">{team.teamIntroduction}</p>
                    </li>
                ))}
              </ul>

              <div className="pagination mt-3">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <span
                        key={page}
                        className={`page-item ${page === currentPage ? "active" : ""}`}
                        onClick={() => handlePageChange(page)}
                    >
                {page}
              </span>
                ))}
              </div>
            </div>
        ) : (
            <p>팀이 없습니다.</p>
        )}

        <Link to="/create_team" className="btn btn-primary mt-3">
          팀 생성
        </Link>
      </div>
  );
};

export default Team;
