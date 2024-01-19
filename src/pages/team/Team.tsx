import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TeamDto } from '../../dto/Team';

import './Team.css'; // Import your custom CSS file

const Team: React.FC = () => {
  const [teams, setTeams] = useState<TeamDto[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTeamName, setNewTeamName] = useState('');
  const [userTeams, setUserTeams] = useState<TeamDto[] | null>(null);

  useEffect(() => {
    // 유저가 로그인한 상태라면 유저가 속한 팀 리스트를 가져옴
    if (isLoggedIn()) {
      getUserTeams();
    } else {
      // 로그인하지 않은 경우 기본적으로 게임에 속한 팀 리스트를 가져옴
      const gameName = "LEAGUE_OF_LEGEND"; // 예시로 하드코딩, 실제로는 동적으로 값을 받아오세요
      getTeams(gameName, currentPage);
    }
  }, [currentPage]);

  const getTeams = async (gameName: string, page: number) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/teams?page=${page}&size=10&sortBy=teamName&isAsc=true&gameName=${gameName}`);
      setTeams(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  const getUserTeams = async () => {
    try {
      const res = await axios.get(`http://localhost:8080/api/teams/users?page=${currentPage}&size=10&sortBy=teamName&isAsc=true`);
      setUserTeams(res.data.data.content);
      setTotalPages(res.data.data.totalPages);
    } catch (error) {
      console.error('Error fetching user teams:', error);
    }
  };

  const isLoggedIn = () => {
    // 로컬 스토리지에서 토큰을 가져오거나, 다른 방법으로 로그인 상태를 확인
    const accessToken = localStorage.getItem('accessToken');
    const refreshToken = localStorage.getItem('refreshToken');

    // 토큰이 존재하면 로그인 상태로 간주
    return !!accessToken && !!refreshToken;
  };

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setNewTeamName('');
  };

  const createNewTeam = async () => {
    try {
      // 팀 생성 API 호출
      // ...

      // 모달 닫기
      closeModal();
    } catch (error) {
      console.error('Error creating new team:', error);
    }
  };

  return (
      <div className="team-container">
        <h1>Team List</h1>
        {isLoggedIn() && userTeams ? (
            // 유저가 로그인한 경우 유저가 속한 팀 리스트를 출력
            <div>
              <ul>
                {userTeams.map((team) => (
                    <li key={team.teamId} className="team-item">
                      <h2 className="team-name">{team.teamName}</h2>
                      <p className="team-introduction">{team.teamIntroduction}</p>
                    </li>
                ))}
              </ul>
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <span
                        key={page}
                        className={page === currentPage ? "active" : ""}
                        onClick={() => handlePageChange(page)}
                    >
                {page}
              </span>
                ))}
              </div>
            </div>
        ) : teams ? (
            // 로그인하지 않은 경우 기본적으로 게임에 속한 팀 리스트를 출력
            <div>
              <ul>
                {teams.map((team) => (
                    <li key={team.teamId} className="team-item">
                      <h2 className="team-name">{team.teamName}</h2>
                      <p className="team-introduction">{team.teamIntroduction}</p>
                    </li>
                ))}
              </ul>
              <div className="pagination">
                {Array.from({ length: totalPages }, (_, index) => index + 1).map((page) => (
                    <span
                        key={page}
                        className={page === currentPage ? "active" : ""}
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

        {isModalOpen && (
            <div className="modal">
              <div className="modal-content">
            <span className="close" onClick={closeModal}>
              &times;
            </span>
                <h2>Create New Team</h2>
                <label>
                  Team Name:
                  <input
                      type="text"
                      value={newTeamName}
                      onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </label>
                <button onClick={createNewTeam}>Create</button>
              </div>
            </div>
        )}

        {isLoggedIn() && (
            <button className="create-team-button" onClick={openModal}>
              Create New Team
            </button>
        )}
      </div>
  );
};

export default Team;
