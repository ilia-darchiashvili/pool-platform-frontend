import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import MatchItem from '../../matches/components/MatchItem';
import maleIcon from '../../shared/assets/maleIcon.jpg';
import femaleIcon from '../../shared/assets/femaleIcon.jpg';
import './PlayerItem.css';

const PlayerItem = ({ player, matches }) => {
  const {
    totalMatches,
    matchesWon,
    totalRacks,
    racksWon,
    highestPlace,
    rankingPoints,
    isFemale
  } = player;

  let matchesWonPercentage = null;
  let racksWonPercentage = null;

  if (totalMatches) {
    matchesWonPercentage = Math.round(matchesWon/totalMatches * 100);
  }

  if (totalRacks) {
    racksWonPercentage = Math.round(racksWon/totalRacks * 100);
  }

  return (
    <>
      <Card className="stats-card">
        <div className="stats-header">
          <img className="player-image" src={isFemale ? femaleIcon : maleIcon} alt="Player Image" />
          <div className="player-name">
            {player.firstName + ' ' + player.lastName}
          </div>
        </div>
        <div className="stats-content">
          <div className="stat-wrapper">
            <div>Total Matches</div>
            <div className="stat-divider"></div>
            <div>{totalMatches}</div>
          </div>
          <div className="stat-wrapper">
            <div>Matches Won</div>
            <div className="stat-divider"></div>
            <div>{(matchesWon) + (matchesWonPercentage >= 0 ? (' (' + matchesWonPercentage + '%)') : '')}</div>
          </div>
          <div className="stat-wrapper">
            <div>Total Racks</div>
            <div className="stat-divider"></div>
            <div>{totalRacks}</div>
          </div>
          <div className="stat-wrapper">
            <div>Racks Won</div>
            <div className="stat-divider"></div>
            <div>{(racksWon) + (racksWonPercentage >= 0 ? (' (' + racksWonPercentage + '%)') : '')}</div>
          </div>
          <div className="stat-wrapper">
            <div>Highest Place</div>
            <div className="stat-divider"></div>
            <div>{highestPlace ?? '-'}</div>
          </div>
          <div className="stat-wrapper">
            <div>Total Ranking Points</div>
            <div className="stat-divider"></div>
            <div>{rankingPoints ?? '-'}</div>
          </div>
        </div>
      </Card>
      {matches?.length > 0 && <h1 style={{textAlign: 'center', color: 'white', marginTop: '45px'}}>Recent Matches</h1>}
      {matches?.length > 0 && matches.map(match => (
        <MatchItem key={match.id} match={match} />
      ))}
    </>
  );
};

export default PlayerItem;
