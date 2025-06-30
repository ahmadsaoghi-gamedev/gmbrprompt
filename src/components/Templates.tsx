import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { BookTemplate as Template, Copy, Star } from 'lucide-react';
import { promptTemplates, getAllCategories } from '../data/templates';
import { PromptTemplate } from '../types';
import { useTranslation } from '../hooks/useTranslation';
import toast from 'react-hot-toast';

interface TemplatesProps {
  onTemplateSelect: (template: PromptTemplate) => void;
}

export const Templates: React.FC<TemplatesProps> = ({ onTemplateSelect }) => {
  const { t } = useTranslation();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const categories = ['All', ...getAllCategories()];

  const filteredTemplates = selectedCategory === 'All' 
    ? promptTemplates 
    : promptTemplates.filter(template => template.category === selectedCategory);

  const copyPrompt = async (prompt: string, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(prompt);
      toast.success(t('prompt_copied'));
    } catch (error) {
      toast.error(t('copy_failed'));
    }
  };

  const getCategoryTranslation = (category: string) => {
    const categoryMap: { [key: string]: string } = {
      'All': t('all'),
      'YouTube': t('youtube'),
      'Music': t('music'),
      'Social Media': t('social_media'),
      'Marketing': t('marketing'),
      'Content': t('content'),
      'Indonesian': t('indonesian'),
      'E-commerce': t('ecommerce'),
      'Real Estate': t('real_estate'),
      'Food & Culinary': t('food'),
      'Fashion & Beauty': t('fashion'),
      'Corporate': t('corporate'),
      'Events': t('events'),
      'Travel & Tourism': t('travel')
    };
    return categoryMap[category] || category;
  };

  return (
    <motion.div
      className="space-y-4"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Template className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">{t('templates')}</h2>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((category) => (
          <motion.button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200
              ${selectedCategory === category
                ? 'bg-gradient-to-r from-purple-500 to-blue-500 text-white'
                : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
              }
            `}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {getCategoryTranslation(category)}
          </motion.button>
        ))}
      </div>

      {/* Templates Grid */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {filteredTemplates.map((template, index) => (
          <motion.div
            key={template.id}
            className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4 cursor-pointer hover:border-purple-500/30 transition-colors duration-200"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onTemplateSelect(template)}
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-start justify-between mb-2">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-medium text-white text-sm">{template.name}</h3>
                  <span className="text-xs px-2 py-0.5 bg-purple-500/20 text-purple-300 rounded-full">
                    {getCategoryTranslation(template.category)}
                  </span>
                </div>
                <p className="text-gray-400 text-xs mb-2">{template.description}</p>
              </div>
              
              <motion.button
                onClick={(e) => copyPrompt(template.prompt, e)}
                className="p-1.5 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={t('copy_prompt')}
              >
                <Copy className="w-3 h-3" />
              </motion.button>
            </div>

            <div className="text-xs text-gray-500 line-clamp-2 mb-2">
              {template.prompt}
            </div>

            <div className="flex flex-wrap gap-1">
              {template.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="text-xs px-1.5 py-0.5 bg-slate-700/50 text-gray-400 rounded"
                >
                  {tag}
                </span>
              ))}
              {template.tags.length > 3 && (
                <span className="text-xs px-1.5 py-0.5 bg-slate-700/50 text-gray-400 rounded">
                  +{template.tags.length - 3}
                </span>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-8 text-gray-400">
          <Template className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p>No templates found for this category</p>
        </div>
      )}
    </motion.div>
  );
};