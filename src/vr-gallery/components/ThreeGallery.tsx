/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { Artwork, LightSettings, ControlsState } from '../types';
import { drawArtworkCanvas, drawCompanionCanvas } from '../artworksData';

// Helper to draw play/pause icon onto a canvas texture
const createPlayIconTexture = (isPause: boolean): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Background circle: dark semi-transparent black
    ctx.fillStyle = 'rgba(15, 15, 15, 0.85)';
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();

    // Border: white outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Icon: white
    ctx.fillStyle = '#ffffff';
    if (isPause) {
      // Draw pause bars
      ctx.fillRect(44, 38, 10, 52);
      ctx.fillRect(74, 38, 10, 52);
    } else {
      // Draw play triangle
      ctx.beginPath();
      ctx.moveTo(48, 32);
      ctx.lineTo(48, 96);
      ctx.lineTo(92, 64);
      ctx.closePath();
      ctx.fill();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

// Helper to draw inquiry (question mark) icon onto a canvas texture
const createInquiryIconTexture = (): THREE.CanvasTexture => {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    // Background circle: dark semi-transparent black
    ctx.fillStyle = 'rgba(15, 15, 15, 0.85)';
    ctx.beginPath();
    ctx.arc(64, 64, 60, 0, Math.PI * 2);
    ctx.fill();

    // Border: white outline
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
    ctx.lineWidth = 4;
    ctx.stroke();

    // Icon: white question mark
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 72px "Space Grotesk", "Inter", sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('?', 64, 64);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
};

interface ThreeGalleryProps {
  artworks: Artwork[];
  lightSettings: LightSettings;
  controlsState: ControlsState;
  customHeadingText: string;
  onUpdatePosition: (pos: { x: number; z: number; angle: number }) => void;
  // Triggered when the user click-navigates on an artwork or teleports
  teleportCoords: { x: number; z: number; rotationY?: number } | null;
  onClearTeleport: () => void;
  onSelectArtwork?: (id: string) => void;
  playingArtId: string | null;
  isAudioPlaying: boolean;
  onPlaySong: (id: string) => void;
  onPauseSong: () => void;
  discoMode: boolean;
  onLoadProgress?: (pct: number) => void;
  onSceneReady?: () => void;
}

export default function ThreeGallery({
  artworks,
  lightSettings,
  controlsState,
  customHeadingText,
  onUpdatePosition,
  teleportCoords,
  onClearTeleport,
  onSelectArtwork,
  playingArtId,
  isAudioPlaying,
  onPlaySong,
  onPauseSong,
  discoMode,
  onLoadProgress,
  onSceneReady,
}: ThreeGalleryProps) {
  const mountRef = useRef<HTMLDivElement>(null);

  // References to keep Three.js properties in sync with React state updates
  const stateRefs = useRef({
    artworks,
    lightSettings,
    controlsState,
    customHeadingText,
    discoMode,
  });

  stateRefs.current = {
    artworks,
    lightSettings,
    controlsState,
    customHeadingText,
    discoMode,
  };

  // Keep references to specific 3D scene elements to modify them on the fly
  const sceneElementsRef = useRef<{
    scene: THREE.Scene | null;
    renderer: THREE.WebGLRenderer | null;
    camera: THREE.PerspectiveCamera | null;
    ambientLight: THREE.AmbientLight | null;
    ceilingLights: THREE.SpotLight[];
    lightCones: THREE.Mesh[]; // Reference to volumetric light cones
    artworkGroups: Map<string, THREE.Group>;
    glowPlanes: Map<string, THREE.Mesh>;
    glowLights: Map<string, THREE.PointLight>;
    mainHeadingMesh: THREE.Mesh | null;
    mainHeadingTexture: THREE.CanvasTexture | null;
    keysPressed: Record<string, boolean>;
    cameraRotation: { yaw: number; pitch: number };
    playerPosition: THREE.Vector3;
    isDragging: boolean;
    previousMousePosition: { x: number; y: number };
    wallMaterial: THREE.MeshStandardMaterial | null;
    targetFov: number;
  }>({
    scene: null,
    renderer: null,
    camera: null,
    ambientLight: null,
    ceilingLights: [],
    lightCones: [],
    artworkGroups: new Map(),
    glowPlanes: new Map(),
    glowLights: new Map(),
    mainHeadingMesh: null,
    mainHeadingTexture: null,
    keysPressed: {},
    cameraRotation: { yaw: Math.PI, pitch: 0 },
    playerPosition: new THREE.Vector3(0, 1.7, 0), // updated on mount for mobile/desktop
    isDragging: false,
    previousMousePosition: { x: 0, y: 0 },
    wallMaterial: null,
    targetFov: 46,
  });

  // Natural human perspective on desktop (46° = zero edge skew); zoomed out on portrait mobile (70°) to see the full room
  const getNaturalFov = (w: number, h: number): number => (w < h ? 70 : 46);
  const getMaxZoomOutFov = (w: number, h: number): number => (w < h ? 78 : 58);

  // Handle Teleportation triggers
  useEffect(() => {
    if (teleportCoords) {
      const refs = sceneElementsRef.current;
      refs.playerPosition.x = teleportCoords.x;
      refs.playerPosition.z = teleportCoords.z;
      
      // Update gaze angle if supplied
      if (teleportCoords.rotationY !== undefined) {
        refs.cameraRotation.yaw = teleportCoords.rotationY;
        // set slight look down or flat
        refs.cameraRotation.pitch = 0;
      }

      // Reset FOV on teleport to natural human perspective
      if (refs.camera && mountRef.current) {
        const naturalFov = getNaturalFov(mountRef.current.clientWidth, mountRef.current.clientHeight);
        refs.camera.fov = naturalFov;
        refs.camera.updateProjectionMatrix();
        refs.targetFov = naturalFov;
      }

      onClearTeleport();
    }
  }, [teleportCoords, onClearTeleport]);

  // Handle play button state updates in the 3D scene
  useEffect(() => {
    const refs = sceneElementsRef.current;
    if (!refs.scene) return;

    artworks.forEach((art) => {
      const artGroup = refs.artworkGroups.get(art.id);
      if (artGroup) {
        const playBtn = artGroup.getObjectByName('play-button-mesh') as THREE.Mesh;
        if (playBtn) {
          const mat = playBtn.material as THREE.MeshBasicMaterial;
          const isPlayingThis = playingArtId === art.id && isAudioPlaying;
          
          if (mat.map) mat.map.dispose();
          mat.map = createPlayIconTexture(isPlayingThis);
          mat.needsUpdate = true;
        }
      }
    });
  }, [playingArtId, isAudioPlaying, artworks]);

  const isInitialArtworksMount = useRef(true);

  // Handle Dynamic Art edits / updates (skip initial mount to avoid double-loading all 9 textures)
  useEffect(() => {
    if (isInitialArtworksMount.current) {
      isInitialArtworksMount.current = false;
      return;
    }
    const refs = sceneElementsRef.current;
    if (!refs.scene) return;

    // Loop through artworks and update textures in 3D
    artworks.forEach((art) => {
      const artGroup = refs.artworkGroups.get(art.id);
      if (artGroup) {
        // Find canvas mesh
        const canvasMesh = artGroup.getObjectByName('canvas-mesh') as THREE.Mesh;
        if (canvasMesh) {
          const mat = canvasMesh.material as THREE.MeshBasicMaterial;
          if (mat) {
            if (art.customImageUrl) {
              const loader = new THREE.TextureLoader();
              loader.load(art.customImageUrl, (loadedTex) => {
                if (mat.map) mat.map.dispose();
                loadedTex.generateMipmaps = true;
                loadedTex.minFilter = THREE.LinearMipmapLinearFilter;
                const maxAnisotropy = refs.renderer ? (refs.renderer.capabilities.getMaxAnisotropy ? refs.renderer.capabilities.getMaxAnisotropy() : 1) : 1;
                loadedTex.anisotropy = maxAnisotropy;
                loadedTex.colorSpace = THREE.SRGBColorSpace;
                mat.map = loadedTex;
                mat.needsUpdate = true;
              });
            } else {
              // Draw fresh onto a localized canvas
              const baseRes = 2048;
              const aspect = art.width / art.height;
              const texWidth = aspect > 1 ? Math.round(baseRes * aspect) : baseRes;
              const texHeight = aspect > 1 ? baseRes : Math.round(baseRes / aspect);
              const tempCanvas = drawArtworkCanvas(art, texWidth, texHeight);
              const freshTex = new THREE.CanvasTexture(tempCanvas);
              
              // Dispose of old map to prevent GPU load leaks
              if (mat.map) mat.map.dispose();
              freshTex.generateMipmaps = true;
              freshTex.minFilter = THREE.LinearMipmapLinearFilter;
              const maxAnisotropy = refs.renderer ? (refs.renderer.capabilities.getMaxAnisotropy ? refs.renderer.capabilities.getMaxAnisotropy() : 1) : 1;
              freshTex.anisotropy = maxAnisotropy;
              freshTex.colorSpace = THREE.SRGBColorSpace;
              mat.map = freshTex;
              mat.needsUpdate = true;
            }
          }
        }

        // Find wall text mesh
        const textMesh = artGroup.getObjectByName('wall-text-mesh') as THREE.Mesh;
        if (textMesh) {
          const mat = textMesh.material as THREE.MeshBasicMaterial;
          if (mat && mat.map) {
            const freshTex = createWallTextTexture(art.wallText || '');
            mat.map.dispose();
            mat.map = freshTex;
            mat.needsUpdate = true;
          }
        }
      }
    });
  }, [artworks]);

  // Handle Dynamic Main Header Wall Inscription updates
  useEffect(() => {
    const refs = sceneElementsRef.current;
    if (refs.mainHeadingMesh && refs.mainHeadingTexture) {
      // Redraw Heading Canvas
      const hCanvas = createHeaderCanvas(customHeadingText);
      refs.mainHeadingTexture.image = hCanvas;
      refs.mainHeadingTexture.needsUpdate = true;
    }
  }, [customHeadingText]);

  // Handle atmosphere/lighting updates
  useEffect(() => {
    const refs = sceneElementsRef.current;
    if (!refs.scene) return;

    // Update ambient strength
    if (refs.ambientLight) {
      refs.ambientLight.intensity = lightSettings.ambientIntensity;
    }

    // Update ceiling spotlight strengths
    refs.ceilingLights.forEach((light) => {
      light.intensity = lightSettings.ceilingIntensity;
    });

    // Update glow lights and backlights behind paintings
    artworks.forEach((art) => {
      const glowMesh = refs.glowPlanes.get(art.id);
      if (glowMesh) {
        const mat = glowMesh.material as THREE.MeshBasicMaterial;
        mat.color.set(lightSettings.glowColor);
        // Map halo opacity safely
        mat.opacity = Math.min(0.9, lightSettings.backlightIntensity * 0.22);
      }

      const glowLight = refs.glowLights.get(art.id);
      if (glowLight) {
        glowLight.color.set(lightSettings.glowColor);
        glowLight.intensity = lightSettings.backlightIntensity * 1.5;
      }
    });

    // Update wall material emissive illumination level (balanced so shadows & plaster relief stay visible)
    if (refs.wallMaterial) {
      const val = lightSettings.wallBrightness !== undefined ? lightSettings.wallBrightness : 0.35;
      refs.wallMaterial.emissive.setHSL(0.08, 0.05, val * 0.22);
    }
  }, [lightSettings, artworks]);

  // Custom textures creator for secondary texts
  const createWallTextTexture = (text: string): THREE.CanvasTexture => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 128;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f4f4f4'; // blend close with modular wall
      ctx.fillRect(0, 0, 512, 128);
      ctx.fillStyle = '#555555';
      ctx.font = 'bold 22px "Courier New", monospace';
      ctx.letterSpacing = '2px';
      ctx.textAlign = 'center';
      const safeText = typeof text === 'string' ? text : '';
      ctx.fillText(safeText.toUpperCase(), 256, 68);
    }
    const tex = new THREE.CanvasTexture(canvas);
    return tex;
  };

  // Fast 128x128 tileable fine-grain noise canvas for instant pattern stamping (avoids slow 1M-pixel JS loops)
  const createNoiseTileCanvas = (amplitude = 18, alpha = 0.28): HTMLCanvasElement => {
    const size = 128;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (ctx) {
      const img = ctx.createImageData(size, size);
      const d = img.data;
      const aByte = Math.round(alpha * 255);
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.max(0, Math.min(255, 128 + (Math.random() - 0.5) * amplitude * 2));
        d[i] = v;
        d[i + 1] = v;
        d[i + 2] = v;
        d[i + 3] = aByte;
      }
      ctx.putImageData(img, 0, 0);
    }
    return c;
  };

  // Fast Height-to-Tangent-Space Normal Map converter (Sobel/central-difference, wraps seamlessly)
  const heightCanvasToNormalCanvas = (srcCanvas: HTMLCanvasElement, strength = 2.0): HTMLCanvasElement => {
    const w = srcCanvas.width;
    const h = srcCanvas.height;
    const srcCtx = srcCanvas.getContext('2d');
    const outCanvas = document.createElement('canvas');
    outCanvas.width = w;
    outCanvas.height = h;
    const outCtx = outCanvas.getContext('2d');
    if (!srcCtx || !outCtx) return outCanvas;

    const src = srcCtx.getImageData(0, 0, w, h).data;
    const outImg = outCtx.createImageData(w, h);
    const dst = outImg.data;
    const scale = strength / 255;

    for (let y = 0; y < h; y++) {
      const ym = ((y - 1 + h) % h) * w;
      const y0 = y * w;
      const yp = ((y + 1) % h) * w;
      for (let x = 0; x < w; x++) {
        const xm = (x - 1 + w) % w;
        const xp = (x + 1) % w;
        const hL = src[(y0 + xm) << 2];
        const hR = src[(y0 + xp) << 2];
        const hU = src[(ym + x) << 2];
        const hD = src[(yp + x) << 2];

        const dx = (hL - hR) * scale;
        const dy = (hU - hD) * scale;
        const dz = 1.0;
        const invLen = 1.0 / Math.sqrt(dx * dx + dy * dy + dz * dz);

        const idx = (y0 + x) << 2;
        dst[idx] = Math.round((dx * invLen * 0.5 + 0.5) * 255);
        dst[idx + 1] = Math.round((dy * invLen * 0.5 + 0.5) * 255);
        dst[idx + 2] = Math.round((dz * invLen * 0.5 + 0.5) * 255);
        dst[idx + 3] = 255;
      }
    }
    outCtx.putImageData(outImg, 0, 0);
    return outCanvas;
  };

  // Architectural room-scale Ambient Occlusion map (soft contact shading at floor, ceiling, and corners)
  const createArchitecturalAOMap = (edgeAlpha = 0.24, bottomAlpha = 0.30, topAlpha = 0.26): THREE.CanvasTexture => {
    const size = 256;
    const c = document.createElement('canvas');
    c.width = size;
    c.height = size;
    const ctx = c.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, size, size);

      const leftG = ctx.createLinearGradient(0, 0, size * 0.16, 0);
      leftG.addColorStop(0, `rgba(0,0,0,${edgeAlpha})`);
      leftG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = leftG;
      ctx.fillRect(0, 0, size * 0.16, size);

      const rightG = ctx.createLinearGradient(size, 0, size * 0.84, 0);
      rightG.addColorStop(0, `rgba(0,0,0,${edgeAlpha})`);
      rightG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = rightG;
      ctx.fillRect(size * 0.84, 0, size * 0.16, size);

      const topG = ctx.createLinearGradient(0, 0, 0, size * 0.18);
      topG.addColorStop(0, `rgba(0,0,0,${topAlpha})`);
      topG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = topG;
      ctx.fillRect(0, 0, size, size * 0.18);

      const botG = ctx.createLinearGradient(0, size, 0, size * 0.82);
      botG.addColorStop(0, `rgba(0,0,0,${bottomAlpha})`);
      botG.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = botG;
      ctx.fillRect(0, size * 0.82, size, size * 0.18);
    }
    const tex = new THREE.CanvasTexture(c);
    tex.wrapS = THREE.ClampToEdgeWrapping;
    tex.wrapT = THREE.ClampToEdgeWrapping;
    tex.channel = 1; // uses uv1 (0..1 across full plane) while albedo/normal repeat on uv0
    return tex;
  };

  // Fast Procedural Venetian/Gypsum Plaster PBR Set (Albedo + RGB Normal + Roughness)
  const createPlasterMaps = (
    baseColor = '#f4f2ec',
    repeatX = 5,
    repeatY = 2.5,
    anisotropy = 1
  ): { map: THREE.CanvasTexture; normalMap: THREE.CanvasTexture; roughnessMap: THREE.CanvasTexture } => {
    const size = 256;

    const albedoCanvas = document.createElement('canvas');
    albedoCanvas.width = size;
    albedoCanvas.height = size;
    const aCtx = albedoCanvas.getContext('2d');

    const heightCanvas = document.createElement('canvas');
    heightCanvas.width = size;
    heightCanvas.height = size;
    const hCtx = heightCanvas.getContext('2d');

    const roughCanvas = document.createElement('canvas');
    roughCanvas.width = size;
    roughCanvas.height = size;
    const rCtx = roughCanvas.getContext('2d');

    if (aCtx && hCtx && rCtx) {
      aCtx.fillStyle = baseColor;
      aCtx.fillRect(0, 0, size, size);

      hCtx.fillStyle = '#808080';
      hCtx.fillRect(0, 0, size, size);

      rCtx.fillStyle = '#e0e0e0'; // ~0.88 matte plaster roughness
      rCtx.fillRect(0, 0, size, size);

      // Seamless wrapped trowel sweeps & subtle lime-plaster mottling
      for (let i = 0; i < 24; i++) {
        const cx = Math.random() * size;
        const cy = Math.random() * size;
        const rx = 22 + Math.random() * 55;
        const ry = 11 + Math.random() * 32;
        const angle = (Math.random() - 0.5) * 0.8;
        const isLight = Math.random() > 0.48;
        const alpha = 0.02 + Math.random() * 0.03;

        const drawWrappedTrowel = (ctx: CanvasRenderingContext2D, fill: string) => {
          ctx.fillStyle = fill;
          for (let ox = -size; ox <= size; ox += size) {
            for (let oy = -size; oy <= size; oy += size) {
              const gx = cx + ox;
              const gy = cy + oy;
              if (gx + rx < 0 || gx - rx > size || gy + rx < 0 || gy - rx > size) continue;
              ctx.save();
              ctx.translate(gx, gy);
              ctx.rotate(angle);
              ctx.beginPath();
              ctx.ellipse(0, 0, rx, ry, 0, 0, Math.PI * 2);
              ctx.fill();
              ctx.restore();
            }
          }
        };

        drawWrappedTrowel(aCtx, isLight ? `rgba(255, 253, 248, ${alpha})` : `rgba(212, 207, 198, ${alpha})`);
        drawWrappedTrowel(hCtx, isLight ? `rgba(195, 195, 195, ${alpha * 3.0})` : `rgba(65, 65, 65, ${alpha * 3.0})`);
        drawWrappedTrowel(rCtx, isLight ? `rgba(198, 198, 198, ${alpha * 2.8})` : `rgba(248, 248, 248, ${alpha * 2.8})`);
      }

      // Stamp fast tileable mineral plaster grain across all 3 canvases (<2ms total)
      const aPat = aCtx.createPattern(createNoiseTileCanvas(22, 0.24), 'repeat');
      const hPat = hCtx.createPattern(createNoiseTileCanvas(48, 0.45), 'repeat');
      const rPat = rCtx.createPattern(createNoiseTileCanvas(24, 0.30), 'repeat');

      if (aPat) {
        aCtx.globalCompositeOperation = 'overlay';
        aCtx.fillStyle = aPat;
        aCtx.fillRect(0, 0, size, size);
        aCtx.globalCompositeOperation = 'source-over';
      }
      if (hPat) {
        hCtx.fillStyle = hPat;
        hCtx.fillRect(0, 0, size, size);
      }
      if (rPat) {
        rCtx.fillStyle = rPat;
        rCtx.fillRect(0, 0, size, size);
      }
    }

    const normalCanvas = heightCanvasToNormalCanvas(heightCanvas, 2.4);

    const configureTex = (canvas: HTMLCanvasElement, isSRGB: boolean): THREE.CanvasTexture => {
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      tex.repeat.set(repeatX, repeatY);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.anisotropy = anisotropy;
      if (isSRGB) tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    return {
      map: configureTex(albedoCanvas, true),
      normalMap: configureTex(normalCanvas, false),
      roughnessMap: configureTex(roughCanvas, false),
    };
  };

  // Header Canvas Generator
  const createHeaderCanvas = (text: string): HTMLCanvasElement => {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 256;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = '#f4f4f4'; // modular wall matte
      ctx.fillRect(0, 0, 1024, 256);
      
      // Top luxury borderline
      ctx.strokeStyle = '#222222';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 40);
      ctx.lineTo(924, 40);
      ctx.stroke();

      // Large curated typography inscription
      ctx.fillStyle = '#111111';
      ctx.font = 'tracking-widest 500 48px "Space Grotesk", "Inter", sans-serif';
      ctx.letterSpacing = '10px';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const safeText = typeof text === 'string' ? text : '';
      ctx.fillText(safeText.toUpperCase(), 512, 128);

      // Bottom subline
      ctx.font = 'italic 20px "Georgia", serif';
      ctx.fillStyle = '#666666';
      ctx.fillText('— PARIS EXPOSITION DE L\'ATELIER // MCXXVI —', 512, 190);
    }
    return canvas;
  };

  // Spanning Board Canvas Generator (1:1 physical aspect ratio matching the 3D board -> ZERO text stretching)
  const createSpanningBoardTexture = (
    quote: string,
    _category: string,
    planeWidth = 16,
    planeHeight = 0.9,
    isWhite = false
  ): THREE.CanvasTexture => {
    const canvasHeight = 128;
    const canvasWidth = Math.min(2048, Math.max(512, Math.round(canvasHeight * (planeWidth / planeHeight))));
    const canvas = document.createElement('canvas');
    canvas.width = canvasWidth;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = isWhite ? '#ffffff' : '#08080a';
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      if (quote) {
        const text = quote.toUpperCase();
        const padX = Math.round(canvasWidth * 0.05);
        const maxTextWidth = canvasWidth - padX * 2;

        // Start big and bold (matching physical board height cleanly) and auto-fit by true measured width
        let fontSize = isWhite ? 168 : 156;
        let letterSp = isWhite ? 22 : 10;

        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';

        const measure = (fs: number, ls: number) => {
          ctx.font = `900 ${fs}px "Space Grotesk", "Inter", "Arial Black", "Helvetica", sans-serif`;
          ctx.letterSpacing = `${ls}px`;
          return ctx.measureText(text).width;
        };

        let measured = measure(fontSize, letterSp);
        if (measured > maxTextWidth) {
          const scale = maxTextWidth / measured;
          fontSize = Math.max(48, Math.floor(fontSize * scale));
          letterSp = Math.max(2, Math.floor(letterSp * scale));
          measure(fontSize, letterSp);
        }

        const fgColor = isWhite ? '#0a0a0a' : '#ffffff';
        ctx.fillStyle = fgColor;
        // Subtle embolden stroke on dark boards so "DISCOVER THE JOURNEY WITH IAN ART" is extra bold & commanding
        if (!isWhite) {
          ctx.strokeStyle = '#ffffff';
          ctx.lineWidth = Math.max(2, fontSize * 0.032);
          ctx.lineJoin = 'round';
          ctx.strokeText(text, canvasWidth / 2, canvasHeight / 2 + 4);
        }
        ctx.fillText(text, canvasWidth / 2, canvasHeight / 2 + 4);
      }
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearMipmapLinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.generateMipmaps = true;
    return tex;
  };

  // Main canvas mount effect
  useEffect(() => {
    if (!mountRef.current) return;

    // --- SETUP COHESIVE 3D SCENE ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#030303');
    scene.fog = new THREE.FogExp2('#030303', 0.012); // subtle premium room fog

    let width = mountRef.current.clientWidth;
    let height = mountRef.current.clientHeight;

    // Natural human eye-level perspective camera (zero wide-angle skew)
    const isPortraitInitial = width < height;
    const initialFov = getNaturalFov(width, height);
    const camera = new THREE.PerspectiveCamera(initialFov, width / height, 0.1, 100);
    // On mobile, start toward the back of the gallery so the opening shot frames the full front wall & side exhibits
    const startZ = isPortraitInitial ? 5.2 : 0;
    sceneElementsRef.current.playerPosition.set(0, 1.7, startZ);
    camera.position.set(0, 1.7, startZ);
    sceneElementsRef.current.targetFov = initialFov;

    const isMobileDevice = width < 768 || ('ontouchstart' in window && navigator.maxTouchPoints > 0);

    // Setup High-FPS WebGL Renderer (baked AO maps + halo planes replace expensive per-pixel shadow maps)
    const renderer = new THREE.WebGLRenderer({
      antialias: !isMobileDevice,
      alpha: false,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, isMobileDevice ? 1.25 : 1.35));
    renderer.setSize(width, height);
    renderer.shadowMap.enabled = false;
    renderer.shadowMap.autoUpdate = false;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.06;

    // Wipe previous canvas
    renderer.domElement.style.display = 'block';
    renderer.domElement.style.width = '100%';
    renderer.domElement.style.height = '100%';
    renderer.domElement.style.touchAction = 'none';
    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);

    const refs = sceneElementsRef.current;
    refs.scene = scene;
    refs.renderer = renderer;
    refs.camera = camera;

    // LoadingManager tracks real artwork image loading so Enter opens immediately once ready
    let sceneReadyNotified = false;
    const notifyReady = () => {
      if (sceneReadyNotified) return;
      sceneReadyNotified = true;
      onLoadProgress?.(100);
      renderer.shadowMap.needsUpdate = true;
      renderer.compile(scene, camera);
      renderer.render(scene, camera);
      onSceneReady?.();
    };

    const loadingManager = new THREE.LoadingManager(
      () => {
        notifyReady();
      },
      (_url, itemsLoaded, itemsTotal) => {
        const pct = itemsTotal > 0 ? Math.min(95, 35 + Math.round((itemsLoaded / itemsTotal) * 60)) : 90;
        onLoadProgress?.(pct);
      }
    );
    const textureLoader = new THREE.TextureLoader(loadingManager);
    onLoadProgress?.(25);

    // --- 1. LIGHTING LAYOUTS (2 wide-throw gallery SpotLights + Hemisphere + Ambient for locked 60fps across all GPUs) ---
    const ambientLight = new THREE.AmbientLight('#faf8f5', lightSettings.ambientIntensity * 1.15);
    scene.add(ambientLight);
    refs.ambientLight = ambientLight;

    const hemiLight = new THREE.HemisphereLight('#fffdf8', '#9e9a92', 0.68);
    hemiLight.position.set(0, 5, 0);
    scene.add(hemiLight);

    // Recessed LED Spotlights layout (10 physical ceiling fixtures + cones, driven by 2 wide shader SpotLights)
    refs.ceilingLights = [];
    refs.lightCones = [];
    const lightPositions = [
      { x: -2.8, z: -6, activeLight: false }, { x: 2.8, z: -6, activeLight: false },
      { x: -2.8, z: -2, activeLight: false }, { x: 2.8, z: -2, activeLight: false },
      { x: -2.8, z: 2, activeLight: false },  { x: 2.8, z: 2, activeLight: false },
      { x: -2.8, z: 6, activeLight: false },  { x: 2.8, z: 6, activeLight: false },
      { x: 0, z: -4.2, activeLight: true },   { x: 0, z: 4.2, activeLight: true }
    ];

    const fixtureBezelGeo = new THREE.CylinderGeometry(0.115, 0.115, 0.022, 16);
    const fixtureBezelMat = new THREE.MeshStandardMaterial({
      color: '#1b1b1f',
      roughness: 0.32,
      metalness: 0.72,
    });
    const fixtureBaffleGeo = new THREE.CylinderGeometry(0.09, 0.09, 0.02, 16);
    const fixtureBaffleMat = new THREE.MeshStandardMaterial({
      color: '#0e0e11',
      roughness: 0.85,
      metalness: 0.1,
    });
    const fixtureLensGeo = new THREE.CylinderGeometry(0.068, 0.068, 0.012, 16);
    const fixtureLensMat = new THREE.MeshBasicMaterial({
      color: '#fff8e8',
    });
    const sharedConeGeo = new THREE.CylinderGeometry(0.01, 1.8, 4.8, 12, 1, true);

    lightPositions.forEach((pos) => {
      if (pos.activeLight) {
        const spot = new THREE.SpotLight('#fffaf0', lightSettings.ceilingIntensity * 1.45, 24, Math.PI / 2.05, 0.75, 1.0);
        spot.position.set(pos.x, 4.85, pos.z);
        spot.target.position.set(pos.x, 0, pos.z);
        scene.add(spot.target);
        scene.add(spot);
        refs.ceilingLights.push(spot);
      }

      // Physical recessed downlight bezel + dark baffle + warm LED diffuser in the ceiling
      const bezel = new THREE.Mesh(fixtureBezelGeo, fixtureBezelMat);
      bezel.position.set(pos.x, 4.989, pos.z);
      scene.add(bezel);

      const baffle = new THREE.Mesh(fixtureBaffleGeo, fixtureBaffleMat);
      baffle.position.set(pos.x, 4.986, pos.z);
      scene.add(baffle);

      const lens = new THREE.Mesh(fixtureLensGeo, fixtureLensMat);
      lens.position.set(pos.x, 4.983, pos.z);
      scene.add(lens);

      // Light Cone Visualizer
      const coneMat = new THREE.MeshBasicMaterial({
        color: '#fff8ec',
        transparent: true,
        opacity: 0.018,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const cone = new THREE.Mesh(sharedConeGeo, coneMat);
      cone.position.set(pos.x, 2.4, pos.z);
      scene.add(cone);
      refs.lightCones.push(cone);
    });

    // --- 2. FLOONS & CEILING & SHELL ---
    // Realistic Tiled Checkerboard Flooring (16m x 24m)
    // We render a 2x2 tile pattern on a 1024x1024 canvas, matching 2m x 2m area of 3D world
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 1024;
    floorCanvas.height = 1024;
    const fCtx = floorCanvas.getContext('2d');
    if (fCtx) {
      const cWhite = '#ffffff';
      const cBlack = '#141416'; // Deep charcoal black so studs are visible

      // 1. Draw 4 solid square tiles
      fCtx.fillStyle = cWhite;
      fCtx.fillRect(0, 0, 512, 512);
      fCtx.fillRect(512, 512, 512, 512);

      fCtx.fillStyle = cBlack;
      fCtx.fillRect(512, 0, 512, 512);
      fCtx.fillRect(0, 512, 512, 512);

      // Helper to draw a vertical tab
      const drawVerticalTab = (ctx: CanvasRenderingContext2D, xBound: number, y: number, extendRight: boolean, color: string) => {
        const r = 8;
        const neckW = 8;
        const neckH = 8;
        const cx = extendRight ? xBound + neckW : xBound - neckW;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        if (extendRight) {
          ctx.rect(xBound, y - neckH / 2, neckW, neckH);
        } else {
          ctx.rect(xBound - neckW, y - neckH / 2, neckW, neckH);
        }
        ctx.arc(cx, y, r, 0, Math.PI * 2);
        ctx.fill();

        // Subtle shadow outline
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(cx, y, r, 0, Math.PI * 2);
        ctx.stroke();
      };

      // Helper to draw a horizontal tab
      const drawHorizontalTab = (ctx: CanvasRenderingContext2D, x: number, yBound: number, extendDown: boolean, color: string) => {
        const r = 8;
        const neckW = 8;
        const neckH = 8;
        const cy = extendDown ? yBound + neckH : yBound - neckH;
        
        ctx.fillStyle = color;
        ctx.beginPath();
        if (extendDown) {
          ctx.rect(x - neckW / 2, yBound, neckW, neckH);
        } else {
          ctx.rect(x - neckW / 2, yBound - neckH, neckW, neckH);
        }
        ctx.arc(x, cy, r, 0, Math.PI * 2);
        ctx.fill();

        // Subtle shadow outline
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(x, cy, r, 0, Math.PI * 2);
        ctx.stroke();
      };

      // Draw vertical joints
      // Center vertical (x = 512)
      for (let y = 16; y < 1024; y += 32) {
        const isUpper = y < 512;
        const cLeft = isUpper ? cWhite : cBlack;
        const cRight = isUpper ? cBlack : cWhite;
        const idx = Math.floor((y - 16) / 32);
        if (idx % 2 === 0) {
          drawVerticalTab(fCtx, 512, y, true, cLeft);
        } else {
          drawVerticalTab(fCtx, 512, y, false, cRight);
        }
      }

      // Outer vertical (x = 0 / 1024)
      for (let y = 16; y < 1024; y += 32) {
        const isUpper = y < 512;
        const cLeft = isUpper ? cBlack : cWhite; // wraps from right
        const cRight = isUpper ? cWhite : cBlack;
        const idx = Math.floor((y - 16) / 32);
        if (idx % 2 === 0) {
          drawVerticalTab(fCtx, 0, y, true, cLeft);
        } else {
          drawVerticalTab(fCtx, 1024, y, false, cRight);
        }
      }

      // Draw horizontal joints
      // Center horizontal (y = 512)
      for (let x = 16; x < 1024; x += 32) {
        const isLeft = x < 512;
        const cTop = isLeft ? cWhite : cBlack;
        const cBottom = isLeft ? cBlack : cWhite;
        const idx = Math.floor((x - 16) / 32);
        if (idx % 2 === 0) {
          drawHorizontalTab(fCtx, x, 512, true, cTop);
        } else {
          drawHorizontalTab(fCtx, x, 512, false, cBottom);
        }
      }

      // Outer horizontal (y = 0 / 1024)
      for (let x = 16; x < 1024; x += 32) {
        const isLeft = x < 512;
        const cTop = isLeft ? cBlack : cWhite; // wraps from bottom
        const cBottom = isLeft ? cWhite : cBlack;
        const idx = Math.floor((x - 16) / 32);
        if (idx % 2 === 0) {
          drawHorizontalTab(fCtx, x, 0, true, cTop);
        } else {
          drawHorizontalTab(fCtx, x, 1024, false, cBottom);
        }
      }

      // Draw joint line details along borders (to make joints pop)
      fCtx.strokeStyle = 'rgba(0, 0, 0, 0.15)';
      fCtx.lineWidth = 1;
      
      fCtx.beginPath();
      // center horizontal line
      fCtx.moveTo(0, 512); fCtx.lineTo(1024, 512);
      // center vertical line
      fCtx.moveTo(512, 0); fCtx.lineTo(512, 1024);
      fCtx.stroke();

      // Helper to draw 3D Stud (embossed coin-top texture)
      const draw3DStud = (ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, isBlack: boolean) => {
        const baseColor = isBlack ? '#1c1c1f' : '#f5f5f7';
        const shadowColor = isBlack ? '#070708' : '#d2d2d6';
        const highlightColor = isBlack ? '#2d2d31' : '#ffffff';

        // 1. Shadow (offset bottom-right)
        ctx.fillStyle = shadowColor;
        ctx.beginPath();
        ctx.arc(cx + 1, cy + 1, r, 0, Math.PI * 2);
        ctx.fill();

        // 2. Highlight (offset top-left)
        ctx.fillStyle = highlightColor;
        ctx.beginPath();
        ctx.arc(cx - 1, cy - 1, r, 0, Math.PI * 2);
        ctx.fill();

        // 3. Main Stud Body
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.arc(cx, cy, r, 0, Math.PI * 2);
        ctx.fill();
      };

      // Draw Studs in 12x12 grid per tile
      const studR = 7;
      const studCount = 12;
      const studStep = 512 / studCount;

      for (let tileRow = 0; tileRow < 2; tileRow++) {
        for (let tileCol = 0; tileCol < 2; tileCol++) {
          const tileX = tileCol * 512;
          const tileY = tileRow * 512;
          const isBlackTile = (tileRow + tileCol) % 2 === 1;

          for (let r = 0; r < studCount; r++) {
            for (let c = 0; c < studCount; c++) {
              const cx = tileX + (c + 0.5) * studStep;
              const cy = tileY + (r + 0.5) * studStep;
              
              // Only draw if inside the main tile and not too close to the puzzle edges to avoid clipping
              if (cx > tileX + 16 && cx < tileX + 496 && cy > tileY + 16 && cy < tileY + 496) {
                draw3DStud(fCtx, cx, cy, studR, isBlackTile);
              }
            }
          }
        }
      }

      // Fast micro-grain pattern stamp across tiles (<1ms vs 1M-pixel loop)
      const floorNoisePat = fCtx.createPattern(createNoiseTileCanvas(14, 0.16), 'repeat');
      if (floorNoisePat) {
        fCtx.globalCompositeOperation = 'overlay';
        fCtx.fillStyle = floorNoisePat;
        fCtx.fillRect(0, 0, 1024, 1024);
        fCtx.globalCompositeOperation = 'source-over';
      }
    }

    // Generate synchronized 256x256 Height -> RGB Normal Map & Roughness Map for the interlocking studded floor
    const fMapSize = 256;
    const floorHeightCanvas = document.createElement('canvas');
    floorHeightCanvas.width = fMapSize;
    floorHeightCanvas.height = fMapSize;
    const fhCtx = floorHeightCanvas.getContext('2d');

    const floorRoughCanvas = document.createElement('canvas');
    floorRoughCanvas.width = fMapSize;
    floorRoughCanvas.height = fMapSize;
    const frCtx = floorRoughCanvas.getContext('2d');

    if (fhCtx && frCtx) {
      // Base tile height & semi-matte surface roughness
      fhCtx.fillStyle = '#737373';
      fhCtx.fillRect(0, 0, fMapSize, fMapSize);
      frCtx.fillStyle = '#9a9a9a'; // ~0.60 roughness on flat tile body
      frCtx.fillRect(0, 0, fMapSize, fMapSize);

      // Subtle micro-grain on floor height & roughness
      const fhPat = fhCtx.createPattern(createNoiseTileCanvas(16, 0.2), 'repeat');
      if (fhPat) {
        fhCtx.fillStyle = fhPat;
        fhCtx.fillRect(0, 0, fMapSize, fMapSize);
      }

      // Recessed puzzle seams
      const halfF = fMapSize / 2;
      fhCtx.strokeStyle = '#181818';
      fhCtx.lineWidth = 2;
      fhCtx.beginPath();
      fhCtx.moveTo(0, halfF); fhCtx.lineTo(fMapSize, halfF);
      fhCtx.moveTo(halfF, 0); fhCtx.lineTo(halfF, fMapSize);
      fhCtx.stroke();

      frCtx.strokeStyle = '#e8e8e8'; // matte seams
      frCtx.lineWidth = 2;
      frCtx.beginPath();
      frCtx.moveTo(0, halfF); frCtx.lineTo(fMapSize, halfF);
      frCtx.moveTo(halfF, 0); frCtx.lineTo(halfF, fMapSize);
      frCtx.stroke();

      const studR = 1.8;
      const studCount = 12;
      const studStep = halfF / studCount;
      for (let tileRow = 0; tileRow < 2; tileRow++) {
        for (let tileCol = 0; tileCol < 2; tileCol++) {
          const tileX = tileCol * halfF;
          const tileY = tileRow * halfF;
          for (let r = 0; r < studCount; r++) {
            for (let c = 0; c < studCount; c++) {
              const cx = tileX + (c + 0.5) * studStep;
              const cy = tileY + (r + 0.5) * studStep;
              if (cx > tileX + 4 && cx < tileX + halfF - 4 && cy > tileY + 4 && cy < tileY + halfF - 4) {
                const grad = fhCtx.createRadialGradient(cx, cy, 0.5, cx, cy, studR);
                grad.addColorStop(0, '#f5f5f5');
                grad.addColorStop(0.72, '#dcdcdc');
                grad.addColorStop(1, '#737373');
                fhCtx.fillStyle = grad;
                fhCtx.beginPath();
                fhCtx.arc(cx, cy, studR, 0, Math.PI * 2);
                fhCtx.fill();

                frCtx.fillStyle = '#4e4e4e'; // ~0.31 satin sheen on raised stud tops
                frCtx.beginPath();
                frCtx.arc(cx, cy, studR * 0.85, 0, Math.PI * 2);
                frCtx.fill();
              }
            }
          }
        }
      }
    }

    const floorNormalCanvas = heightCanvasToNormalCanvas(floorHeightCanvas, 3.0);
    const maxAnisotropy = renderer.capabilities.getMaxAnisotropy ? Math.min(8, renderer.capabilities.getMaxAnisotropy()) : 1;

    const configureFloorMap = (canvas: HTMLCanvasElement, isSRGB: boolean): THREE.CanvasTexture => {
      const tex = new THREE.CanvasTexture(canvas);
      tex.wrapS = THREE.RepeatWrapping;
      tex.wrapT = THREE.RepeatWrapping;
      // Stretch represents 2m x 2m. Width 11m = 5.5 repeats. Length 16m = 8 repeats.
      tex.repeat.set(5.5, 8);
      tex.minFilter = THREE.LinearMipmapLinearFilter;
      tex.magFilter = THREE.LinearFilter;
      tex.generateMipmaps = true;
      tex.anisotropy = maxAnisotropy;
      if (isSRGB) tex.colorSpace = THREE.SRGBColorSpace;
      return tex;
    };

    const floorTex = configureFloorMap(floorCanvas, true);
    const floorNormalTex = configureFloorMap(floorNormalCanvas, false);
    const floorRoughTex = configureFloorMap(floorRoughCanvas, false);

    // Room-scale architectural Ambient Occlusion maps (soft contact shadows where walls/floor/ceiling meet)
    const floorAOMap = createArchitecturalAOMap(0.32, 0.32, 0.32);
    const ceilingAOMap = createArchitecturalAOMap(0.34, 0.34, 0.34);
    const wallAOMap = createArchitecturalAOMap(0.24, 0.34, 0.28);

    const floorGeo = new THREE.PlaneGeometry(11, 16);
    floorGeo.setAttribute('uv1', floorGeo.attributes.uv);
    const floorMat = new THREE.MeshStandardMaterial({
      map: floorTex,
      normalMap: floorNormalTex,
      normalScale: new THREE.Vector2(0.85, 0.85),
      roughnessMap: floorRoughTex,
      roughness: 1.0,
      metalness: 0.05,
      aoMap: floorAOMap,
      aoMapIntensity: 0.65,
      envMapIntensity: 0.55,
    });
    const floor = new THREE.Mesh(floorGeo, floorMat);
    floor.name = 'floor-mesh';
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = 0;
    floor.receiveShadow = true;
    scene.add(floor);

    // Shared Fast Venetian/Gypsum Plaster PBR Set (used by both walls and ceiling)
    const wallPlasterMaps = createPlasterMaps('#f5f3ee', 5.5, 2.5, maxAnisotropy);

    // Realistic Plastered Drywall Ceiling with Perimeter Architectural Soffit & Contact AO
    const ceilingGeo = new THREE.PlaneGeometry(11, 16);
    ceilingGeo.setAttribute('uv1', ceilingGeo.attributes.uv);
    const ceilingMat = new THREE.MeshStandardMaterial({
      color: '#eae8e2',
      map: wallPlasterMaps.map,
      normalMap: wallPlasterMaps.normalMap,
      normalScale: new THREE.Vector2(0.28, 0.28),
      roughnessMap: wallPlasterMaps.roughnessMap,
      roughness: 1.0,
      metalness: 0.0,
      aoMap: ceilingAOMap,
      aoMapIntensity: 0.72,
      envMapIntensity: 0.28,
    });
    const ceiling = new THREE.Mesh(ceilingGeo, ceilingMat);
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = 5; // Height 5 meters
    ceiling.receiveShadow = true;
    scene.add(ceiling);

    // Perimeter architectural ceiling soffit / coffer drop border with subtle shadow reveal
    const soffitMat = new THREE.MeshStandardMaterial({
      color: '#e5e3dc',
      normalMap: wallPlasterMaps.normalMap,
      normalScale: new THREE.Vector2(0.2, 0.2),
      roughness: 0.88,
      metalness: 0.0,
      envMapIntensity: 0.25,
    });
    const addSoffit = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), soffitMat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
    };
    addSoffit(11, 0.14, 0.34, 0, 4.93, -7.83);   // North soffit
    addSoffit(11, 0.14, 0.34, 0, 4.93, 7.83);    // South soffit
    addSoffit(0.34, 0.14, 15.32, -5.33, 4.93, 0); // West soffit
    addSoffit(0.34, 0.14, 15.32, 5.33, 4.93, 0);  // East soffit

    // Draw ceiling architectural powder-coated steel I-beams (flange + web profile)
    const beamMat = new THREE.MeshStandardMaterial({
      color: '#19191d',
      roughness: 0.38,
      metalness: 0.35,
      envMapIntensity: 0.55,
    });
    const longWebGeo = new THREE.BoxGeometry(0.14, 0.15, 16);
    const longFlangeGeo = new THREE.BoxGeometry(0.32, 0.035, 16);
    [-2.75, 2.75].forEach((bx) => {
      const web = new THREE.Mesh(longWebGeo, beamMat);
      web.position.set(bx, 4.925, 0);
      web.castShadow = true;
      web.receiveShadow = true;
      scene.add(web);

      const flange = new THREE.Mesh(longFlangeGeo, beamMat);
      flange.position.set(bx, 4.85, 0);
      flange.castShadow = true;
      flange.receiveShadow = true;
      scene.add(flange);
    });

    const crossWebGeo = new THREE.BoxGeometry(11, 0.15, 0.14);
    const crossFlangeGeo = new THREE.BoxGeometry(11, 0.035, 0.32);
    [-4, 4].forEach((bz) => {
      const web = new THREE.Mesh(crossWebGeo, beamMat);
      web.position.set(0, 4.925, bz);
      web.castShadow = true;
      web.receiveShadow = true;
      scene.add(web);

      const flange = new THREE.Mesh(crossFlangeGeo, beamMat);
      flange.position.set(0, 4.85, bz);
      flange.castShadow = true;
      flange.receiveShadow = true;
      scene.add(flange);
    });

    // --- 3. MODULAR EXHIBITION WALLS (Outer Perimeter) ---
    // Realistic plastered white walls ("enduit") with RGB normal relief, matte roughness, and architectural AO
    const initialEmissiveHSLVal = (lightSettings.wallBrightness !== undefined ? lightSettings.wallBrightness : 0.35) * 0.22;
    const wallMat = new THREE.MeshStandardMaterial({
      map: wallPlasterMaps.map,
      normalMap: wallPlasterMaps.normalMap,
      normalScale: new THREE.Vector2(0.45, 0.45),
      roughnessMap: wallPlasterMaps.roughnessMap,
      roughness: 1.0,
      metalness: 0.0,
      aoMap: wallAOMap,
      aoMapIntensity: 0.65,
      envMapIntensity: 0.35,
      emissive: new THREE.Color().setHSL(0.08, 0.05, initialEmissiveHSLVal),
    });
    sceneElementsRef.current.wallMaterial = wallMat;

    const createWall = (w: number, h: number, x: number, y: number, z: number, rotY: number) => {
      const g = new THREE.PlaneGeometry(w, h);
      g.setAttribute('uv1', g.attributes.uv);
      const m = new THREE.Mesh(g, wallMat);
      m.position.set(x, y, z);
      m.rotation.y = rotY;
      m.receiveShadow = true;
      scene.add(m);
    };

    // Four main perimeter walls at ±5.5m (width) and ±8m (length)
    createWall(11, 5, 0, 2.5, -8, 0);          // Front Wall (North)
    createWall(11, 5, 0, 2.5, 8, Math.PI);      // Rear Wall (South)
    createWall(16, 5, -5.5, 2.5, 0, Math.PI / 2);  // Left Wall (West)
    createWall(16, 5, 5.5, 2.5, 0, -Math.PI / 2);  // Right Wall (East)

    // Profiled architectural baseboards (two-tier skirting + top molding lip) where walls meet the floor
    const baseboardMat = new THREE.MeshStandardMaterial({
      color: '#ebe9e3',
      roughness: 0.42,
      metalness: 0.04,
      envMapIntensity: 0.4,
    });
    const addBaseboard = (w: number, h: number, d: number, x: number, y: number, z: number) => {
      const m = new THREE.Mesh(new THREE.BoxGeometry(w, h, d), baseboardMat);
      m.position.set(x, y, z);
      m.castShadow = true;
      m.receiveShadow = true;
      scene.add(m);
    };
    // Main skirting boards
    addBaseboard(11, 0.13, 0.028, 0, 0.065, -7.986);   // North
    addBaseboard(11, 0.13, 0.028, 0, 0.065, 7.986);    // South
    addBaseboard(0.028, 0.13, 16, -5.486, 0.065, 0);   // West
    addBaseboard(0.028, 0.13, 16, 5.486, 0.065, 0);    // East
    // Subtle recessed top cap molding on baseboards
    addBaseboard(11, 0.018, 0.036, 0, 0.135, -7.982);
    addBaseboard(11, 0.018, 0.036, 0, 0.135, 7.982);
    addBaseboard(0.036, 0.018, 16, -5.482, 0.135, 0);
    addBaseboard(0.036, 0.018, 16, 5.482, 0.135, 0);

    // Add three structural partition walls on the left and three on the right sides
    // to segment the side murals and paintings into 4 equal, gorgeous exhibition quadrants.
    const partitionGeo = new THREE.BoxGeometry(0.45, 5, 0.08);
    partitionGeo.setAttribute('uv1', partitionGeo.attributes.uv);
    const partitionBaseboardGeo = new THREE.BoxGeometry(0.47, 0.13, 0.105);
    const partitionZPositions = [-4, 0, 4];

    partitionZPositions.forEach((zVal) => {
      // Left Wall partitions: stand out by 0.45m towards the center (X goes from -5.5 to -5.05)
      const leftPart = new THREE.Mesh(partitionGeo, wallMat);
      leftPart.position.set(-5.5 + 0.225, 2.5, zVal);
      leftPart.castShadow = true;
      leftPart.receiveShadow = true;
      scene.add(leftPart);

      const leftBase = new THREE.Mesh(partitionBaseboardGeo, baseboardMat);
      leftBase.position.set(-5.5 + 0.225, 0.065, zVal);
      leftBase.receiveShadow = true;
      scene.add(leftBase);

      // Right Wall partitions: stand out by 0.45m towards the center (X goes from 5.5 to 5.05)
      const rightPart = new THREE.Mesh(partitionGeo, wallMat);
      rightPart.position.set(5.5 - 0.225, 2.5, zVal);
      rightPart.castShadow = true;
      rightPart.receiveShadow = true;
      scene.add(rightPart);

      const rightBase = new THREE.Mesh(partitionBaseboardGeo, baseboardMat);
      rightBase.position.set(5.5 - 0.225, 0.065, zVal);
      rightBase.receiveShadow = true;
      scene.add(rightBase);
    });

    // --- 3.5 HORIZONTAL TOP BOARDS ABOVE PARTITIONS (SPANNING ACROSS ALL FOUR SIDES WITH PHILOSOPHICAL QUOTES) ---
    // Spanning boards bridge across the partitions and form a gorgeous, continuous gallery crown/frieze.
    // By setting their height to 0.9m and centering at Y=4.55m, their top edge reaches exactly Y=5.0m,
    // which seamlessly level-caps the partitions and walls so they don't stick out.
    const boardSupportMat = new THREE.MeshBasicMaterial({
      color: '#000000',
    });

    // Pristine luxury white board support material for left and right walls
    const whiteBoardSupportMat = new THREE.MeshStandardMaterial({
      color: '#ffffff',
      roughness: 0.85,
    });

    // 1) Left (West) Spanning Board & Text Plane
    const leftBoardSupportGeo = new THREE.BoxGeometry(0.1, 0.9, 16);
    const leftBoardSupport = new THREE.Mesh(leftBoardSupportGeo, whiteBoardSupportMat);
    leftBoardSupport.position.set(-5.05, 4.55, 0);
    leftBoardSupport.castShadow = true;
    leftBoardSupport.receiveShadow = true;
    scene.add(leftBoardSupport);

    // Left quotes: 1:1 physical aspect ratio (16m x 0.9m) -> zero text stretching
    const leftTextTex = createSpanningBoardTexture(
      "IT'S ABOUT TIME",
      'STRUCTURE',
      16,
      0.9,
      true
    );
    leftTextTex.anisotropy = maxAnisotropy;
    const leftTextPlaneGeo = new THREE.PlaneGeometry(16, 0.9);
    const leftTextPlaneMat = new THREE.MeshBasicMaterial({
      map: leftTextTex,
      side: THREE.DoubleSide,
    });
    const leftTextPlane = new THREE.Mesh(leftTextPlaneGeo, leftTextPlaneMat);
    leftTextPlane.position.set(-4.99, 4.55, 0);
    leftTextPlane.rotation.y = Math.PI / 2; // Face inwards (East)
    scene.add(leftTextPlane);

    // 2) Right (East) Spanning Board & Text Plane
    const rightBoardSupportGeo = new THREE.BoxGeometry(0.1, 0.9, 16);
    const rightBoardSupport = new THREE.Mesh(rightBoardSupportGeo, whiteBoardSupportMat);
    rightBoardSupport.position.set(5.05, 4.55, 0);
    rightBoardSupport.castShadow = true;
    rightBoardSupport.receiveShadow = true;
    scene.add(rightBoardSupport);

    // Right quotes: 1:1 physical aspect ratio (16m x 0.9m) -> zero text stretching
    const rightTextTex = createSpanningBoardTexture(
      "LET'S FACE IT",
      'REDUCTION',
      16,
      0.9,
      true
    );
    rightTextTex.anisotropy = maxAnisotropy;
    const rightTextPlaneGeo = new THREE.PlaneGeometry(16, 0.9);
    const rightTextPlaneMat = new THREE.MeshBasicMaterial({
      map: rightTextTex,
      side: THREE.DoubleSide,
    });
    const rightTextPlane = new THREE.Mesh(rightTextPlaneGeo, rightTextPlaneMat);
    rightTextPlane.position.set(4.99, 4.55, 0);
    rightTextPlane.rotation.y = -Math.PI / 2; // Face inwards (West)
    scene.add(rightTextPlane);

    // 3) Front (North) Spanning Board & Text Plane
    const frontBoardSupportGeo = new THREE.BoxGeometry(10.1, 0.9, 0.1);
    const frontBoardSupport = new THREE.Mesh(frontBoardSupportGeo, boardSupportMat);
    frontBoardSupport.position.set(0, 4.55, -7.55);
    frontBoardSupport.castShadow = true;
    frontBoardSupport.receiveShadow = true;
    scene.add(frontBoardSupport);

    const frontTextTex = createSpanningBoardTexture(
      'DISCOVER THE JOURNEY WITH IAN ART',
      'ELEGANCE',
      10.1,
      0.9,
      false
    );
    frontTextTex.anisotropy = maxAnisotropy;
    const frontTextPlaneGeo = new THREE.PlaneGeometry(10.1, 0.9);
    const frontTextPlaneMat = new THREE.MeshBasicMaterial({
      map: frontTextTex,
      side: THREE.DoubleSide,
    });
    const frontTextPlane = new THREE.Mesh(frontTextPlaneGeo, frontTextPlaneMat);
    frontTextPlane.position.set(0, 4.55, -7.49);
    frontTextPlane.rotation.y = 0; // Face inwards (South)
    scene.add(frontTextPlane);

    // 4) Back (South) Spanning Board & Text Plane
    const backBoardSupportGeo = new THREE.BoxGeometry(10.1, 0.9, 0.1);
    const backBoardSupport = new THREE.Mesh(backBoardSupportGeo, boardSupportMat);
    backBoardSupport.position.set(0, 4.55, 7.55);
    backBoardSupport.castShadow = true;
    backBoardSupport.receiveShadow = true;
    scene.add(backBoardSupport);

    const backTextTex = createSpanningBoardTexture(
      'DISCOVER THE JOURNEY WITH IAN ART',
      'MONOCHROME',
      10.1,
      0.9,
      false
    );
    backTextTex.anisotropy = maxAnisotropy;
    const backTextPlaneGeo = new THREE.PlaneGeometry(10.1, 0.9);
    const backTextPlaneMat = new THREE.MeshBasicMaterial({
      map: backTextTex,
      side: THREE.DoubleSide,
    });
    const backTextPlane = new THREE.Mesh(backTextPlaneGeo, backTextPlaneMat);
    backTextPlane.position.set(0, 4.55, 7.49);
    backTextPlane.rotation.y = Math.PI; // Face inwards (North)
    scene.add(backTextPlane);

    // Centerpiece partition walls and bases removed to open up the room structure layout

    // --- 4. MOUNTING MINIMALIST TYPOGRAPHY ON NORTH WALL (REMOVED TO PREVENT OVERLAPPING THE GRAND LANDSCAPE PANORAMA) ---
    refs.mainHeadingMesh = null;
    refs.mainHeadingTexture = null;

    // --- 5. THE ART EXHIBITIONS LOOP (Shared Materials & Textures for Fast Startup & High FPS) ---
    refs.artworkGroups.clear();
    refs.glowPlanes.clear();
    refs.glowLights.clear();

    const sharedFrameMat = new THREE.MeshStandardMaterial({
      color: '#111111',
      roughness: 0.16,
      metalness: 0.15,
      envMapIntensity: 0.5,
    });

    // Single shared Gaussian backlight halo texture (instead of 10 duplicate canvases)
    const glowCanvas = document.createElement('canvas');
    glowCanvas.width = 128;
    glowCanvas.height = 128;
    const gCtx = glowCanvas.getContext('2d');
    if (gCtx) {
      const rad = 64;
      const grad = gCtx.createRadialGradient(rad, rad, 5, rad, rad, rad);
      grad.addColorStop(0, 'rgba(255,255,255,1.0)');
      grad.addColorStop(0.3, 'rgba(255,255,255,0.7)');
      grad.addColorStop(1, 'rgba(255,255,255,0.0)');
      gCtx.fillStyle = grad;
      gCtx.fillRect(0, 0, 128, 128);
    }
    const sharedHaloTexture = new THREE.CanvasTexture(glowCanvas);
    const sharedBtnGeo = new THREE.PlaneGeometry(0.28, 0.28);
    const sharedPlayIconTex = createPlayIconTexture(false);
    const sharedPauseIconTex = createPlayIconTexture(true);
    const sharedInquiryIconTex = createInquiryIconTexture();
    const sharedInquiryBtnMat = new THREE.MeshBasicMaterial({
      map: sharedInquiryIconTex,
      transparent: true,
      depthWrite: false,
    });

    let asyncImageCount = 0;

    artworks.forEach((art) => {
      // Create a centralized grouping for the painting elements
      const artGroup = new THREE.Group();
      artGroup.position.set(art.position.x, art.position.y, art.position.z);
      artGroup.rotation.y = art.rotationY;

      // 5.1 Deep Black Luxury Floating Frame
      const frameDepth = 0.08;
      const frameGap = 0.04;
      const frameGeo = new THREE.BoxGeometry(art.width + frameGap * 2, art.height + frameGap * 2, frameDepth);
      const frameMesh = new THREE.Mesh(frameGeo, sharedFrameMat);
      frameMesh.castShadow = true;
      artGroup.add(frameMesh);

      // 5.2 Dynamic Painting Texture (loaded via LoadingManager for real progress tracking)
      const baseRes = 1024;
      const aspect = art.width / art.height;
      const texWidth = Math.min(2048, aspect > 1 ? Math.round(baseRes * aspect) : baseRes);
      const texHeight = Math.min(2048, aspect > 1 ? baseRes : Math.round(baseRes / aspect));
      
      let paintingTex: THREE.Texture;
      if (art.customImageUrl) {
        asyncImageCount++;
        paintingTex = textureLoader.load(art.customImageUrl);
        paintingTex.colorSpace = THREE.SRGBColorSpace;
      } else {
        const paintingCanvas = drawArtworkCanvas(art, texWidth, texHeight);
        paintingTex = new THREE.CanvasTexture(paintingCanvas);
        paintingTex.colorSpace = THREE.SRGBColorSpace;
      }
      paintingTex.generateMipmaps = true;
      paintingTex.minFilter = THREE.LinearMipmapLinearFilter;
      paintingTex.anisotropy = maxAnisotropy;

      const canvasWidth = art.width;
      const canvasHeight = art.height;
      const canvasDepth = 0.02;
      const canvasGeo = new THREE.BoxGeometry(canvasWidth, canvasHeight, canvasDepth);
      const canvasMat = new THREE.MeshBasicMaterial({
        map: paintingTex,
        toneMapped: false,
      });
      const canvasMesh = new THREE.Mesh(canvasGeo, canvasMat);
      canvasMesh.name = 'canvas-mesh';
      // Nested slightly forward relative to frame box
      canvasMesh.position.z = frameDepth / 2 + 0.01;
      artGroup.add(canvasMesh);

      // 5.3 Glowing Wall Backlight (behind the frame box)
      const glowScale = 1.25;
      const glowGeo = new THREE.PlaneGeometry(art.width * glowScale, art.height * glowScale);
      const glowMat = new THREE.MeshBasicMaterial({
        color: new THREE.Color(lightSettings.glowColor),
        map: sharedHaloTexture,
        transparent: true,
        opacity: Math.min(0.9, lightSettings.backlightIntensity * 0.22),
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const glowMesh = new THREE.Mesh(glowGeo, glowMat);
      // Sit precisely between frame and wall
      glowMesh.position.z = -frameDepth / 2 - 0.01;
      artGroup.add(glowMesh);
      refs.glowPlanes.set(art.id, glowMesh);

      // 5.4 Backlight halo is rendered by glowMesh above (zero per-pixel PointLight shader cost across all GPUs)

      // 5.45 3D Play Button (sitting at bottom right corner of canvas)
      const playBtnMat = new THREE.MeshBasicMaterial({
        map: playingArtId === art.id && isAudioPlaying ? sharedPauseIconTex : sharedPlayIconTex,
        transparent: true,
        depthWrite: false,
      });
      const playBtnMesh = new THREE.Mesh(sharedBtnGeo, playBtnMat);
      playBtnMesh.name = 'play-button-mesh';
      playBtnMesh.position.set(art.width / 2 - 0.22, -art.height / 2 + 0.22, frameDepth / 2 + 0.03);
      playBtnMesh.renderOrder = 10;
      playBtnMesh.userData = { artworkId: art.id, type: 'play-button' };
      artGroup.add(playBtnMesh);

      // 5.46 3D Inquiry Button (sitting directly above the play button)
      const inquiryBtnMesh = new THREE.Mesh(sharedBtnGeo, sharedInquiryBtnMat);
      inquiryBtnMesh.name = 'inquiry-button-mesh';
      // Sits vertically above the play button (offset +0.36m in Y direction)
      inquiryBtnMesh.position.set(art.width / 2 - 0.22, -art.height / 2 + 0.58, frameDepth / 2 + 0.03);
      inquiryBtnMesh.renderOrder = 10;
      inquiryBtnMesh.userData = { artworkId: art.id, type: 'inquiry-button' };
      artGroup.add(inquiryBtnMesh);

      // Add entire curated exhibit group to scene and register
      scene.add(artGroup);
      refs.artworkGroups.set(art.id, artGroup);
    });

    // Bake static shadows once; if no async images are pending, notify ready immediately
    renderer.shadowMap.needsUpdate = true;
    if (asyncImageCount === 0) {
      notifyReady();
    }

    // --- 6. EVENT BINDING & INTERACTIVITY ---
    const handleKeyDown = (e: KeyboardEvent) => {
      // AVOID stealing focus if the user is customizing text inside the control sidebar!
      const activeEl = document.activeElement;
      if (activeEl && (activeEl.tagName === 'INPUT' || activeEl.tagName === 'TEXTAREA')) {
        return;
      }
      
      const k = e.key.toLowerCase();
      refs.keysPressed[k] = true;

      // Handle direct keyboard number hotkeys 1-9 to focus/teleport to exhibits
      if (k >= '1' && k <= '9') {
        const artIdx = parseInt(k) - 1;
        const targetArt = stateRefs.current.artworks[artIdx];
        if (targetArt) {
          // Trigger a simulated click on the button by emitting a teleport event
          const offset = 3.6;
          let targetX = targetArt.position.x;
          let targetZ = targetArt.position.z;
          let viewY = targetArt.rotationY;

          if (Math.abs(targetArt.rotationY - Math.PI / 2) < 0.1) {
            targetX = targetArt.position.x + offset;
            viewY = -Math.PI / 2;
          } else if (Math.abs(targetArt.rotationY + Math.PI / 2) < 0.1) {
            targetX = targetArt.position.x - offset;
            viewY = Math.PI / 2;
          } else if (Math.abs(targetArt.rotationY) < 0.1) {
            targetZ = targetArt.position.z + offset;
            viewY = Math.PI;
          } else if (Math.abs(targetArt.rotationY - Math.PI) < 0.1) {
            targetZ = targetArt.position.z - offset;
            viewY = 0;
          }
          
          refs.playerPosition.set(targetX, 1.7, targetZ);
          refs.cameraRotation.yaw = viewY;
          refs.cameraRotation.pitch = 0;

          if (camera) {
            const naturalFov = getNaturalFov(width, height);
            camera.fov = naturalFov;
            camera.updateProjectionMatrix();
            refs.targetFov = naturalFov;
          }
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      refs.keysPressed[e.key.toLowerCase()] = false;
    };

    const handleMouseDown = (e: MouseEvent) => {
      // Verify user clicked details or standard viewport
      refs.isDragging = true;
      refs.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    let lastHoverRaycastTime = 0;
    const hoverRaycaster = new THREE.Raycaster();
    const hoverMouseVec = new THREE.Vector2();

    const handleMouseMove = (e: MouseEvent) => {
      if (!refs.isDragging) {
        // Throttled hover check (max 12Hz on desktop only) to prevent layout/raycast stalls in Chrome
        if (!isMobileDevice && renderer && renderer.domElement && camera) {
          const nowMs = performance.now();
          if (nowMs - lastHoverRaycastTime < 80) return;
          lastHoverRaycastTime = nowMs;

          const rect = renderer.domElement.getBoundingClientRect();
          hoverMouseVec.set(
            ((e.clientX - rect.left) / rect.width) * 2 - 1,
            -((e.clientY - rect.top) / rect.height) * 2 + 1
          );
          hoverRaycaster.setFromCamera(hoverMouseVec, camera);

          const targets: THREE.Object3D[] = [];
          stateRefs.current.artworks.forEach((art) => {
            const group = refs.artworkGroups.get(art.id);
            if (group) {
              const playBtnMesh = group.getObjectByName('play-button-mesh');
              if (playBtnMesh) targets.push(playBtnMesh);
              const inquiryBtnMesh = group.getObjectByName('inquiry-button-mesh');
              if (inquiryBtnMesh) targets.push(inquiryBtnMesh);
            }
          });

          const intersects = hoverRaycaster.intersectObjects(targets);
          renderer.domElement.style.cursor = intersects.length > 0 ? 'pointer' : '';
        }
        return;
      }

      const deltaX = e.clientX - refs.previousMousePosition.x;
      const deltaY = e.clientY - refs.previousMousePosition.y;

      // Adjust viewing angle (yaw and pitch) with custom drag damping
      refs.cameraRotation.yaw -= deltaX * 0.004;
      refs.cameraRotation.pitch -= deltaY * 0.004;

      // Restrict looking straight up or down for structural comfort
      refs.cameraRotation.pitch = Math.max(-Math.PI / 2.3, Math.min(Math.PI / 2.3, refs.cameraRotation.pitch));

      refs.previousMousePosition = { x: e.clientX, y: e.clientY };
    };

    const handleMouseUp = () => {
      refs.isDragging = false;
    };

    let lastTouchTime = 0;

    const triggerFloorTeleport = (clientX: number, clientY: number) => {
      if (!renderer || !renderer.domElement || !camera) return;

      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      const floorMesh = scene.getObjectByName('floor-mesh');
      if (floorMesh) {
        const intersects = raycaster.intersectObject(floorMesh);
        if (intersects.length > 0) {
          const point = intersects[0].point;
          
          // Teleport player here smoothly
          refs.playerPosition.x = Math.max(-4.9, Math.min(4.9, point.x));
          refs.playerPosition.z = Math.max(-7.4, Math.min(7.4, point.z));
          
          // Reset FOV to natural human perspective
          const naturalFov = getNaturalFov(width, height);
          camera.fov = naturalFov;
          camera.updateProjectionMatrix();
          refs.targetFov = naturalFov;
        }
      }
    };

    const handleCanvasDblClick = (e: MouseEvent) => {
      triggerFloorTeleport(e.clientX, e.clientY);
    };

    // --- SUPPORT COMPREHENSIVE TOUCH SWIPING & PINCH-TO-ZOOM FOR TABLETS & PHONES ---
    let lastPinchDist = 0;

    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        refs.isDragging = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        lastPinchDist = Math.hypot(dx, dy);
      } else if (e.touches.length === 1) {
        lastPinchDist = 0;
        refs.isDragging = true;
        refs.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };

        // Double-tap detection
        const currentTime = Date.now();
        const tapDelay = currentTime - lastTouchTime;
        if (tapDelay < 300 && tapDelay > 0) {
          triggerFloorTeleport(e.touches[0].clientX, e.touches[0].clientY);
        }
        lastTouchTime = currentTime;
      }
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.target === canvasEl && e.cancelable) {
        e.preventDefault();
      }
      if (e.touches.length === 2) {
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.hypot(dx, dy);
        if (lastPinchDist > 0) {
          const delta = lastPinchDist - dist;
          refs.targetFov = Math.max(28, Math.min(getMaxZoomOutFov(width, height), refs.targetFov + delta * 0.08));
        }
        lastPinchDist = dist;
        return;
      }
      if (!refs.isDragging || e.touches.length === 0) return;

      const deltaX = e.touches[0].clientX - refs.previousMousePosition.x;
      const deltaY = e.touches[0].clientY - refs.previousMousePosition.y;

      refs.cameraRotation.yaw -= deltaX * 0.0065;
      refs.cameraRotation.pitch -= deltaY * 0.0055;

      refs.cameraRotation.pitch = Math.max(-Math.PI / 3.2, Math.min(Math.PI / 3.2, refs.cameraRotation.pitch));

      refs.previousMousePosition = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    };

    const handleCanvasClick = (e: MouseEvent) => {
      // Prevent raycasting trigger on excessive dragging/rotation
      if (refs.isDragging && refs.previousMousePosition) {
        // If they dragged around, it might not be a clean click. But standard click is safe.
      }

      const rect = renderer.domElement.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      const y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      const raycaster = new THREE.Raycaster();
      raycaster.setFromCamera(new THREE.Vector2(x, y), camera);

      // Find play button and inquiry button meshes
      const targets: THREE.Object3D[] = [];
      stateRefs.current.artworks.forEach((art) => {
        const group = refs.artworkGroups.get(art.id);
        if (group) {
          const playBtnMesh = group.getObjectByName('play-button-mesh');
          if (playBtnMesh) {
            playBtnMesh.userData = { artworkId: art.id, type: 'play-button' };
            targets.push(playBtnMesh);
          }
          const inquiryBtnMesh = group.getObjectByName('inquiry-button-mesh');
          if (inquiryBtnMesh) {
            inquiryBtnMesh.userData = { artworkId: art.id, type: 'inquiry-button' };
            targets.push(inquiryBtnMesh);
          }
        }
      });

      const intersects = raycaster.intersectObjects(targets);
      if (intersects.length > 0) {
        const clickedObj = intersects[0].object;
        const artId = clickedObj.userData.artworkId;
        const type = clickedObj.userData.type;

        if (artId) {
          if (type === 'play-button') {
            // Toggle song play state
            const isPlayingThis = playingArtId === artId && isAudioPlaying;
            if (isPlayingThis) {
              onPauseSong();
            } else {
              onPlaySong(artId);
            }
          } else if (type === 'inquiry-button') {
            // Open inquiry popup modal directly without warping the camera view
            if (onSelectArtwork) {
              onSelectArtwork(artId);
            }
          } else {
            // Trigger React selected state update
            if (onSelectArtwork) {
              onSelectArtwork(artId);
            }

            // Teleport viewer smoothly in front of this artwork so they can see it clearly
            const targetArt = stateRefs.current.artworks.find(a => a.id === artId);
            if (targetArt) {
              const offset = 3.6;
              let targetX = targetArt.position.x;
              let targetZ = targetArt.position.z;
              let viewY = targetArt.rotationY;

              if (Math.abs(targetArt.rotationY - Math.PI / 2) < 0.1) {
                targetX = targetArt.position.x + offset;
                viewY = -Math.PI / 2;
              } else if (Math.abs(targetArt.rotationY + Math.PI / 2) < 0.1 || Math.abs(targetArt.rotationY - Math.PI * 1.5) < 0.1) {
                targetX = targetArt.position.x - offset;
                viewY = Math.PI / 2;
              } else if (Math.abs(targetArt.rotationY) < 0.1) {
                targetZ = targetArt.position.z + offset;
                viewY = Math.PI;
              } else if (Math.abs(targetArt.rotationY - Math.PI) < 0.1) {
                targetZ = targetArt.position.z - offset;
                viewY = 0;
              }

              refs.playerPosition.set(targetX, 1.7, targetZ);
              refs.cameraRotation.yaw = viewY;
              refs.cameraRotation.pitch = 0;

              if (camera) {
                const naturalFov = getNaturalFov(width, height);
                camera.fov = naturalFov;
                camera.updateProjectionMatrix();
                refs.targetFov = naturalFov;
              }
            }
          }
        }
      }
    };

    const handleWheel = (e: WheelEvent) => {
      // scroll up: e.deltaY < 0, zoom in (decrease FOV)
      // scroll down: e.deltaY > 0, zoom out (increase FOV, capped so room never skews)
      refs.targetFov = Math.max(28, Math.min(getMaxZoomOutFov(width, height), refs.targetFov + e.deltaY * 0.04));
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    
    // Bind listeners specifically to renderer element to prevent sidebar leaks
    const canvasEl = renderer.domElement;
    canvasEl.addEventListener('mousedown', handleMouseDown);
    canvasEl.addEventListener('click', handleCanvasClick);
    canvasEl.addEventListener('dblclick', handleCanvasDblClick);
    canvasEl.addEventListener('wheel', handleWheel, { passive: true });
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);

    canvasEl.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchmove', handleTouchMove, { passive: false });
    window.addEventListener('touchend', handleMouseUp, { passive: true });

    // --- 7. IMMERSIVE MOTION RENDER LOOP ---
    let frameId: number;
    let tourTime = 0;

    // Pre-allocated scratch objects for zero-GC 60fps animation loop
    const upAxis = new THREE.Vector3(0, 1, 0);
    const forwardVec = new THREE.Vector3();
    const rightVec = new THREE.Vector3();
    const moveVec = new THREE.Vector3();
    const smoothMoveVec = new THREE.Vector3();
    const targetLook = new THREE.Vector3();
    const tmpColor = new THREE.Color();
    const normalFogColor = new THREE.Color('#030303');
    const partitionZs = [-4, 0, 4];

    let smoothYaw = refs.cameraRotation.yaw;
    let smoothPitch = refs.cameraRotation.pitch;
    let lastFrameTime = performance.now();
    let lastPosReportTime = 0;
    let lastReportedX = NaN;
    let lastReportedZ = NaN;
    let lastReportedYaw = NaN;
    let wasDiscoMode = false;

    const animate = (now: number) => {
      frameId = requestAnimationFrame(animate);

      const dt = Math.min(Math.max((now - lastFrameTime) / 16.667, 0.25), 2.5);
      lastFrameTime = now;

      const currentControls = stateRefs.current.controlsState;

      // Set eye height from controls
      refs.playerPosition.y = currentControls.cameraHeight;

      // 7.1 AUTOPILOT TOUR ENGINE
      if (currentControls.tourActive) {
        tourTime += 0.0035; // pacing
        
        // Circular tour orbit paths inside the spacious arena
        const r = 6.5;
        const targetX = Math.sin(tourTime) * r;
        const targetZ = Math.cos(tourTime) * r;

        refs.playerPosition.x += (targetX - refs.playerPosition.x) * 0.04;
        refs.playerPosition.z += (targetZ - refs.playerPosition.z) * 0.04;

        const targetYaw = Math.atan2(Math.sin(tourTime + 0.3), Math.cos(tourTime + 0.3)) + Math.PI;
        refs.cameraRotation.yaw += (targetYaw - refs.cameraRotation.yaw) * 0.03;
        refs.cameraRotation.pitch += (0 - refs.cameraRotation.pitch) * 0.03;

      } else {
        // 7.2 FIRST PERSON KEYBOARD LOOPS (aligned with spherical camera forward/right, zero allocations)
        const yaw = refs.cameraRotation.yaw;
        forwardVec.set(Math.sin(yaw), 0, Math.cos(yaw));
        rightVec.set(-Math.cos(yaw), 0, Math.sin(yaw));
        moveVec.set(0, 0, 0);

        const speed = currentControls.movementSpeed;

        if (refs.keysPressed['w'] || refs.keysPressed['arrowup']) {
          moveVec.add(forwardVec);
        }
        if (refs.keysPressed['s'] || refs.keysPressed['arrowdown']) {
          moveVec.sub(forwardVec);
        }
        if (refs.keysPressed['a'] || refs.keysPressed['arrowleft']) {
          moveVec.sub(rightVec);
        }
        if (refs.keysPressed['d'] || refs.keysPressed['arrowright']) {
          moveVec.add(rightVec);
        }

        if (moveVec.lengthSq() > 0) {
          moveVec.normalize().multiplyScalar(speed * dt);
        }
        // Smooth velocity damping for silky glide on mobile D-pad & desktop WASD
        const moveLerp = 1 - Math.pow(1 - 0.18, dt);
        smoothMoveVec.lerp(moveVec, moveLerp);
        if (smoothMoveVec.lengthSq() > 0.000001) {
          refs.playerPosition.add(smoothMoveVec);
        }

        // Smooth Zoom In / Zoom Out via buttons or +/- keys
        if (refs.keysPressed['='] || refs.keysPressed['+'] || refs.keysPressed['zoomin']) {
          refs.targetFov = Math.max(28, refs.targetFov - 0.75 * dt);
        }
        if (refs.keysPressed['-'] || refs.keysPressed['_'] || refs.keysPressed['zoomout']) {
          refs.targetFov = Math.min(getMaxZoomOutFov(width, height), refs.targetFov + 0.75 * dt);
        }

        // 7.3 STRICT CAMERA BOUNDARIES (Collision with 11m x 16m perimeter & modular partitions)
        refs.playerPosition.x = Math.max(-4.9, Math.min(4.9, refs.playerPosition.x));
        refs.playerPosition.z = Math.max(-7.4, Math.min(7.4, refs.playerPosition.z));

        const px = refs.playerPosition.x;
        const pz = refs.playerPosition.z;
        const buffer = 0.35;

        for (let i = 0; i < partitionZs.length; i++) {
          const zVal = partitionZs[i];
          if (Math.abs(pz - zVal) < buffer) {
            if (px < -5.5 + 0.45 + buffer) {
              if (pz > zVal) refs.playerPosition.z = zVal + buffer;
              else refs.playerPosition.z = zVal - buffer;
            } else if (px > 5.5 - 0.45 - buffer) {
              if (pz > zVal) refs.playerPosition.z = zVal + buffer;
              else refs.playerPosition.z = zVal - buffer;
            }
          }
        }
      }

      // 7.4 UPDATE CAMERAS BASED ON ORIENTATIONS
      const fovLerp = 1 - Math.pow(1 - 0.14, dt);
      if (Math.abs(camera.fov - refs.targetFov) > 0.01) {
        camera.fov += (refs.targetFov - camera.fov) * fovLerp;
        camera.updateProjectionMatrix();
      }

      const rotLerp = 1 - Math.pow(1 - 0.28, dt);
      smoothYaw += (refs.cameraRotation.yaw - smoothYaw) * rotLerp;
      smoothPitch += (refs.cameraRotation.pitch - smoothPitch) * rotLerp;

      targetLook
        .setFromSphericalCoords(1, smoothPitch + Math.PI / 2, smoothYaw)
        .add(refs.playerPosition);

      // Throttled React position sync (max 10Hz and ONLY when position/yaw changed -> eliminates 60fps React re-renders)
      if (
        now - lastPosReportTime > 100 &&
        (Math.abs(refs.playerPosition.x - lastReportedX) > 0.015 ||
          Math.abs(refs.playerPosition.z - lastReportedZ) > 0.015 ||
          Math.abs(refs.cameraRotation.yaw - lastReportedYaw) > 0.015)
      ) {
        lastPosReportTime = now;
        lastReportedX = refs.playerPosition.x;
        lastReportedZ = refs.playerPosition.z;
        lastReportedYaw = refs.cameraRotation.yaw;
        onUpdatePosition({
          x: refs.playerPosition.x,
          z: refs.playerPosition.z,
          angle: refs.cameraRotation.yaw,
        });
      }

      // 7.45 DISCO MODE ATMOSPHERE MUTATOR (only mutates during disco or once on exit)
      const isDisco = stateRefs.current.discoMode;
      if (isDisco) {
        wasDiscoMode = true;
        const time = now * 0.0018;

        if (refs.ambientLight) {
          refs.ambientLight.intensity = 0.05;
        }

        if (scene) {
          if (scene.fog && 'density' in scene.fog) {
            scene.fog.density = 0.10 + 0.015 * Math.sin(time);
          }
          tmpColor.setHSL((time * 0.04) % 1.0, 0.7, 0.08);
          if (scene.fog) {
            scene.fog.color.copy(tmpColor);
          }
          if (scene.background instanceof THREE.Color) {
            scene.background.copy(tmpColor);
          }
        }

        const currentCeilingSetting = stateRefs.current.lightSettings.ceilingIntensity;
        refs.ceilingLights.forEach((spot, idx) => {
          spot.color.setHSL((time * 0.15 + idx * 0.1) % 1.0, 1.0, 0.5);
          spot.intensity = currentCeilingSetting * 1.8 * (0.5 + 0.5 * Math.sin(time * 4.0 + idx));
        });

        refs.lightCones.forEach((cone, idx) => {
          const mat = cone.material as THREE.MeshBasicMaterial;
          mat.color.setHSL((time * 0.15 + idx * 0.1) % 1.0, 1.0, 0.5);
          mat.opacity = 0.22 + 0.08 * Math.sin(time * 4.0 + idx);
        });

        const currentBacklightSetting = stateRefs.current.lightSettings.backlightIntensity;
        stateRefs.current.artworks.forEach((art, idx) => {
          const glowMesh = refs.glowPlanes.get(art.id);
          const glowLight = refs.glowLights.get(art.id);
          tmpColor.setHSL((time * 0.1 + idx * 0.12) % 1.0, 1.0, 0.55);

          if (glowMesh) {
            const mat = glowMesh.material as THREE.MeshBasicMaterial;
            mat.color.copy(tmpColor);
            mat.opacity = 0.35 + 0.25 * Math.sin(time * 3.0 + idx);
          }

          if (glowLight) {
            glowLight.color.copy(tmpColor);
            glowLight.intensity = currentBacklightSetting * 2.2 * (0.5 + 0.5 * Math.sin(time * 3.0 + idx));
          }
        });

        if (refs.wallMaterial) {
          refs.wallMaterial.emissive.setHex(0x111111);
        }
      } else if (wasDiscoMode) {
        wasDiscoMode = false;
        // Restore Normal Lighting settings ONCE when exiting disco mode
        if (refs.ambientLight) {
          refs.ambientLight.intensity = stateRefs.current.lightSettings.ambientIntensity * 0.75;
        }

        if (scene) {
          if (scene.fog && 'density' in scene.fog) {
            scene.fog.density = 0.012;
          }
          if (scene.fog) {
            scene.fog.color.copy(normalFogColor);
          }
          if (scene.background instanceof THREE.Color) {
            scene.background.copy(normalFogColor);
          }
        }

        const currentCeilingSetting = stateRefs.current.lightSettings.ceilingIntensity;
        refs.ceilingLights.forEach((spot) => {
          spot.color.setHex(0xfffaf0);
          spot.intensity = currentCeilingSetting;
        });

        refs.lightCones.forEach((cone) => {
          const mat = cone.material as THREE.MeshBasicMaterial;
          mat.color.setHex(0xfff8ec);
          mat.opacity = 0.018;
        });

        tmpColor.set(stateRefs.current.lightSettings.glowColor);
        const currentBacklightSetting = stateRefs.current.lightSettings.backlightIntensity;
        stateRefs.current.artworks.forEach((art) => {
          const glowMesh = refs.glowPlanes.get(art.id);
          const glowLight = refs.glowLights.get(art.id);

          if (glowMesh) {
            const mat = glowMesh.material as THREE.MeshBasicMaterial;
            mat.color.copy(tmpColor);
            mat.opacity = Math.min(0.9, currentBacklightSetting * 0.22);
          }

          if (glowLight) {
            glowLight.color.copy(tmpColor);
            glowLight.intensity = currentBacklightSetting * 1.5;
          }
        });

        if (refs.wallMaterial) {
          const val = stateRefs.current.lightSettings.wallBrightness !== undefined ? stateRefs.current.lightSettings.wallBrightness : 0.35;
          refs.wallMaterial.emissive.setHSL(0.08, 0.05, val * 0.22);
        }
      }

      // 7.5 RENDERING
      camera.position.copy(refs.playerPosition);
      camera.lookAt(targetLook);
      renderer.render(scene, camera);
    };

    frameId = requestAnimationFrame(animate);

    // 7.6 WINDOW RESIZE HANDLERS
    const handleResize = () => {
      if (!mountRef.current || !refs.renderer || !refs.camera) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      if (w === 0 || h === 0) return;

      const wasPortrait = width < height;
      const isPortrait = w < h;

      width = w;
      height = h;

      refs.renderer.setSize(w, h);
      refs.camera.aspect = w / h;
      if (wasPortrait !== isPortrait) {
        const naturalFov = getNaturalFov(w, h);
        refs.camera.fov = naturalFov;
        refs.targetFov = naturalFov;
      }
      refs.camera.updateProjectionMatrix();
    };

    window.addEventListener('resize', handleResize);

    const resizeObserver = new ResizeObserver(() => {
      handleResize();
    });
    if (mountRef.current) {
      resizeObserver.observe(mountRef.current);
    }

    // --- 8. LIFECYCLE DESTRUCTION CLEANUPS ---
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      
      if (canvasEl) {
        canvasEl.removeEventListener('mousedown', handleMouseDown);
        canvasEl.removeEventListener('click', handleCanvasClick);
        canvasEl.removeEventListener('dblclick', handleCanvasDblClick);
        canvasEl.removeEventListener('touchstart', handleTouchStart);
        canvasEl.removeEventListener('wheel', handleWheel);
      }
      
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();

      cancelAnimationFrame(frameId);

      // Clean up geometries and materials to avoid memory bloating
      scene.traverse((object) => {
        if (!(object instanceof THREE.Mesh)) return;
        object.geometry.dispose();

        if (object.material instanceof Array) {
          object.material.forEach((mat) => mat.dispose());
        } else {
          object.material.dispose();
        }
      });

      floorTex.dispose();
      floorNormalTex.dispose();
      floorRoughTex.dispose();
      floorAOMap.dispose();
      ceilingAOMap.dispose();
      wallAOMap.dispose();
      wallPlasterMaps.map.dispose();
      wallPlasterMaps.normalMap.dispose();
      wallPlasterMaps.roughnessMap.dispose();
      sharedHaloTexture.dispose();
      sharedPlayIconTex.dispose();
      sharedPauseIconTex.dispose();
      sharedInquiryIconTex.dispose();
      envRenderTarget.dispose();
      if (refs.mainHeadingTexture) {
        refs.mainHeadingTexture.dispose();
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-full select-none cursor-grab active:cursor-grabbing">
      {/* Three.js Canvas container mount */}
      <div ref={mountRef} className="w-full h-full" />
    </div>
  );
}
