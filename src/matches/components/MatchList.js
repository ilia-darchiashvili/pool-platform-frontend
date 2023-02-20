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
      {props.items.map(match => (
        <MatchItem key={match.id} match={match} />
      ))}
    </>
  );
};

export default MatchList;
