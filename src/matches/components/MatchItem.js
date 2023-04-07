import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import Moment from 'moment';

import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';

import Card from '../../shared/components/UIElements/Card';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import maleIcon from '../../shared/assets/maleIcon.jpg';
import femaleIcon from '../../shared/assets/femaleIcon.jpg';
import './MatchItem.css';

const MatchItem = ({ match, onDeleteMatch }) => {
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  const {
    tournamentName,
    isRankingEvent,
    stage,
    player1,
    player2,
    player1Racks,
    player2Racks,
    player1Walkover,
    player2Walkover,
    isPlayer1Female,
    isPlayer2Female,
    player1Id,
    player2Id,
    date
  } = match;

  let winner;
  if (player1Racks > player2Racks || player1Walkover) {
    winner = "PLAYER1"
  } else {
    winner = "PLAYER2"
  }

  const navigate = useNavigate();

  const goToPlayerStats = playerId => {
    navigate('/players/' + playerId + '/stats');
  }

  const handleMatchDelete = async () => {
    if (match?.id) {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/matches/${match.id}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      onDeleteMatch(match.id);
    }
  }

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <Card className="match-card">
        <div className="tournament-name">
          {tournamentName}
        </div>
        {isRankingEvent && (
          <div className="ranking-event">
            Ranking Event
          </div>
        )}
        {stage && (
          <div className="tournament-stage">
            {stage}
          </div>
        )}
        <div className="match-info">
          <img className="match-player-image" src={isPlayer1Female ? femaleIcon : maleIcon} alt="Player 1 Image" onClick={() => goToPlayerStats(player1Id)} />
          <div className={winner === "PLAYER1" ? "match-player-name player-winner" : "match-player-name"} onClick={() => goToPlayerStats(player1Id)}>{player1}</div>
          <div className={winner === "PLAYER1" ? "player1-score player1-winner" : "player1-score player1-loser"}>{(player1Racks || player1Racks === 0) ? player1Racks : (player1Walkover ? 'WO' : '-')}</div>
          <div className={winner === "PLAYER2" ? "player2-score player2-winner" : "player2-score player2-loser"}>{(player2Racks || player2Racks === 0) ? player2Racks : (player2Walkover ? 'WO' : '-')}</div>
          <div className={winner === "PLAYER2" ? "match-player-name player-winner" : "match-player-name"} onClick={() => goToPlayerStats(player2Id)}>{player2}</div>
          <img className="match-player-image" src={isPlayer2Female ? femaleIcon : maleIcon} alt="Player 2 Image" onClick={() => goToPlayerStats(player2Id)} />
        </div>
        <div className="tournament-date">
          {Moment(date).format('DD MMM YYYY')}
        </div>
        {auth?.isLoggedIn && auth?.isManager && onDeleteMatch && (
          <div className="center">
            <Button danger size="x-small" onClick={handleMatchDelete}>DEL</Button>
          </div>
        )}
      </Card>
    </>
  );
};

export default MatchItem;
