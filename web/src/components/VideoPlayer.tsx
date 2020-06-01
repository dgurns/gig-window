import React, { useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

interface VideoPlayerProps {
  hlsUrl?: string;
  shouldPlay?: boolean;
  shouldHideControls?: boolean;
}

const VideoPlayer = ({
  hlsUrl,
  shouldPlay = true,
  shouldHideControls = false,
}: VideoPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (shouldPlay) {
      setIsPlaying(true);
    }
  }, [shouldPlay]);

  if (!hlsUrl) {
    return null;
  }

  return (
    <ReactPlayer
      url={hlsUrl}
      height="100%"
      width="100%"
      controls={!shouldHideControls}
      playsinline
      playing={isPlaying}
    />
  );
};

export default React.memo(VideoPlayer);
