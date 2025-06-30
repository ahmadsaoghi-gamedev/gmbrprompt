import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { History, Copy, Trash2, Download, Eye } from 'lucide-react';
import { GeneratedPrompt } from '../types';
import toast from 'react-hot-toast';

interface PromptHistoryProps {
  prompts: GeneratedPrompt[];
  onClearHistory: () => void;
  onDeletePrompt: (id: string) => void;
}

export const PromptHistory: React.FC<PromptHistoryProps> = ({
  prompts,
  onClearHistory,
  onDeletePrompt
}) => {
  const copyPrompt = async (prompt: string) => {
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success('Prompt copied to clipboard!');
    } catch (error) {
      toast.error('Failed to copy prompt');
    }
  };

  const exportHistory = () => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'prompt-history.json';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    toast.success('History exported successfully!');
  };

  const formatTimestamp = (timestamp: Date) => {
    return new Date(timestamp).toLocaleString();
  };

  const getPlatformColor = (platform: string) => {
    const colors = {
      'dalle3': 'from-green-500 to-emerald-500',
      'stable-diffusion': 'from-blue-500 to-indigo-500',
      'midjourney': 'from-purple-500 to-pink-500',
      'bing': 'from-orange-500 to-red-500',
      'firefly': 'from-yellow-500 to-orange-500'
    };
    return colors[platform as keyof typeof colors] || 'from-gray-500 to-gray-600';
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
          <History className="w-5 h-5 text-purple-400" />
          <h2 className="text-lg font-semibold text-white">History</h2>
          <span className="text-sm text-gray-400">({prompts.length})</span>
        </div>
        
        {prompts.length > 0 && (
          <div className="flex gap-2">
            <motion.button
              onClick={exportHistory}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/10 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Export history"
            >
              <Download className="w-4 h-4" />
            </motion.button>
            <motion.button
              onClick={onClearHistory}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title="Clear history"
            >
              <Trash2 className="w-4 h-4" />
            </motion.button>
          </div>
        )}
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        <AnimatePresence>
          {prompts.map((promptItem, index) => (
            <motion.div
              key={promptItem.id}
              className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ delay: index * 0.05 }}
              layout
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  <span className={`text-xs px-2 py-1 bg-gradient-to-r ${getPlatformColor(promptItem.platform)} text-white rounded-full font-medium`}>
                    {promptItem.platform.toUpperCase()}
                  </span>
                  <span className="text-xs text-gray-400">
                    {formatTimestamp(promptItem.timestamp)}
                  </span>
                </div>
                
                <div className="flex gap-1">
                  <motion.button
                    onClick={() => copyPrompt(promptItem.prompt)}
                    className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Copy prompt"
                  >
                    <Copy className="w-3 h-3" />
                  </motion.button>
                  <motion.button
                    onClick={() => onDeletePrompt(promptItem.id)}
                    className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition-colors duration-200"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                    title="Delete prompt"
                  >
                    <Trash2 className="w-3 h-3" />
                  </motion.button>
                </div>
              </div>

              <p className="text-gray-300 text-sm leading-relaxed line-clamp-3 mb-2">
                {promptItem.prompt}
              </p>

              {promptItem.negativePrompt && (
                <div className="mt-2 p-2 bg-red-500/10 border border-red-500/20 rounded">
                  <p className="text-red-300 text-xs">
                    <strong>Negative:</strong> {promptItem.negativePrompt}
                  </p>
                </div>
              )}

              {promptItem.sourceImage && (
                <div className="mt-2 flex items-center gap-2 text-xs text-gray-400">
                  <Eye className="w-3 h-3" />
                  <span>Generated from image analysis</span>
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {prompts.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <History className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No prompts generated yet</p>
          <p className="text-sm mt-1">Your generated prompts will appear here</p>
        </div>
      )}
    </motion.div>
  );
};