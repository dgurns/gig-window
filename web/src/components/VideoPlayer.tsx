import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  hlsUrl?: string;
  isPlaying?: boolean;
}

const VideoPlayer = (props: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (props.isPlaying) {
      setIsPlaying(true);
    }
  }, [props.isPlaying]);

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
      playing={isPlaying}
      onPause={() => setIsPlaying(false)}
      onPlay={() => setIsPlaying(true)}
    />
  );
};

export default React.memo(VideoPlayer);
