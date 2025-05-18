import { create } from 'zustand'
import { devtools } from 'zustand/middleware';


const useThemeStore = create(
  devtools((set) => ({
    theme: 'light',
    toggleTheme: () => set((state) => ({
      theme: state.theme === 'light' ? 'dark' : 'light',
    })),
  })));

export default useThemeStore;
