import React, { useState, useEffect, useRef } from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/common/Button'
import { ConfirmDialog } from '../components/common/ConfirmDialog'
import { useApp } from '../context/AppContext'
import {
  db,
  exportDatabaseBackup,
  validateBackupData,
  restoreDatabaseFromBackup,
  exportStudySessionsCSV,
  resetAllData,
  restoreDefaultRoadmapStructure
} from '../../src/db'
import { BackupData } from '../types'
import {
  Sun,
  Moon,
  Laptop,
  Download,
  Upload,
  FileSpreadsheet,
  RotateCcw,
  AlertTriangle,
  Database,
  Check,
  ShieldCheck,
  Calendar,
  Layers
} from 'lucide-react'

export const SettingsScreen: React.FC = () => {
  const { settings, updateSettings, showToast } = useApp()
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Local schedule states
  const [targetHours, setTargetHours] = useState(settings.weeklyTargetHours)
  const [categorySplit, setCategorySplit] = useState(settings.categoryTargets)
  const [preferredDays, setPreferredDays] = useState<string[]>(settings.preferredStudyDays)
  const [remindersEnabled, setRemindersEnabled] = useState(settings.remindersEnabled)
  const [showSkipped, setShowSkipped] = useState(settings.showSkippedTasks)

  // Confirmation dialogs
  const [isResetConfirmOpen, setIsResetConfirmOpen] = useState(false)
  const [pendingBackupToRestore, setPendingBackupToRestore] = useState<{
    data: BackupData
    summary: { tasks: number; sessions: number; projects: number }
  } | null>(null)
  const [isRestoreConfirmOpen, setIsRestoreConfirmOpen] = useState(false)

  // Storage info
  const [storageEstimate, setStorageEstimate] = useState<string>('Local IndexedDB')

  useEffect(() => {
    async function estimateStorage() {
      if (navigator.storage && navigator.storage.estimate) {
        try {
          const est = await navigator.storage.estimate()
          if (est.usage) {
            const kb = Math.round(est.usage / 1024)
            setStorageEstimate(`${kb} KB used on device`)
          }
        } catch {
          // ignore
        }
      }
    }
    estimateStorage()
  }, [])

  const handleSaveSchedule = async () => {
    await updateSettings({
      weeklyTargetHours: Number(targetHours) || 17,
      categoryTargets: categorySplit,
      preferredStudyDays: preferredDays,
      remindersEnabled,
      showSkippedTasks: showSkipped
    })
    showToast('Schedule settings saved')
  }

  // Toggle Preferred Study Day
  const toggleDay = (day: string) => {
    setPreferredDays(prev =>
      prev.includes(day) ? prev.filter(d => d !== day) : [...prev, day]
    )
  }

  // Export JSON Backup
  const handleExportJSON = async () => {
    try {
      const backup = await exportDatabaseBackup()
      const jsonStr = JSON.stringify(backup, null, 2)
      const blob = new Blob([jsonStr], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `roadmap-tracker-backup-${new Date().toISOString().slice(0, 10)}.json`
      a.click()
      URL.revokeObjectURL(url)
      showToast('JSON backup exported successfully')
    } catch (err) {
      showToast('Failed to export backup', 'warning')
    }
  }

  // Export CSV Sessions
  const handleExportCSV = async () => {
    try {
      const csvStr = await exportStudySessionsCSV()
      const blob = new Blob([csvStr], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `study-sessions-${new Date().toISOString().slice(0, 10)}.csv`
      a.click()
      URL.revokeObjectURL(url)
      showToast('CSV exported successfully')
    } catch (err) {
      showToast('Failed to export CSV', 'warning')
    }
  }

  // Import JSON file handler
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = async event => {
      try {
        const text = event.target?.result as string
        const parsed = JSON.parse(text)
        const validation = validateBackupData(parsed)

        if (!validation.valid || !validation.summary) {
          showToast(validation.error || 'Invalid backup file', 'warning')
          return
        }

        setPendingBackupToRestore({
          data: parsed as BackupData,
          summary: validation.summary
        })
        setIsRestoreConfirmOpen(true)
      } catch (err) {
        showToast('Error parsing JSON backup file', 'warning')
      } finally {
        if (fileInputRef.current) fileInputRef.current.value = ''
      }
    }
    reader.readAsText(file)
  }

  // Confirm Restore
  const handleConfirmRestore = async () => {
    if (!pendingBackupToRestore) return
    try {
      await restoreDatabaseFromBackup(pendingBackupToRestore.data)
      showToast('Database successfully restored from backup', 'success')
      setPendingBackupToRestore(null)
      setIsRestoreConfirmOpen(false)
      window.location.reload()
    } catch (err) {
      showToast('Failed to restore backup', 'warning')
    }
  }

  // Reset all data
  const handleConfirmReset = async () => {
    try {
      await resetAllData()
      showToast('All data reset to initial roadmap state', 'info')
      setIsResetConfirmOpen(false)
      window.location.reload()
    } catch (err) {
      showToast('Failed to reset data', 'warning')
    }
  }

  // Restore roadmap structure
  const handleRestoreRoadmapStructure = async () => {
    try {
      await restoreDefaultRoadmapStructure()
      showToast('Default roadmap phases and tasks restored', 'success')
    } catch (err) {
      showToast('Failed to restore roadmap structure', 'warning')
    }
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-bg transition-colors">
      <Header
        title="Settings & Data"
        subtitle="Customization, study schedules, and local-first data backup"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* APPEARANCE */}
        <section className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Appearance</h3>
          <div className="grid grid-cols-3 gap-2.5">
            {[
              { id: 'light', label: 'Light', icon: Sun },
              { id: 'dark', label: 'Dark', icon: Moon },
              { id: 'system', label: 'System', icon: Laptop }
            ].map(t => {
              const Icon = t.icon
              const isSelected = settings.theme === t.id
              return (
                <button
                  key={t.id}
                  onClick={() => updateSettings({ theme: t.id as 'light' | 'dark' | 'system' })}
                  className={`p-3 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-colors ${
                    isSelected
                      ? 'bg-accent text-white border-accent font-semibold'
                      : 'bg-bg-subtle border-border text-text-secondary hover:text-text-primary'
                  }`}
                >
                  <Icon size={18} />
                  <span className="text-xs">{t.label}</span>
                </button>
              )
            })}
          </div>
        </section>

        {/* STUDY SCHEDULE SETTINGS */}
        <section className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Weekly Study Schedule</h3>
              <p className="text-xs text-text-secondary">
                Adjust target hours and category allocation around your college schedule
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Total Weekly Target (Hours)
              </label>
              <input
                type="number"
                min={1}
                max={60}
                value={targetHours}
                onChange={e => setTargetHours(Number(e.target.value))}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Preferred Study Days
              </label>
              <div className="flex gap-1">
                {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => toggleDay(day)}
                    className={`flex-1 py-1.5 rounded text-[11px] font-medium border transition-colors ${
                      preferredDays.includes(day)
                        ? 'bg-accent text-white border-accent'
                        : 'bg-bg-subtle border-border text-text-secondary'
                    }`}
                  >
                    {day[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Category Split */}
          <div className="pt-2 border-t border-border space-y-2">
            <span className="text-xs font-semibold text-text-secondary block">
              Category Weekly Hour Allocations
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
              {(['Projects', 'DSA', 'Learning', 'CS fundamentals', 'Career'] as const).map(cat => (
                <div key={cat} className="p-2 bg-bg-subtle rounded-lg border border-border">
                  <span className="text-[10px] text-text-secondary block truncate">{cat}</span>
                  <input
                    type="number"
                    min={0}
                    value={categorySplit[cat] || 0}
                    onChange={e =>
                      setCategorySplit({
                        ...categorySplit,
                        [cat]: Math.max(0, Number(e.target.value))
                      })
                    }
                    className="w-full mt-1 px-2 py-1 text-xs bg-bg border border-border rounded text-text-primary"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Reminder Preference */}
          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-text-primary block">Daily Study Reminder</span>
              <span className="text-[11px] text-text-secondary block">
                Local-first notification preference (requires browser permission when supported)
              </span>
            </div>
            <input
              type="checkbox"
              checked={remindersEnabled}
              onChange={e => setRemindersEnabled(e.target.checked)}
              className="rounded text-accent focus:ring-accent"
            />
          </div>

          <div className="flex justify-end pt-1">
            <Button size="sm" variant="primary" onClick={handleSaveSchedule}>
              Save Schedule Settings
            </Button>
          </div>
        </section>

        {/* ROADMAP SETTINGS */}
        <section className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3">
          <h3 className="text-sm font-semibold text-text-primary">Roadmap Options</h3>

          <div className="flex items-center justify-between py-1">
            <div>
              <span className="text-xs font-medium text-text-primary block">Show Skipped Tasks</span>
              <span className="text-[11px] text-text-secondary block">
                Display skipped tasks in roadmap view instead of filtering them out
              </span>
            </div>
            <input
              type="checkbox"
              checked={showSkipped}
              onChange={e => {
                setShowSkipped(e.target.checked)
                updateSettings({ showSkippedTasks: e.target.checked })
              }}
              className="rounded text-accent focus:ring-accent"
            />
          </div>

          <div className="pt-2 border-t border-border flex items-center justify-between">
            <div>
              <span className="text-xs font-medium text-text-primary block">
                Restore Default Roadmap Structure
              </span>
              <span className="text-[11px] text-text-secondary block">
                Restores missing default phases and tasks without deleting your completed history
              </span>
            </div>
            <Button size="sm" variant="secondary" onClick={handleRestoreRoadmapStructure}>
              Restore Structure
            </Button>
          </div>
        </section>

        {/* DATA BACKUP & RESTORE */}
        <section className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-text-primary">Data Management & Privacy</h3>
              <p className="text-xs text-text-secondary">
                Your data is stored strictly in your browser IndexedDB on this device.
              </p>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-accent font-medium bg-accent-subtle px-2.5 py-1 rounded-lg">
              <Database size={13} />
              <span>{storageEstimate}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
            <Button
              variant="secondary"
              onClick={handleExportJSON}
              icon={<Download size={15} />}
            >
              Export JSON Backup
            </Button>

            <Button
              variant="secondary"
              onClick={() => fileInputRef.current?.click()}
              icon={<Upload size={15} />}
            >
              Import JSON Backup
            </Button>

            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".json"
              className="hidden"
            />
          </div>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-border">
            <Button
              size="sm"
              variant="tertiary"
              onClick={handleExportCSV}
              icon={<FileSpreadsheet size={14} />}
            >
              Download Study Sessions CSV
            </Button>

            <Button
              size="sm"
              variant="danger"
              onClick={() => setIsResetConfirmOpen(true)}
              icon={<RotateCcw size={14} />}
            >
              Reset All Progress
            </Button>
          </div>
        </section>

        {/* ABOUT & PRIVACY */}
        <section className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-2 text-xs text-text-secondary">
          <div className="flex items-center gap-2 text-text-primary font-semibold text-sm">
            <ShieldCheck size={16} className="text-accent" />
            <span>Local-First Software Engineering Tracker</span>
          </div>
          <p>
            Target Timeline: <strong>20 October 2026 – December 2028</strong>, preparing for international roles by early 2029.
          </p>
          <p>
            Privacy Guarantee: No remote backend, no user accounts, no telemetry, no tracking cookies. All progress stays on this device unless you explicitly export it.
          </p>
          <div className="pt-2 text-[11px] text-text-secondary font-mono">
            Version 1.0.0 · Offline Ready (PWA)
          </div>
        </section>
      </main>

      {/* CONFIRM RESET DIALOG */}
      <ConfirmDialog
        isOpen={isResetConfirmOpen}
        onClose={() => setIsResetConfirmOpen(false)}
        onConfirm={handleConfirmReset}
        title="Reset All Personal Progress?"
        message="This will completely clear your logged study sessions, task completions, algorithm notes, and reflections, resetting the application back to the initial roadmap state. This action cannot be undone."
        confirmText="Yes, Reset All Data"
        isDestructive={true}
      />

      {/* CONFIRM RESTORE BACKUP DIALOG */}
      {pendingBackupToRestore && (
        <ConfirmDialog
          isOpen={isRestoreConfirmOpen}
          onClose={() => setIsRestoreConfirmOpen(false)}
          onConfirm={handleConfirmRestore}
          title="Restore Database from Backup?"
          message={`This backup contains ${pendingBackupToRestore.summary.tasks} tasks, ${pendingBackupToRestore.summary.sessions} study sessions, and ${pendingBackupToRestore.summary.projects} projects. Restoring will replace your current local data. Are you sure you wish to continue?`}
          confirmText="Yes, Restore Backup"
          isDestructive={false}
        />
      )}
    </div>
  )
}
