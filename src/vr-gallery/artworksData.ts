/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Artwork } from './types';

export const DEFAULT_ARTWORKS: Artwork[] = [
  // --- Left Wall (Long, X = -5.45, facing east/center: rotationY = Math.PI / 2) ---
  {
    id: 'art-left-1',
    title: 'MONOCHROME KICKS',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'A handcrafted monochrome wood-block mosaic capturing a pair of classic laced high-top sneakers in crisp white relief against deep charcoal timber cubes.',
    generativeStyle: 'fashion-silhouette',
    wallText: 'N° 01 — IAN ART',
    position: { x: -5.45, y: 2.15, z: -6 },
    rotationY: Math.PI / 2,
    width: 2.2,
    height: 2.2,
    customImageUrl: '/artwork/78abe36e-a129-4a65-8d65-14c846260ad1.png',
    songTitle: 'Monochrome Kicks',
    songArtist: 'Ian Art Sound'
  },
  {
    id: 'art-left-2',
    title: 'SMILE IN TIMBER',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'An expressive black-and-white wood-block portrait celebrating warmth and joy, sculpted from raised dark timber cubes against a crisp white mosaic.',
    generativeStyle: 'bauhaus-grid',
    wallText: 'N° 02 — IAN ART',
    position: { x: -5.45, y: 2.15, z: -2 },
    rotationY: Math.PI / 2,
    width: 2.2,
    height: 2.2,
    customImageUrl: '/artwork/ChatGPT Image Jun 6, 2026, 07_08_21 PM.png',
    songTitle: 'Smile in Timber',
    songArtist: 'Ian Art Sound'
  },
  {
    id: 'art-left-3',
    title: 'GOLDEN SHADES & CRIMSON',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'A bold pop-art wood-block mosaic featuring oversized yellow-framed sunglasses and vivid red lips set against a sunlit yellow and monochrome grid.',
    generativeStyle: 'minimalist-editorial',
    wallText: 'N° 03 — IAN ART',
    position: { x: -5.45, y: 2.15, z: 2 },
    rotationY: Math.PI / 2,
    width: 2.2,
    height: 2.2,
    customImageUrl: '/artwork/ChatGPT Image Jun 6, 2026, 07_13_31 PM.png',
    songTitle: 'Golden Shades',
    songArtist: 'Ian Art Sound'
  },
  {
    id: 'art-left-4',
    title: 'PRISM PORTRAIT',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'A striking multi-colored wood-block portrait blending deep green, yellow, cobalt blue, and red cubes into an expressive contemporary study.',
    generativeStyle: 'optical-illusion',
    wallText: 'N° 04 — IAN ART',
    position: { x: -5.45, y: 2.15, z: 6 },
    rotationY: Math.PI / 2,
    width: 2.2,
    height: 2.2,
    customImageUrl: '/artwork/ChatGPT Image Jun 6, 2026, 07_16_25 PM.png',
    songTitle: 'Prism Portrait',
    songArtist: 'Ian Art Sound'
  },

  // --- Right Wall (Long, X = 5.45, facing west/center: rotationY = -Math.PI / 2) ---
  {
    id: 'art-right-1',
    title: 'SILENT REFLECTION',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'An intimate monochrome wood-block portrait where sculpted white timber cubes emerge from deep black shadow to reveal quiet character and depth.',
    generativeStyle: 'marilyn-mosaic',
    wallText: 'N° 05 — IAN ART',
    position: { x: 5.45, y: 2.15, z: -6 },
    rotationY: -Math.PI / 2,
    width: 2.2,
    height: 2.2,
    customImageUrl: '/artwork/ChatGPT Image Jun 6, 2026, 07_38_16 PM.png',
    songTitle: 'Silent Reflection',
    songArtist: 'Ian Art Sound'
  },
  {
    id: 'art-right-2',
    title: 'MARILYN IN WOOD BLOCKS',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'A sculptural wood-block tribute to Marilyn Monroe, crafted from hundreds of black and white timber cubes with an iconic pop of crimson lips.',
    generativeStyle: 'surreal-geometric',
    wallText: 'N° 06 — IAN ART',
    position: { x: 5.45, y: 2.15, z: -2 },
    rotationY: -Math.PI / 2,
    width: 2.2,
    height: 2.2,
    customImageUrl: '/artwork/ChatGPT Image May 27, 2026, 01_18_17 AM.png',
    songTitle: 'Marilyn in Wood Blocks',
    songArtist: 'Ian Art Sound'
  },
  {
    id: 'art-right-3',
    title: 'MADIBA IN MOSAIC',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'A dignified wood-block portrait of Nelson Mandela, rendered in crisp black and white timber cubes that honor strength, grace, and legacy.',
    generativeStyle: 'bauhaus-grid',
    wallText: 'N° 07 — IAN ART',
    position: { x: 5.45, y: 2.15, z: 2 },
    rotationY: -Math.PI / 2,
    width: 2.2,
    height: 2.2,
    customImageUrl: '/artwork/ChatGPT Image May 27, 2026, 12_00_04 AM.png',
    songTitle: 'Madiba in Mosaic',
    songArtist: 'Ian Art Sound'
  },
  {
    id: 'art-right-4',
    title: 'THE SHEPHERD IN RELIEF',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'A serene black-and-white wood-block portrait of a bearded figure with flowing hair, formed from raised dark timber cubes on a bright white mosaic.',
    generativeStyle: 'fashion-silhouette',
    wallText: 'N° 08 — IAN ART',
    position: { x: 5.45, y: 2.15, z: 6 },
    rotationY: -Math.PI / 2,
    width: 2.2,
    height: 2.2,
    customImageUrl: '/artwork/ba58f07a-ea1b-4911-ba96-0caf7dd2729d.png',
    songTitle: 'Shepherd in Relief',
    songArtist: 'Ian Art Sound'
  },

  // --- Front Wall (Short, Z = -7.95, facing south/center: rotationY = 0) ---
  {
    id: 'art-front-giant',
    title: 'SHADOW & PROFILE',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'A monumental dark wood-block relief spanning textured world terrain on the left and a luminous white profile emerging from deep charcoal shadow on the right.',
    generativeStyle: 'minimalist-editorial',
    wallText: 'SHADOW & PROFILE — IAN ART',
    position: { x: 0, y: 2.0, z: -7.95 },
    rotationY: 0,
    width: 5.6,
    height: 2.8,
    customImageUrl: '/artwork/d00ca55d-63ac-4ab4-ad3b-fcf3f900a7f6 (2).png',
    songTitle: 'Shadow & Profile',
    songArtist: 'Ian Art Sound'
  },

  // --- Back Wall (Short, Z = 7.95, facing north/center: rotationY = Math.PI) ---
  {
    id: 'art-back-giant',
    title: 'HORIZON IN TIMBER',
    artist: 'Ian Albertyn (Ian Art)',
    year: '2026',
    description: 'A monumental dark wood-block relief spanning textured world terrain on the left and a luminous white profile emerging from deep charcoal shadow on the right.',
    generativeStyle: 'minimalist-editorial',
    wallText: 'HORIZON IN TIMBER — IAN ART',
    position: { x: 0, y: 2.0, z: 7.95 },
    rotationY: Math.PI,
    width: 5.6,
    height: 2.8,
    customImageUrl: '/artwork/d00ca55d-63ac-4ab4-ad3b-fcf3f900a7f6 (2).png',
    songTitle: 'Horizon in Timber',
    songArtist: 'Ian Art Sound'
  }
];

