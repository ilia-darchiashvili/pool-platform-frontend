import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import MatchList from '../../matches/components/MatchList';
import maleIcon from '../../shared/assets/maleIcon.jpg';
import femaleIcon from '../../shared/assets/femaleIcon.jpg';
import ShowMore from '../../shared/components/UIElements/ShowMore';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlayerItem.css';


const PAGE_SIZE = 10;

const asterisk = <span>&#42;</span>;

const HIGHEST_PLACE = {
  short: 'Highest Place',
  full: 'Highest Place (Ranking Events)'
}

const PlayerItem = ({ player, matches }) => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [ highestPlaceLabel, setHighestPlaceLabel ] = useState(HIGHEST_PLACE.short);
  const [pageNumber, setPageNumber] = useState(1);
  const [ loadedPlayers, setLoadedPlayers ] = useState();
  const navigate = useNavigate();

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

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/players`
        );
        const displayOtherPlayers = responseData.players?.filter(selfPlayer => selfPlayer.id !== player?.id)?.map(displayPlayer => {
            const displayName = displayPlayer.lastName + ' ' + displayPlayer.firstName
            return {...displayPlayer, displayName};
        })
        setLoadedPlayers(displayOtherPlayers);
      } catch (err) {}
    };
    fetchPlayers();
  }, [sendRequest]);

  const goToCompare = event => {
    navigate('/compare', {
      state: {
        player1Id: player?.id,
        player2Id: JSON.parse(event?.target?.value)?.id
      }
    });
  }

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <>
      <ErrorModal error={error} onClear={clearError} />
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
          <div className="compare-player-wrapper">
            <div className="compare-label">Compare VS</div>
            <select
                onChange={goToCompare}
                className="player-select compare-player center"
            >
              <option key={"null-value"} value={null} className="hide-select-placeholder">Select Player</option>
              {loadedPlayers?.map(player => (
                  <option key={player.id} value={JSON.stringify(player)}>{player.displayName}</option>
              ))}
            </select>
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
