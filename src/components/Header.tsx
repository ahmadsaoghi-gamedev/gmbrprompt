import React from 'react';
import { Sparkles, Settings, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { LanguageToggle } from './LanguageToggle';
import { useTranslation } from '../hooks/useTranslation';

interface HeaderProps {
  onSettingsClick: () => void;
  onHelpClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onSettingsClick, onHelpClick }) => {
  const { t } = useTranslation();

  return (
    <motion.header 
      className="bg-gradient-to-r from-slate-900 via-purple-900 to-slate-900 border-b border-purple-500/20"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <motion.div 
            className="flex items-center space-x-3"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}
          >
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-600 rounded-xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                {t('app_title')}
              </h1>
              <p className="text-sm text-gray-400">
                {t('app_subtitle')}
              </p>
            </div>
          </motion.div>

          <div className="flex items-center space-x-4">
            <LanguageToggle />
            <motion.button
              onClick={onHelpClick}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={t('help')}
            >
              <HelpCircle className="w-5 h-5" />
            </motion.button>
            <motion.button
              onClick={onSettingsClick}
              className="p-2 text-gray-400 hover:text-white transition-colors duration-200 hover:bg-white/10 rounded-lg"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              title={t('settings')}
            >
              <Settings className="w-5 h-5" />
            </motion.button>
          </div>
        </div>
        <nav className="container mx-auto px-6 py-2">
          <ul className="flex items-center justify-center space-x-6">
            <li>
              <a href="https://www.youtube.com/channel/UCvJYzUyYWAtOFTad5Qu35mQ" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
                My Youtube Channel
              </a>
            </li>
            <li>
              <a href="https://www.tiktok.com/@scenecrafter" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
                My Tiktok
              </a>
            </li>
            <li>
              <a href="https://apps.apple.com/to/developer/hermizariafis/id1662246465" target="_blank" rel="noopener noreferrer" className="text-gray-300 hover:text-white transition-colors duration-200">
                My Playstore
              </a>
            </li>
          </ul>
        </nav>
      </div>
    </motion.header>
  );
};
