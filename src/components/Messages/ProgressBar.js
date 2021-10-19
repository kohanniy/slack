import React from 'react';
import { Progress } from 'semantic-ui-react';

function ProgressBar(props) {
  const {
    sendImageLoading,
    percentUploaded,
  } = props;

  return (
    sendImageLoading && (
      <Progress
        className='progress__bar'
        percent={percentUploaded}
        progress
        indicating
        size='medium'
        inverted
      />
    )
  )
}

export default ProgressBar;
