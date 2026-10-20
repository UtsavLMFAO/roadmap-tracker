import React, { createContext, useContext, useState, useEffect, useCallback } from 'react'
import {
  RoadmapTask,
  Milestone,
  StudySession,
  AppSettings,
  ActiveTimerState,
  StudyCategory
} from '../types'
import { db, initializeDatabase } from '../db'
import { DEFAULT_SETTINGS } from '../data/seedData'

export type AppScreen =
  | 'today'
  | 'roadmap'
  | 'progress'
  | 'journal'
  | 'projects'
  | 'resources'
  | 'algorithms'
  | 'applications'
  | 'settings'
  | 'weekly-review'

interface ToastMessage {
  id: string
  message: string
  type?: 'info' | 'success' | 'warning'
}

interface AppContextValue {
  currentScreen: AppScreen
  setCurrentScreen: (screen: AppScreen) => void
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void
  dbReady: boolean
  dbError: string | null
  settings: AppSettings
  updateSettings: (newSettings: Partial<AppSettings>) => Promise<void>
  
  // Timer state
  timerState: ActiveTimerState
  startTimer: (category?: StudyCategory, taskId?: string) => void
  pauseTimer: () => void
  resetTimer: () => void
  getTimerElapsedSeconds: () => number

  // Modal controls
  taskModal: {
    isOpen: boolean
    taskId?: string
    defaultValues?: Partial<RoadmapTask>
  }
  openTaskModal: (taskId?: string, defaultValues?: Partial<RoadmapTask>) => void
  closeTaskModal: () => void

  logSessionModal: {
    isOpen: boolean
    defaultValues?: Partial<StudySession>
  }
  openLogSessionModal: (defaultValues?: Partial<StudySession>) => void
  closeLogSessionModal: () => void

  milestoneModal: {
    isOpen: boolean
    milestone?: Milestone
  }
  openMilestoneModal: (milestone: Milestone) => void
  closeMilestoneModal: () => void

  chooseTaskModal: {
    isOpen: boolean
  }
  openChooseTaskModal: () => void
  closeChooseTaskModal: () => void

  // Toast notifications
  toast: ToastMessage | null
  showToast: (message: string, type?: 'info' | 'success' | 'warning') => void
}

