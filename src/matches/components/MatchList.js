import React from 'react';

import Card from '../../shared/components/UIElements/Card';
import MatchItem from './MatchItem';
import './MatchList.css';

const MatchList = props => {
  
  if (props.items.length === 0) {
    return (
      <div className="match-list center">
        <Card>
          <h2>No matches found!</h2>
        </Card>
      </div>
    );
  }

  return (
    <>
      {props.items.map((match, index) => (
        index < props.pageNumber * props.pageSize && <MatchItem key={match.id} match={match} onDeleteMatch={props?.onDeleteMatch} />
      ))}
    </>
  );
};

export default MatchList;
