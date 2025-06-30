export interface ImageAnalysis {
  objects: string[];
  scene: string;
  colors: string[];
  lighting: string;
  mood: string;
  style: string;
  composition: string;
  technicalDetails: string;
}

export interface GeneratedPrompt {
  id: string;
  platform: string;
  prompt: string;
  negativePrompt?: string;
  timestamp: Date;
  sourceImage?: string;
  analysis?: ImageAnalysis;
  weights?: PromptWeights;
}

export interface PromptTemplate {
  id: string;
  name: string;
  category: string;
  description: string;
  prompt: string;
  negativePrompt?: string;
  aspectRatio?: string;
  tags: string[];
}

export interface PromptBuilderData {
  subject: string;
  action: string;
  setting: string;
  style: string;
  mood: string;
  lighting: string;
  cameraAngle: string;
  aspectRatio: string;
  additionalDetails: string;
  negativePrompt: string;
  artMedium: string;
  resolution: string;
  quality: string;
  technical: string;
  camera: string;
}

export interface PromptWeights {
  subject: number;
  style: number;
  setting: number;
  mood: number;
  lighting: number;
}

export interface CustomOptions {
  styles: string[];
  moods: string[];
  lighting: string[];
  cameraAngles: string[];
  artMediums: string[];
  resolutions: string[];
  qualities: string[];
  technical: string[];
  cameras: string[];
}

export type Platform = 'dalle3' | 'stable-diffusion' | 'midjourney' | 'bing' | 'firefly' | 'other';

export type Language = 'en' | 'id';

export interface APIResponse {
  success: boolean;
  data?: any;
  error?: string;
}

export interface Translation {
  [key: string]: string;
}

export interface Translations {
  en: Translation;
  id: Translation;
}