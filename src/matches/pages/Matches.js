import React, { useEffect, useState } from 'react';

import MatchList from '../components/MatchList';
import ErrorModal from '../../shared/components/UIElements/ErrorModal';
import LoadingSpinner from '../../shared/components/UIElements/LoadingSpinner';
import ShowMore from '../../shared/components/UIElements/ShowMore';
import { useHttpClient } from '../../shared/hooks/http-hook';

const PAGE_SIZE = 25;

const Matches = () => {
  const [loadedMatches, setLoadedMatches] = useState();
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [pageNumber, setPageNumber] = useState(1);

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

  const handleShowMore = () => {
    setPageNumber(pageNumber + 1);
  }

  const matchDeletedHandler = deletedMatchId => {
    setLoadedMatches(prevMatches =>
      prevMatches.filter(match => match.id !== deletedMatchId)
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
      {!isLoading && loadedMatches && (
        <>
          <MatchList items={loadedMatches} pageNumber={pageNumber} pageSize={PAGE_SIZE} onDeleteMatch={matchDeletedHandler} />
          {loadedMatches.length > pageNumber * PAGE_SIZE && <ShowMore onClick={handleShowMore}>Show More</ShowMore>}
        </>
      )}
    </React.Fragment>
  );
};

export default Matches;
