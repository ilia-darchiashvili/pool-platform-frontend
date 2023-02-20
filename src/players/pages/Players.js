import React, { useEffect, useState } from 'react';

import PlayerList from '../components/PlayerList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Players = () => {
  const [loadedPlayers, setLoadedPlayers] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/players`
        );
        setLoadedPlayers(responseData.players.sort((a, b) => b.rankingPoints - a.rankingPoints));
      } catch (err) {}
    };
    fetchPlayers();
  }, [sendRequest]);

  const playerDeletedHandler = deletedPlayerId => {
    setLoadedPlayers(prevPlayers =>
      prevPlayers.filter(player => player.id !== deletedPlayerId)
    );
  };

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedPlayers && (
        <PlayerList items={loadedPlayers} onDeletePlayer={playerDeletedHandler} />
      )}
    </React.Fragment>
  );
};

export default Players;
