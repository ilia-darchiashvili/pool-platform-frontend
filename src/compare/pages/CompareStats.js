import React, { useEffect, useState } from 'react';

import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import { useHttpClient } from '../../shared/hooks/http-hook';
import CompareItem from '../components/CompareItem';

const CompareStats = () => {
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [loadedPlayers, setLoadedPlayers] = useState();

useEffect(() => {
    const fetchPlayers = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/players`
        );
        const displayPlayers = responseData.players.map(player => {
            const displayName = player.lastName + ' ' + player.firstName
            return {...player, displayName};
        })
        setLoadedPlayers(displayPlayers);
      } catch (err) {}
    };
    fetchPlayers();
  }, [sendRequest]);

  if (isLoading) {
    return (
      <div className="center">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {loadedPlayers && <CompareItem loadedPlayers={loadedPlayers} />}
    </React.Fragment>
  );
};

export default CompareStats;
