import { create } from 'zustand';

interface UIState {
  isSidebarOpen: boolean;
  isMobileSidebarOpen: boolean;
  isNotificationsOpen: boolean;
  isCommandPaletteOpen: boolean;
  
  toggleSidebar: () => void;
  setMobileSidebar: (isOpen: boolean) => void;
  toggleNotifications: () => void;
  setNotifications: (isOpen: boolean) => void;
  toggleCommandPalette: () => void;
  setCommandPalette: (isOpen: boolean) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isSidebarOpen: false, 
  isMobileSidebarOpen: false,
  isNotificationsOpen: false,
  isCommandPaletteOpen: false,
  
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })),
  setMobileSidebar: (isOpen) => set({ isMobileSidebarOpen: isOpen }),
  toggleNotifications: () => set((state) => ({ isNotificationsOpen: !state.isNotificationsOpen })),
  setNotifications: (isOpen) => set({ isNotificationsOpen: isOpen }),
  toggleCommandPalette: () => set((state) => ({ isCommandPaletteOpen: !state.isCommandPaletteOpen })),
  setCommandPalette: (isOpen) => set({ isCommandPaletteOpen: isOpen }),
}));
