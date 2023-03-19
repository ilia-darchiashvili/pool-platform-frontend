import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import Modal from '../../shared/components/UIElements/Modal';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import Button from '../../shared/components/FormElements/Button';
import { AuthContext } from '../../shared/context/auth-context';
import { useHttpClient } from '../../shared/hooks/http-hook';
import './PlayerList.css';

const asterisk = <span>&#42;</span>;

const TRP = {
  short: 'TRP',
  full: 'Total Ranking Points'
}

const PlayerList = props => {
  const [TRPLabel, setTRPLabel] = useState(TRP.short);
  const navigate = useNavigate();
  const auth = useContext(AuthContext);
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [selectedPlayerId, setSelectedPlayerId] = useState(null);
  
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

  const showDeleteWarningHandler = playerId => {
    setShowConfirmModal(true);
    setSelectedPlayerId(playerId);
  };

  const cancelDeleteHandler = () => {
    setShowConfirmModal(false);
    setSelectedPlayerId(null);
  };

  const removePlayer = async () => {
    setShowConfirmModal(false);
    if (selectedPlayerId) {
      await sendRequest(
        `${process.env.REACT_APP_BACKEND_URL}/players/${selectedPlayerId}`,
        'DELETE',
        null,
        {
          Authorization: 'Bearer ' + auth.token
        }
      );
      props.onDeletePlayer(selectedPlayerId);
      setSelectedPlayerId(null);
    }
  }

  return (
    <>
      {isLoading && <LoadingSpinner asOverlay />}
      <ErrorModal error={error} onClear={clearError} />
      <Modal
        show={showConfirmModal}
        onCancel={cancelDeleteHandler}
        header="Are you sure?"
        footerClass="player-modal-actions"
        footer={
          <React.Fragment>
            <Button inverse onClick={cancelDeleteHandler}>
              CANCEL
            </Button>
            <Button danger onClick={removePlayer}>
              DELETE
            </Button>
          </React.Fragment>
        }
      >
        <p>
          Are you sure you want to delete this player? Please note that it
          can't be undone thereafter!
        </p>
      </Modal>
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
              <Button inverse size="x-small">UPD</Button>
              <Button danger size="x-small" onClick={event => {event.stopPropagation(); showDeleteWarningHandler(player?.id)}}>DEL</Button>
            </div>
          ))}
        </Card>
      </ul>
    </>
  );
};

export default PlayerList;
