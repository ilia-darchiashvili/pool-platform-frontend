import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

import Card from '../../shared/components/UIElements/Card';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import PlayerItem from '../components/PlayerItem';
import './PlayerForm.scss';

const PlayerStats = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlayer, setLoadedPlayer] = useState();
  const playerId = useParams().playerId;

  useEffect(() => {
    const fetchPlayer = async () => {
      if (playerId) {
        try {
          const responseData = await sendRequest(
            `${process.env.REACT_APP_BACKEND_URL}/players/${playerId}`
          );
          setLoadedPlayer(responseData);
        } catch (err) {}
      }
    };
    fetchPlayer();
  }, [sendRequest, playerId]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!loadedPlayer && !error) {
    return (
      <div className="center">
        <Card>
          <h2>Could not find player!</h2>
        </Card>
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {!isLoading && loadedPlayer && (
        <PlayerItem player={loadedPlayer.player} matches={loadedPlayer.matches} />
      )}
    </React.Fragment>
  );
};

export default PlayerStats;
