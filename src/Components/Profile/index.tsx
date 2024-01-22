import React, { useState } from 'react';
import { UserData } from '../../Types/UserData';
import "./index.css";

const Profile = ({ username, userData }: { username: string | undefined, userData: UserData | null}) => {
  const [selectedStatsPeriod, setSelectedStatsPeriod] = useState(userData?.statsPeriod);

  const calculateWinRate = (wins: number, games: number) => {
    return games > 0 ? ((wins / games) * 100).toFixed(1) : "0";
  };

  const getStatsByPeriod = (period: string | undefined) => {
    switch (period) {
      case 'Last 5':
        return userData?.stats.last5Games;
      case 'Last 10':
        return userData?.stats.last10Games;
      case 'All time':
        return userData?.stats.allTime;
      default:
        return undefined;
    }
  };

  const selectedStats = getStatsByPeriod(selectedStatsPeriod);

  return (
    <div className="profile-container">
      <h2>{username}'s Profile</h2>
      <select
        value={selectedStatsPeriod}
        onChange={(e) => setSelectedStatsPeriod(e.target.value as 'All time' | 'Last 10' | 'Last 5')}
        className="stats-period-dropdown"
      >
        <option value="All time">All Games</option>
        <option value="Last 10">Last 10 Games</option>
        <option value="Last 5">Last 5 Games</option>
      </select>

      {selectedStats && (
        <div className="stats-card">
          <h3>{selectedStatsPeriod?.replace(/^\w/, (c) => c.toUpperCase())} Games</h3>
          <div className="stats-info">
            <p>Total Games: {selectedStats.gamesPlayed}</p>
            <p>Total Wins: {selectedStats.wins}</p>
            <p>Win Rate: {calculateWinRate(selectedStats.wins, selectedStats.gamesPlayed)}%</p>
          </div>
          <div className="roles-stats">
            <h4>Roles Wins | Games:</h4>
            <ul>
              {Object.entries(selectedStats.rolesPlayed).map(([role, count]) => (
                <li key={role}>
                  {role}: {selectedStats.winsPerRole[role]} | {count} ({calculateWinRate(selectedStats.winsPerRole[role], count)}%)
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;