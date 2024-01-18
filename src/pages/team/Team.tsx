import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TeamDto } from '../../dto/Team';

import './Team.css'; // Import your custom CSS file

const Team: React.FC = () => {
  const [teams, setTeams] = useState<TeamDto[] | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const gameName = "LEAGUE_OF_LEGEND"; // 예시로 하드코딩, 실제로는 동적으로 값을 받아오세요
    getTeams(gameName, currentPage);
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

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
  };

  return (
      <div className="team-container">
        <h1>Team List</h1>
        {teams ? (
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
            <p>Loading teams...</p>
        )}
      </div>
  );
};

export default Team;
