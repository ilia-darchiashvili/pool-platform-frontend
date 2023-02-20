import React from 'react';

import './LoadingSpinner.css';

const LoadingSpinner = props => {
  return (
    <div className={`${props.asOverlay}`}>
      <div className="cue-ball cue-ball-volume"></div>
    </div>
  );
};

export default LoadingSpinner;
