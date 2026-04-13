import { createContext, useContext, useState, useRef, useEffect } from 'react';

const PlayerContext = createContext(null);

export function PlayerProvider({ children }) {
  const [currentTrack, setCurrentTrack] = useState(null);
  const [queue, setQueue] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const audioRef = useRef(new Audio());

  useEffect(() => {
    const audio = audioRef.current;
    audio.volume = volume;

    const onTimeUpdate = () => setProgress(audio.currentTime);
    const onDuration = () => setDuration(audio.duration);
    const onEnded = () => {
      setIsPlaying(false);
      playNext();
    };

    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('loadedmetadata', onDuration);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('loadedmetadata', onDuration);
      audio.removeEventListener('ended', onEnded);
    };
  }, [queue]);

  useEffect(() => {
    audioRef.current.volume = volume;
  }, [volume]);

  const play = (track, trackQueue = []) => {
    const audio = audioRef.current;

    if (currentTrack?._id === track._id && isPlaying) {
      audio.pause();
      setIsPlaying(false);
      return;
    }

    if (currentTrack?._id !== track._id) {
      audio.src = track.uri;
      audio.load();
    }

    if (trackQueue.length) setQueue(trackQueue);

    audio.play().then(() => {
      setCurrentTrack(track);
      setIsPlaying(true);
    }).catch(() => {
      setCurrentTrack(track);
      setIsPlaying(false);
    });
  };

  const togglePlay = () => {
    const audio = audioRef.current;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play();
      setIsPlaying(true);
    }
  };

  const seek = (time) => {
    audioRef.current.currentTime = time;
    setProgress(time);
  };

  const playNext = () => {
    if (!currentTrack || !queue.length) return;
    const idx = queue.findIndex(t => t._id === currentTrack._id);
    if (idx < queue.length - 1) play(queue[idx + 1], queue);
  };

  const playPrev = () => {
    if (!currentTrack || !queue.length) return;
    const idx = queue.findIndex(t => t._id === currentTrack._id);
    if (idx > 0) play(queue[idx - 1], queue);
  };

  return (
    <PlayerContext.Provider value={{
      currentTrack, isPlaying, progress, duration, volume,
      play, togglePlay, seek, playNext, playPrev, setVolume,
    }}>
      {children}
    </PlayerContext.Provider>
  );
}

export const usePlayer = () => useContext(PlayerContext);