import React from 'react';
import { motion } from 'framer-motion';
import { Eye, Palette, Lightbulb, Camera, Sparkles } from 'lucide-react';
import { ImageAnalysis } from '../types';

interface AnalysisResultsProps {
  analysis: ImageAnalysis;
}

export const AnalysisResults: React.FC<AnalysisResultsProps> = ({ analysis }) => {
  const analysisItems = [
    {
      icon: Eye,
      title: 'Objects & Subjects',
      content: analysis.objects.join(', '),
      color: 'text-blue-400'
    },
    {
      icon: Camera,
      title: 'Scene & Setting',
      content: analysis.scene,
      color: 'text-green-400'
    },
    {
      icon: Palette,
      title: 'Colors',
      content: analysis.colors.join(', '),
      color: 'text-pink-400'
    },
    {
      icon: Lightbulb,
      title: 'Lighting & Mood',
      content: `${analysis.lighting} • ${analysis.mood}`,
      color: 'text-yellow-400'
    },
    {
      icon: Sparkles,
      title: 'Style & Composition',
      content: `${analysis.style} • ${analysis.composition}`,
      color: 'text-purple-400'
    }
  ];

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, staggerChildren: 0.1 }}
    >
      <h3 className="text-lg font-semibold text-white mb-4">Analysis Results</h3>
      
      {analysisItems.map((item, index) => (
        <motion.div
          key={item.title}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-start gap-3">
            <div className={`p-2 rounded-lg bg-slate-800/50 ${item.color}`}>
              <item.icon className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white mb-1">{item.title}</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{item.content}</p>
            </div>
          </div>
        </motion.div>
      ))}

      {analysis.technicalDetails && (
        <motion.div
          className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm border border-indigo-500/20 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-indigo-500/20 text-indigo-400">
              <Camera className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <h4 className="font-medium text-white mb-1">Technical Details</h4>
              <p className="text-gray-300 text-sm leading-relaxed">{analysis.technicalDetails}</p>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};