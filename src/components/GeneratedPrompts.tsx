import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Copy, RefreshCw, Download, Share2 } from 'lucide-react';
import { Platform } from '../types';
import toast from 'react-hot-toast';

interface GeneratedPromptsProps {
  prompts: Array<{
    platform: Platform;
    prompt: string;
    negativePrompt?: string;
    tips?: string;
  }>;
  onRegenerate: (platform: Platform) => void;
  isGenerating: boolean;
}

export const GeneratedPrompts: React.FC<GeneratedPromptsProps> = ({
  prompts,
  onRegenerate,
  isGenerating
}) => {
  const [expandedPrompt, setExpandedPrompt] = useState<string | null>(null);

  const copyPrompt = async (prompt: string, negativePrompt?: string) => {
    try {
      const fullPrompt = negativePrompt 
        ? `${prompt}\n\nNegative Prompt: ${negativePrompt}`
        : prompt;
      await navigator.clipboard.writeText(fullPrompt);
      toast.success('Prompt copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy prompt');
    }
  };

  const exportPrompts = () => {
    const dataStr = prompts.map(p => ({
      platform: p.platform,
      prompt: p.prompt,
      negativePrompt: p.negativePrompt,
      timestamp: new Date().toISOString()
    }));
    
    const blob = new Blob([JSON.stringify(dataStr, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'generated-prompts.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('Prompts exported successfully!');
  };

  const sharePrompt = async (prompt: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'AI Generated Prompt',
          text: prompt,
        });
      } catch (error) {
        copyPrompt(prompt);
      }
    } else {
      copyPrompt(prompt);
    }
  };

  const getPlatformColor = (platform: Platform) => {
    const colors = {
      'dalle3': 'from-green-500 to-emerald-500',
      'stable-diffusion': 'from-blue-500 to-indigo-500',
      'midjourney': 'from-purple-500 to-pink-500',
      'bing': 'from-orange-500 to-red-500',
      'firefly': 'from-yellow-500 to-orange-500',
      'other': 'from-gray-500 to-gray-600'
    };
    return colors[platform] || colors.other;
  };

  const getPlatformName = (platform: Platform) => {
    const names = {
      'dalle3': 'DALL-E 3',
      'stable-diffusion': 'Stable Diffusion',
      'midjourney': 'Midjourney',
      'bing': 'Bing AI',
      'firefly': 'Adobe Firefly',
      'other': 'Other'
    };
    return names[platform] || platform;
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">Generated Prompts</h2>
        </div>
        
        {prompts.length > 0 && (
          <motion.button
            onClick={exportPrompts}
            className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors duration-200"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title="Export all prompts"
          >
            <Download className="w-4 h-4" />
          </motion.button>
        )}
      </div>

      {prompts.length === 0 && !isGenerating && (
        <div className="text-center py-8 text-gray-400">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No prompts generated yet</p>
          <p className="text-sm mt-1">Upload an image or use the prompt builder to get started</p>
        </div>
      )}

      {isGenerating && (
        <div className="text-center py-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-8 h-8 mx-auto mb-2"
          >
            <Sparkles className="w-8 h-8 text-purple-400" />
          </motion.div>
          <p className="text-white">Generating optimized prompts...</p>
        </div>
      )}

      <div className="space-y-4">
        {prompts.map((promptData, index) => (
          <motion.div
            key={`${promptData.platform}-${index}`}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            whileHover={{ scale: 1.01 }}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <span className={`text-sm px-3 py-1 bg-gradient-to-r ${getPlatformColor(promptData.platform)} text-white rounded-full font-medium`}>
                  {getPlatformName(promptData.platform)}
                </span>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  onClick={() => sharePrompt(promptData.prompt)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Share prompt"
                >
                  <Share2 className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => copyPrompt(promptData.prompt, promptData.negativePrompt)}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Copy prompt"
                >
                  <Copy className="w-4 h-4" />
                </motion.button>
                <motion.button
                  onClick={() => onRegenerate(promptData.platform)}
                  className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors duration-200"
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  title="Regenerate"
                >
                  <RefreshCw className="w-4 h-4" />
                </motion.button>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <h4 className="text-white font-medium mb-2 text-sm">Main Prompt</h4>
                <div className="bg-slate-900/50 rounded-lg p-3">
                  <p className={`text-gray-300 text-sm leading-relaxed ${
                    expandedPrompt === `${promptData.platform}-${index}` ? '' : 'line-clamp-3'
                  }`}>
                    {promptData.prompt}
                  </p>
                  {promptData.prompt.length > 200 && (
                    <motion.button
                      onClick={() => setExpandedPrompt(
                        expandedPrompt === `${promptData.platform}-${index}` 
                          ? null 
                          : `${promptData.platform}-${index}`
                      )}
                      className="text-purple-400 hover:text-purple-300 text-xs mt-2 font-medium"
                      whileHover={{ scale: 1.05 }}
                    >
                      {expandedPrompt === `${promptData.platform}-${index}` ? 'Show less' : 'Show more'}
                    </motion.button>
                  )}
                </div>
              </div>

              {promptData.negativePrompt && (
                <div>
                  <h4 className="text-red-300 font-medium mb-2 text-sm">Negative Prompt</h4>
                  <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                    <p className="text-red-200 text-sm leading-relaxed">
                      {promptData.negativePrompt}
                    </p>
                  </div>
                </div>
              )}

              {promptData.tips && (
                <div>
                  <h4 className="text-blue-300 font-medium mb-2 text-sm">Tips</h4>
                  <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-3">
                    <p className="text-blue-200 text-sm leading-relaxed">
                      {promptData.tips}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};