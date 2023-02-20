import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import './PlayerList.css';

const asterisk = <span>&#42;</span>;

const TRP = {
  short: 'TRP',
  full: 'Total Ranking Points'
}

const PlayerList = props => {
  const [TRPLabel, setTRPLabel] = useState(TRP.short);
  const navigate = useNavigate();
  
  if (props.items.length === 0) {
    return (
      <div className="player-list center">
        <Card>
          <h2>No players found!</h2>
        </Card>
      </div>
    );
  }

  const onTRPClick = () => {
    if (TRPLabel === TRP.short) {
      return setTRPLabel(TRP.full);
    }

    return setTRPLabel(TRP.short);
  }

  const goToPlayerStats = selectedPlayer => {
    navigate('/players/' + selectedPlayer.id + '/stats');
  }

  return (
    <>
      <ul className="player-list">
        <Card>
          <div className="player-list-header">
            <div className="player-position"></div>
            <div className="player-fullname">Player</div>
            <div className="player-points">
              <span onClick={onTRPClick}>{TRPLabel}{TRPLabel === TRP.short && asterisk}</span>
            </div>
          </div>
          {props.items.map((player, index) => (
            <div className="player-item" key={player.id ?? index} onClick={() => goToPlayerStats(player)}>
              <div className="player-position">{index + 1 + '.'}</div>
              <div className="player-fullname">{player.lastName + ' ' + player.firstName}</div>
              <div className="player-points">{player.rankingPoints ?? '-'}</div>
            </div>
          ))}
        </Card>
      </ul>
    </>
  );
};

export default PlayerList;
