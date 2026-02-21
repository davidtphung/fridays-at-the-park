import { create } from 'zustand';

type Theme = 'dark' | 'light' | 'system';

interface ThemeState {
  theme: Theme;
  resolved: 'dark' | 'light';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  initTheme: () => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  theme: 'dark',
  resolved: 'dark',

  setTheme: (theme) => {
    const resolved = theme === 'system'
      ? (typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : theme;

    set({ theme, resolved });

    if (typeof window !== 'undefined') {
      localStorage.setItem('theme', theme);
      document.documentElement.classList.remove('dark', 'light');
      document.documentElement.classList.add(resolved);
    }
  },

  toggleTheme: () => {
    const { resolved } = get();
    get().setTheme(resolved === 'dark' ? 'light' : 'dark');
  },

  initTheme: () => {
    if (typeof window === 'undefined') return;

    const stored = localStorage.getItem('theme') as Theme | null;
    const theme = stored || 'dark';

    const resolved = theme === 'system'
      ? (window.matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark')
      : theme;

    set({ theme, resolved });
    document.documentElement.classList.remove('dark', 'light');
    document.documentElement.classList.add(resolved);
  },
}));
