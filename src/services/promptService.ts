import { GeminiService } from './gemini';
import { OpenRouterService } from './openrouter';
import { ImageAnalysis, Platform, APIResponse } from '../types';

interface PromptBuilderData {
  subject?: string;
  action?: string;
  setting?: string;
  style?: string;
  mood?: string;
  lighting?: string;
  cameraAngle?: string;
  additionalDetails?: string;
  aspectRatio?: string;
}

export class PromptService {
  private gemini = GeminiService.getInstance();
  private openRouter = OpenRouterService.getInstance();

  async analyzeImageWithFallback(imageBase64: string): Promise<APIResponse> {
    // Try Gemini first
    const geminiResult = await this.gemini.analyzeImage(imageBase64);
    
    if (geminiResult.success) {
      return geminiResult;
    }

    console.warn('Gemini failed, trying OpenRouter fallback:', geminiResult.error);
    
    // Fallback to OpenRouter
    const openRouterResult = await this.openRouter.analyzeImage(imageBase64);
    
    if (!openRouterResult.success) {
      return {
        success: false,
        error: `Both services failed. Gemini: ${geminiResult.error}, OpenRouter: ${openRouterResult.error}`
      };
    }

    return openRouterResult;
  }

  async generatePromptFromAnalysis(analysis: ImageAnalysis, platform: Platform): Promise<APIResponse> {
    const result = await this.gemini.generatePrompt(analysis, platform);
    
    if (!result.success) {
      // Create a fallback prompt based on analysis
      const fallbackPrompt = this.createFallbackPrompt(analysis, platform);
      return {
        success: true,
        data: {
          prompt: fallbackPrompt,
          negativePrompt: this.getDefaultNegativePrompt(platform),
          tips: 'Generated using fallback method'
        }
      };
    }

    return result;
  }

  async enhancePrompt(prompt: string, platform: Platform): Promise<APIResponse> {
    return await this.openRouter.enhancePrompt(prompt, platform);
  }

  private createFallbackPrompt(analysis: ImageAnalysis, platform: Platform): string {
    const elements = [
      analysis.objects.join(', '),
      analysis.scene,
      analysis.style,
      analysis.lighting,
      analysis.mood,
      analysis.composition
    ].filter(Boolean);

    const basePrompt = elements.join(', ');
    
    // Add platform-specific formatting
    switch (platform) {
      case 'stable-diffusion':
        return `${basePrompt}, highly detailed, professional photography, high quality, 8k resolution`;
      case 'midjourney':
        return `${basePrompt} --ar 16:9 --v 6 --style raw`;
      case 'dalle3':
        return `A detailed image showing ${basePrompt}`;
      default:
        return basePrompt;
    }
  }

  public getDefaultNegativePrompt(platform: Platform): string {
    const common = 'blurry, low quality, distorted, ugly, bad anatomy, watermark, text';
    
    switch (platform) {
      case 'stable-diffusion':
        return `${common}, malformed, duplicate, out of frame, extra limbs, poorly drawn`;
      default:
        return common;
    }
  }

  generatePromptFromBuilder(data: PromptBuilderData, platform: Platform): string {
    const elements = [];
    
    if (data.subject) elements.push(data.subject);
    if (data.action) elements.push(data.action);
    if (data.setting) elements.push(`set in ${data.setting}`);
    if (data.style) elements.push(`${data.style} style`);
    if (data.mood) elements.push(`${data.mood} mood`);
    if (data.lighting) elements.push(`${data.lighting} lighting`);
    if (data.cameraAngle) elements.push(`${data.cameraAngle} view`);
    if (data.additionalDetails) elements.push(data.additionalDetails);

    let prompt = elements.join(', ');

    // Add platform-specific enhancements
    switch (platform) {
      case 'stable-diffusion':
        prompt += ', highly detailed, professional photography, 8k, high quality';
        break;
      case 'midjourney':
        prompt += ` --ar ${data.aspectRatio || '16:9'} --v 6`;
        break;
      case 'dalle3':
        prompt = `Create a detailed image of ${prompt}`;
        break;
    }

    return prompt;
  }
}
