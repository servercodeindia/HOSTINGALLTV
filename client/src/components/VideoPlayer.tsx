import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { 
  AlertCircle, Play, Pause, Volume2, Maximize, 
  RotateCcw, RotateCw, Settings, SkipBack, SkipForward,
  FastForward, Rewind, VolumeX, X
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { cn } from "@/lib/utils";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  videoUrl: string;
  title: string;
}

const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];

export function VideoPlayer({ isOpen, onClose, videoUrl, title }: VideoPlayerProps) {
  const [error, setError] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [played, setPlayed] = useState(0);
  const [duration, setDuration] = useState(0);
  const [showControls, setShowControls] = useState(true);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<any>(null);
  const controlsTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isOpen && videoRef.current && !playerRef.current) {
      setError(false);
      
      playerRef.current = videojs(videoRef.current, {
        autoplay: true,
        controls: false,
        responsive: true,
        fluid: true,
        preload: 'auto',
      });

      const player = playerRef.current;

      player.on('play', () => setPlaying(true));
      player.on('pause', () => setPlaying(false));
      player.on('timeupdate', () => {
        setPlayed(player.currentTime() / player.duration() || 0);
      });
      player.on('durationchange', () => setDuration(player.duration()));
      player.on('error', () => {
        console.error("Video.js error:", player.error());
        setError(true);
      });
      
      player.src({ 
        src: videoUrl,
        type: videoUrl.toLowerCase().endsWith('.mkv') ? 'video/x-matroska' : 
              videoUrl.toLowerCase().endsWith('.mp4') ? 'video/mp4' : 'video/mp4'
      });

      player.on('touchstart', () => handleMouseMove());
      
      player.volume(volume);
      player.playbackRate(playbackSpeed);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen || !playerRef.current) return;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowleft':
          e.preventDefault();
          handleSkip(-5);
          break;
        case 'arrowright':
          e.preventDefault();
          handleSkip(5);
          break;
        case 'j':
          e.preventDefault();
          handleSkip(-10);
          break;
        case 'l':
          e.preventDefault();
          handleSkip(10);
          break;
        case 'arrowup':
          e.preventDefault();
          setVolume(prev => Math.min(1, prev + 0.05));
          break;
        case 'arrowdown':
          e.preventDefault();
          setVolume(prev => Math.max(0, prev - 0.05));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (playerRef.current) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [isOpen, videoUrl]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.volume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (playerRef.current) {
      playerRef.current.playbackRate(playbackSpeed);
    }
  }, [playbackSpeed]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) clearTimeout(controlsTimeoutRef.current);
    controlsTimeoutRef.current = setTimeout(() => setShowControls(false), 3000);
  };

  const togglePlay = () => {
    if (!playerRef.current) return;
    if (playerRef.current.paused()) {
      playerRef.current.play();
    } else {
      playerRef.current.pause();
    }
    handleMouseMove();
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
    handleMouseMove();
  };

  const handleSkip = (seconds: number) => {
    if (!playerRef.current) return;
    const currentTime = playerRef.current.currentTime();
    playerRef.current.currentTime(Math.max(0, Math.min(currentTime + seconds, duration)));
    handleMouseMove();
  };

  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    if (playerRef.current.isFullscreen()) {
      playerRef.current.exitFullscreen();
    } else {
      playerRef.current.requestFullscreen();
    }
    handleMouseMove();
  };

  const formatTime = (seconds: number) => {
    if (!seconds) return "0:00";
    const date = new Date(seconds * 1000);
    const hh = date.getUTCHours();
    const mm = date.getUTCMinutes();
    const ss = date.getUTCSeconds().toString().padStart(2, '0');
    if (hh) {
      return `${hh}:${mm.toString().padStart(2, '0')}:${ss}`;
    }
    return `${mm}:${ss}`;
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent 
        className="max-w-none w-screen h-screen p-0 border-none bg-black overflow-hidden flex flex-col items-center justify-center rounded-none [&>button]:text-white [&>button]:z-[100] [&>button]:bg-black/60 [&>button]:hover:bg-white/20 [&>button]:p-3 [&>button]:rounded-full [&>button]:top-8 [&>button]:right-8 [&>button]:scale-125 [&>button]:transition-all"
        onMouseMove={handleMouseMove}
      >
        <DialogTitle className="sr-only">Playing {title}</DialogTitle>
        <DialogDescription className="sr-only">Video player for {title}</DialogDescription>
        
        {isOpen && (
          <div 
            className={cn(
              "w-full h-full relative flex items-center justify-center transition-all duration-300",
              showControls ? "cursor-default" : "cursor-none"
            )}
          >
            {/* Manual Close Button for Mobile/Android */}
            {showControls && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-8 right-8 z-[101] text-white bg-black/40 rounded-full h-12 w-12 md:hidden hover:bg-white/20"
                onClick={onClose}
              >
                <X className="w-8 h-8" />
              </Button>
            )}

            {error ? (
              <div className="w-full h-full flex flex-col items-center justify-center bg-black text-white p-6 text-center">
                <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
                <h3 className="text-2xl font-bold mb-2">Playback Error</h3>
                <p className="text-white/60 mb-6 max-w-md">
                  We're having trouble playing this video. VLC-style playback might require a different format.
                </p>
                <div className="flex gap-4">
                  <Button variant="outline" asChild>
                    <a href={videoUrl} target="_blank" rel="noopener noreferrer">
                      Try Direct Link
                    </a>
                  </Button>
                  <Button onClick={() => window.location.reload()}>
                    Reload Page
                  </Button>
                  <Button onClick={onClose}>
                    Close Player
                  </Button>
                </div>
              </div>
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-black">
                <video
                  ref={videoRef}
                  className="w-full h-full"
                  playsInline
                  autoPlay
                  src={videoUrl}
                />
              </div>
            )}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
