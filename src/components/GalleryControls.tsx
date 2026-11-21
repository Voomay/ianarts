/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Sliders, 
  Map, 
  Edit3, 
  Volume2, 
  VolumeX, 
  Play, 
  Pause, 
  Eye, 
  Maximize2, 
  ChevronRight, 
  HelpCircle,
  Sparkles,
  Sun,
  X,
  Plus,
  ShoppingBag,
  Music
} from 'lucide-react';
import { Artwork, LightSettings, ControlsState, ViewMode } from '../types/virtual-gallery';

export const AVAILABLE_AUDIO_TRACKS = [
  { title: "Welcome Theme", url: "/uploads/uploads/2025/09/Welcome-to-our-website.mp3" },
  { title: "Atmosphere Intro", url: "/uploads/uploads/2025/09/Welcome-to-our-website-1.mp3" },
  { title: "Couture Chill", url: "/uploads/uploads/2025/09/Welcome-to-our-website-2.mp3" },
  { title: "Acoustic Intro", url: "/uploads/uploads/2025/09/guitar-soft-intro-picking.mp3" },
  { title: "WhatsApp Soundscape", url: "/uploads/uploads/2025/09/WhatsApp-Audio-2025-08-22-at-21.50.54.mpeg" },
  { title: "Its About Time Theme", url: "/artwork/WhatsApp Audio 2026-06-07 at 20.09.49.mpeg" },
];

interface GalleryControlsProps {
  artworks: Artwork[];
  onUpdateArtwork: (updated: Artwork) => void;
  lightSettings: LightSettings;
  onChangeLightSettings: (settings: LightSettings) => void;
  controlsState: ControlsState;
  onChangeControlsState: (state: Partial<ControlsState>) => void;
  playerPosition: { x: number; z: number; angle: number };
  onTeleport: (x: number, z: number, rotationY?: number) => void;
  customHeadingText: string;
  onUpdateHeadingText: (text: string) => void;
  onOpenPurchaseModal?: () => void;
}

