import React from 'react';

import './ShowMore.css';

const ShowMore = props => {
  return (
    <div className={`center show-more ${props.className}`} onClick={props?.onClick}>
      {props.children}
    </div>
  );
};

export default ShowMore;
