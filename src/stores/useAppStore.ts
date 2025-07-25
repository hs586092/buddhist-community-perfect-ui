import { create } from 'zustand'
import { devtools, persist, subscribeWithSelector } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

interface User {
  id: string
  name: string
  email: string
  avatar?: string
  role: 'user' | 'admin' | 'moderator'
}

interface AppState {
  // UI State
  theme: 'light' | 'dark' | 'system'
  sidebarOpen: boolean
  loading: boolean
  
  // User State
  user: User | null
  isAuthenticated: boolean
  
  // Notifications
  notifications: Array<{
    id: string
    type: 'info' | 'success' | 'warning' | 'error'
    message: string
    timestamp: number
    read: boolean
  }>
  
  // Settings
  settings: {
    notifications: boolean
    autoSave: boolean
    language: string
  }
}

interface AppActions {
  // UI Actions
  setTheme: (theme: AppState['theme']) => void
  toggleSidebar: () => void
  setSidebarOpen: (open: boolean) => void
  setLoading: (loading: boolean) => void
  
  // User Actions
  setUser: (user: User | null) => void
  login: (user: User) => void
  logout: () => void
  
  // Notification Actions
  addNotification: (notification: Omit<AppState['notifications'][0], 'id' | 'timestamp' | 'read'>) => void
  removeNotification: (id: string) => void
  markNotificationRead: (id: string) => void
  clearNotifications: () => void
  
  // Settings Actions
  updateSettings: (settings: Partial<AppState['settings']>) => void
  
  // Reset
  reset: () => void
}

type AppStore = AppState & AppActions

const initialState: AppState = {
  // UI State
  theme: 'system',
  sidebarOpen: false,
  loading: false,
  
  // User State
  user: null,
  isAuthenticated: false,
  
  // Notifications
  notifications: [],
  
  // Settings
  settings: {
    notifications: true,
    autoSave: true,
    language: 'en',
  },
}

export const useAppStore = create<AppStore>()(
  devtools(
    persist(
      subscribeWithSelector(
        immer((set, _get) => ({
          ...initialState,

          // UI Actions
          setTheme: (theme) =>
            set((state) => {
              state.theme = theme
            }),

          toggleSidebar: () =>
            set((state) => {
              state.sidebarOpen = !state.sidebarOpen
            }),

          setSidebarOpen: (open) =>
            set((state) => {
              state.sidebarOpen = open
            }),

          setLoading: (loading) =>
            set((state) => {
              state.loading = loading
            }),

          // User Actions
          setUser: (user) =>
            set((state) => {
              state.user = user
              state.isAuthenticated = !!user
            }),

          login: (user) =>
            set((state) => {
              state.user = user
              state.isAuthenticated = true
            }),

          logout: () =>
            set((state) => {
              state.user = null
              state.isAuthenticated = false
            }),

          // Notification Actions
          addNotification: (notification) =>
            set((state) => {
              state.notifications.push({
                ...notification,
                id: crypto.randomUUID(),
                timestamp: Date.now(),
                read: false,
              })
            }),

          removeNotification: (id) =>
            set((state) => {
              state.notifications = state.notifications.filter((n) => n.id !== id)
            }),

          markNotificationRead: (id) =>
            set((state) => {
              const notification = state.notifications.find((n) => n.id === id)
              if (notification) {
                notification.read = true
              }
            }),

          clearNotifications: () =>
            set((state) => {
              state.notifications = []
            }),

          // Settings Actions
          updateSettings: (settings) =>
            set((state) => {
              Object.assign(state.settings, settings)
            }),

          // Reset
          reset: () => set(initialState),
        }))
      ),
      {
        name: 'app-store',
        partialize: (state) => ({
          theme: state.theme,
          settings: state.settings,
        }),
      }
    ),
    {
      name: 'app-store',
    }
  )
)

// Selectors for optimized subscriptions
export const useTheme = () => useAppStore((state) => state.theme)
export const useUser = () => useAppStore((state) => state.user)
export const useIsAuthenticated = () => useAppStore((state) => state.isAuthenticated)
export const useNotifications = () => useAppStore((state) => state.notifications)
export const useSettings = () => useAppStore((state) => state.settings)