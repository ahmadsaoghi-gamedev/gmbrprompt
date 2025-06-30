import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Plus } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface CustomOptionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (option: string) => void;
  title: string;
}

export const CustomOptionModal: React.FC<CustomOptionModalProps> = ({
  isOpen,
  onClose,
  onAdd,
  title
}) => {
  const { t } = useTranslation();
  const [customOption, setCustomOption] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customOption.trim()) {
      onAdd(customOption.trim());
      setCustomOption('');
      onClose();
    }
  };

  const handleClose = () => {
    setCustomOption('');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 rounded-xl p-6 w-full max-w-md"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">
                {t('add_custom')} {title}
              </h3>
              <motion.button
                onClick={handleClose}
                className="p-2 text-gray-400 hover:text-white hover:bg-gray-700/50 rounded-lg transition-colors duration-200"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  {t('custom_option')}
                </label>
                <input
                  type="text"
                  value={customOption}
                  onChange={(e) => setCustomOption(e.target.value)}
                  placeholder={t('custom_placeholder')}
                  className="w-full px-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  autoFocus
                />
              </div>

              <div className="flex gap-3">
                <motion.button
                  type="button"
                  onClick={handleClose}
                  className="flex-1 px-4 py-2 bg-slate-700 text-gray-300 rounded-lg hover:bg-slate-600 transition-colors duration-200"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {t('cancel')}
                </motion.button>
                <motion.button
                  type="submit"
                  className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 transition-all duration-200 flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={!customOption.trim()}
                >
                  <Plus className="w-4 h-4" />
                  {t('add_option')}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};