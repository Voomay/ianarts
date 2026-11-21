/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Eye, 
  Maximize2, 
  Sparkles, 
  Info,
  ChevronRight,
  Compass,
  ArrowRight,
  HelpCircle,
  Map,
  Volume2,
  Play,
  Pause,
  SkipForward,
  SkipBack,
  VolumeX,
  Music,
  ChevronDown,
  ChevronUp,
  ListMusic
} from 'lucide-react';
import { Artwork, LightSettings, ControlsState, ViewMode } from './types';
import { DEFAULT_ARTWORKS } from './artworksData';
import ThreeGallery from './components/ThreeGallery';
import GalleryControls from './components/GalleryControls';
import ArtworkPurchaseModal from './components/ArtworkPurchaseModal';
import { ambientSynth } from './audio/ambientSynth';

export default function App() {
  // --- IN-MEMORY DURABLE AND INTERACTIVE STATES ---
  const entryAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const giantAudioRef = React.useRef<HTMLAudioElement | null>(null);
  const [artworks, setArtworks] = useState<Artwork[]>(DEFAULT_ARTWORKS);
  const [lightSettings, setLightSettings] = useState<LightSettings>({
    ambientIntensity: 0.55,
    ceilingIntensity: 1.3,
    backlightIntensity: 2.2,
    glowColor: '#ffd29d', // Luxury warm amber as default glow halo
    showBeamEffect: true,
    wallBrightness: 0.35,
  });
  const [controlsState, setControlsState] = useState<ControlsState>({
    movementSpeed: 1.0 / 4, // 0.25 is perfect comfort speed
    cameraHeight: 1.7, // eye level 1.7m
    activeArtworkId: 'art-left-1',
    tourActive: false,
    viewMode: 'desktop',
    controlMethod: 'wasd',
  });
  const [customHeadingText, setCustomHeadingText] = useState<string>('IAN ART STUDIO');
  const [hasEntered, setHasEntered] = useState<boolean>(false);
  const [initThree, setInitThree] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingProgress, setLoadingProgress] = useState<number>(0);
  const [fadeOutOverlay, setFadeOutOverlay] = useState<boolean>(false);
  const [showOverlay, setShowOverlay] = useState<boolean>(true);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState<boolean>(false);
  const [discoMode, setDiscoMode] = useState<boolean>(false);

  // Synchronized player coordinates from 3D model engine (updated in render loops)
  const [playerPosition, setPlayerPosition] = useState({ x: 0, z: 0, angle: 0 });

  // Coordinator state to trigger teleportation animations
  const [teleportCoords, setTeleportCoords] = useState<{ x: number; z: number; rotationY?: number } | null>(null);

  // --- AUDIO SYNTHESIS & PLAYLIST STATES ---
  const [playingArtId, setPlayingArtId] = useState<string | null>(null);
  const [isAudioPlaying, setIsAudioPlaying] = useState<boolean>(false);
  const [audioVolume, setAudioVolume] = useState<number>(0.5);
  const [playerMinimized, setPlayerMinimized] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );
  const [playlistOpen, setPlaylistOpen] = useState<boolean>(false);

  const handlePlaySong = (artId: string) => {
    if (artId === 'entry-track') {
      setPlayingArtId(artId);
      setIsAudioPlaying(true);
      ambientSynth.stop();
      if (giantAudioRef.current) giantAudioRef.current.pause();
      if (entryAudioRef.current) {
        entryAudioRef.current.volume = audioVolume * 0.45; // "not too loud"
        entryAudioRef.current.play().catch(e => console.log("Audio play error:", e));
      }
    } else if (artId === 'art-front-giant') {
      setPlayingArtId(artId);
      setIsAudioPlaying(true);
      ambientSynth.stop();
      if (entryAudioRef.current) entryAudioRef.current.pause();
      if (giantAudioRef.current) {
        giantAudioRef.current.volume = audioVolume * 0.45; // same comfort volume
        giantAudioRef.current.play().catch(e => console.log("Audio play error:", e));
      }
    } else {
      if (entryAudioRef.current) entryAudioRef.current.pause();
      if (giantAudioRef.current) giantAudioRef.current.pause();
      setPlayingArtId(artId);
      setIsAudioPlaying(true);
      ambientSynth.play(artId);
    }
  };

  const handlePauseSong = () => {
    setIsAudioPlaying(false);
    ambientSynth.stop();
    if (entryAudioRef.current) entryAudioRef.current.pause();
    if (giantAudioRef.current) giantAudioRef.current.pause();
  };

  React.useEffect(() => {
    return () => {
      ambientSynth.stop();
      if (entryAudioRef.current) entryAudioRef.current.pause();
      if (giantAudioRef.current) giantAudioRef.current.pause();
    };
  }, []);

  const handleTogglePlay = () => {
    if (isAudioPlaying && playingArtId) {
      handlePauseSong();
    } else {
      const targetId = playingArtId || controlsState.activeArtworkId || artworks[0]?.id;
      if (targetId) {
        handlePlaySong(targetId);
      }
    }
  };

  const handleTeleportToArtwork = (art: Artwork) => {
    let targetX = art.position.x;
    let targetZ = art.position.z;
    let viewAngle = art.rotationY;

    const offset = 3.6;
    if (Math.abs(art.rotationY - Math.PI / 2) < 0.1) {
      targetX = art.position.x + offset;
      viewAngle = -Math.PI / 2;
    } else if (Math.abs(art.rotationY + Math.PI / 2) < 0.1 || Math.abs(art.rotationY - Math.PI * 1.5) < 0.1) {
      targetX = art.position.x - offset;
      viewAngle = Math.PI / 2;
    } else if (Math.abs(art.rotationY) < 0.1) {
      targetZ = art.position.z + offset;
      viewAngle = Math.PI;
    } else if (Math.abs(art.rotationY - Math.PI) < 0.1) {
      targetZ = art.position.z - offset;
      viewAngle = 0;
    }
    handleTeleport(targetX, targetZ, viewAngle);
    handleUpdateControlsState({ activeArtworkId: art.id });
  };

  const handleSkipNext = () => {
    const currentIndex = artworks.findIndex(art => art.id === (playingArtId || controlsState.activeArtworkId));
    const nextIndex = (currentIndex + 1) % artworks.length;
    const nextArt = artworks[nextIndex];
    if (nextArt) {
      handleTeleportToArtwork(nextArt);
      handlePlaySong(nextArt.id);
    }
  };

  const handleSkipPrev = () => {
    const currentIndex = artworks.findIndex(art => art.id === (playingArtId || controlsState.activeArtworkId));
    const prevIndex = (currentIndex - 1 + artworks.length) % artworks.length;
    const prevArt = artworks[prevIndex];
    if (prevArt) {
      handleTeleportToArtwork(prevArt);
      handlePlaySong(prevArt.id);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const vol = parseFloat(e.target.value);
    setAudioVolume(vol);
    ambientSynth.setVolume(vol);
    if (entryAudioRef.current) {
      entryAudioRef.current.volume = vol * 0.45;
    }
    if (giantAudioRef.current) {
      giantAudioRef.current.volume = vol * 0.45;
    }
  };

  const handleUpdateArtwork = (updated: Artwork) => {
    setArtworks((prev) => prev.map((art) => (art.id === updated.id ? updated : art)));
  };

  const handleUpdateLightSettings = (updated: LightSettings) => {
    setLightSettings(updated);
  };

  const handleUpdateControlsState = (updated: Partial<ControlsState>) => {
    setControlsState((prev) => ({ ...prev, ...updated }));
  };

  const handleTeleport = (x: number, z: number, rotationY?: number) => {
    setTeleportCoords({ x, z, rotationY });
  };

  const toggleFullscreen = () => {
    if (document.fullscreenElement) {
      document.exitFullscreen().catch((err) => console.log(err));
      setIsFullscreen(false);
    } else {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error("Error attempting to resolve fullscreen:", err);
      });
      setIsFullscreen(true);
    }
  };

  React.useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, []);

  const currentArt = artworks.find(art => art.id === controlsState.activeArtworkId);

  const entryDoneRef = React.useRef<boolean>(false);
  const fallbackTimerRef = React.useRef<number | null>(null);

  const progressTimerRef = React.useRef<number | null>(null);
  const sceneReadyRef = React.useRef<boolean>(false);

  const finishLoading = React.useCallback(() => {
    sceneReadyRef.current = true;
    if (entryDoneRef.current) return;
    if (fallbackTimerRef.current !== null) {
      window.clearTimeout(fallbackTimerRef.current);
      fallbackTimerRef.current = null;
    }
    if (progressTimerRef.current !== null) {
      window.clearInterval(progressTimerRef.current);
      progressTimerRef.current = null;
    }
    entryDoneRef.current = true;
    setLoadingProgress(100);
    setFadeOutOverlay(true);
    // Start playing the welcome track as the loading screen fades out (autoplay enabled)
    handlePlaySong('entry-track');
    window.setTimeout(() => {
      setShowOverlay(false);
      setHasEntered(true);
    }, 350);
  }, []);

  const handleEnterClick = () => {
    entryDoneRef.current = false;
    sceneReadyRef.current = false;
    setIsLoading(true);
    setLoadingProgress(10);

    // Smoothly step loader 10, 20, 30, 40, 50... while Three.js initializes
    progressTimerRef.current = window.setInterval(() => {
      setLoadingProgress((prev) => {
        if (prev >= 90) {
          if (sceneReadyRef.current) {
            finishLoading();
          }
          return prev;
        }
        const next = Math.min(90, prev + 10);
        if (next >= 50 && sceneReadyRef.current) {
          finishLoading();
        }
        return next;
      });
    }, 110);

    // Yield one frame so the loading UI paints immediately before Three.js initializes
    requestAnimationFrame(() => {
      setInitThree(true);
    });

    // Safety fallback so loading never stalls even if an external/network asset fails
    fallbackTimerRef.current = window.setTimeout(() => {
      finishLoading();
    }, 3500);
  };

  return (
    <div id="app-root-container" className="w-screen h-[100dvh] bg-[#030303] text-white flex overflow-hidden font-sans select-none">
      
      {/* Hidden audio player for custom welcome soundscape */}
      <audio 
        ref={entryAudioRef}
        src="/entry_song.mpeg"
        loop
        preload="metadata"
      />

      <audio 
        ref={giantAudioRef}
        src="/giant_mural_song.mpeg"
        loop
        preload="none"
      />

      {/* ================ PREMIUM MODERN FASHION LAUNCH COVER ================ */}
      {showOverlay && (
        <div 
          id="museum-entry-card"
          className={`fixed inset-0 z-50 bg-black flex flex-col items-center justify-center text-white transition-opacity duration-300 ease-out ${
            fadeOutOverlay ? 'opacity-0 pointer-events-none' : 'opacity-100'
          }`}
        >
          {!isLoading ? (
            <button
              id="btn-enter-gallery"
              onClick={handleEnterClick}
              className="group px-10 py-5 bg-white text-black font-semibold text-xs tracking-[6px] uppercase hover:bg-gray-200 transition-all cursor-pointer border border-white select-none hover:scale-[1.03] duration-200 active:scale-95"
            >
              Enter Gallery
            </button>
          ) : (
            <div className="flex flex-col items-center justify-center space-y-8 animate-fade-in">
              <div className="flex flex-col items-center space-y-1 text-center">
                <span className="text-[10px] font-mono tracking-[4px] text-gray-500 uppercase">
                  IAN ART GALLERY
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-[8px] sm:tracking-[12px] uppercase text-white font-display select-none">
                  "IT'S ABOUT TIME"
                </h2>
              </div>

              {/* Minimal Loading Line */}
              <div className="flex flex-col items-center space-y-3">
                <div className="w-64 sm:w-80 h-[2px] bg-white/10 rounded-full overflow-hidden relative">
                  <div 
                    className="absolute left-0 top-0 bottom-0 bg-white transition-all duration-75 rounded-full"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <span className="text-[9px] font-mono tracking-[2px] text-gray-400 select-none">
                  LOADING EXHIBITS {loadingProgress}%
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ================ PRIMARY INTERACTIVE METAVERSE viewport ================ */}
      <div className="flex-1 h-full relative flex flex-col">
        
        {/* Fullscreen 3D Canvas Mount */}
        <div id="canvas-3d-viewport" className="w-full h-full">
          {initThree && (
            <ThreeGallery
              artworks={artworks}
              lightSettings={lightSettings}
              controlsState={controlsState}
              customHeadingText={customHeadingText}
              onUpdatePosition={setPlayerPosition}
              teleportCoords={teleportCoords}
              onClearTeleport={() => setTeleportCoords(null)}
              onSelectArtwork={(id) => {
                handleUpdateControlsState({ activeArtworkId: id });
                setIsPurchaseModalOpen(true);
              }}
              playingArtId={playingArtId}
              isAudioPlaying={isAudioPlaying}
              onPlaySong={handlePlaySong}
              onPauseSong={handlePauseSong}
              discoMode={discoMode}
              onLoadProgress={(pct) => setLoadingProgress((prev) => Math.max(prev, Math.min(90, Math.floor(pct / 10) * 10)))}
              onSceneReady={() => {
                sceneReadyRef.current = true;
              }}
            />
          )}
        </div>

        {/* --- DYNAMIC HUD OVERLAYS --- */}
        {hasEntered && (
          <>
            {/* Top Navigation HUD bar */}
            <div 
              id="top-hud-strip"
              className="fixed top-4 right-4 md:top-6 md:right-6 z-40 flex items-center gap-2 pointer-events-none"
            >
              {/* Active Subtitle Info */}
              {controlsState.tourActive && (
                <div className="hidden md:flex bg-black/80 backdrop-blur-md px-3 h-10 border border-white/15 rounded-lg items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-white opacity-40 animate-pulse"></div>
                  <span className="text-[10px] font-mono tracking-widest uppercase">
                    Autopilot Tour
                  </span>
                </div>
              )}

              {/* Icon-only Fullscreen Trigger */}
              <button
                id="hud-btn-fullscreen"
                onClick={toggleFullscreen}
                aria-label={isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
                title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
                className={`pointer-events-auto w-10 h-10 rounded-lg border cursor-pointer transition-all flex items-center justify-center backdrop-blur-md shadow-2xl ${
                  isFullscreen
                    ? 'bg-amber-500 text-black border-amber-400'
                    : 'bg-black/85 text-white border-white/15 hover:border-white/40 hover:bg-black'
                }`}
              >
                <Maximize2 className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Walk instructions badge */}
            <div className="absolute bottom-4 left-3 right-44 md:bottom-6 md:left-[430px] md:right-auto md:w-auto z-30 pointer-events-none">
              {!controlsState.tourActive && (
                <div className="bg-[#090909]/90 backdrop-blur-sm border border-white/10 rounded px-3 py-2 md:px-4 md:py-3 space-y-1 flex flex-col">
                  <span className="text-[9px] md:text-[10px] font-mono tracking-wider text-gray-400 uppercase">
                    Interactive Walk Guide
                  </span>
                  
                  {/* Desktop guide */}
                  <div className="hidden md:flex text-[11px] font-mono text-white items-center gap-4">
                    <span>Keyboard: <strong className="border border-white/20 px-1 py-0.5 rounded">W A S D</strong> / <strong className="border border-white/20 px-1 py-0.5 rounded">Arrows</strong></span>
                    <span className="opacity-40">|</span>
                    <span>Look: <strong className="border border-white/20 px-1 py-0.5 rounded">Drag Canvas</strong></span>
                    <span className="opacity-40">|</span>
                    <span>Teleport: <strong className="border border-white/20 px-1 py-0.5 rounded">Minimap Click</strong></span>
                  </div>

                  {/* Mobile guide */}
                  <div className="flex md:hidden text-[9px] font-mono text-white/90 items-center flex-wrap gap-1.5">
                    <span>Swipe to look</span>
                    <span className="opacity-40">•</span>
                    <span>Pinch to zoom</span>
                    <span className="opacity-40">•</span>
                    <span>D-pad to walk</span>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile On-Screen Touch Walk D-Pad + Smooth Zoom Buttons */}
            {!controlsState.tourActive && (
              <div className="md:hidden absolute bottom-4 right-3 z-30 flex items-end gap-2 pointer-events-auto select-none touch-none">
                {/* Smooth Zoom In / Out */}
                <div className="flex flex-col gap-1.5">
                  <button
                    type="button"
                    aria-label="Zoom In"
                    onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'zoomin' })); }}
                    onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'zoomin' }))}
                    onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'zoomin' }))}
                    onPointerCancel={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'zoomin' }))}
                    className="w-9 h-9 bg-black/80 active:bg-white active:text-black border border-white/25 rounded-md flex items-center justify-center text-white text-sm font-bold"
                  >
                    +
                  </button>
                  <button
                    type="button"
                    aria-label="Zoom Out"
                    onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'zoomout' })); }}
                    onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'zoomout' }))}
                    onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'zoomout' }))}
                    onPointerCancel={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'zoomout' }))}
                    className="w-9 h-9 bg-black/80 active:bg-white active:text-black border border-white/25 rounded-md flex items-center justify-center text-white text-sm font-bold"
                  >
                    −
                  </button>
                </div>

                {/* 4-Way Walk D-Pad */}
                <div
                  id="mobile-walk-pad"
                  className="grid grid-cols-3 gap-1.5 w-28 h-28"
                >
                  <div />
                  <button
                    type="button"
                    aria-label="Walk Forward"
                    onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'w' })); }}
                    onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }))}
                    onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }))}
                    onPointerCancel={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'w' }))}
                    className="bg-black/80 active:bg-white active:text-black border border-white/25 rounded-md flex items-center justify-center text-white text-xs font-bold"
                  >
                    ▲
                  </button>
                  <div />
                  <button
                    type="button"
                    aria-label="Walk Left"
                    onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'a' })); }}
                    onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))}
                    onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))}
                    onPointerCancel={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'a' }))}
                    className="bg-black/80 active:bg-white active:text-black border border-white/25 rounded-md flex items-center justify-center text-white text-xs font-bold"
                  >
                    ◀
                  </button>
                  <button
                    type="button"
                    aria-label="Walk Backward"
                    onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 's' })); }}
                    onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's' }))}
                    onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's' }))}
                    onPointerCancel={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 's' }))}
                    className="bg-black/80 active:bg-white active:text-black border border-white/25 rounded-md flex items-center justify-center text-white text-xs font-bold"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    aria-label="Walk Right"
                    onPointerDown={(e) => { e.preventDefault(); window.dispatchEvent(new KeyboardEvent('keydown', { key: 'd' })); }}
                    onPointerUp={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }))}
                    onPointerLeave={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }))}
                    onPointerCancel={() => window.dispatchEvent(new KeyboardEvent('keyup', { key: 'd' }))}
                    className="bg-black/80 active:bg-white active:text-black border border-white/25 rounded-md flex items-center justify-center text-white text-xs font-bold"
                  >
                    ▶
                  </button>
                </div>
              </div>
            )}

            {/* Quick Curation Hotkey Readout */}
            <div className="absolute bottom-6 right-6 z-30 pointer-events-none hidden md:block">
              <div className="bg-[#090909]/95 border border-white/10 rounded px-4 py-2 text-[10px] font-mono text-gray-400">
                HOTKEYS: PRESS <strong className="text-white bg-white/10 px-1 py-0.5 ml-1">1 - 7</strong> TO JUMP DIRECTLY TO EXHIBIT SITES
              </div>
            </div>
          </>
        )}
      </div>

      {/* ================ SIDEBAR CONTROLS & COMPRESSED CURATOR ================ */}
      {hasEntered && (
        <GalleryControls
          artworks={artworks}
          onUpdateArtwork={handleUpdateArtwork}
          lightSettings={lightSettings}
          onChangeLightSettings={handleUpdateLightSettings}
          controlsState={controlsState}
          onChangeControlsState={handleUpdateControlsState}
          playerPosition={playerPosition}
          onTeleport={handleTeleport}
          customHeadingText={customHeadingText}
          onUpdateHeadingText={setCustomHeadingText}
          onOpenPurchaseModal={() => setIsPurchaseModalOpen(true)}
          discoMode={discoMode}
          onToggleDiscoMode={() => setDiscoMode(prev => !prev)}
        />
      )}

      {/* ================ DYNAMIC MEDIA PLAYER HUD ================ */}
      {hasEntered && (
        <div
          id="media-player-hud"
          className={`fixed top-4 left-16 right-16 md:top-6 md:left-auto md:right-20 md:w-72 z-30 bg-black/85 backdrop-blur-md border border-white/15 rounded-lg shadow-2xl transition-all duration-300 overflow-hidden ${
            playerMinimized ? 'h-10' : 'h-auto'
          }`}
        >
          {/* Player Header */}
          <div className="flex items-center justify-between px-3 h-10 bg-white/[0.03] border-b border-white/10">
            <div className="flex items-center gap-2 text-[10px] sm:text-xs font-mono tracking-widest text-gray-200 select-none truncate">
              <Music className="w-3.5 h-3.5 text-white shrink-0 animate-pulse" />
              <span className="truncate">EXHIBIT SOUNDSCAPE</span>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPlaylistOpen(!playlistOpen)}
                className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
                title="Toggle Playlist"
              >
                <ListMusic className="w-4 h-4" />
              </button>
              <button
                onClick={() => setPlayerMinimized(!playerMinimized)}
                className="p-1 text-gray-400 hover:text-white rounded hover:bg-white/10 transition-colors cursor-pointer"
                title={playerMinimized ? "Expand Player" : "Minimize Player"}
              >
                {playerMinimized ? <ChevronDown className="w-4 h-4 text-gray-400" /> : <ChevronUp className="w-4 h-4 text-gray-400" />}
              </button>
            </div>
          </div>

          {/* Player Body (Visible when NOT Minimized) */}
          {!playerMinimized && (
            <div className="p-4 space-y-4">
              {/* Artwork Track Info */}
              {(() => {
                if (playingArtId === 'entry-track') {
                  return (
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 bg-black border border-white/10 rounded overflow-hidden flex items-center justify-center shrink-0">
                        <Music className="w-6 h-6 text-gray-400 animate-pulse" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <h4 className="text-xs font-bold truncate text-white uppercase tracking-wide">
                          Intro Sound
                        </h4>
                        <p className="text-[10px] text-gray-400 truncate uppercase mt-0.5">
                          Ian Art Sound
                        </p>
                      </div>
                    </div>
                  );
                }
                const currentArt = artworks.find(art => art.id === (playingArtId || controlsState.activeArtworkId)) || artworks[0];
                return (
                  <div className="flex items-center gap-3">
                    <div 
                      onClick={() => handleTeleportToArtwork(currentArt)}
                      className="w-14 h-14 bg-black border border-white/10 rounded overflow-hidden flex items-center justify-center shrink-0 cursor-pointer hover:border-white transition-all group"
                      title="Warp to this artwork"
                    >
                      {currentArt?.customImageUrl ? (
                        <img src={currentArt.customImageUrl} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300" />
                      ) : (
                        <Music className="w-6 h-6 text-gray-500" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold truncate text-white uppercase tracking-wide">
                        {currentArt?.songTitle || 'Ambient Silence'}
                      </h4>
                      <p className="text-[10px] text-gray-400 truncate uppercase mt-0.5">
                        {currentArt?.songArtist || 'Ian Art Sound'}
                      </p>
                      <p className="text-[8px] text-white/40 truncate uppercase mt-1 tracking-wider font-mono">
                        Art: {currentArt?.title}
                      </p>
                    </div>
                  </div>
                );
              })()}

              {/* Playback Controls */}
              <div className="flex items-center justify-center gap-4">
                <button
                  onClick={handleSkipPrev}
                  className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-90"
                  title="Previous Artwork Track"
                >
                  <SkipBack className="w-4 h-4 fill-current" />
                </button>
                <button
                  onClick={handleTogglePlay}
                  className="p-3 bg-white text-black hover:bg-gray-200 rounded-full transition-all cursor-pointer active:scale-90 shadow-lg"
                  title={isAudioPlaying ? "Pause" : "Play"}
                >
                  {isAudioPlaying ? <Pause className="w-5 h-5 fill-current" /> : <Play className="w-5 h-5 fill-current translate-x-[1px]" />}
                </button>
                <button
                  onClick={handleSkipNext}
                  className="p-2 text-gray-400 hover:text-white transition-colors cursor-pointer active:scale-90"
                  title="Next Artwork Track"
                >
                  <SkipForward className="w-4 h-4 fill-current" />
                </button>
              </div>

              {/* Volume Bar */}
              <div className="flex items-center gap-3 pt-1">
                <button
                  onClick={() => {
                    const nextVol = audioVolume > 0 ? 0 : 0.5;
                    setAudioVolume(nextVol);
                    ambientSynth.setVolume(nextVol);
                    if (entryAudioRef.current) {
                      entryAudioRef.current.volume = nextVol * 0.45;
                    }
                    if (giantAudioRef.current) {
                      giantAudioRef.current.volume = nextVol * 0.45;
                    }
                  }}
                  className="text-gray-400 hover:text-white transition-colors cursor-pointer animate-none"
                  title="Mute/Unmute"
                >
                  {audioVolume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={audioVolume}
                  onChange={handleVolumeChange}
                  className="flex-1 accent-white bg-white/20 h-1 rounded-lg appearance-none cursor-pointer"
                  title="Adjust Volume"
                />
              </div>
            </div>
          )}

          {/* Minimized Mini Controller */}
          {playerMinimized && (
            <div className="flex items-center justify-between px-4 py-2 h-14">
              {(() => {
                if (playingArtId === 'entry-track') {
                  return (
                    <div className="min-w-0 flex-1 flex items-center gap-2">
                      <div className="relative flex h-2 w-2">
                        {isAudioPlaying && (
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                        )}
                        <span className={`relative inline-flex rounded-full h-2 w-2 ${isAudioPlaying ? 'bg-white' : 'bg-gray-600'}`}></span>
                      </div>
                      <span className="text-[10px] text-gray-300 truncate font-mono uppercase tracking-wider">
                        Intro Sound
                      </span>
                    </div>
                  );
                }
                const currentArt = artworks.find(art => art.id === (playingArtId || controlsState.activeArtworkId)) || artworks[0];
                return (
                  <div className="min-w-0 flex-1 flex items-center gap-2">
                    <div className="relative flex h-2 w-2">
                      {isAudioPlaying && (
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                      )}
                      <span className={`relative inline-flex rounded-full h-2 w-2 ${isAudioPlaying ? 'bg-white' : 'bg-gray-600'}`}></span>
                    </div>
                    <span className="text-[10px] text-gray-300 truncate font-mono uppercase tracking-wider">
                      {currentArt?.songTitle || 'Ambient Silence'}
                    </span>
                  </div>
                );
              })()}
              <div className="flex items-center gap-2">
                <button
                  onClick={handleTogglePlay}
                  className="p-2 text-white hover:text-gray-300 transition-colors cursor-pointer active:scale-90"
                >
                  {isAudioPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current translate-x-[0.5px]" />}
                </button>
              </div>
            </div>
          )}

          {/* Playlist Expanded panel */}
          {playlistOpen && !playerMinimized && (
            <div className="border-t border-white/10 max-h-48 overflow-y-auto custom-scrollbar bg-black/45">
              <div className="p-2 space-y-1">
                {/* Intro Sound Track in Playlist */}
                <div
                  onClick={() => handlePlaySong('entry-track')}
                   className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors text-[10px] font-mono uppercase tracking-wider ${
                     playingArtId === 'entry-track'
                       ? 'bg-white/10 text-white font-bold'
                       : 'text-gray-400 hover:bg-white/5 hover:text-white'
                   }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <span className="opacity-45">00.</span>
                    <span className="truncate">Intro Sound</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="text-[8px] opacity-40">Ian Art Sound</span>
                    {playingArtId === 'entry-track' && isAudioPlaying && (
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                    )}
                  </div>
                </div>

                {artworks.map((art, idx) => {
                  const isSelected = (playingArtId || controlsState.activeArtworkId) === art.id;
                  const isPlayingThis = playingArtId === art.id && isAudioPlaying;
                  return (
                    <div
                      key={art.id}
                      onClick={() => {
                        handleTeleportToArtwork(art);
                        handlePlaySong(art.id);
                      }}
                      className={`flex items-center justify-between p-2 rounded cursor-pointer transition-colors text-[10px] font-mono uppercase tracking-wider ${
                        isSelected 
                          ? 'bg-white/10 text-white font-bold' 
                          : 'text-gray-400 hover:bg-white/5 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="opacity-45">0{idx + 1}.</span>
                        <span className="truncate">{art.songTitle}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0 ml-2">
                        <span className="text-[8px] opacity-40">by {art.songArtist}</span>
                        {isPlayingThis && (
                          <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse"></span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
      {/* ================ FINE ART ACQUISITION & LEASE PORTAL (MODAL) ================ */}
      <ArtworkPurchaseModal
        artwork={currentArt || null}
        isOpen={isPurchaseModalOpen}
        onClose={() => setIsPurchaseModalOpen(false)}
      />
    </div>
  );
}
