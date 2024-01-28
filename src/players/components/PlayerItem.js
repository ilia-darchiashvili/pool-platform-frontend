import React, { useState } from 'react';

import Card from '../../shared/components/UIElements/Card';
import MatchList from '../../matches/components/MatchList';
import maleIcon from '../../shared/assets/maleIcon.jpg';
import femaleIcon from '../../shared/assets/femaleIcon.jpg';
import ShowMore from '../../shared/components/UIElements/ShowMore';
import './PlayerItem.css';


const PAGE_SIZE = 10;

const asterisk = <span>&#42;</span>;

const HIGHEST_PLACE = {
  short: 'Highest Place',
  full: 'Highest Place (Ranking Events)'
}

const PlayerItem = ({ player, matches }) => {
  const [ highestPlaceLabel, setHighestPlaceLabel ] = useState(HIGHEST_PLACE.short);
  const [pageNumber, setPageNumber] = useState(1);

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

  const handleShowMore = () => {
    setPageNumber(pageNumber + 1);
  }
  
  const onHighestPlaceClick = () => {
    if (highestPlaceLabel === HIGHEST_PLACE.short) {
      return setHighestPlaceLabel(HIGHEST_PLACE.full);
    }

    return setHighestPlaceLabel(HIGHEST_PLACE.short);
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
            <div>{(matchesWon) + (matchesWonPercentage !== null && (' (' + matchesWonPercentage + '%)'))}</div>
          </div>
          <div className="stat-wrapper">
            <div>Total Racks</div>
            <div className="stat-divider"></div>
            <div>{totalRacks}</div>
          </div>
          <div className="stat-wrapper">
            <div>Racks Won</div>
            <div className="stat-divider"></div>
            <div>{(racksWon) + (racksWonPercentage !== null && (' (' + racksWonPercentage + '%)'))}</div>
          </div>
          <div className="stat-wrapper">
            <div onClick={onHighestPlaceClick} className="highest-place-label">{highestPlaceLabel}{highestPlaceLabel === HIGHEST_PLACE.short && asterisk}</div>
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
      {matches?.length > 0 && (
        <>
          <MatchList items={matches} pageNumber={pageNumber} pageSize={PAGE_SIZE} />
          {matches.length > pageNumber * PAGE_SIZE && <ShowMore onClick={handleShowMore}>Show More</ShowMore>}
        </>
      )}
    </>
  );
};

export default PlayerItem;