/**
 * Draws high-resolution monochrome artwork onto a canvas element.
 * Resolves into standard WebGL textures with ultra-fine, razor-sharp textures.
 */
export function drawArtworkCanvas(artwork: Artwork, width: number = 1024, height: number = 1024): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  // Set default modern rendering properties
  ctx.imageSmoothingEnabled = true;

  // 1. Fill luxury white/eggshell matte background
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, width, height);

  // 2. Outer minimal margin border
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 4;
  const borderMargin = 24;
  ctx.strokeRect(borderMargin, borderMargin, width - borderMargin * 2, height - borderMargin * 2);

  // Sub-margins and guide numbers for editorial feel
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 1;
  ctx.strokeRect(borderMargin + 12, borderMargin + 12, width - (borderMargin + 12) * 2, height - (borderMargin + 12) * 2);

  // 3. Render Generative Style Content
  switch (artwork.generativeStyle) {
    case 'fashion-silhouette': {
      // Draw high fashion elegant posing silhouette (wide brimmed hat + neck / shoulder curve)
      const cx = width / 2;
      const cy = height * 0.42;

      // Draw background warm gray graphic elements
      ctx.fillStyle = '#e8e8e8';
      ctx.beginPath();
      ctx.arc(cx - 30, cy - 10, 160, 0, Math.PI * 2);
      ctx.fill();

      // Sharp abstract line backdrop
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(cx - 250, cy);
      ctx.lineTo(cx + 250, cy);
      ctx.moveTo(cx, cy - 220);
      ctx.lineTo(cx, cy + 220);
      ctx.stroke();

      // Draw large luxurious black hat shape
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      // An elegant asymmetrical elongated ellipse for the wide brimmed hat
      ctx.ellipse(cx, cy - 70, 220, 64, -Math.PI / 12, 0, Math.PI * 2);
      ctx.fill();

      // Hat crown
      ctx.beginPath();
      ctx.ellipse(cx, cy - 105, 100, 70, -Math.PI / 12, Math.PI, 0);
      ctx.fill();

      // Elegant neck line and shoulder curve
      ctx.beginPath();
      ctx.moveTo(cx - 35, cy + 10); // under jaw
      ctx.bezierCurveTo(cx - 35, cy + 110, cx - 160, cy + 130, cx - 200, cy + 260); // shoulder down
      ctx.lineTo(cx + 200, cy + 260);
      ctx.bezierCurveTo(cx + 150, cy + 190, cx + 45, cy + 110, cx + 45, cy + 15); // neck rise
      ctx.bezierCurveTo(cx + 25, cy + 15, cx + 8, cy, cx - 8, cy - 5); // jaw line
      ctx.closePath();
      ctx.fillStyle = '#111111';
      ctx.fill();

      // High-fashion lips (subtle white geometric accent line)
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(cx - 12, cy + 32);
      ctx.lineTo(cx + 8, cy + 35);
      ctx.stroke();

      // Sleek geometric sunglasses or eyeshadow sweep
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(cx + 2, cy - 20, 40, 11, -Math.PI / 14, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.ellipse(cx + 10, cy - 18, 18, 7, -Math.PI / 14, 0, Math.PI * 2);
      ctx.fill();

      break;
    }

    case 'bauhaus-grid': {
      // Strong heavyweight circles, diagonals, and grids
      const boundsX = width * 0.15;
      const boundsY = height * 0.12;
      const innerW = width * 0.7;
      const innerH = height * 0.58;

      ctx.save();
      // Grid lines
      ctx.strokeStyle = '#dddddd';
      ctx.lineWidth = 1.5;
      for (let i = 0; i <= 6; i++) {
        const lx = boundsX + (innerW * i) / 6;
        ctx.beginPath();
        ctx.moveTo(lx, boundsY);
        ctx.lineTo(lx, boundsY + innerH);
        ctx.stroke();

        const ly = boundsY + (innerH * i) / 6;
        ctx.beginPath();
        ctx.moveTo(boundsX, ly);
        ctx.lineTo(boundsX + innerW, ly);
        ctx.stroke();
      }

      const cx = width / 2;
      const cy = boundsY + innerH / 2;

      // Heavy monochrome segments
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy, 140, 0, Math.PI, false); // bottom half-circle
      ctx.fill();

      ctx.fillStyle = '#666666';
      ctx.beginPath();
      ctx.arc(cx - 25, cy - 30, 95, 0, Math.PI * 2);
      ctx.fill();

      // White overlay wedge
      ctx.fillStyle = '#fafafa';
      ctx.beginPath();
      ctx.moveTo(cx - 25, cy - 30);
      ctx.arc(cx - 25, cy - 30, 105, -Math.PI / 6, Math.PI / 4);
      ctx.closePath();
      ctx.fill();

      // Bold thick black crossing bands
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 24;
      ctx.beginPath();
      ctx.moveTo(boundsX + 20, boundsY + 30);
      ctx.lineTo(boundsX + innerW - 20, boundsY + innerH - 30);
      ctx.stroke();

      // Interlocking fine thin line
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.arc(cx, cy, 160, 0, Math.PI * 2);
      ctx.stroke();

      ctx.restore();
      break;
    }

    case 'minimalist-editorial': {
      // Elegant minimal poster magazine layout
      const cx = width / 2;

      // Grid guides
      ctx.strokeStyle = '#eeeeee';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.08, height * 0.12);
      ctx.lineTo(width * 0.92, height * 0.12);
      ctx.lineTo(width * 0.92, height * 0.82);
      ctx.lineTo(width * 0.08, height * 0.82);
      ctx.closePath();
      ctx.stroke();

      // Giant structural numeral (scaled for square canvas)
      ctx.fillStyle = '#ededed';
      ctx.font = 'condensed 700 320px "Didot", "Playfair Display", "Times New Roman", serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('05', cx, height * 0.40);

      // Fine intersecting graphics
      ctx.strokeStyle = '#000000';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(width * 0.06, height * 0.44);
      ctx.lineTo(width * 0.94, height * 0.44);
      ctx.stroke();

      // Perfect alignment text blocks
      ctx.fillStyle = '#111111';
      
      // Header Title
      ctx.font = 'tracking-widest 500 32px "Space Grotesk", "Inter", sans-serif';
      ctx.letterSpacing = '10px';
      ctx.textAlign = 'center';
      ctx.fillText('L\'É L É G A N C E   N O I R E', cx, height * 0.10);

      // Slogan / Subline
      ctx.font = 'italic 20px "Georgia", serif';
      ctx.letterSpacing = '1px';
      ctx.fillStyle = '#444444';
      ctx.fillText('\"The architecture of silence in contemporary fashion space\"', cx, height * 0.49);

      // Meticulous editorial columns
      ctx.fillStyle = '#111111';
      ctx.font = '15px "Courier New", monospace';
      ctx.textAlign = 'left';
      
      const colY = height * 0.54;
      
      if (width > 1500) {
        // Column 1
        const p1 = [
          "SECTION I.01 — FORM AND VOID",
          "The black and white checkerboard flooring",
          "forces a dualistic perspective on space.",
          "Walking through a virtual plane where light",
          "is controlled by indirect luminescence,",
          "the viewer forms an immediate tactile",
          "and emotional link to deep monochrome."
        ];
        p1.forEach((line, idx) => {
          ctx.fillText(line, width * 0.08, colY + idx * 26);
        });

        // Column 2
        const p2 = [
          "SECTION I.02 — VR EMERGENCE",
          "By detaching the gallery from material",
          "cost, we achieve a frictionless museum.",
          "The modular walls represent floating canvases",
          "suspended in simulated 16m x 16m physical",
          "coordinates. Glowing backlights project an",
          "ethereal aura around every luxury frame."
        ];
        p2.forEach((line, idx) => {
          ctx.fillText(line, width * 0.39, colY + idx * 26);
        });

        // Column 3
        const p3 = [
          "SECTION I.03 — THE SHALOM POSTURE",
          "Integrating geometric harmony directly",
          "with visual serenity reduces the vastness.",
          "By structuring space with human proportions,",
          "the gallery provides a comforting layout",
          "where depth and compression interact for a",
          "focused, premium, and calm curation."
        ];
        p3.forEach((line, idx) => {
          ctx.fillText(line, width * 0.69, colY + idx * 26);
        });
      } else {
        // Column 1
        const p1 = [
          "SECTION I.01 — FORM AND VOID",
          "The black and white checkerboard flooring",
          "forces a dualistic perspective on space.",
          "Walking through a virtual plane where light",
          "is controlled by indirect luminescence,",
          "the viewer forms an immediate tactile",
          "and emotional link to deep monochrome."
        ];
        p1.forEach((line, idx) => {
          ctx.fillText(line, width * 0.12, colY + idx * 26);
        });

        // Column 2
        const p2 = [
          "SECTION I.02 — VR EMERGENCE",
          "By detaching the gallery from material",
          "cost, we achieve a frictionless museum.",
          "The modular walls represent floating canvases",
          "suspended in simulated 16m x 16m physical",
          "coordinates. Glowing backlights project an",
          "ethereal aura around every luxury frame."
        ];
        p2.forEach((line, idx) => {
          ctx.fillText(line, width * 0.52, colY + idx * 26);
        });
      }

      break;
    }

    case 'surreal-geometric': {
      // Floating spheres, recurring prospective columns, space portal
      const cx = width / 2;
      const cy = height * 0.42;

      // Base horizon line
      ctx.strokeStyle = '#cccccc';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(50, cy + 140);
      ctx.lineTo(width - 50, cy + 140);
      ctx.stroke();

      // Perspective grid stretching into the distance
      ctx.strokeStyle = '#e2e2e2';
      ctx.lineWidth = 1;
      const gridCount = 20;
      for (let i = 0; i <= gridCount; i++) {
        const px = 50 + ((width - 100) * i) / gridCount;
        ctx.beginPath();
        ctx.moveTo(px, cy + 140);
        const destX = cx + (px - cx) * 2.8;
        ctx.lineTo(destX, height * 0.80);
        ctx.stroke();
      }

      // Drawing stylized classical architectural columns
      ctx.fillStyle = '#000000';
      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 3;

      const drawColumn = (colX: number, colY: number, colW: number, colH: number) => {
        ctx.fillRect(colX - colW/2, colY - 10, colW, 10);
        ctx.strokeRect(colX - colW/3, colY - colH, (colW * 2)/3, colH - 10);
        ctx.beginPath();
        ctx.moveTo(colX - colW/10, colY - colH + 5);
        ctx.lineTo(colX - colW/10, colY - 12);
        ctx.moveTo(colX + colW/10, colY - colH + 5);
        ctx.lineTo(colX + colW/10, colY - 12);
        ctx.stroke();
        ctx.fillRect(colX - colW/2.2, colY - colH, colW * 0.9, 12);
      };

      // Draw columns stepping into distance
      if (width > 1500) {
        // Fully populated immersive architectural colonnade for widescreen panorama
        drawColumn(cx - 1200, cy + 240, 160, 380);
        drawColumn(cx + 1200, cy + 240, 160, 380);
        drawColumn(cx - 800, cy + 210, 120, 310);
        drawColumn(cx + 800, cy + 210, 120, 310);
        drawColumn(cx - 500, cy + 180, 90, 240);
        drawColumn(cx + 500, cy + 180, 90, 240);
        drawColumn(cx - 280, cy + 160, 65, 170);
        drawColumn(cx + 280, cy + 160, 65, 170);
        drawColumn(cx - 140, cy + 145, 45, 110);
        drawColumn(cx + 140, cy + 145, 45, 110);
      } else {
        // Standard view column pairs
        drawColumn(cx - 260, cy + 170, 100, 240);
        drawColumn(cx + 260, cy + 170, 100, 240);
        drawColumn(cx - 150, cy + 150, 70, 160);
        drawColumn(cx + 150, cy + 150, 70, 160);
      }

      // Central Portal
      ctx.fillStyle = '#111111';
      ctx.beginPath();
      ctx.moveTo(cx - 90, cy + 140);
      ctx.lineTo(cx - 90, cy - 60);
      ctx.arc(cx, cy - 60, 90, Math.PI, 0, false);
      ctx.lineTo(cx + 90, cy + 140);
      ctx.fill();

      // Deep dark mirror within the portal
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.moveTo(cx - 82, cy + 140);
      ctx.lineTo(cx - 82, cy - 60);
      ctx.arc(cx, cy - 60, 82, Math.PI, 0, false);
      ctx.lineTo(cx + 82, cy + 140);
      ctx.fill();

      // Floating heavy black sphere
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(cx, cy - 110, 52, 0, Math.PI * 2);
      ctx.fill();

      // Sub-sphere with concentric rings
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      for (let r = 8; r < 52; r += 14) {
        ctx.beginPath();
        ctx.ellipse(cx, cy - 110, r, r * 0.5, -Math.PI/6, 0, Math.PI * 2);
        ctx.stroke();
      }

      break;
    }

    case 'monochrome-portrait': {
      // Avant-garde physical/abstract outline portrait
      const cx = width / 2;
      const cy = height * 0.40;

      ctx.fillStyle = '#efefef';
      ctx.fillRect(cx - 240, cy - 200, 480, 400);

      ctx.fillStyle = '#111111';
      ctx.fillRect(cx, cy - 200, 240, 400);

      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 4.5;
      
      ctx.beginPath();
      ctx.moveTo(cx + 8, cy - 150);
      ctx.bezierCurveTo(cx + 40, cy - 150, cx + 90, cy - 110, cx + 90, cy - 60);
      ctx.bezierCurveTo(cx + 90, cy - 45, cx + 115, cy - 30, cx + 105, cy - 5);
      ctx.lineTo(cx + 145, cy + 3);
      ctx.lineTo(cx + 110, cy + 20);
      ctx.moveTo(cx + 110, cy + 20);
      ctx.lineTo(cx + 122, cy + 28);
      ctx.lineTo(cx + 106, cy + 44);
      ctx.bezierCurveTo(cx + 114, cy + 76, cx + 98, cy + 93, cx + 74, cy + 110);
      ctx.quadraticCurveTo(cx + 40, cy + 93, cx + 8, cy + 150);
      ctx.stroke();

      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 4.5;
      ctx.beginPath();
      ctx.moveTo(cx - 8, cy - 150);
      ctx.bezierCurveTo(cx - 40, cy - 150, cx - 90, cy - 110, cx - 90, cy - 60);
      ctx.bezierCurveTo(cx - 90, cy - 45, cx - 115, cy - 30, cx - 105, cy - 5);
      ctx.lineTo(cx - 145, cy + 3);
      ctx.lineTo(cx - 110, cy + 20);
      ctx.lineTo(cx - 122, cy + 28);
      ctx.lineTo(cx - 106, cy + 44);
      ctx.bezierCurveTo(cx - 114, cy + 76, cx - 98, cy + 93, cx - 74, cy + 110);
      ctx.quadraticCurveTo(cx - 40, cy + 93, cx - 8, cy + 150);
      ctx.stroke();

      ctx.strokeStyle = '#111111';
      ctx.lineWidth = 7;
      ctx.beginPath();
      ctx.arc(cx - 25, cy + 40, 56, 0, Math.PI * 2);
      ctx.stroke();

      ctx.strokeStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(cx + 25, cy + 40, 56, 0, Math.PI * 2);
      ctx.stroke();

      break;
    }

    case 'optical-illusion': {
      // Dynamic spiral or concentric geometric wave patterns (Op Art)
      const cx = width / 2;
      const cy = height * 0.40;
      const maxRadius = Math.min(width, height) * 0.35;

      ctx.save();
      ctx.translate(cx, cy);

      const rings = 20;
      for (let r = rings; r > 0; r--) {
        const radius = (maxRadius * r) / rings;
        ctx.fillStyle = r % 2 === 0 ? '#111111' : '#f0f0f0';

        ctx.beginPath();
        const segments = 160;
        for (let s = 0; s <= segments; s++) {
          const theta = (s * Math.PI * 2) / segments;
          const wave = Math.sin(theta * 6 + r * 0.3) * (11 - r * 0.35);
          const currentR = radius + wave;
          const x = Math.cos(theta) * currentR;
          const y = Math.sin(theta) * currentR;
          
          if (s === 0) ctx.moveTo(x, y);
          else ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fill();
        
        ctx.strokeStyle = '#222222';
        ctx.lineWidth = 1;
        ctx.stroke();
      }

      ctx.restore();
      break;
    }

    case 'marilyn-mosaic': {
      // Create offscreen high-definition virtual canvas to render Marilyn vector shapes
      const virtSize = 64;
      const virtCanvas = document.createElement('canvas');
      virtCanvas.width = virtSize;
      virtCanvas.height = virtSize;
      const vctx = virtCanvas.getContext('2d');
      if (!vctx) break;

      // Fill offscreen with deep stark charcoal (black wood base)
      vctx.fillStyle = '#0a0a0c';
      vctx.fillRect(0, 0, virtSize, virtSize);

      // Draw beautiful hair volume (White Blocks base)
      vctx.fillStyle = '#fbfbfc';
      
      const drawCircle = (x: number, y: number, r: number) => {
        vctx.beginPath();
        vctx.arc(x, y, r, 0, Math.PI * 2);
        vctx.fill();
      };

      // Massive wavy hair shape
      drawCircle(32, 16, 15); // Top crown
      drawCircle(22, 18, 11); // Left top
      drawCircle(42, 18, 11); // Right top
      drawCircle(15, 25, 11); // Left mid
      drawCircle(49, 25, 11); // Right mid
      drawCircle(13, 35, 11); // Left curls lower
      drawCircle(51, 35, 11); // Right curls lower
      drawCircle(16, 44, 9);  // Left neck curl
      drawCircle(48, 44, 10); // Right neck curl

      // Forehead curls in black (to carve out the iconic hair contour)
      vctx.fillStyle = '#0a0a0c';
      drawCircle(32, 11, 6);  // top parting shadow
      drawCircle(16, 14, 5);  // left top corner shadow
      drawCircle(48, 14, 5);  // right top corner shadow

      // Draw Face skin container (soft off-white/cream)
      vctx.fillStyle = '#eceae6';
      vctx.beginPath();
      vctx.moveTo(32, 21); // forehead center height
      vctx.bezierCurveTo(18, 21, 19, 38, 22, 45); // left face check
      vctx.bezierCurveTo(24, 50, 27, 54, 32, 57); // chin curve left
      vctx.bezierCurveTo(37, 54, 40, 50, 42, 45); // chin curve right
      vctx.bezierCurveTo(45, 38, 46, 21, 32, 21); // right face cheek
      vctx.fill();

      // Forehead center drop lock curl (black overlay)
      vctx.fillStyle = '#0a0a0c';
      vctx.beginPath();
      vctx.moveTo(28, 21);
      vctx.bezierCurveTo(32, 21, 34, 25, 33, 29);
      vctx.bezierCurveTo(31, 29, 29, 25, 28, 21);
      vctx.fill();

      // Side shadows on cheeks (sculpt head)
      vctx.beginPath();
      vctx.moveTo(22, 43);
      vctx.quadraticCurveTo(20, 46, 23, 49);
      vctx.lineTo(21, 49);
      vctx.closePath();
      vctx.fill();

      // Left eye shadow / depth
      vctx.fillStyle = '#c5c2bd'; // subtle gray shadow for eye sockets
      vctx.beginPath();
      vctx.ellipse(26, 34, 3.5, 2, 0, 0, Math.PI * 2);
      vctx.ellipse(38, 34, 3.5, 2, 0, 0, Math.PI * 2);
      vctx.fill();

      // Drawing pristine black features (eyebrows + eyes + nose shadows)
      vctx.fillStyle = '#0a0a0c';
      vctx.strokeStyle = '#0a0a0c';
      vctx.lineWidth = 1.2;

      // Beautiful long thin arched eyebrows
      vctx.beginPath();
      vctx.moveTo(21, 32);
      vctx.quadraticCurveTo(25, 28, 29, 31);
      vctx.stroke();

      vctx.beginPath();
      vctx.moveTo(35, 31);
      vctx.quadraticCurveTo(39, 28, 43, 32);
      vctx.stroke();

      // Thick glamorous bedroom eyeliner lashes
      vctx.beginPath();
      vctx.moveTo(22, 34);
      vctx.quadraticCurveTo(26, 32, 29, 35);
      vctx.stroke();

      vctx.beginPath();
      vctx.moveTo(35, 35);
      vctx.quadraticCurveTo(38, 32, 42, 34);
      vctx.stroke();

      // Eyeballs/iris (highly abstract dots)
      vctx.beginPath();
      vctx.arc(25.5, 34.2, 1, 0, Math.PI * 2);
      vctx.arc(37.5, 34.2, 1, 0, Math.PI * 2);
      vctx.fill();

      // Nose shadow & tip base
      vctx.fillStyle = '#9d9992'; // soft shadow under nose
      vctx.beginPath();
      vctx.ellipse(32, 41.5, 2, 1, 0, 0, Math.PI * 2);
      vctx.fill();

      vctx.fillStyle = '#0a0a0c'; // nose lines/accents
      vctx.fillRect(31, 41.5, 2, 1);

      // Marilyn's iconic mole/beauty mark (on viewer's right cheek - her left)
      vctx.beginPath();
      vctx.arc(37.5, 43.5, 0.8, 0, Math.PI * 2);
      vctx.fill();

      // Elegant lips - base outline and vibrant crimson block fill
      vctx.fillStyle = '#e6001a'; // Hot Marilyn Red!

      // Upper lip
      vctx.beginPath();
      vctx.moveTo(25, 47);
      vctx.bezierCurveTo(28, 44, 30, 44, 31.5, 45.5);
      vctx.bezierCurveTo(33, 44, 36, 44, 39, 47);
      vctx.bezierCurveTo(36, 49, 28, 49, 25, 47);
      vctx.fill();

      // Lower lip (beautiful full cushion shape)
      vctx.beginPath();
      vctx.moveTo(25, 48);
      vctx.bezierCurveTo(28, 53, 36, 53, 39, 48);
      vctx.bezierCurveTo(36, 49.5, 28, 49.5, 25, 48);
      vctx.fill();

      // Mouth inner line (smiling dark space between open/smiling lips)
      vctx.fillStyle = '#0a0a0c';
      vctx.fillRect(27.5, 47.5, 9, 1);

      // Teeth reflection (fine white pixels)
      vctx.fillStyle = '#ffffff';
      vctx.fillRect(29.5, 47.5, 5, 0.6);

      // --- PIXEL BLOCK RENDERING ENGINE (BEVELLED WOOD TILE RECONSTRUCTION) ---
      // Get the image buffer mapping
      const imgData = vctx.getImageData(0, 0, virtSize, virtSize);
      const data = imgData.data;

      // Map out spacing on the design canvas
      const padX = 64;
      const padY = 120;
      const drawSize = width - padX * 2; // ~896px width mapping area
      const cellSize = drawSize / virtSize; // ~14px per wood block square!

      // To make it look EXACTLY like the wood block assembly, we add block shading
      ctx.save();
      
      for (let r = 0; r < virtSize; r++) {
        for (let c = 0; c < virtSize; c++) {
          const idx = (r * virtSize + c) * 4;
          const redVal = data[idx];
          const greenVal = data[idx+1];
          const blueVal = data[idx+2];

          // Determine type based on chrominance
          let type = 'black'; // default
          
          if (redVal > 180 && greenVal < 100 && blueVal < 100) {
            type = 'lips-red';
          } else if (redVal > 220 && greenVal > 220 && blueVal > 220) {
            type = 'pure-white';
          } else if (redVal > 180 && greenVal > 180 && blueVal > 180) {
            type = 'eggshell-white';
          } else if (redVal > 120 && greenVal > 120 && blueVal > 120) {
            type = 'warm-gray';
          } else if (redVal > 60 && greenVal > 60 && blueVal > 60) {
            type = 'dark-gray';
          }

          // Compute absolute brick positions
          const bx = padX + c * cellSize;
          const by = padY - 40 + r * cellSize;

          // Define brick colors & shadow styling
          let blockColor = '#121213';
          let highlightColor = '#2b2b2e';
          let shadowColor = '#060607';
          let grainColor = '#1a1a1c';

          switch (type) {
            case 'lips-red':
              blockColor = '#d60715';
              highlightColor = '#ff3c4d';
              shadowColor = '#80020a';
              grainColor = '#b50410';
              break;
            case 'pure-white':
              blockColor = '#f5f4f0';
              highlightColor = '#ffffff';
              shadowColor = '#d3d2ce';
              grainColor = '#e1e0db';
              break;
            case 'eggshell-white':
              blockColor = '#e6e4df';
              highlightColor = '#fdfcf7';
              shadowColor = '#b8b6b1';
              grainColor = '#cfcdc8';
              break;
            case 'warm-gray':
              blockColor = '#a3a099';
              highlightColor = '#c7c4be';
              shadowColor = '#777570';
              grainColor = '#8f8c86';
              break;
            case 'dark-gray':
              blockColor = '#535254';
              highlightColor = '#757476';
              shadowColor = '#3c3b3d';
              grainColor = '#474648';
              break;
          }

          // 1. Draw 3D-feeling Bevelled Wood Block / Brick
          ctx.fillStyle = blockColor;
          ctx.fillRect(bx, by, cellSize, cellSize);

          // 2. Bezel highlighted edges (top & left borders)
          ctx.strokeStyle = highlightColor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(bx + cellSize - 1, by + 1);
          ctx.lineTo(bx + 1, by + 1);
          ctx.lineTo(bx + 1, by + cellSize - 1);
          ctx.stroke();

          // 3. Shadowed bevel edges (bottom & right borders)
          ctx.strokeStyle = shadowColor;
          ctx.beginPath();
          ctx.moveTo(bx + cellSize - 1, by + 1);
          ctx.lineTo(bx + cellSize - 1, by + cellSize - 1);
          ctx.lineTo(bx + 1, by + cellSize - 1);
          ctx.stroke();

          // 4. Subtle programmatically generated Wood-Grain line texture (vertical or horizontal wood splits)
          ctx.fillStyle = grainColor;
          const randSeed = (r * 13 + c * 37) % 3;
          if (randSeed === 0) {
            ctx.fillRect(bx + cellSize * 0.35, by + 2, 1, cellSize - 4);
            ctx.fillRect(bx + cellSize * 0.7, by + 2, 1, cellSize - 4);
          } else if (randSeed === 1) {
            ctx.fillRect(bx + 2, by + cellSize * 0.35, cellSize - 4, 1);
            ctx.fillRect(bx + 2, by + cellSize * 0.7, cellSize - 4, 1);
          } else {
            ctx.fillRect(bx + cellSize * 0.5, by + 3, 1, cellSize - 6);
          }
        }
      }

      ctx.restore();
      break;
    }
  }

  // 4. Draw Typography Label at the Bottom (Pristine Museum Style, adjusted for 1024x1024 square layout)
  const bottomY = height * 0.83;
  ctx.fillStyle = '#111111';
  ctx.textAlign = 'center';

  // Title
  ctx.font = 'bold 30px "Space Grotesk", "Helvetica Neue", sans-serif';
  ctx.letterSpacing = '1px';
  ctx.fillText(artwork.title.toUpperCase(), width / 2, bottomY);

  // Divider line
  ctx.strokeStyle = '#999999';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(width * 0.35, bottomY + 18);
  ctx.lineTo(width * 0.65, bottomY + 18);
  ctx.stroke();

  // Artist, Year, Style
  ctx.font = '20px "Courier New", monospace';
  ctx.fillStyle = '#666666';
  ctx.fillText(`${artwork.artist} — ${artwork.year}`, width / 2, bottomY + 50);

  // Tiny minimalist subtitle info
  ctx.font = 'italic 15px "Georgia", serif';
  ctx.fillStyle = '#888888';
  ctx.fillText(`Style: ${artwork.generativeStyle.replace('-', ' ').toUpperCase()} // PERMANENT EXHIBIT`, width / 2, bottomY + 80);

  return canvas;
}

