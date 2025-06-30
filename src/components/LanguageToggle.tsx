import React from 'react';
import { motion } from 'framer-motion';
import { Globe } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';
import { Language } from '../types';

export const LanguageToggle: React.FC = () => {
  const { language, changeLanguage } = useTranslation();

  const toggleLanguage = () => {
    changeLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <motion.button
      onClick={toggleLanguage}
      className="flex items-center gap-2 p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      title={language === 'en' ? 'Switch to Indonesian' : 'Beralih ke Bahasa Inggris'}
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {language === 'en' ? 'ID' : 'EN'}
      </span>
    </motion.button>
  );
};