import React from 'react';
import { Heart, Coffee } from 'lucide-react';
import { motion } from 'framer-motion';

export const Footer: React.FC = () => {
  return (
    <motion.footer
      className="bg-slate-900 border-t border-purple-500/20 py-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <div className="container mx-auto px-6 text-center">
        <p className="text-gray-400">
          Made With Love <motion.span className="inline-block" animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 2 }}>
            <Heart className="w-4 h-4 text-red-500 inline-block align-middle" />
          </motion.span>
        </p>
        <p className="text-gray-400">
          <a href="https://saweria.co/ahmadsaoghi" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors duration-200">
            Buy coffee <Coffee className="w-4 h-4 text-yellow-500 inline-block align-middle" />
          </a>
        </p>
      </div>
    </motion.footer>
  );
};
