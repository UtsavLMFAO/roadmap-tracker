import React from 'react'
import { AppProvider, useApp } from './context/AppContext'
import { Sidebar } from './components/layout/Sidebar'
import { BottomNav } from './components/layout/BottomNav'
import { HamburgerDrawer } from './components/layout/HamburgerDrawer'
import { TaskModal } from './components/modals/TaskModal'
import { LogSessionModal } from './components/modals/LogSessionModal'
import { MilestoneModal } from './components/modals/MilestoneModal'
import { ChooseRoadmapTaskModal } from './components/modals/ChooseRoadmapTaskModal'

import { TodayScreen } from './screens/TodayScreen'
import { RoadmapScreen } from './screens/RoadmapScreen'
import { ProgressScreen } from './screens/ProgressScreen'
import { JournalScreen } from './screens/JournalScreen'
import { ProjectsScreen } from './screens/ProjectsScreen'
import { ResourcesScreen } from './screens/ResourcesScreen'
import { AlgorithmTrackerScreen } from './screens/AlgorithmTrackerScreen'
import { ApplicationsScreen } from './screens/ApplicationsScreen'
import { SettingsScreen } from './screens/SettingsScreen'
import { AlertCircle, CheckCircle } from 'lucide-react'

const MainContent: React.FC = () => {
  const { currentScreen, dbReady, dbError, toast } = useApp()

  if (dbError) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg text-text-primary">
        <div className="max-w-md w-full bg-bg-card rounded-2xl p-6 border border-overdue/30 space-y-3 text-center shadow-lg">
          <AlertCircle size={32} className="mx-auto text-overdue" />
          <h2 className="text-lg font-bold text-text-primary">Database Access Issue</h2>
          <p className="text-sm text-text-secondary leading-relaxed">
            {dbError}
          </p>
          <p className="text-xs text-text-secondary">
            Ensure IndexedDB is enabled in your browser settings and you are not in private browsing with storage disabled.
          </p>
        </div>
      </div>
    )
  }

  if (!dbReady) {
    return (
      <div className="min-h-screen flex items-center justify-center p-6 bg-bg text-text-secondary text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-accent animate-ping" />
          <span>Loading roadmap workspace...</span>
        </div>
      </div>
    )
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'today':
        return <TodayScreen />
      case 'roadmap':
        return <RoadmapScreen />
      case 'progress':
        return <ProgressScreen />
      case 'journal':
      case 'weekly-review':
        return <JournalScreen />
      case 'projects':
        return <ProjectsScreen />
      case 'resources':
        return <ResourcesScreen />
      case 'algorithms':
        return <AlgorithmTrackerScreen />
      case 'applications':
        return <ApplicationsScreen />
      case 'settings':
        return <SettingsScreen />
      default:
        return <TodayScreen />
    }
  }

  return (
    <div className="flex min-h-screen bg-bg">
      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Screen Content */}
      <div className="flex-1 min-w-0">
        {renderScreen()}
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Slide-out Hamburger Drawer */}
      <HamburgerDrawer />

      {/* Global Interactive Modals */}
      <TaskModal />
      <LogSessionModal />
      <MilestoneModal />
      <ChooseRoadmapTaskModal />

      {/* Unobtrusive Toast Notification */}
      {toast && (
        <div
          role="status"
          aria-live="polite"
          className="fixed bottom-20 md:bottom-6 right-6 z-50 flex items-center gap-2 bg-text-primary text-bg px-4 py-2.5 rounded-xl shadow-lg text-xs font-medium animate-in fade-in slide-in-from-bottom-2 duration-150"
        >
          <CheckCircle size={14} className="text-accent shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  )
}

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  )
}
