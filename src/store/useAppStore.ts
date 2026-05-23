import { create } from 'zustand'

interface AppState {
  user: any | null
  sidebarOpen: boolean
  setUser: (user: any | null) => void
  toggleSidebar: () => void
}

export const useAppStore = create<AppState>((set) => ({
  user: null,
  sidebarOpen: true,
  setUser: (user) => set({ user }),
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}))
