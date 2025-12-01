export interface BodyMeasurement {
  bodyShape: string;
  estimatedSize: string;
  measurements: {
    shoulders: string;
    bust: string;
    waist: string;
    hips: string;
  };
  confidence: number;
}

export interface UserProfile {
  name: string;
  height: string; // in cm
  weight: string; // in kg
  avatarImage: string | null; // base64
  measurements: BodyMeasurement['measurements'];
}

export interface DressSuggestion {
  id: string;
  name: string;
  description: string;
  reason: string;
  style: string;
  imagePrompt: string; // Used to generate a placeholder or visual
  colorPalette: string[];
}

export enum AppState {
  LANDING = 'LANDING',
  SCANNING = 'SCANNING',
  ANALYZING = 'ANALYZING',
  RESULTS = 'RESULTS',
  PROFILE = 'PROFILE',
  TRY_ON = 'TRY_ON',
}

export interface PricingTier {
  name: string;
  price: string;
  features: string[];
  recommended?: boolean;
}

// Fix for missing Three.js types in JSX.IntrinsicElements
declare global {
  namespace JSX {
    interface IntrinsicElements {
      ambientLight: any;
      pointLight: any;
      group: any;
      mesh: any;
      meshStandardMaterial: any;
      sphereGeometry: any;
      cylinderGeometry: any;
    }
  }
}