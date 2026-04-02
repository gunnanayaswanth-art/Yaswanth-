import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Music, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const DUMMY_TRACKS = [
  {
    id: 1,
    title: "NEON DREAMS",
    artist: "AI_GEN_V1",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    color: "neon-cyan"
  },
  {
    id: 2,
    title: "CYBERPUNK PULSE",
    artist: "AI_GEN_V2",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    color: "neon-magenta"
  },
  {
    id: 3,
    title: "SYNTH WAVE",
    artist: "AI_GEN_V3",
    url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    color: "neon-lime"
  }
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const currentTrack = DUMMY_TRACKS[currentTrackIndex];

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + DUMMY_TRACKS.length) % DUMMY_TRACKS.length);
    setIsPlaying(true);
  };

  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play();
    }
  }, [currentTrackIndex]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const p = (audio.currentTime / audio.duration) * 100;
      setProgress(p || 0);
    };

    const handleEnded = () => {
      nextTrack();
    };

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="w-full max-w-[400px] bg-black border-2 border-neon-cyan p-4 font-pixel relative overflow-hidden">
      {/* Background Static for Player */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://upload.wikimedia.org/wikipedia/commons/5/5a/Can_of_static.png')] animate-static" />
      
      <audio ref={audioRef} src={currentTrack.url} />

      <div className="flex items-center gap-4 mb-4 relative z-10">
        <div className="w-12 h-12 bg-neon-magenta flex items-center justify-center border-2 border-black animate-pulse">
          <Music className="w-6 h-6 text-black" />
        </div>
        <div className="flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentTrack.id}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              className="animate-tearing"
            >
              <h3 className="text-[10px] text-neon-magenta glitch-text mb-1" data-text={currentTrack.title}>{currentTrack.title}</h3>
              <p className="text-[8px] text-neon-yellow opacity-80 tracking-tighter">SRC: {currentTrack.artist}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-4 relative z-10">
        {/* Progress Bar */}
        <div className="relative h-4 bg-gray-900 border border-neon-cyan/50 overflow-hidden">
          <motion.div 
            className="absolute top-0 left-0 h-full bg-neon-cyan"
            style={{ width: `${progress}%` }}
          />
          <div className="absolute inset-0 flex items-center justify-center text-[8px] text-white mix-blend-difference">
            {Math.floor(progress)}%_SYNC
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between px-2">
          <button 
            onClick={prevTrack}
            className="p-2 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors"
          >
            <SkipBack className="w-4 h-4" />
          </button>
          
          <button 
            onClick={togglePlay}
            className="px-6 py-2 bg-neon-magenta text-black border-2 border-black hover:bg-neon-yellow transition-colors"
          >
            {isPlaying ? <Pause className="w-6 h-6 fill-current" /> : <Play className="w-6 h-6 fill-current" />}
          </button>

          <button 
            onClick={nextTrack}
            className="p-2 border border-neon-cyan text-neon-cyan hover:bg-neon-cyan hover:text-black transition-colors"
          >
            <SkipForward className="w-4 h-4" />
          </button>
        </div>

        <div className="flex justify-between text-[6px] text-neon-cyan opacity-40 uppercase tracking-widest">
          <span>BITRATE: 128KBPS</span>
          <span>BUFFER: 100%</span>
        </div>
      </div>
    </div>
  );
}
