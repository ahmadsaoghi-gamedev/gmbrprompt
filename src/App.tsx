import React, { useState, useCallback } from 'react';
import { Toaster } from 'react-hot-toast';
import { Header } from './components/Header';
import { ImageUpload } from './components/ImageUpload';
import { AnalysisResults } from './components/AnalysisResults';
import { PromptBuilder } from './components/PromptBuilder';
import { Templates } from './components/Templates';
import { PromptHistory } from './components/PromptHistory';
import { GeneratedPrompts } from './components/GeneratedPrompts';
import { PromptService } from './services/promptService';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTranslation } from './hooks/useTranslation';
import { Footer } from './components/Footer';
import { ImageAnalysis, GeneratedPrompt, Platform, PromptTemplate } from './types';
import toast from 'react-hot-toast';

function App() {
  const { t } = useTranslation();
  
  // State management
  const [uploadedImage, setUploadedImage] = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [generatedPrompts, setGeneratedPrompts] = useState<Array<{
    platform: Platform;
    prompt: string;
    negativePrompt?: string;
    tips?: string;
  }>>([]);
  
  // Local storage for history
  const [promptHistory, setPromptHistory] = useLocalStorage<GeneratedPrompt[]>('prompt-history', []);
  
  // Services
  const promptService = new PromptService();

  // Image handling
  const handleImageUpload = useCallback(async (imageBase64: string) => {
    setUploadedImage(imageBase64);
    setImageAnalysis(null);
    setGeneratedPrompts([]);
    setIsAnalyzing(true);

    try {
      const result = await promptService.analyzeImageWithFallback(imageBase64);
      
      if (result.success) {
        setImageAnalysis(result.data);
        toast.success(t('image_analyzed'));
        
        // Auto-generate prompts for popular platforms
        await generatePromptsFromAnalysis(result.data);
      } else {
        toast.error(result.error || t('analysis_failed'));
      }
    } catch (error) {
      console.error('Analysis error:', error);
      toast.error(t('analysis_failed'));
    } finally {
      setIsAnalyzing(false);
    }
  }, [t]);

  const handleImageRemove = useCallback(() => {
    setUploadedImage(null);
    setImageAnalysis(null);
    setGeneratedPrompts([]);
  }, []);

  // Prompt generation
  const generatePromptsFromAnalysis = async (analysis: ImageAnalysis) => {
    if (!analysis) return;

    setIsGeneratingPrompts(true);
    const platforms: Platform[] = ['dalle3', 'stable-diffusion', 'midjourney'];
    const newPrompts = [];

    try {
      for (const platform of platforms) {
        const result = await promptService.generatePromptFromAnalysis(analysis, platform);
        if (result.success) {
          newPrompts.push({
            platform,
            prompt: result.data.prompt,
            negativePrompt: result.data.negativePrompt,
            tips: result.data.tips
          });

          // Add to history
          const historyItem: GeneratedPrompt = {
            id: Date.now().toString() + Math.random(),
            platform,
            prompt: result.data.prompt,
            negativePrompt: result.data.negativePrompt,
            timestamp: new Date(),
            sourceImage: uploadedImage || undefined,
            analysis
          };
          
          setPromptHistory(prev => [historyItem, ...prev.slice(0, 49)]); // Keep last 50
        }
      }

      setGeneratedPrompts(newPrompts);
      
      if (newPrompts.length > 0) {
        toast.success(`Generated ${newPrompts.length} prompts!`);
      } else {
        toast.error(t('generation_failed'));
      }
    } catch (error) {
      console.error('Prompt generation error:', error);
      toast.error(t('generation_failed'));
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const handlePromptGenerated = async (prompt: string, platform: Platform) => {
    const historyItem: GeneratedPrompt = {
      id: Date.now().toString() + Math.random(),
      platform,
      prompt,
      timestamp: new Date()
    };
    
    setPromptHistory(prev => [historyItem, ...prev.slice(0, 49)]);
    
    // Update generated prompts display
    setGeneratedPrompts(prev => {
      const filtered = prev.filter(p => p.platform !== platform);
      return [{
        platform,
        prompt,
        negativePrompt: promptService.getDefaultNegativePrompt?.(platform)
      }, ...filtered];
    });
    
    toast.success(t('prompt_generated'));
  };

  const handleVariationsGenerated = (variations: Array<{ platform: Platform; prompt: string; negativePrompt?: string }>) => {
    setGeneratedPrompts(variations);
    
    // Add all variations to history
    variations.forEach(variation => {
      const historyItem: GeneratedPrompt = {
        id: Date.now().toString() + Math.random(),
        platform: variation.platform,
        prompt: variation.prompt,
        negativePrompt: variation.negativePrompt,
        timestamp: new Date()
      };
      
      setPromptHistory(prev => [historyItem, ...prev.slice(0, 49)]);
    });
  };

  const handlePromptEnhance = async (prompt: string, platform: Platform) => {
    try {
      const result = await promptService.enhancePrompt(prompt, platform);
      
      if (result.success) {
        const enhancedPrompt = result.data.enhancedPrompt || result.data.prompt;
        
        // Update the displayed prompt
        setGeneratedPrompts(prev => 
          prev.map(p => 
            p.platform === platform 
              ? { 
                  ...p, 
                  prompt: enhancedPrompt,
                  negativePrompt: result.data.negativePrompt || p.negativePrompt,
                  tips: result.data.improvements || p.tips
                }
              : p
          )
        );

        // Add to history
        const historyItem: GeneratedPrompt = {
          id: Date.now().toString() + Math.random(),
          platform,
          prompt: enhancedPrompt,
          negativePrompt: result.data.negativePrompt,
          timestamp: new Date()
        };
        
        setPromptHistory(prev => [historyItem, ...prev.slice(0, 49)]);
        toast.success(t('prompt_enhanced'));
      } else {
        toast.error(result.error || t('enhancement_failed'));
      }
    } catch (error) {
      console.error('Enhancement error:', error);
      toast.error(t('enhancement_failed'));
    }
  };

  const handleTemplateSelect = (template: PromptTemplate) => {
    const historyItem: GeneratedPrompt = {
      id: Date.now().toString() + Math.random(),
      platform: 'other',
      prompt: template.prompt,
      negativePrompt: template.negativePrompt,
      timestamp: new Date()
    };
    
    setPromptHistory(prev => [historyItem, ...prev.slice(0, 49)]);
    
    setGeneratedPrompts([{
      platform: 'other',
      prompt: template.prompt,
      negativePrompt: template.negativePrompt,
      tips: `Template: ${template.name} - ${template.description}`
    }]);
    
    toast.success(t('template_applied'));
  };

  const handleRegeneratePrompt = async (platform: Platform) => {
    if (imageAnalysis) {
      setIsGeneratingPrompts(true);
      try {
        const result = await promptService.generatePromptFromAnalysis(imageAnalysis, platform);
        if (result.success) {
          setGeneratedPrompts(prev => 
            prev.map(p => 
              p.platform === platform 
                ? {
                    platform,
                    prompt: result.data.prompt,
                    negativePrompt: result.data.negativePrompt,
                    tips: result.data.tips
                  }
                : p
            )
          );

          const historyItem: GeneratedPrompt = {
            id: Date.now().toString() + Math.random(),
            platform,
            prompt: result.data.prompt,
            negativePrompt: result.data.negativePrompt,
            timestamp: new Date(),
            sourceImage: uploadedImage || undefined,
            analysis: imageAnalysis
          };
          
          setPromptHistory(prev => [historyItem, ...prev.slice(0, 49)]);
          toast.success('Prompt regenerated!');
        }
      } catch {
        toast.error('Failed to regenerate prompt');
      } finally {
        setIsGeneratingPrompts(false);
      }
    }
  };

  // History management
  const handleClearHistory = () => {
    setPromptHistory([]);
    toast.success(t('history_cleared'));
  };

  const handleDeletePrompt = (id: string) => {
    setPromptHistory(prev => prev.filter(p => p.id !== id));
    toast.success(t('prompt_deleted'));
  };

  // Modal handlers
  const handleSettingsClick = () => {
    toast('Settings coming soon!', { icon: '⚙️' });
  };

  const handleHelpClick = () => {
    toast('Help documentation coming soon!', { icon: '❓' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <Header 
        onSettingsClick={handleSettingsClick}
        onHelpClick={handleHelpClick}
      />
      
      <main className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Panel - Image Upload & Analysis */}
          <div className="space-y-6">
            <ImageUpload
              onImageUpload={handleImageUpload}
              onImageRemove={handleImageRemove}
              uploadedImage={uploadedImage}
              isAnalyzing={isAnalyzing}
            />
            
            {imageAnalysis && (
              <AnalysisResults analysis={imageAnalysis} />
            )}
          </div>

          {/* Center Panel - Prompt Builder & Generated Prompts */}
          <div className="space-y-6">
            <PromptBuilder
              onPromptGenerated={handlePromptGenerated}
              onPromptEnhance={handlePromptEnhance}
              onVariationsGenerated={handleVariationsGenerated}
            />
            
            <GeneratedPrompts
              prompts={generatedPrompts}
              onRegenerate={handleRegeneratePrompt}
              isGenerating={isGeneratingPrompts}
            />
          </div>

          {/* Right Panel - Templates & History */}
          <div className="space-y-6">
            <Templates onTemplateSelect={handleTemplateSelect} />
            
            <PromptHistory
              prompts={promptHistory}
              onClearHistory={handleClearHistory}
              onDeletePrompt={handleDeletePrompt}
            />
          </div>
        </div>
      </main>

      <Toaster 
        position="bottom-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: 'rgba(51, 65, 85, 0.9)',
            color: '#ffffff',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            backdropFilter: 'blur(10px)',
          },
        }}
      />
      <Footer />
    </div>
  );
}

export default App;
