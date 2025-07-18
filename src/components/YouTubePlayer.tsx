
import React, { useEffect, useRef, useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Link } from 'lucide-react';

interface YouTubePlayerProps {
  onTimeUpdate: (time: number) => void;
  currentTime: number;
  onPlay: () => void;
  onPause: () => void;
  isPlaying: boolean;
  onVideoDurationChange: (duration: number) => void;
  onVideoInfoChange: (info: { title: string; url: string }) => void;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

const YouTubePlayer: React.FC<YouTubePlayerProps> = ({
  onTimeUpdate,
  currentTime,
  onPlay,
  onPause,
  isPlaying,
  onVideoDurationChange,
  onVideoInfoChange
}) => {
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoId, setVideoId] = useState('');
  const [player, setPlayer] = useState<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [videoTitle, setVideoTitle] = useState('');
  const playerRef = useRef<HTMLDivElement>(null);
  const timeUpdateInterval = useRef<NodeJS.Timeout>();

  useEffect(() => {
    // Cargar la API de YouTube
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = initializePlayer;
    } else {
      initializePlayer();
    }

    return () => {
      if (timeUpdateInterval.current) {
        clearInterval(timeUpdateInterval.current);
      }
    };
  }, []);

  const initializePlayer = () => {
    if (window.YT && window.YT.Player && playerRef.current) {
      const newPlayer = new window.YT.Player(playerRef.current, {
        height: '1',
        width: '1',
        playerVars: {
          controls: 0,
          modestbranding: 1,
          rel: 0,
          autoplay: 0,
          mute: 0
        },
        events: {
          onReady: () => {
            setIsLoaded(true);
            console.log('YouTube player ready');
          },
          onStateChange: (event: any) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              startTimeTracking();
              onPlay();
            } else if (event.data === window.YT.PlayerState.PAUSED) {
              stopTimeTracking();
              onPause();
            }
          }
        }
      });
      setPlayer(newPlayer);
    }
  };

  const startTimeTracking = () => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
    }
    
    timeUpdateInterval.current = setInterval(() => {
      if (player && player.getCurrentTime && player.getPlayerState && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
        const time = player.getCurrentTime();
        console.log('YouTube time update:', time); // Debug log
        onTimeUpdate(time);
      }
    }, 100); // Intervalo de 100ms para mejor sincronización
  };

  const stopTimeTracking = () => {
    if (timeUpdateInterval.current) {
      clearInterval(timeUpdateInterval.current);
    }
  };

  const extractVideoId = (url: string) => {
    const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/);
    return match ? match[1] : '';
  };

  const handleUrlSubmit = async () => {
    const id = extractVideoId(youtubeUrl);
    if (id && player) {
      setVideoId(id);
      player.loadVideoById(id);
      
      // Esperar a que se cargue el video para obtener información
      setTimeout(() => {
        const duration = player.getDuration();
        const title = player.getVideoData()?.title || 'Video de YouTube';
        
        setVideoTitle(title);
        onVideoDurationChange(duration);
        onVideoInfoChange({ title, url: youtubeUrl });
      }, 1000);
    }
  };

  const handlePlayPause = () => {
    if (!player || !videoId) return;
    
    if (isPlaying) {
      player.pauseVideo();
    } else {
      player.playVideo();
    }
  };

  const handleSeek = (time: number) => {
    if (player && videoId) {
      player.seekTo(time, true);
    }
  };

  const toggleMute = () => {
    if (player) {
      if (isMuted) {
        player.unMute();
      } else {
        player.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  // Sincronizar con el currentTime del timeline solo cuando sea necesario
  useEffect(() => {
    if (player && player.seekTo && player.getCurrentTime && !isPlaying) {
      const playerTime = player.getCurrentTime();
      if (Math.abs(playerTime - currentTime) > 1) {
        player.seekTo(currentTime, true);
      }
    }
  }, [currentTime, player, isPlaying]);

  // Manejar cambios de estado de reproducción
  useEffect(() => {
    if (player && player.getPlayerState) {
      if (isPlaying && player.getPlayerState() !== window.YT.PlayerState.PLAYING) {
        player.playVideo();
      } else if (!isPlaying && player.getPlayerState() === window.YT.PlayerState.PLAYING) {
        player.pauseVideo();
      }
    }
  }, [isPlaying, player]);

  return (
    <div className="bg-white border rounded-lg shadow-sm">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2 mb-3">
          <Link className="w-5 h-5 text-red-600" />
          <span className="font-medium text-gray-900">Reproductor YouTube</span>
        </div>
        
        <div className="flex space-x-2 mb-3">
          <input
            type="text"
            value={youtubeUrl}
            onChange={(e) => setYoutubeUrl(e.target.value)}
            placeholder="Pega aquí el link de YouTube..."
            className="flex-1 px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            onKeyPress={(e) => e.key === 'Enter' && handleUrlSubmit()}
          />
          <button
            onClick={handleUrlSubmit}
            disabled={!youtubeUrl.trim()}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
          >
            Cargar
          </button>
        </div>

        {videoTitle && (
          <div className="text-sm text-gray-600 mb-2">
            <strong>Video:</strong> {videoTitle}
          </div>
        )}
      </div>

      <div className="p-4">
        {/* Reproductor oculto */}
        <div ref={playerRef} className="hidden"></div>
        
        {videoId && (
          <div className="flex items-center justify-center space-x-4">
            <button
              onClick={handlePlayPause}
              disabled={!isLoaded}
              className="flex items-center justify-center w-12 h-12 bg-red-600 text-white rounded-full hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPlaying ? (
                <Pause className="w-6 h-6" />
              ) : (
                <Play className="w-6 h-6 ml-1" />
              )}
            </button>
            
            <button
              onClick={toggleMute}
              className="p-2 text-gray-600 hover:text-gray-800"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5" />
              ) : (
                <Volume2 className="w-5 h-5" />
              )}
            </button>
          </div>
        )}
        
        {!videoId && isLoaded && (
          <div className="text-center text-gray-500 py-8">
            Carga un video de YouTube para comenzar
          </div>
        )}
      </div>
    </div>
  );
};

export default YouTubePlayer;
