import { ImageAnalysis, APIResponse } from '../types';

const OPENROUTER_API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const OPENROUTER_API_URL = import.meta.env.VITE_OPENROUTER_BASE_URL + "/v1/chat/completions";

export class OpenRouterService {
  private static instance: OpenRouterService;
  private rateLimitDelay = 1000; // 1 second between requests

  static getInstance(): OpenRouterService {
    if (!OpenRouterService.instance) {
      OpenRouterService.instance = new OpenRouterService();
    }
    return OpenRouterService.instance;
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

      if (!OPENROUTER_API_KEY) {
        throw new Error('OpenRouter API key is not configured');
      }

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-opus",
          messages: [
            {
              role: "user",
              content: [
                {
                  type: "text",
                  text: prompt
                },
                {
                  type: "image_url",
                  image_url: {
                    url: `data:image/jpeg;base64,${imageBase64.split(',')[1]}`
                  }
                }
              ]
            }
          ],
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const analysisText = data.choices?.[0]?.message?.content;
      
      if (!analysisText) {
        throw new Error('No analysis text received from OpenRouter');
      }

      // Extract JSON from the response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const analysis: ImageAnalysis = JSON.parse(jsonMatch[0]);
      return { success: true, data: analysis };

    } catch (error) {
      console.error('OpenRouter analysis error:', error);
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

      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-opus",
          messages: [{
            role: "user",
            content: prompt
          }],
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content;
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);
      return { success: true, data: result };

    } catch (error) {
      console.error('OpenRouter prompt generation error:', error);
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

  async enhancePrompt(prompt: string, platform: string): Promise<APIResponse> {
    try {
      await this.delay(this.rateLimitDelay);

      const enhancementPrompt = `Optimize this AI image prompt for ${platform}:
      
      Original Prompt: ${prompt}

      Return a JSON response with:
      {
        "enhancedPrompt": "optimized version",
        "improvements": "list of specific improvements made",
        "negativePrompt": "suggested negative prompt if applicable",
        "tips": "platform-specific optimization tips"
      }`;

      const response = await fetch(`${OPENROUTER_API_URL}?key=${OPENROUTER_API_KEY}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`
        },
        body: JSON.stringify({
          model: "anthropic/claude-3-opus",
          messages: [{
            role: "user",
            content: enhancementPrompt
          }],
          max_tokens: 2000
        })
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      const responseText = data.choices?.[0]?.message?.content;
      
      const jsonMatch = responseText.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      const result = JSON.parse(jsonMatch[0]);
      return { success: true, data: result };

    } catch (error) {
      console.error('OpenRouter prompt enhancement error:', error);
      return { 
        success: false, 
        error: error instanceof Error ? error.message : 'Failed to enhance prompt' 
      };
    }
  }
}
