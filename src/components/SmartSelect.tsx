import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Plus, Search } from 'lucide-react';
import { useTranslation } from '../hooks/useTranslation';

interface SmartSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  placeholder: string;
  onAddCustom: () => void;
  searchable?: boolean;
}

export const SmartSelect: React.FC<SmartSelectProps> = ({
  value,
  onChange,
  options,
  placeholder,
  onAddCustom,
  searchable = true
}) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredOptions = searchable
    ? options.filter(option => 
        option.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : options;

  const handleSelect = (option: string) => {
    onChange(option);
    setIsOpen(false);
    setSearchTerm('');
  };

  return (
    <div className="relative">
      <motion.button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 bg-slate-800/50 border border-slate-600 rounded-lg text-white text-left flex items-center justify-between hover:border-purple-500/50 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-colors duration-200"
        whileHover={{ scale: 1.01 }}
      >
        <span className={value ? 'text-white' : 'text-gray-400'}>
          {value || placeholder}
        </span>
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="w-4 h-4 text-gray-400" />
        </motion.div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="absolute top-full left-0 right-0 mt-1 bg-slate-800 border border-slate-700 rounded-lg shadow-xl z-50 max-h-60 overflow-hidden"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {searchable && (
              <div className="p-2 border-b border-slate-700">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search options..."
                    className="w-full pl-9 pr-3 py-2 bg-slate-700/50 border border-slate-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                  />
                </div>
              </div>
            )}

            <div className="max-h-48 overflow-y-auto">
              <motion.button
                type="button"
                onClick={onAddCustom}
                className="w-full px-3 py-2 text-left text-purple-400 hover:bg-purple-500/10 flex items-center gap-2 border-b border-slate-700"
                whileHover={{ backgroundColor: 'rgba(147, 51, 234, 0.1)' }}
              >
                <Plus className="w-4 h-4" />
                {t('add_custom')}
              </motion.button>

              {filteredOptions.map((option, index) => (
                <motion.button
                  key={option}
                  type="button"
                  onClick={() => handleSelect(option)}
                  className="w-full px-3 py-2 text-left text-white hover:bg-slate-700/50 transition-colors duration-200"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.02 }}
                  whileHover={{ backgroundColor: 'rgba(51, 65, 85, 0.5)' }}
                >
                  {option}
                </motion.button>
              ))}

              {filteredOptions.length === 0 && searchTerm && (
                <div className="px-3 py-2 text-gray-400 text-sm">
                  No options found
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};