const AppContext = createContext<AppContextValue | null>(null)

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('today')
  const [isDrawerOpen, setIsDrawerOpen] = useState(false)
  const [dbReady, setDbReady] = useState(false)
  const [dbError, setDbError] = useState<string | null>(null)
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS)
  const [toast, setToast] = useState<ToastMessage | null>(null)

  // Timer
  const [timerState, setTimerState] = useState<ActiveTimerState>({
    isRunning: false,
    startEpochMs: 0,
    accumulatedSeconds: 0,
    category: 'Learning'
  })

  // Modals
  const [taskModal, setTaskModal] = useState<{
    isOpen: boolean
    taskId?: string
    defaultValues?: Partial<RoadmapTask>
  }>({ isOpen: false })

  const [logSessionModal, setLogSessionModal] = useState<{
    isOpen: boolean
    defaultValues?: Partial<StudySession>
  }>({ isOpen: false })

  const [milestoneModal, setMilestoneModal] = useState<{
    isOpen: boolean
    milestone?: Milestone
  }>({ isOpen: false })

  const [chooseTaskModal, setChooseTaskModal] = useState({ isOpen: false })

  // Initialize DB
  useEffect(() => {
    let isMounted = true
    async function init() {
      try {
        const success = await initializeDatabase()
        if (!success) {
          if (isMounted) setDbError('IndexedDB is not supported or accessible in this browser environment.')
          return
        }
        const savedSettings = await db.settings.get('settings')
        if (savedSettings && isMounted) {
          setSettings(savedSettings)
          if (savedSettings.activeTimer) {
            setTimerState(savedSettings.activeTimer)
          }
        }
        if (isMounted) setDbReady(true)
      } catch (err) {
        if (isMounted) setDbError(err instanceof Error ? err.message : 'Unknown database initialization error')
      }
    }
    init()
    return () => { isMounted = false }
  }, [])

  // Theme application
  useEffect(() => {
    const root = document.documentElement
    const isDark =
      settings.theme === 'dark' ||
      (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)

    if (isDark) {
      root.classList.add('dark')
    } else {
      root.classList.remove('dark')
    }
  }, [settings.theme])

  // Update Settings
  const updateSettings = async (newSettings: Partial<AppSettings>) => {
    const updated = { ...settings, ...newSettings }
    setSettings(updated)
    await db.settings.put(updated)
  }

  // Toast notification helper
  const showToast = useCallback((message: string, type: 'info' | 'success' | 'warning' = 'info') => {
    const id = Math.random().toString()
    setToast({ id, message, type })
    setTimeout(() => {
      setToast(prev => (prev?.id === id ? null : prev))
    }, 3200)
  }, [])

  // Timer helpers
  const getTimerElapsedSeconds = useCallback(() => {
    if (!timerState.isRunning) {
      return timerState.accumulatedSeconds
    }
    const elapsedSinceStart = Math.floor((Date.now() - timerState.startEpochMs) / 1000)
    return timerState.accumulatedSeconds + Math.max(0, elapsedSinceStart)
  }, [timerState])

  const startTimer = (category: StudyCategory = 'Learning', taskId?: string) => {
    const newState: ActiveTimerState = {
      isRunning: true,
      startEpochMs: Date.now(),
      accumulatedSeconds: timerState.accumulatedSeconds,
      category,
      taskId: taskId || timerState.taskId
    }
    setTimerState(newState)
    updateSettings({ activeTimer: newState })
  }

  const pauseTimer = () => {
    const totalElapsed = getTimerElapsedSeconds()
    const newState: ActiveTimerState = {
      ...timerState,
      isRunning: false,
      startEpochMs: 0,
      accumulatedSeconds: totalElapsed
    }
    setTimerState(newState)
    updateSettings({ activeTimer: newState })
  }

  const resetTimer = () => {
    const newState: ActiveTimerState = {
      isRunning: false,
      startEpochMs: 0,
      accumulatedSeconds: 0,
      category: 'Learning',
      taskId: undefined
    }
    setTimerState(newState)
    updateSettings({ activeTimer: newState })
  }

  // Modal openers
  const openTaskModal = (taskId?: string, defaultValues?: Partial<RoadmapTask>) => {
    setTaskModal({ isOpen: true, taskId, defaultValues })
  }
  const closeTaskModal = () => setTaskModal({ isOpen: false })

  const openLogSessionModal = (defaultValues?: Partial<StudySession>) => {
    setLogSessionModal({ isOpen: true, defaultValues })
  }
  const closeLogSessionModal = () => setLogSessionModal({ isOpen: false })

  const openMilestoneModal = (milestone: Milestone) => {
    setMilestoneModal({ isOpen: true, milestone })
  }
  const closeMilestoneModal = () => setMilestoneModal({ isOpen: false })

  const openChooseTaskModal = () => setChooseTaskModal({ isOpen: true })
  const closeChooseTaskModal = () => setChooseTaskModal({ isOpen: false })

  return (
    <AppContext.Provider
      value={{
        currentScreen,
        setCurrentScreen,
        isDrawerOpen,
        setIsDrawerOpen,
        dbReady,
        dbError,
        settings,
        updateSettings,
        timerState,
        startTimer,
        pauseTimer,
        resetTimer,
        getTimerElapsedSeconds,
        taskModal,
        openTaskModal,
        closeTaskModal,
        logSessionModal,
        openLogSessionModal,
        closeLogSessionModal,
        milestoneModal,
        openMilestoneModal,
        closeMilestoneModal,
        chooseTaskModal,
        openChooseTaskModal,
        closeChooseTaskModal,
        toast,
        showToast
      }}
    >
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}
