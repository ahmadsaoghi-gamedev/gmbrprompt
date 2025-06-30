import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Wand2, Copy, Sparkles, Shuffle } from 'lucide-react';
import { PromptBuilderData, Platform, PromptWeights } from '../types';
import { SmartSelect } from './SmartSelect';
import { WeightSlider } from './WeightSlider';
import { CustomOptionModal } from './CustomOptionModal';
import { useTranslation } from '../hooks/useTranslation';
import { useCustomOptions } from '../hooks/useCustomOptions';
import { defaultOptions, negativePromptTemplates } from '../data/options';
import toast from 'react-hot-toast';

interface PromptBuilderProps {
  onPromptGenerated: (prompt: string, platform: Platform) => void;
  onPromptEnhance: (prompt: string, platform: Platform) => void;
  onVariationsGenerated?: (prompts: Array<{ platform: Platform; prompt: string; negativePrompt?: string }>) => void;
}

export const PromptBuilder: React.FC<PromptBuilderProps> = ({
  onPromptGenerated,
  onPromptEnhance,
  onVariationsGenerated
}) => {
  const { t, language } = useTranslation();
  const { customOptions, addCustomOption } = useCustomOptions();

  const [formData, setFormData] = useState<PromptBuilderData>({
    subject: '',
    action: '',
    setting: '',
    style: '',
    mood: '',
    lighting: '',
    cameraAngle: '',
    aspectRatio: '16:9',
    additionalDetails: '',
    negativePrompt: '',
    artMedium: '',
    resolution: '',
    quality: '',
    technical: '',
    camera: ''
  });

  const [weights, setWeights] = useState<PromptWeights>({
    subject: 1.0,
    style: 1.0,
    setting: 1.0,
    mood: 1.0,
    lighting: 1.0
  });

  const [selectedPlatform, setSelectedPlatform] = useState<Platform>('dalle3');
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [modalState, setModalState] = useState<{
    isOpen: boolean;
    category: keyof typeof customOptions;
    title: string;
  }>({ isOpen: false, category: 'styles', title: '' });

  const platforms = [
    { id: 'dalle3' as Platform, name: 'DALL-E 3', color: 'from-green-500 to-emerald-500' },
    { id: 'stable-diffusion' as Platform, name: 'Stable Diffusion', color: 'from-blue-500 to-indigo-500' },
    { id: 'midjourney' as Platform, name: 'Midjourney', color: 'from-purple-500 to-pink-500' },
    { id: 'bing' as Platform, name: 'Bing AI', color: 'from-orange-500 to-red-500' },
    { id: 'firefly' as Platform, name: 'Adobe Firefly', color: 'from-yellow-500 to-orange-500' }
  ];

  const getOptions = (category: string) => {
    const baseOptions = language === 'id' ? 
      (defaultOptions as any)[category + 'Id'] || (defaultOptions as any)[category] :
      (defaultOptions as any)[category];
    
    const customOpts = customOptions[category as keyof typeof customOptions] || [];
    return [...customOpts, ...baseOptions];
  };

  const handleInputChange = (field: keyof PromptBuilderData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleWeightChange = (field: keyof PromptWeights, value: number) => {
    setWeights(prev => ({ ...prev, [field]: value }));
  };

  const openCustomModal = (category: keyof typeof customOptions, title: string) => {
    setModalState({ isOpen: true, category, title });
  };

  const handleAddCustomOption = (option: string) => {
    addCustomOption(modalState.category, option);
    toast.success(t('custom_option_added'));
  };

  const applyNegativeTemplate = (template: string) => {
    setFormData(prev => ({
      ...prev,
      negativePrompt: prev.negativePrompt ? `${prev.negativePrompt}, ${template}` : template
    }));
  };

  const generatePrompt = () => {
    const elements = [];
    
    // Apply weights to elements
    if (formData.subject) {
      const weightedSubject = weights.subject !== 1.0 ? 
        `(${formData.subject}:${weights.subject.toFixed(1)})` : 
        formData.subject;
      elements.push(weightedSubject);
    }
    
    if (formData.action) elements.push(formData.action);
    if (formData.setting) {
      const weightedSetting = weights.setting !== 1.0 ? 
        `(in ${formData.setting}:${weights.setting.toFixed(1)})` : 
        `in ${formData.setting}`;
      elements.push(weightedSetting);
    }
    
    if (formData.style) {
      const weightedStyle = weights.style !== 1.0 ? 
        `(${formData.style} style:${weights.style.toFixed(1)})` : 
        `${formData.style} style`;
      elements.push(weightedStyle);
    }
    
    if (formData.mood) {
      const weightedMood = weights.mood !== 1.0 ? 
        `(${formData.mood} atmosphere:${weights.mood.toFixed(1)})` : 
        `${formData.mood} atmosphere`;
      elements.push(weightedMood);
    }
    
    if (formData.lighting) {
      const weightedLighting = weights.lighting !== 1.0 ? 
        `(${formData.lighting}:${weights.lighting.toFixed(1)})` : 
        formData.lighting;
      elements.push(weightedLighting);
    }
    
    if (formData.cameraAngle) elements.push(`${formData.cameraAngle}`);
    if (formData.artMedium) elements.push(`${formData.artMedium} medium`);
    if (formData.resolution) elements.push(formData.resolution);
    if (formData.quality) elements.push(formData.quality);
    if (formData.technical) elements.push(formData.technical);
    if (formData.camera) elements.push(`${formData.camera} photography`);
    if (formData.additionalDetails) elements.push(formData.additionalDetails);

    let prompt = elements.join(', ');

    // Platform-specific enhancements
    switch (selectedPlatform) {
      case 'stable-diffusion':
        prompt += ', highly detailed, professional photography, 8k, high quality, masterpiece';
        break;
      case 'midjourney':
        prompt += ` --ar ${formData.aspectRatio} --v 6 --style raw`;
        break;
      case 'dalle3':
        prompt = `Create a detailed ${formData.style} image showing ${prompt}`;
        break;
    }

    setGeneratedPrompt(prompt);
    onPromptGenerated(prompt, selectedPlatform);
  };

  const generateVariations = async () => {
    if (!generatedPrompt) {
      generatePrompt();
      return;
    }

    const variations = [];
    const platforms: Platform[] = ['dalle3', 'stable-diffusion', 'midjourney'];
    
    for (const platform of platforms) {
      // Create platform-specific variations
      let variation = generatedPrompt;
      
      switch (platform) {
        case 'stable-diffusion':
          variation = variation.replace(/Create a detailed.*?showing /, '');
          variation += ', highly detailed, professional photography, 8k, high quality, masterpiece';
          break;
        case 'midjourney':
          variation = variation.replace(/Create a detailed.*?showing /, '');
          variation += ` --ar ${formData.aspectRatio} --v 6 --style raw`;
          break;
        case 'dalle3':
          if (!variation.startsWith('Create a detailed')) {
            variation = `Create a detailed image showing ${variation}`;
          }
          break;
      }

      variations.push({
        platform,
        prompt: variation,
        negativePrompt: formData.negativePrompt || undefined
      });
    }

    if (onVariationsGenerated) {
      onVariationsGenerated(variations);
      toast.success(t('variations_generated'));
    }
  };

  const copyToClipboard = async () => {
    if (!generatedPrompt) return;
    
    try {
      const fullPrompt = formData.negativePrompt 
        ? `${generatedPrompt}\n\nNegative Prompt: ${formData.negativePrompt}`
        : generatedPrompt;
      await navigator.clipboard.writeText(fullPrompt);
      toast.success(t('prompt_copied'));
    } catch (error) {
      toast.error(t('copy_failed'));
    }
  };

  const enhancePrompt = () => {
    if (!generatedPrompt) return;
    onPromptEnhance(generatedPrompt, selectedPlatform);
  };

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2 mb-6">
        <Wand2 className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">{t('prompt_builder')}</h2>
      </div>

      {/* Platform Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-3">
          {t('target_platform')}
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {platforms.map((platform) => (
            <motion.button
              key={platform.id}
              onClick={() => setSelectedPlatform(platform.id)}
              className={`
                p-3 rounded-lg text-sm font-medium transition-all duration-200
                ${selectedPlatform === platform.id
                  ? `bg-gradient-to-r ${platform.color} text-white shadow-lg`
                  : 'bg-slate-800/50 text-gray-300 hover:bg-slate-700/50'
                }
              `}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {platform.name}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Form Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('subject')}
          </label>
          <input
            type="text"
            value={formData.subject}
            onChange={(e) => handleInputChange('subject', e.target.value)}
            placeholder={t('subject_placeholder')}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('action')}
          </label>
          <input
            type="text"
            value={formData.action}
            onChange={(e) => handleInputChange('action', e.target.value)}
            placeholder={t('action_placeholder')}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('setting')}
          </label>
          <input
            type="text"
            value={formData.setting}
            onChange={(e) => handleInputChange('setting', e.target.value)}
            placeholder={t('setting_placeholder')}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('style')}
          </label>
          <SmartSelect
            value={formData.style}
            onChange={(value) => handleInputChange('style', value)}
            options={getOptions('styles')}
            placeholder={t('select_style')}
            onAddCustom={() => openCustomModal('styles', t('style'))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('mood')}
          </label>
          <SmartSelect
            value={formData.mood}
            onChange={(value) => handleInputChange('mood', value)}
            options={getOptions('moods')}
            placeholder={t('select_mood')}
            onAddCustom={() => openCustomModal('moods', t('mood'))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('lighting')}
          </label>
          <SmartSelect
            value={formData.lighting}
            onChange={(value) => handleInputChange('lighting', value)}
            options={getOptions('lighting')}
            placeholder={t('select_lighting')}
            onAddCustom={() => openCustomModal('lighting', t('lighting'))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('camera_angle')}
          </label>
          <SmartSelect
            value={formData.cameraAngle}
            onChange={(value) => handleInputChange('cameraAngle', value)}
            options={getOptions('cameraAngles')}
            placeholder={t('select_angle')}
            onAddCustom={() => openCustomModal('cameraAngles', t('camera_angle'))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('art_medium')}
          </label>
          <SmartSelect
            value={formData.artMedium}
            onChange={(value) => handleInputChange('artMedium', value)}
            options={getOptions('artMediums')}
            placeholder={t('select_medium')}
            onAddCustom={() => openCustomModal('artMediums', t('art_medium'))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('resolution')}
          </label>
          <SmartSelect
            value={formData.resolution}
            onChange={(value) => handleInputChange('resolution', value)}
            options={getOptions('resolutions')}
            placeholder={t('select_resolution')}
            onAddCustom={() => openCustomModal('resolutions', t('resolution'))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('quality')}
          </label>
          <SmartSelect
            value={formData.quality}
            onChange={(value) => handleInputChange('quality', value)}
            options={getOptions('qualities')}
            placeholder={t('select_quality')}
            onAddCustom={() => openCustomModal('qualities', t('quality'))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('technical')}
          </label>
          <SmartSelect
            value={formData.technical}
            onChange={(value) => handleInputChange('technical', value)}
            options={getOptions('technical')}
            placeholder={t('select_technical')}
            onAddCustom={() => openCustomModal('technical', t('technical'))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('camera')}
          </label>
          <SmartSelect
            value={formData.camera}
            onChange={(value) => handleInputChange('camera', value)}
            options={getOptions('cameras')}
            placeholder={t('select_camera')}
            onAddCustom={() => openCustomModal('cameras', t('camera'))}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">
            {t('aspect_ratio')}
          </label>
          <select
            value={formData.aspectRatio}
            onChange={(e) => handleInputChange('aspectRatio', e.target.value)}
            className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
          >
            <option value="1:1">Square (1:1)</option>
            <option value="4:3">Standard (4:3)</option>
            <option value="16:9">Widescreen (16:9)</option>
            <option value="9:16">Portrait (9:16)</option>
            <option value="21:9">Ultrawide (21:9)</option>
          </select>
        </div>
      </div>

      {/* Weights Section */}
      <div className="bg-gradient-to-br from-slate-800/30 to-slate-900/30 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4">
        <h3 className="text-white font-medium mb-4 flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          {t('weights')}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <WeightSlider
            label={t('subject_weight')}
            value={weights.subject}
            onChange={(value) => handleWeightChange('subject', value)}
          />
          <WeightSlider
            label={t('style_weight')}
            value={weights.style}
            onChange={(value) => handleWeightChange('style', value)}
          />
          <WeightSlider
            label={t('setting_weight')}
            value={weights.setting}
            onChange={(value) => handleWeightChange('setting', value)}
          />
          <WeightSlider
            label={t('mood_weight')}
            value={weights.mood}
            onChange={(value) => handleWeightChange('mood', value)}
          />
          <WeightSlider
            label={t('lighting_weight')}
            value={weights.lighting}
            onChange={(value) => handleWeightChange('lighting', value)}
          />
        </div>
      </div>

      {/* Additional Details */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('additional_details')}
        </label>
        <textarea
          value={formData.additionalDetails}
          onChange={(e) => handleInputChange('additionalDetails', e.target.value)}
          placeholder={t('details_placeholder')}
          rows={3}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
      </div>

      {/* Negative Prompt Section */}
      <div>
        <label className="block text-sm font-medium text-gray-300 mb-2">
          {t('negative_prompt')}
        </label>
        <textarea
          value={formData.negativePrompt}
          onChange={(e) => handleInputChange('negativePrompt', e.target.value)}
          placeholder={t('negative_placeholder')}
          rows={2}
          className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
        />
        
        {/* Negative Prompt Templates */}
        <div className="flex flex-wrap gap-2 mt-2">
          {(language === 'id' ? negativePromptTemplates.commonId : negativePromptTemplates.common).map((template, index) => (
            <motion.button
              key={index}
              onClick={() => applyNegativeTemplate(template)}
              className="text-xs px-2 py-1 bg-red-500/20 text-red-300 rounded border border-red-500/30 hover:bg-red-500/30 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {template}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3">
        <motion.button
          onClick={generatePrompt}
          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white py-3 px-4 rounded-lg font-medium hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Wand2 className="w-4 h-4" />
          {t('generate_prompt')}
        </motion.button>
        
        <motion.button
          onClick={generateVariations}
          className="px-4 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg font-medium hover:from-indigo-600 hover:to-purple-600 transition-all duration-200 flex items-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <Shuffle className="w-4 h-4" />
          {t('generate_variations')}
        </motion.button>
      </div>

      {generatedPrompt && (
        <motion.div
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-4"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-white font-medium">{t('generated_prompt')}</h3>
            <div className="flex gap-2">
              <motion.button
                onClick={enhancePrompt}
                className="p-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Enhance with AI"
              >
                <Sparkles className="w-4 h-4" />
              </motion.button>
              <motion.button
                onClick={copyToClipboard}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Copy to clipboard"
              >
                <Copy className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
          <p className="text-gray-300 text-sm leading-relaxed">{generatedPrompt}</p>
          
          {formData.negativePrompt && (
            <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
              <h4 className="text-red-300 font-medium mb-1 text-sm">{t('negative_prompt')}</h4>
              <p className="text-red-200 text-sm">{formData.negativePrompt}</p>
            </div>
          )}
        </motion.div>
      )}

      <CustomOptionModal
        isOpen={modalState.isOpen}
        onClose={() => setModalState(prev => ({ ...prev, isOpen: false }))}
        onAdd={handleAddCustomOption}
        title={modalState.title}
      />
    </motion.div>
  );
};