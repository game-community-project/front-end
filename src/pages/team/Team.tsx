import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { TeamDto } from '../../dto/Team';

import './Team.css';

const Team: React.FC = () => {
  const [teams, setTeams] = useState<TeamDto[] | null>(null);

  useEffect(() => {
    const gameName = "LEAGUE_OF_LEGEND"; // 예시로 하드코딩, 실제로는 동적으로 값을 받아오세요
    getTeams(gameName);
  }, []);

  const getTeams = async (gameName:string) => {
    try {
      const res = await axios.get(`http://localhost:8080/api/teams?gameName=${gameName}`);
      setTeams(res.data.data);
      console.log(res.data.data);
    } catch (error) {
      console.error('Error fetching teams:', error);
    }
  };

  return (
      <div>
        <h1>Team List</h1>
        {teams ? (
            <ul>
              {teams.map((team) => (
                  <li key={team.teamId}>
                    <h2>{team.teamName}</h2>
                    <p>{team.teamIntroduction}</p>
                  </li>
              ))}
            </ul>
        ) : (
            <p>Loading teams...</p>
        )}
      </div>
  );
};

export default Team;
