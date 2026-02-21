'use client';

import { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { motion } from 'framer-motion';

export function ThemeToggle() {
  const { resolved, toggleTheme, initTheme } = useThemeStore();

  useEffect(() => {
    initTheme();
  }, [initTheme]);

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg text-text-secondary hover:text-text-primary hover:bg-bg-tertiary transition-colors min-w-[44px] min-h-[44px] flex items-center justify-center"
      aria-label={`Switch to ${resolved === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        key={resolved}
        initial={{ rotate: -90, opacity: 0 }}
        animate={{ rotate: 0, opacity: 1 }}
        transition={{ duration: 0.2 }}
      >
        {resolved === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
      </motion.div>
    </button>
  );
}
