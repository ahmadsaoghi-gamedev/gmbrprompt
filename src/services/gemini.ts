import { ImageAnalysis, APIResponse } from '../types';

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = import.meta.env.VITE_GEMINI_BASE_URL + "/v1beta/models/gemini-2.0-flash:generateContent";

export class GeminiService {
  private static instance: GeminiService;
  private rateLimitDelay = 1000; // 1 second between requests

  static getInstance(): GeminiService {
    if (!GeminiService.instance) {
      GeminiService.instance = new GeminiService();
    }
    return GeminiService.instance;
  }

  async analyzeImage(imageBase64: string): Promise<APIResponse> {
    try {
      await this.delay(this.rateLimitDelay);

      const prompt = `Analyze this image thoroughly and provide a detailed description in the following JSON format:
      {
        "objects": ["list of main objects and subjects"],
        "scene": "description of the scene/setting",
        "colors": ["dominant colors"],
        "lighting": "lighting conditions and quality",
        "mood": "overall mood and atmosphere",
        "style": "artistic or photographic style",
        "composition": "composition and framing details",
        "technicalDetails": "camera angle, depth of field, etc."
      }
      
      Be specific and detailed to help generate accurate AI image prompts.`;

      const apiKey = GEMINI_API_KEY;
      if (!apiKey) {
        throw new Error('Gemini API key is not configured');
      }
const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [
              { text: prompt },
              {
                inline_data: {
                  mime_type: "image/jpeg",
                  data: imageBase64.split(',')[1]
                }
              }
            ]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (!analysisText) {
        throw new Error('No analysis text received from Gemini');
      }

      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const analysis: ImageAnalysis = JSON.parse(jsonMatch[0]);
      return { success: true, data: analysis };

    } catch (error) {
      console.error('Gemini analysis error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Unknown error occurred' 
      };
    }
  }

  async generatePrompt(analysis: ImageAnalysis, platform: string): Promise<APIResponse> {
    try {
      await this.delay(this.rateLimitDelay);

      const platformInstructions = this.getPlatformInstructions(platform);
      
      const prompt = `Based on this image analysis, generate an optimized AI image prompt for ${platform}:

      Analysis: ${JSON.stringify(analysis, null, 2)}

      ${platformInstructions}

      Return a JSON response with:
      {
        "prompt": "optimized prompt for ${platform}",
        "negativePrompt": "negative prompt if applicable",
        "tips": "platform-specific tips"
      }`;

      const response = await fetch(`${GEMINI_API_URL}?key=${GEMINI_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{ text: prompt }]
          }]
        })
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);
      return { success: true, data: result };

    } catch (error) {
      console.error('Gemini prompt generation error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to generate prompt' 
      };
    }
  }

  private getPlatformInstructions(platform: string): string {
    const instructions = {
      'dalle3': 'For DALL-E 3: Use natural language, be descriptive but concise. Focus on visual elements and artistic style. Avoid prohibited content.',
      'stable-diffusion': 'For Stable Diffusion: Use detailed descriptive tags separated by commas. Include technical photography terms, art styles, and quality modifiers.',
      'midjourney': 'For Midjourney: Use descriptive phrases with artistic and photographic terms. Include aspect ratio suggestions and style parameters.',
      'bing': 'For Bing Image Creator: Use clear, descriptive language. Focus on subjects, settings, and artistic styles. Keep it family-friendly.',
      'firefly': 'For Adobe Firefly: Use detailed descriptions with emphasis on professional photography and artistic styles. Include lighting and composition details.',
    };

    return instructions[platform as keyof typeof instructions] || 'Generate a detailed, descriptive prompt suitable for AI image generation.';
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}
