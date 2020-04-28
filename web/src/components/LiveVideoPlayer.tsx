import React from 'react';
import ReactPlayer from 'react-player';

interface LiveVideoPlayerProps {
  hlsUrl?: string;
}

const LiveVideoPlayer = (props: LiveVideoPlayerProps) => {
  if (!props.hlsUrl) {
    return null;
  }

  return (
    <ReactPlayer
      url={props.hlsUrl}
      height="100%"
      width="100%"
      controls
      playsinline
      playing
    />
  );
};

export default LiveVideoPlayer;
