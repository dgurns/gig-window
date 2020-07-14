import React, { useEffect, useRef, useState, useCallback } from 'react';
import Hls from 'hls.js';

interface HlsPlayerProps {
  hlsUrl?: string;
  shouldPlay?: boolean;
  shouldHideControls?: boolean;
}

const playerConfig = {
  liveSyncDurationCount: 1,
  liveDurationInfinity: true,
};

const HlsPlayer = ({
  hlsUrl,
  shouldPlay = true,
  shouldHideControls = false,
}: HlsPlayerProps) => {
  const hlsPlayerRef = useRef<HTMLVideoElement>(null);
  const [manifestIsLoaded, setManifestIsLoaded] = useState(false);

  const playVideo = useCallback(() => {
    const hlsPlayer = hlsPlayerRef.current;
    if (!hlsPlayer || !manifestIsLoaded) {
      return;
    }

    const { buffered } = hlsPlayer;
    if (buffered.length !== 0) {
      hlsPlayer.currentTime = buffered.end(buffered.length - 1);
    }
    hlsPlayer.play();
  }, [hlsPlayerRef, manifestIsLoaded]);

  useEffect(() => {
    if (shouldPlay) {
      playVideo();
    }
  }, [shouldPlay, playVideo]);

  useEffect(() => {
    if (!hlsUrl || !hlsPlayerRef.current || !Hls.isSupported()) {
      return;
    }

    const hls = new Hls(playerConfig);
    hls.loadSource(hlsUrl ?? '');
    hls.attachMedia(hlsPlayerRef.current);
    hls.on(Hls.Events.MANIFEST_PARSED, () => setManifestIsLoaded(true));
  }, [hlsUrl]);

  if (!hlsUrl) {
    return null;
  }

  return (
    <video
      ref={hlsPlayerRef}
      width="100%"
      height="100%"
      onPlay={playVideo}
      controls={!shouldHideControls}
    />
  );
};

export default HlsPlayer;