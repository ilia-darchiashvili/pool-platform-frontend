import React, { useEffect, useState } from 'react';

import MatchList from '../components/MatchList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import { useHttpClient } from '../../shared/hooks/http-hook';

const Matches = () => {
  const [loadedMatches, setLoadedMatches] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        const responseData = await sendRequest(
          `${process.env.REACT_APP_BACKEND_URL}/matches`
        );
        setLoadedMatches(responseData.matches);
      } catch (err) {}
    };
    fetchMatches();
  }, [sendRequest]);

  return (
    <React.Fragment>
      <ErrorModal error={error} onClear={clearError} />
      {isLoading && (
        <div className="center">
          <LoadingSpinner />
        </div>
      )}
      {!isLoading && loadedMatches && (
        <MatchList items={loadedMatches} />
      )}
    </React.Fragment>
  );
};

export default Matches;
