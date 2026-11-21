export interface Artwork {
  id: string;
  title: string;
  artist: string;
  year: string;
  description: string;
  generativeStyle: 'fashion-silhouette' | 'bauhaus-grid' | 'minimalist-editorial' | 'surreal-geometric' | 'monochrome-portrait' | 'optical-illusion' | 'marilyn-mosaic';
  customText?: string;
  accentColor?: string; // e.g. subtle grayscale hex or off-white
  wallText?: string; // Optional wall lettering near this artwork
  position: { x: number; y: number; z: number };
  rotationY: number; // in radians
  width: number;
  height: number;
  customImageUrl?: string;
  image?: string;
  audio?: string;
}

export interface LightSettings {
  ambientIntensity: number;
  ceilingIntensity: number;
  backlightIntensity: number;
  glowColor: string; // Hex color for the glowing backlights
  showBeamEffect: boolean;
  wallBrightness: number;
}

export type ViewMode = 'desktop';

export interface ControlsState {
  movementSpeed: number;
  cameraHeight: number;
  activeArtworkId: string | null;
  tourActive: boolean;
  viewMode: ViewMode;
  controlMethod: 'wasd' | 'teleport' | 'tour';
}