export default function GalleryControls({
  artworks,
  onUpdateArtwork,
  lightSettings,
  onChangeLightSettings,
  controlsState,
  onChangeControlsState,
  playerPosition,
  onTeleport,
  customHeadingText,
  onUpdateHeadingText,
  onOpenPurchaseModal,
}: GalleryControlsProps) {
  const [activeTab, setActiveTab] = useState<'exhibits' | 'lighting' | 'controls'>('exhibits');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedArtForEdit, setSelectedArtForEdit] = useState<string>(artworks[0]?.id || '');
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [speechUtterance, setSpeechUtterance] = useState<SpeechSynthesisUtterance | null>(null);
  const [subtitles, setSubtitles] = useState<string>('');
  
  // Local audio preview playback in sidebar
  const [previewAudioPlaying, setPreviewAudioPlaying] = useState(false);
  const previewAudioRef = useRef<HTMLAudioElement | null>(null);

  const currentArt = artworks.find(art => art.id === selectedArtForEdit);

  // Sync state edit form
  const handleArtChange = (key: keyof Artwork, value: any) => {
    if (!currentArt) return;
    const updated = { ...currentArt, [key]: value };
    onUpdateArtwork(updated);
  };

  // Process uploaded image to scale physical artwork in 3D proportionately
  const handleImageResizeUpload = (dataUrl: string) => {
    if (!currentArt) return;
    const img = new Image();
    img.onload = () => {
      const aspect = img.width / img.height;
      let newWidth = currentArt.width;
      let newHeight = currentArt.height;
      if (aspect > 1) {
        newWidth = 1.8;
        newHeight = 1.8 / aspect;
      } else {
        newHeight = 1.6;
        newWidth = 1.6 * aspect;
      }
      newWidth = Math.round(newWidth * 100) / 100;
      newHeight = Math.round(newHeight * 100) / 100;

      onUpdateArtwork({
        ...currentArt,
        customImageUrl: dataUrl,
        width: newWidth,
        height: newHeight,
      });
    };
    img.src = dataUrl;
  };

  // Teleport to the selected artwork's viewing spot in front of it
  const handleFocusArtwork = (art: Artwork) => {
    // Generate a spot 2.5 meters in front of the artwork facing it
    let targetX = art.position.x;
    let targetZ = art.position.z;
    let viewAngle = art.rotationY; // radians

    const offset = 2.4;
    // Calculate looking direction based on wall alignment
    if (Math.abs(art.rotationY - Math.PI / 2) < 0.1) {
      // Facing right wall, stand slightly to its right
      targetX = art.position.x + offset;
      viewAngle = -Math.PI / 2; // facing wall at -x
    } else if (Math.abs(art.rotationY + Math.PI / 2) < 0.1 || Math.abs(art.rotationY - Math.PI * 1.5) < 0.1) {
      // Facing left wall, stand to left
      targetX = art.position.x - offset;
      viewAngle = Math.PI / 2;
    } else if (Math.abs(art.rotationY) < 0.1) {
      // Facing front wall, stand behind
      targetZ = art.position.z + offset;
      viewAngle = Math.PI; // Look towards -z (north)
    } else if (Math.abs(art.rotationY - Math.PI) < 0.1) {
      // Facing rear wall, stand in front
      targetZ = art.position.z - offset;
      viewAngle = 0; // Look towards +z (south)
    }

    onTeleport(targetX, targetZ, viewAngle);
    onChangeControlsState({ activeArtworkId: art.id });
    setSelectedArtForEdit(art.id);
  };

  // Dynamic Audio Voice Guide implementation
  useEffect(() => {
    // Shutdown any active speaking when piece switches
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsPlayingAudio(false);
    setSubtitles('');
  }, [selectedArtForEdit]);

  const handleToggleAudioGuide = () => {
    if (!currentArt) return;

    if (isPlayingAudio) {
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      setIsPlayingAudio(false);
      setSubtitles('');
    } else {
      setIsPlayingAudio(true);
      const textToSpeak = `This is ${currentArt.title}, an original creation by modern artist ${currentArt.artist} in the year ${currentArt.year}. ${currentArt.description}`;
      setSubtitles(textToSpeak);

      if (window.speechSynthesis) {
        window.speechSynthesis.cancel(); // Stop anything else
        const utterance = new SpeechSynthesisUtterance(textToSpeak);
        utterance.rate = 0.95; // elegant pacing
        utterance.pitch = 1.0;
        utterance.onend = () => {
          setIsPlayingAudio(false);
          setSubtitles('');
        };
        utterance.onerror = () => {
          setIsPlayingAudio(false);
        };
        window.speechSynthesis.speak(utterance);
      } else {
        // Fallback simulated player for frames without synth permissions
        setTimeout(() => {
          setIsPlayingAudio(false);
          setSubtitles('');
        }, 12000);
      }
    }
  };

  // Predefined glow hues to fit a luxury showroom
  const GLOW_PRESETS = [
    { name: 'Warm Amber', color: '#ffd29d', tailwindClass: 'bg-[#ffd29d]' },
    { name: 'Pure Platinum', color: '#ffffff', tailwindClass: 'bg-white' },
    { name: 'Ice White', color: '#e2f0ff', tailwindClass: 'bg-[#e2f0ff]' },
    { name: 'Nordic Blue', color: '#b6dbff', tailwindClass: 'bg-[#b6dbff]' },
    { name: 'Cyber Scarlet', color: '#ff7070', tailwindClass: 'bg-[#ff7070]' },
  ];

  return (
    <>
      {/* Floating Sidebar Toggle Button */}
      {!isSidebarOpen && (
        <button
          id="btn-sidebar-reveal"
          onClick={() => setIsSidebarOpen(true)}
          className="fixed top-4 left-4 md:top-6 md:left-6 z-50 bg-[#111111]/90 hover:bg-black text-white p-2.5 md:p-3 rounded-md border border-white/20 shadow-2xl transition-all flex items-center gap-1.5 md:gap-2 cursor-pointer"
        >
          <Sliders className="w-4 h-4 md:w-5 md:h-5" />
          <span className="text-[10px] md:text-xs font-mono tracking-widest uppercase">Atelier</span>
        </button>
      )}

      {/* Mobile Backdrop Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="md:hidden fixed inset-0 bg-black/70 backdrop-blur-sm z-30 pointer-events-auto"
        />
      )}

      {/* Primary Translucent Sidebar */}
      <div
        id="side-gallery-curator"
        className={`fixed top-0 left-0 h-full w-full max-w-[340px] sm:max-w-[380px] md:w-[410px] bg-black/95 text-white z-40 border-r border-white/10 flex flex-col transition-transform duration-300 shadow-2xl ${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Gallery Header */}
        <div className="p-4 md:p-6 border-b border-white/10 flex justify-between items-center bg-[#0d0d0d]">
          <div>
            <h1 className="text-base md:text-lg font-sans tracking-widest font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-white animate-pulse" />
              LÉ REVOIR
            </h1>
          </div>
          <button
            id="btn-close-sidebar"
            onClick={() => setIsSidebarOpen(false)}
            className="text-gray-400 hover:text-white p-1 hover:bg-white/10 rounded cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-white/10 text-xs font-mono tracking-widest bg-[#0a0a0a]">
          <button
            id="tab-btn-exhibits"
            onClick={() => setActiveTab('exhibits')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'exhibits'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            CURATE
          </button>
          <button
            id="tab-btn-lighting"
            onClick={() => setActiveTab('lighting')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'lighting'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            ATMOSPHERE
          </button>
          <button
            id="tab-btn-controls"
            onClick={() => setActiveTab('controls')}
            className={`flex-1 py-3 text-center border-b-2 transition-all ${
              activeTab === 'controls'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-gray-400 hover:text-white hover:bg-white/5'
            }`}
          >
            EXPERIENCE
          </button>
        </div>

        {/* Main Tabs Content Area */}
        <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6">
          {/* ================ TAB 1: CURATE & ARTWORKS ================ */}
          {activeTab === 'exhibits' && (
            <div className="space-y-6">
              {/* Main Wall Typography Customizer */}
              <div className="bg-white/5 rounded-lg p-4 border border-white/10 space-y-3">
                <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400">
                  Hall Wall Inscription
                </h3>
                <p className="text-[11px] text-gray-400">
                  Tailor the primary typography mounted on the main gallery wall.
                </p>
                <input
                  id="input-heading-text"
                  type="text"
                  value={customHeadingText}
                  onChange={(e) => onUpdateHeadingText(e.target.value)}
                  placeholder="EXHIBIT: PARIS LUXE"
                  maxLength={40}
                  className="w-full bg-black border border-white/20 rounded p-2 text-sm font-mono focus:border-white focus:outline-none"
                />
              </div>

              {/* Masterpiece Carousel Selector */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400">
                  Select Masterpiece Location
                </h3>
                <div className="grid grid-cols-2 gap-2">
                  {artworks.map((art, index) => (
                    <button
                      id={`marker-art-btn-${art.id}`}
                      key={art.id}
                      onClick={() => handleFocusArtwork(art)}
                      className={`p-3 text-left rounded border transition-all cursor-pointer ${
                        selectedArtForEdit === art.id
                          ? 'bg-white text-black border-white'
                          : 'bg-white/5 text-gray-300 border-white/10 hover:bg-white/10'
                      }`}
                    >
                      <div className="text-[10px] font-mono opacity-60">N° 0{index + 1}</div>
                      <div className="font-sans font-medium text-xs tracking-wider truncate">
                        {art.title || 'Untitled'}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Artwork Interactive Detail Form */}
              {currentArt && (
                <div className="border border-white/10 rounded-lg p-4 bg-[#0a0a0a] space-y-4">
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-xs font-mono text-gray-400">ART WORK ATELIER</span>
                    <button
                      id="btn-teleport-to-active"
                      onClick={() => handleFocusArtwork(currentArt)}
                      className="text-[10px] font-mono border border-white/20 hover:border-white px-2 py-1 rounded bg-white/5 hover:bg-white/10 text-white flex items-center gap-1 cursor-pointer"
                    >
                      <Eye className="w-3 h-3" /> Warp Here
                    </button>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-gray-400 block mb-1">
                        TITLE
                      </label>
                      <input
                        id="form-title"
                        type="text"
                        value={currentArt.title}
                        onChange={(e) => handleArtChange('title', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded p-2 text-sm focus:border-white focus:outline-none"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-gray-400 block mb-1">
                          ARTIST
                        </label>
                        <input
                          id="form-artist"
                          type="text"
                          value={currentArt.artist}
                          onChange={(e) => handleArtChange('artist', e.target.value)}
                          className="w-full bg-black border border-white/10 rounded p-2 text-sm focus:border-white focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-gray-400 block mb-1">
                          YEAR
                        </label>
                        <input
                          id="form-year"
                          type="text"
                          value={currentArt.year}
                          onChange={(e) => handleArtChange('year', e.target.value)}
                          className="w-full bg-black border border-white/10 rounded p-2 text-sm focus:border-white focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* CUSTOM ARTWORK UPLOAD ZONE */}
                    <div className="space-y-2">
                      <label className="text-[10px] font-mono tracking-wider text-gray-400 block mb-1">
                        UPLOAD CUSTOM ARTWORK
                      </label>
                      
                      {currentArt.customImageUrl ? (
                        <div className="relative border border-white/20 rounded p-2 bg-black flex items-center gap-3">
                          <img 
                            src={currentArt.customImageUrl} 
                            alt="Uploaded artwork preview" 
                            className="w-12 h-12 object-cover border border-white/10"
                            id="custom-art-preview"
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-[10px] font-mono text-gray-400 uppercase truncate">Custom Image Loaded</p>
                            <p className="text-[9px] font-mono text-gray-500">Dimensions: {currentArt.width}m × {currentArt.height}m</p>
                          </div>
                          <button
                            id="btn-remove-custom-art"
                            type="button"
                            onClick={() => handleArtChange('customImageUrl', undefined)}
                            className="text-xs px-2.5 py-1.5 border border-red-500/30 hover:border-red-500 text-red-500 rounded bg-red-500/5 hover:bg-red-500/15 cursor-pointer font-mono tracking-wider text-[10px] uppercase transition-all"
                          >
                            Reset
                          </button>
                        </div>
                      ) : (
                        <div
                          id="artwork-drag-drop-zone"
                          onDragOver={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.add('border-white', 'bg-white/5');
                          }}
                          onDragLeave={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-white', 'bg-white/5');
                          }}
                          onDrop={(e) => {
                            e.preventDefault();
                            e.currentTarget.classList.remove('border-white', 'bg-white/5');
                            const file = e.dataTransfer.files?.[0];
                            if (file && file.type.startsWith('image/')) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  handleImageResizeUpload(event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          onClick={() => {
                            document.getElementById('artwork-file-input')?.click();
                          }}
                          className="border border-dashed border-white/20 hover:border-white rounded-lg p-5 text-center bg-black/40 hover:bg-white/5 transition-all cursor-pointer group"
                        >
                          <input 
                            id="artwork-file-input"
                            type="file" 
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0];
                                if (file) {
                                  const reader = new FileReader();
                                  reader.onload = (event) => {
                                    if (event.target?.result) {
                                      handleImageResizeUpload(event.target.result as string);
                                    }
                                  };
                                  reader.readAsDataURL(file);
                                }
                            }}
                            className="hidden"
                          />
                          <Plus className="w-5 h-5 mx-auto mb-2 text-gray-500 group-hover:text-white transition-colors" />
                          <p className="text-[11px] font-mono text-gray-300">
                            DRAG & DROP IMAGE OR <span className="underline text-white font-bold">BROWSE</span>
                          </p>
                          <p className="text-[9px] font-mono text-gray-500 mt-1 uppercase">
                            Fits {currentArt.width > currentArt.height ? 'Long/Panoramic' : currentArt.width === currentArt.height ? 'Square' : 'Portrait'} Frames (JPG/PNG)
                          </p>
                        </div>
                      )}
                    </div>

                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-gray-400 block mb-1">
                        GENRE (HIGH CONTRAST STYLE)
                      </label>
                      <select
                        id="form-style-select"
                        value={currentArt.generativeStyle}
                        onChange={(e) => handleArtChange('generativeStyle', e.target.value)}
                        className="w-full bg-black border border-white/20 rounded p-2 text-xs font-mono focus:border-white focus:outline-none"
                      >
                        <option value="fashion-silhouette">Fashion Silhouette Pose</option>
                        <option value="bauhaus-grid">Bauhaus Interlocking Grid</option>
                        <option value="minimalist-editorial">Luxury Journal Editorial</option>
                        <option value="surreal-geometric">Surreal Perspective Sphere</option>
                        <option value="monochrome-portrait">High-Contrast Silhouette Portrait</option>
                        <option value="optical-illusion">Concentric Op-Art Illusion</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] font-mono tracking-wider text-gray-400 block mb-1">
                        ART DESCRIPTION & BACKGROUND
                      </label>
                      <textarea
                        id="form-description"
                        rows={3}
                        value={currentArt.description}
                        onChange={(e) => handleArtChange('description', e.target.value)}
                        className="w-full bg-black border border-white/10 rounded p-2 text-xs focus:border-white focus:outline-none resize-none custom-scrollbar"
                      />
                    </div>

                    {/* ================ ARTWORK SOUNDTRACK / SONG ASSIGNMENT ================ */}
                    <div className="border border-white/15 rounded-lg p-4 bg-black/60 space-y-3.5 shadow-xl">
                      <div className="flex justify-between items-center border-b border-white/10 pb-2.5">
                        <div className="flex items-center gap-2">
                          <Music className="w-4 h-4 text-emerald-400" />
                          <span className="text-xs font-mono text-white font-bold uppercase tracking-wider">
                            Artwork Soundtrack
                          </span>
                        </div>
                        {currentArt.audio && (
                          <span className="text-[9px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 uppercase font-semibold">
                            Song Linked
                          </span>
                        )}
                      </div>

                      <p className="text-[11px] text-gray-400 leading-relaxed font-sans">
                        Assign a musical track or soundscape that automatically plays when visitors click the <strong>Play button</strong> on this artwork in the 3D gallery.
                      </p>

                      {/* Track Preset Selector */}
                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-gray-400 block mb-1 uppercase">
                          Choose Curated Song Preset
                        </label>
                        <select
                          id="artwork-audio-preset-select"
                          value={
                            AVAILABLE_AUDIO_TRACKS.some(t => t.url === currentArt.audio)
                              ? currentArt.audio
                              : (currentArt.audio ? 'custom' : AVAILABLE_AUDIO_TRACKS[0].url)
                          }
                          onChange={(e) => {
                            if (e.target.value !== 'custom') {
                              handleArtChange('audio', e.target.value);
                            }
                          }}
                          className="w-full bg-black border border-white/20 rounded p-2 text-xs font-mono focus:border-white focus:outline-none text-white cursor-pointer"
                        >
                          {AVAILABLE_AUDIO_TRACKS.map((t, idx) => (
                            <option key={idx} value={t.url} className="bg-neutral-900 text-white">
                              🎵 {t.title}
                            </option>
                          ))}
                          <option value="custom" className="bg-neutral-900 text-white">
                            ⚡ Custom Audio Link / Upload File...
                          </option>
                        </select>
                      </div>

                      {/* Custom Audio URL Input */}
                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-gray-400 block mb-1 uppercase">
                          Custom Song URL / Audio Path
                        </label>
                        <input
                          id="artwork-audio-url-input"
                          type="text"
                          value={currentArt.audio || ''}
                          onChange={(e) => handleArtChange('audio', e.target.value)}
                          placeholder="e.g. /uploads/.../song.mp3 or https://..."
                          className="w-full bg-black border border-white/10 rounded p-2 text-xs font-mono focus:border-white focus:outline-none text-white"
                        />
                      </div>

                      {/* Upload Audio File */}
                      <div>
                        <label className="text-[10px] font-mono tracking-wider text-gray-400 block mb-1 uppercase">
                          Upload Custom Song File (MP3 / WAV / MPEG)
                        </label>
                        <input
                          id="artwork-audio-file-input"
                          type="file"
                          accept="audio/*"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const reader = new FileReader();
                              reader.onload = (event) => {
                                if (event.target?.result) {
                                  handleArtChange('audio', event.target.result as string);
                                }
                              };
                              reader.readAsDataURL(file);
                            }
                          }}
                          className="hidden"
                        />
                        <button
                          type="button"
                          id="btn-upload-audio-file"
                          onClick={() => document.getElementById('artwork-audio-file-input')?.click()}
                          className="w-full py-2 px-3 bg-white/5 hover:bg-white/15 border border-white/20 hover:border-white rounded text-xs font-mono tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer text-white"
                        >
                          <Plus className="w-3.5 h-3.5" /> Upload Audio File from Device
                        </button>
                      </div>

                      {/* In-Sidebar Live Preview Player */}
                      <div className="bg-black/90 border border-white/10 rounded p-3 flex items-center justify-between gap-3 mt-1">
                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                          <div className={`w-2.5 h-2.5 rounded-full shrink-0 ${previewAudioPlaying ? 'bg-emerald-400 animate-pulse shadow-[0_0_10px_#10b981]' : 'bg-white/30'}`} />
                          <div className="min-w-0">
                            <span className="text-[11px] font-semibold text-white truncate block">
                              {AVAILABLE_AUDIO_TRACKS.find(t => t.url === currentArt.audio)?.title || (currentArt.audio ? 'Custom Audio Track' : 'Default Playlist Track')}
                            </span>
                            <span className="text-[9px] font-mono text-gray-400 block truncate">
                              {currentArt.audio ? currentArt.audio : 'Plays default ambient theme'}
                            </span>
                          </div>
                        </div>

                        <button
                          type="button"
                          id="btn-preview-artwork-audio"
                          onClick={() => {
                            if (previewAudioPlaying) {
                              if (previewAudioRef.current) {
                                previewAudioRef.current.pause();
                                previewAudioRef.current = null;
                              }
                              setPreviewAudioPlaying(false);
                            } else {
                              if (window.speechSynthesis) window.speechSynthesis.cancel();
                              setIsPlayingAudio(false);
                              if (previewAudioRef.current) {
                                previewAudioRef.current.pause();
                              }
                              const soundUrl = currentArt.audio || AVAILABLE_AUDIO_TRACKS[0].url;
                              const a = new Audio(soundUrl);
                              a.volume = 0.85;
                              a.play().then(() => {
                                setPreviewAudioPlaying(true);
                              }).catch(err => {
                                console.error("Audio preview playback failed:", err);
                                setPreviewAudioPlaying(false);
                              });
                              a.onended = () => {
                                setPreviewAudioPlaying(false);
                              };
                              previewAudioRef.current = a;
                            }
                          }}
                          className={`px-3 py-1.5 rounded text-xs font-mono tracking-wider flex items-center gap-1.5 cursor-pointer transition-all border shrink-0 ${
                            previewAudioPlaying
                              ? 'bg-emerald-500 text-black border-emerald-400 font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)]'
                              : 'bg-white text-black hover:bg-gray-200 border-white font-semibold'
                          }`}
                        >
                          {previewAudioPlaying ? (
                            <>
                              <Pause className="w-3 h-3 fill-current" /> Stop Test
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" /> Test Song
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* Integrated Simulated Audio Guide */}
                    <div className="bg-white/5 border border-white/10 rounded p-3 flex flex-col gap-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono flex items-center gap-2">
                          {isPlayingAudio ? (
                            <span className="relative flex h-2 w-2">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-2 w-2 bg-white"></span>
                            </span>
                          ) : null}
                          Museum Audio Tour Guide
                        </span>
                        <button
                          id="btn-play-audio-gui"
                          onClick={handleToggleAudioGuide}
                          className="text-xs px-3 py-1 cursor-pointer bg-white text-black font-semibold rounded flex items-center gap-1.5 hover:bg-gray-200 transition-all"
                        >
                          {isPlayingAudio ? (
                            <>
                              <VolumeX className="w-3.5 h-3.5" /> Stop Guide
                            </>
                          ) : (
                            <>
                              <Volume2 className="w-3.5 h-3.5" /> Play Voice
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-[10px] text-gray-400 leading-normal">
                        Narrates the curation details using crisp text-to-speech feedback or subtitle transcription.
                      </p>
                    </div>

                    {/* Integrated Luxury Acquisition & Leasing Portal */}
                    <button
                      id="btn-open-acquisition-portal"
                      type="button"
                      onClick={onOpenPurchaseModal}
                      className="w-full py-3 bg-white hover:bg-neutral-200 text-black font-bold text-xs tracking-[2px] uppercase rounded transition-all flex items-center justify-center gap-2 cursor-pointer mt-3 outline-none select-none shadow hover:shadow-lg hover:scale-[1.01] duration-150"
                    >
                      <ShoppingBag className="w-4 h-4 text-black shrink-0" />
                      Acquire or Rent Art
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ================ TAB 2: LIGHTING & ATMOSPHERE ================ */}
          {activeTab === 'lighting' && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
                <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400 flex items-center gap-2">
                  <Sun className="w-4 h-4 text-white" /> Pure White Ambient Light
                </h3>
                <p className="text-[11px] text-gray-400">
                  Fills the 20m showroom with an even, diffuse floor illumination.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Ambient Intensity</span>
                    <span>{(lightSettings.ambientIntensity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    id="slider-ambient-light"
                    type="range"
                    min="0"
                    max="1.5"
                    step="0.05"
                    value={lightSettings.ambientIntensity}
                    onChange={(e) =>
                      onChangeLightSettings({
                        ...lightSettings,
                        ambientIntensity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-white bg-white/20 h-1 rounded-lg appearance-none"
                  />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
                <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400">
                  Recessed Ceilings (Spotlights)
                </h3>
                <p className="text-[11px] text-gray-400 font-sans">
                  Controls the direct downward projection of high-contrast ceiling beams.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Spotlight Output</span>
                    <span>{(lightSettings.ceilingIntensity * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    id="slider-ceiling-light"
                    type="range"
                    min="0"
                    max="2.5"
                    step="0.1"
                    value={lightSettings.ceilingIntensity}
                    onChange={(e) =>
                      onChangeLightSettings({
                        ...lightSettings,
                        ceilingIntensity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-white bg-white/20 h-1 rounded-lg appearance-none"
                  />
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
                <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400 block pb-1">
                  Floating Wall Backlight Glows
                </h3>
                <p className="text-[11px] text-gray-400 leading-relaxed">
                  Controls the mystical halo behind custom artwork frames to accentuate high fashion.
                </p>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400 font-mono">Halo Intensity</span>
                    <span>{(lightSettings.backlightIntensity * 10).toFixed(0)}x</span>
                  </div>
                  <input
                    id="slider-backlight"
                    type="range"
                    min="0"
                    max="4.0"
                    step="0.1"
                    value={lightSettings.backlightIntensity}
                    onChange={(e) =>
                      onChangeLightSettings({
                        ...lightSettings,
                        backlightIntensity: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-white bg-white/20 h-1 rounded-lg appearance-none"
                  />
                </div>

                <div className="space-y-2 pt-2">
                  <label className="text-[10px] font-mono text-gray-400 tracking-wider">
                    HALO COLOR TONE
                  </label>
                  <div className="flex gap-2">
                    {GLOW_PRESETS.map((preset) => (
                      <button
                        id={`btn-color-glow-${preset.name.replace(' ', '-').toLowerCase()}`}
                        key={preset.name}
                        title={preset.name}
                        onClick={() =>
                          onChangeLightSettings({
                            ...lightSettings,
                            glowColor: preset.color,
                          })
                        }
                        className={`w-8 h-8 rounded-full border transition-all cursor-pointer ${
                          lightSettings.glowColor.toLowerCase() === preset.color.toLowerCase()
                            ? 'ring-2 ring-white scale-110 border-white'
                            : 'border-white/20 hover:scale-105'
                        } ${preset.tailwindClass}`}
                      />
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
                <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400">
                  Plaster Plaster "Enduit" Walls
                </h3>
                <p className="text-[11px] text-gray-450 leading-relaxed font-sans">
                  Adjust the self-luminous brightness of the walls' luxurious micro-granular textured plaster coat finish.
                </p>
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Wall Brightness</span>
                    <span>{((lightSettings.wallBrightness !== undefined ? lightSettings.wallBrightness : 0.35) * 100).toFixed(0)}%</span>
                  </div>
                  <input
                    id="slider-wall-brightness"
                    type="range"
                    min="0"
                    max="1.0"
                    step="0.05"
                    value={lightSettings.wallBrightness !== undefined ? lightSettings.wallBrightness : 0.35}
                    onChange={(e) =>
                      onChangeLightSettings({
                        ...lightSettings,
                        wallBrightness: parseFloat(e.target.value),
                      })
                    }
                    className="w-full accent-white bg-white/20 h-1 rounded-lg appearance-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================ TAB 3: CONTROLS & CAMERA SETTINGS ================ */}
          {activeTab === 'controls' && (
            <div className="space-y-6">
              {/* Comfort factors: Height, Speed */}
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 space-y-4">
                <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400">
                  Walk Parameters
                </h3>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Walking Height (Y)</span>
                    <span>{controlsState.cameraHeight.toFixed(1)} meters</span>
                  </div>
                  <input
                    id="slider-cam-height"
                    type="range"
                    min="1.0"
                    max="2.5"
                    step="0.1"
                    value={controlsState.cameraHeight}
                    onChange={(e) =>
                      onChangeControlsState({ cameraHeight: parseFloat(e.target.value) })
                    }
                    className="w-full accent-white bg-white/20 h-1 rounded-lg appearance-none"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono">
                    <span className="text-gray-400">Speed (WASD)</span>
                    <span>{(controlsState.movementSpeed * 10).toFixed(0)} km/h</span>
                  </div>
                  <input
                    id="slider-movement-speed"
                    type="range"
                    min="0.1"
                    max="0.8"
                    step="0.05"
                    value={controlsState.movementSpeed}
                    onChange={(e) =>
                      onChangeControlsState({ movementSpeed: parseFloat(e.target.value) })
                    }
                    className="w-full accent-white bg-white/20 h-1 rounded-lg appearance-none"
                  />
                </div>
              </div>

              {/* Autopilot and Camera triggers */}
              <div className="space-y-2">
                <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400">
                  Camera Navigation Modes
                </h3>

                <button
                  id="btn-toggle-tour"
                  onClick={() => onChangeControlsState({ tourActive: !controlsState.tourActive })}
                  className={`w-full py-3 px-4 font-mono text-xs tracking-widest uppercase rounded border cursor-pointer transition-all flex items-center justify-center gap-2 ${
                    controlsState.tourActive
                      ? 'bg-[#ffffff] text-black border-white hover:bg-gray-200'
                      : 'bg-transparent text-white border-white/30 hover:border-white hover:bg-white/5'
                  }`}
                >
                  {controlsState.tourActive ? (
                    <>
                      <Pause className="w-4 h-4 fill-current" /> Pause Exhibit Tour
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4 fill-current" /> Auto-Pilot Museum Tour
                    </>
                  )}
                </button>

                <p className="text-[10px] text-gray-400 text-center leading-normal mt-1">
                  {controlsState.tourActive 
                    ? "Camera is gliding elegantly along the 11m x 16m perimeter." 
                    : "Independent Exploration — feel free to wander around using controls."}
                </p>
              </div>

              {/* Interactive Key Bindings card */}
              <div className="border border-white/10 rounded-lg p-4 bg-[#0a0a0a] space-y-3">
                <h3 className="text-xs font-mono tracking-widest uppercase text-gray-400 flex items-center gap-2">
                  <HelpCircle className="w-4 h-4" /> Keyboard & Mouse Guide
                </h3>
                <div className="space-y-2 text-xs font-mono">
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-400">Keys [W][A][S][D] / Arrows</span>
                    <span>Move Camera</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-400">Drag Canvas</span>
                    <span>Look Around</span>
                  </div>
                  <div className="flex justify-between border-b border-white/5 pb-1">
                    <span className="text-gray-400">Minimap Click</span>
                    <span>Warp Instantly</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Double Click Ground</span>
                    <span>Interactive Teleport</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ================ INTEGRATED COHESIVE MINIMAP ================ */}
        <div className="p-4 border-t border-white/10 bg-[#0d0d0d] space-y-3">
          <div className="flex justify-between items-center text-xs font-mono">
            <span className="text-gray-400 tracking-wider flex items-center gap-1">
              <Map className="w-3.5 h-3.5" /> 11m × 16m Minimap
            </span>
            <span className="text-gray-500 text-[10px]">Click to teleport</span>
          </div>

          <div 
            id="map-canvas-container"
            className="relative w-full aspect-[11/16] max-w-[180px] mx-auto bg-black border border-white/20 rounded overflow-hidden flex items-center justify-center cursor-pointer"
            onClick={(e) => {
              // Standard scaling: grid is 11m x 16m, ranging X: [-5.5, 5.5] and Z: [-8, 8]
              const rect = e.currentTarget.getBoundingClientRect();
              const clickedX = e.clientX - rect.left;
              const clickedY = e.clientY - rect.top;
              
              // Normalize clicked pos
              const normX = ((clickedX / rect.width) * 11) - 5.5;
              const normZ = ((clickedY / rect.height) * 16) - 8;
              
              // Bound checking to secure comfort space within walls and offset buffers
              const clampedX = Math.max(-4.9, Math.min(4.9, normX));
              const clampedZ = Math.max(-7.4, Math.min(7.4, normZ));
              
              onTeleport(clampedX, clampedZ);
            }}
          >
            {/* Visual Grid Lines */}
            <div className="absolute inset-0 grid grid-cols-4 grid-rows-6 opacity-10 pointer-events-none">
              {Array.from({ length: 24 }).map((_, i) => (
                <div key={i} className="border border-white"></div>
              ))}
            </div>

            {/* Render Artworks Spots on Minimap */}
            {artworks.map((art) => {
              // Map continuous coordinates X:[-5.5, 5.5], Z:[-8, 8] to percentage space
              const leftPct = ((art.position.x + 5.5) / 11) * 100;
              const topPct = ((art.position.z + 8) / 16) * 100;

              return (
                <button
                   id={`minimap-marker-${art.id}`}
                  key={art.id}
                  title={art.title}
                  onClick={(e) => {
                    e.stopPropagation(); // prevent background click teleport
                    handleFocusArtwork(art);
                  }}
                  className={`absolute w-3.5 h-3.5 -ml-1.5 -mt-1.5 border rounded-sm flex items-center justify-center transition-all cursor-pointer ${
                    selectedArtForEdit === art.id
                      ? 'bg-white border-white scale-125 z-20'
                      : 'bg-black border-gray-400 hover:border-white hover:scale-110 z-10'
                  }`}
                  style={{ left: `${leftPct}%`, top: `${topPct}%` }}
                >
                  <span className={`text-[8px] font-bold ${selectedArtForEdit === art.id ? 'text-black' : 'text-gray-400'}`}>
                    •
                  </span>
                </button>
              );
            })}

            {/* Player Marker with View Direction Beam */}
            {(() => {
              const playerLeft = ((playerPosition.x + 5.5) / 11) * 100;
              const playerTop = ((playerPosition.z + 8) / 16) * 100;
              // Player direction angle is in radians
              const rotationDeg = (playerPosition.angle * 180) / Math.PI;

              return (
                <div
                  id="minimap-player-avatar"
                  className="absolute w-4 h-4 -ml-2 -mt-2 pointer-events-none z-30 transition-all duration-75"
                  style={{ left: `${playerLeft}%`, top: `${playerTop}%` }}
                >
                  {/* View direction triangle beam */}
                  <div 
                    className="absolute inset-0 flex items-center justify-center"
                    style={{ transform: `rotate(${rotationDeg}deg)` }}
                  >
                    <div className="w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[18px] border-b-white/40 -mt-5"></div>
                    <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_8px_white]"></div>
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Player Coordinate readout */}
          <div className="flex justify-between text-[9px] font-mono text-gray-500">
            <span>COORDINATES: X:{playerPosition.x.toFixed(1)}m, Z:{playerPosition.z.toFixed(1)}m</span>
            <span>FPS: 60/60</span>
          </div>
        </div>
      </div>

      {/* Subtitles overlay display during speaking */}
      {isPlayingAudio && subtitles && (
        <div 
          id="audio-subtitle-card"
          className="fixed bottom-6 left-[430px] right-6 z-30 bg-black/90 text-white font-sans text-sm md:text-base border border-white/20 rounded shadow-2xl p-4 flex items-center gap-4 transition-all animate-fade-in"
        >
          <Volume2 className="w-5 h-5 flex-shrink-0 text-white animate-pulse" />
          <div className="flex-1 font-mono tracking-wide text-xs leading-relaxed max-w-4xl uppercase">
            <span className="text-gray-400 font-bold">EXHIBITION NARRATOR: </span>
            {subtitles}
          </div>
        </div>
      )}
    </>
  );
}