/**
 * Draws high-resolution complementary auxiliary artwork (sketches, details, blueprints)
 * to be mounted on the wall to the left and right of the main square artwork.
 */
export function drawCompanionCanvas(artwork: Artwork, side: 'left' | 'right', width: number = 512, height: number = 1024): HTMLCanvasElement {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');
  if (!ctx) return canvas;

  ctx.imageSmoothingEnabled = true;

  // Background
  ctx.fillStyle = '#fafafa';
  ctx.fillRect(0, 0, width, height);

  // Minimal margin border
  ctx.strokeStyle = '#111111';
  ctx.lineWidth = 2;
  const margin = 16;
  ctx.strokeRect(margin, margin, width - margin * 2, height - margin * 2);

  // Grid lines/accents
  ctx.strokeStyle = '#e2e2e2';
  ctx.lineWidth = 1;
  ctx.strokeRect(margin + 8, margin + 8, width - (margin + 8) * 2, height - (margin + 8) * 2);

  const cx = width / 2;
  const cy = height / 2;

  // Let's draw style-specific companion compositions
  switch (artwork.generativeStyle) {
    case 'fashion-silhouette': {
      if (side === 'left') { // Tall Vertical sketch/concept print
        // Minimal vertical single-line profile or drapery study
        ctx.strokeStyle = '#444444';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(cx, margin * 2);
        ctx.lineTo(cx, height - margin * 2);
        ctx.stroke();

        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // elegant swooping curve
        ctx.moveTo(cx + 40, cy - 150);
        ctx.bezierCurveTo(cx - 80, cy - 80, cx - 40, cy + 80, cx + 50, cy + 180);
        ctx.stroke();

        ctx.font = 'italic 12px "Georgia", serif';
        ctx.fillStyle = '#888888';
        ctx.textAlign = 'center';
        ctx.fillText('ETUDE DU DRAPE', cx, height - margin * 3);
      } else { // Square detail
        // Magnified technical mesh or typographic composition
        ctx.fillStyle = '#dcdbdb';
        ctx.beginPath();
        ctx.arc(cx, cy, 60, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.5;
        // Fine cross-hatching or circular guides
        ctx.beginPath();
        for (let r = 20; r <= 80; r += 20) {
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        }
        ctx.stroke();

        ctx.font = '10px "Courier New", monospace';
        ctx.fillStyle = '#333333';
        ctx.textAlign = 'center';
        ctx.fillText('COUTURE DETAIL (12.4x)', cx, cy + 120);
      }
      break;
    }

    case 'bauhaus-grid': {
      if (side === 'left') { // Tall vertical orthographic sketch
        // Grid pattern with geometric elements
        ctx.strokeStyle = '#cccccc';
        ctx.lineWidth = 1;
        // Draw vertical columns
        for (let x = margin * 2; x < width - margin * 2; x += 40) {
          ctx.beginPath();
          ctx.moveTo(x, margin * 2);
          ctx.lineTo(x, height - margin * 2);
          ctx.stroke();
        }
        
        ctx.fillStyle = '#222222';
        ctx.fillRect(cx - 30, cy - 180, 60, 40);
        ctx.fillStyle = '#888888';
        ctx.fillRect(cx - 15, cy - 100, 30, 200);

        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 35, cy - 185, 70, 310);

        ctx.font = 'bold 10px "Courier New", monospace';
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'center';
        ctx.fillText('PLAN_08 / ELEVATION', cx, height - margin * 3);
      } else { // Square detail
        // Overlapping blocks & circle
        ctx.fillStyle = '#222222';
        ctx.beginPath();
        ctx.arc(cx, cy - 10, 50, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2;
        ctx.strokeRect(cx - 60, cy - 70, 120, 120);

        ctx.font = '10px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'center';
        ctx.fillText('GRID SECTOR B-4', cx, cy + 90);
      }
      break;
    }

    case 'minimalist-editorial': {
      if (side === 'left') { // Tall vertical page format
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'left';
        
        ctx.font = 'bold 16px "Space Grotesk", sans-serif';
        ctx.fillText('MANIFESTE', margin * 3, margin * 5);

        ctx.font = '11px "Georgia", serif';
        ctx.fillStyle = '#444444';
        
        const lines = [
          'La pureté de la forme',
          'est l’élimination de l’excès.',
          'Chaque espace vide parle.',
          'Le silence n’est pas absence,',
          'mais présence de place d’esprit.',
          'Nous cherchons la beauté',
          'dans le geste unique,',
          'non encombré.',
          'Fidélité au monochrome.'
        ];
        lines.forEach((line, i) => {
          ctx.fillText(line, margin * 3, margin * 8 + i * 24);
        });

        // Small signature box at bottom
        ctx.strokeStyle = '#888888';
        ctx.beginPath();
        ctx.moveTo(margin * 3, height - margin * 6);
        ctx.lineTo(width - margin * 3, height - margin * 6);
        ctx.stroke();

        ctx.font = 'italic 10px "Courier New", monospace';
        ctx.fillStyle = '#888888';
        ctx.fillText('VOLUME III // ARCHIVES', margin * 3, height - margin * 4);
      } else { // Square detail index / letter logo
        ctx.fillStyle = '#111111';
        ctx.font = 'bold 90px "Space Grotesk", sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('M', cx, cy - 10);

        ctx.font = '10px "Courier New", monospace';
        ctx.fillStyle = '#666666';
        ctx.fillText('SYSTEMA N°01', cx, cy + 90);
      }
      break;
    }

    case 'optical-illusion': {
      if (side === 'left') { // Tall vertical high-frequency lines
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.5;
        for (let y = margin * 3; y < height - margin * 3; y += 12) {
          ctx.beginPath();
          const wave = Math.sin(y * 0.03) * 35;
          ctx.moveTo(cx - 60 + wave, y);
          ctx.lineTo(cx + 60 + wave, y);
          ctx.stroke();
        }
        ctx.font = '10px "Courier New", monospace';
        ctx.fillStyle = '#777777';
        ctx.textAlign = 'center';
        ctx.fillText('FREQUENCY SCAN', cx, height - margin * 3);
      } else { // Square spiral or target circles
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let r = 10; r <= 90; r += 15) {
          ctx.arc(cx, cy, r, 0, Math.PI * 2);
        }
        ctx.stroke();

        ctx.font = '10px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'center';
        ctx.fillText('INTERFERENCE', cx, cy + 120);
      }
      break;
    }

    case 'surreal-geometric': {
      if (side === 'left') { // Tall vertical perspective wireframe
        ctx.strokeStyle = '#aaaaaa';
        ctx.lineWidth = 0.8;
        // Drawing horizon and perspective lines
        ctx.beginPath();
        // Horizon line
        ctx.moveTo(margin * 2, cy);
        ctx.lineTo(width - margin * 2, cy);
        // Perspective rays to vanishing center (cx, cy)
        for (let val = 0; val <= width; val += 40) {
          ctx.moveTo(val, margin * 2);
          ctx.lineTo(cx, cy);
          ctx.moveTo(val, height - margin * 2);
          ctx.lineTo(cx, cy);
        }
        ctx.stroke();

        // Architectural column draft outline in black
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.8;
        ctx.strokeRect(cx - 30, cy - 120, 60, 240);
        ctx.beginPath();
        ctx.moveTo(cx - 30, cy - 120); ctx.lineTo(cx, cy - 150); ctx.lineTo(cx + 30, cy - 120);
        ctx.stroke();

        ctx.font = '10px "Courier New", monospace';
        ctx.fillStyle = '#222222';
        ctx.textAlign = 'center';
        ctx.fillText('PERSPECTIVE PERSISTENCE', cx, height - margin * 3);
      } else { // Square detail sphere projection
        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.2;
        const rad = 65;
        ctx.beginPath();
        ctx.arc(cx, cy, rad, 0, Math.PI * 2);
        ctx.stroke();

        ctx.strokeStyle = '#cccccc';
        ctx.beginPath();
        ctx.ellipse(cx, cy, rad, rad * 0.4, 0, 0, Math.PI * 2);
        ctx.ellipse(cx, cy, rad, rad * 0.8, 0, 0, Math.PI * 2);
        ctx.ellipse(cx, cy, rad * 0.4, rad, 0, 0, Math.PI * 2);
        ctx.ellipse(cx, cy, rad * 0.8, rad, 0, 0, Math.PI * 2);
        ctx.stroke();

        ctx.font = '10px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'center';
        ctx.fillText('SPHERE SPATIALIZATION', cx, cy + 100);
      }
      break;
    }

    case 'marilyn-mosaic': {
      if (side === 'left') { // Tall vertical Warhol style monochrome grid
        // Render 2 stacked super-mini high-contrast block portraits in grays
        ctx.fillStyle = '#222222';
        ctx.fillRect(cx - 40, cy - 180, 80, 100);
        ctx.fillStyle = '#dddddd';
        ctx.fillRect(cx - 28, cy - 165, 56, 75);
        ctx.fillStyle = '#a00010'; // Red lips splash on left side print too!
        ctx.fillRect(cx - 8, cy - 105, 16, 6);

        ctx.fillStyle = '#222222';
        ctx.fillRect(cx - 40, cy - 20, 80, 100);
        ctx.fillStyle = '#888888';
        ctx.fillRect(cx - 28, cy - 5, 56, 75);
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(cx - 28, cy - 5, 25, 75); // side contrast
        ctx.fillStyle = '#a00010';
        ctx.fillRect(cx - 8, cy + 45, 16, 6);

        ctx.strokeStyle = '#111111';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(cx - 42, cy - 182, 84, 104);
        ctx.strokeRect(cx - 42, cy - 22, 84, 104);

        ctx.font = '10px "Courier New", monospace';
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'center';
        ctx.fillText('CHRONOSPACE GRID', cx, height - margin * 3);
      } else { // Square close up details of wood block assembly
        const tileSize = 45;
        const positions = [
          { x: cx - 55, y: cy - 45, color: '#fbfbe7', h: '#ffffff', s: '#dcdcc5', lips: false },
          { x: cx, y: cy - 45, color: '#131315', h: '#2c2c31', s: '#050506', lips: false },
          { x: cx - 27, y: cy + 10, color: '#e6001a', h: '#ff3c4d', s: '#80020a', lips: true } // Bold red lip tile!
        ];

        positions.forEach((p) => {
          ctx.fillStyle = p.color;
          ctx.fillRect(p.x, p.y, tileSize, tileSize);
          
          ctx.strokeStyle = p.h;
          ctx.beginPath();
          ctx.moveTo(p.x + tileSize - 1, p.y + 1);
          ctx.lineTo(p.x + 1, p.y + 1);
          ctx.lineTo(p.x + 1, p.y + tileSize - 1);
          ctx.stroke();

          ctx.strokeStyle = p.s;
          ctx.beginPath();
          ctx.moveTo(p.x + tileSize - 1, p.y + 1);
          ctx.lineTo(p.x + tileSize - 1, p.y + tileSize - 1);
          ctx.lineTo(p.x + 1, p.y + tileSize - 1);
          ctx.stroke();

          // grain details
          ctx.fillStyle = p.lips ? '#cc0014' : '#666666';
          ctx.fillRect(p.x + tileSize * 0.5, p.y + 4, 1, tileSize - 8);
        });

        ctx.font = '10px "Space Grotesk", sans-serif';
        ctx.fillStyle = '#111111';
        ctx.textAlign = 'center';
        ctx.fillText('BLOCK STUDY 108', cx, cy + 90);
      }
      break;
    }
  }

  // Label at bottom of side pieces
  ctx.strokeStyle = '#cccccc';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(cx - 30, height - margin * 2);
  ctx.lineTo(cx + 30, height - margin * 2);
  ctx.stroke();

  return canvas;
}
