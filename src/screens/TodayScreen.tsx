import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/common/Button'
import { ProgressBar } from '../components/common/ProgressBar'
import { useApp } from '../context/AppContext'
import { db } from '../../src/db'
import { RoadmapTask, Milestone, DailyReflection, StudyCategory } from '../types'
import {
  formatLocalDate,
  formatDisplayDate,
  formatMinutes,
  isTaskOverdue
} from '../utils/date'
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Play,
  Pause,
  RotateCcw,
  ChevronDown,
  ChevronUp,
  Milestone as MilestoneIcon,
  Sparkles,
  Edit2,
  Check,
  CalendarPlus
} from 'lucide-react'

export const TodayScreen: React.FC = () => {
  const {
    openTaskModal,
    openLogSessionModal,
    openMilestoneModal,
    openChooseTaskModal,
    setCurrentScreen,
    settings,
    updateSettings,
    timerState,
    startTimer,
    pauseTimer,
    resetTimer,
    getTimerElapsedSeconds,
    showToast
  } = useApp()

  const todayStr = formatLocalDate()
  const displayDateStr = formatDisplayDate(todayStr)

  const [todayTasks, setTodayTasks] = useState<RoadmapTask[]>([])
  const [nextMilestone, setNextMilestone] = useState<Milestone | null>(null)
  const [todayLoggedMinutes, setTodayLoggedMinutes] = useState(0)
  const [dailyFocus, setDailyFocus] = useState<string>('')
  const [isEditingFocus, setIsEditingFocus] = useState(false)
  const [focusInput, setFocusInput] = useState('')
  const [expandedTaskIds, setExpandedTaskIds] = useState<Set<string>>(new Set())

  // Reflection states
  const [isCheckinOpen, setIsCheckinOpen] = useState(false)
  const [workedOn, setWorkedOn] = useState('')
  const [learned, setLearned] = useState('')
  const [blockers, setBlockers] = useState('')
  const [nextSteps, setNextSteps] = useState('')
  const [reflectionSaved, setReflectionSaved] = useState(false)

  // Live timer display ticker
  const [timerDisplaySeconds, setTimerDisplaySeconds] = useState(0)

  useEffect(() => {
    setTimerDisplaySeconds(getTimerElapsedSeconds())
    const interval = setInterval(() => {
      setTimerDisplaySeconds(getTimerElapsedSeconds())
    }, 1000)
    return () => clearInterval(interval)
  }, [getTimerElapsedSeconds, timerState.isRunning])

  // Load Today's data
  useEffect(() => {
    async function loadTodayData() {
      // 1. Tasks scheduled for today, or overdue tasks that are still incomplete
      const allTasks = await db.tasks.toArray()
      const filteredToday = allTasks.filter(t => {
        if (t.status === 'skipped') return false
        if (t.scheduledDate === todayStr) return true
        if (t.targetDate === todayStr) return true
        // If overdue and incomplete, surface in Today so user acts on it
        if (isTaskOverdue(t.targetDate, t.status, todayStr)) return true
        return false
      })

      // Sort: incomplete first, then completed
      filteredToday.sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return 1
        if (a.status !== 'completed' && b.status === 'completed') return -1
        return (a.priority === 'important' ? 0 : 1) - (b.priority === 'important' ? 0 : 1)
      })

      setTodayTasks(filteredToday)

      // 2. Derive daily focus
      if (settings.dailyFocusOverride) {
        setDailyFocus(settings.dailyFocusOverride)
      } else if (filteredToday.length > 0) {
        const nextIncomplete = filteredToday.find(t => t.status !== 'completed')
        if (nextIncomplete) {
          setDailyFocus(nextIncomplete.title)
        } else {
          setDailyFocus('Today’s scheduled tasks are completed. Review concepts or rest.')
        }
      } else {
        // Fallback to next incomplete task of phase 1 or default message
        const phase1Tasks = allTasks.filter(t => t.phaseId === 'phase-1' && t.status !== 'completed')
        if (phase1Tasks.length > 0) {
          setDailyFocus(`Phase 1: ${phase1Tasks[0].title}`)
        } else {
          setDailyFocus('Build the foundations. Start with Java.')
        }
      }

      // 3. Study time logged today
      const sessions = await db.studySessions.where('date').equals(todayStr).toArray()
      const totalMin = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
      setTodayLoggedMinutes(totalMin)

      // 4. Next upcoming milestone
      const pendingMilestones = await db.milestones.where('status').equals('pending').sortBy('targetDate')
      setNextMilestone(pendingMilestones[0] || null)

      // 5. Daily reflection for today
      const existingReflection = await db.reflections.get(todayStr)
      if (existingReflection) {
        setWorkedOn(existingReflection.workedOn || '')
        setLearned(existingReflection.learned || '')
        setBlockers(existingReflection.blockers || '')
        setNextSteps(existingReflection.nextSteps || '')
      }
    }

    loadTodayData()
  }, [todayStr, settings.dailyFocusOverride])

  // Save Reflection
  const handleSaveReflection = async () => {
    const updated: DailyReflection = {
      id: todayStr,
      date: todayStr,
      workedOn: workedOn.trim(),
      learned: learned.trim(),
      blockers: blockers.trim(),
      nextSteps: nextSteps.trim(),
      updatedAt: new Date().toISOString()
    }
    await db.reflections.put(updated)
    setReflectionSaved(true)
    setTimeout(() => setReflectionSaved(false), 2500)
    showToast('Reflection saved')
  }

  // Toggle Task Completion
  const handleToggleTask = async (task: RoadmapTask) => {
    const isNowCompleted = task.status !== 'completed'
    const now = new Date().toISOString()

    const updated: RoadmapTask = {
      ...task,
      status: isNowCompleted ? 'completed' : 'not_started',
      completedAt: isNowCompleted ? now : undefined,
      updatedAt: now
    }

    await db.tasks.put(updated)

    setTodayTasks(prev => {
      const updatedList = prev.map(t => (t.id === task.id ? updated : t))
      return updatedList.sort((a, b) => {
        if (a.status === 'completed' && b.status !== 'completed') return 1
        if (a.status !== 'completed' && b.status === 'completed') return -1
        return (a.priority === 'important' ? 0 : 1) - (b.priority === 'important' ? 0 : 1)
      })
    })

    showToast(isNowCompleted ? 'Task completed' : 'Task marked incomplete')
  }

  // Toggle Task Expand/Collapse
  const toggleExpand = (taskId: string) => {
    setExpandedTaskIds(prev => {
      const next = new Set(prev)
      if (next.has(taskId)) next.delete(taskId)
      else next.add(taskId)
      return next
    })
  }

  // Focus override handlers
  const handleSaveFocus = async () => {
    const newFocus = focusInput.trim()
    await updateSettings({ dailyFocusOverride: newFocus || undefined })
    setDailyFocus(newFocus || 'Build the foundations. Start with Java.')
    setIsEditingFocus(false)
  }

  const handleResetFocus = async () => {
    await updateSettings({ dailyFocusOverride: undefined })
    setIsEditingFocus(false)
    showToast('Focus reset to auto-derived')
  }

  // Fast study logging chips (e.g. 15, 30, 45, 60m)
  const handleQuickLog = async (minutes: number) => {
    openLogSessionModal({
      durationMinutes: minutes,
      category: 'Learning',
      date: todayStr
    })
  }

  // Finish Timer & Log
  const handleFinishTimerAndLog = () => {
    pauseTimer()
    const elapsedMinutes = Math.max(1, Math.round(timerDisplaySeconds / 60))
    openLogSessionModal({
      durationMinutes: elapsedMinutes,
      category: timerState.category,
      taskId: timerState.taskId,
      date: todayStr
    })
    resetTimer()
  }

  const allCompleted = todayTasks.length > 0 && todayTasks.every(t => t.status === 'completed')

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-bg transition-colors">
      <Header
        title="Today"
        subtitle={displayDateStr}
        action={
          <Button
            size="sm"
            variant="secondary"
            onClick={openChooseTaskModal}
            icon={<CalendarPlus size={15} />}
          >
            Pick Task
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* SECTION A: DAILY FOCUS */}
        <section
          className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs transition-colors"
          aria-label="Daily focus"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-accent flex items-center gap-1.5">
              <Sparkles size={13} />
              Daily Focus
            </span>

            {!isEditingFocus && (
              <button
                onClick={() => {
                  setFocusInput(dailyFocus)
                  setIsEditingFocus(true)
                }}
                className="text-xs text-text-secondary hover:text-text-primary p-1 rounded transition-colors"
                aria-label="Edit daily focus"
              >
                <Edit2 size={13} />
              </button>
            )}
          </div>

          {isEditingFocus ? (
            <div className="mt-2 space-y-2">
              <input
                type="text"
                value={focusInput}
                onChange={e => setFocusInput(e.target.value)}
                className="w-full px-3 py-1.5 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="Enter today's primary focus..."
                autoFocus
              />
              <div className="flex justify-end gap-2">
                <Button size="sm" variant="tertiary" onClick={handleResetFocus}>
                  Auto Derive
                </Button>
                <Button size="sm" variant="secondary" onClick={() => setIsEditingFocus(false)}>
                  Cancel
                </Button>
                <Button size="sm" variant="primary" onClick={handleSaveFocus}>
                  Save
                </Button>
              </div>
            </div>
          ) : (
            <p className="text-base sm:text-lg font-medium text-text-primary leading-snug">
              “{dailyFocus}”
            </p>
          )}
        </section>

        {/* SECTION B: TODAY'S TASKS */}
        <section aria-label="Today's tasks" className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-base sm:text-lg font-semibold text-text-primary">
                Today’s Tasks
              </h2>
              <span className="text-xs text-text-secondary">
                ({todayTasks.filter(t => t.status === 'completed').length}/{todayTasks.length})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={() => openTaskModal(undefined, { scheduledDate: todayStr })}
                className="inline-flex items-center gap-1 text-xs font-medium text-accent hover:text-accent-hover px-2 py-1 rounded transition-colors"
              >
                <Plus size={14} />
                Add Task
              </button>
            </div>
          </div>

          {todayTasks.length === 0 ? (
            <div className="bg-bg-card rounded-2xl p-6 border border-border text-center space-y-3">
              <p className="text-sm text-text-secondary">
                No tasks scheduled for today.
              </p>
              <Button
                variant="secondary"
                size="sm"
                onClick={openChooseTaskModal}
                icon={<CalendarPlus size={15} />}
              >
                Choose a roadmap task
              </Button>
            </div>
          ) : allCompleted ? (
            <div className="space-y-3">
              <div className="bg-accent-subtle/50 rounded-xl p-3 border border-accent/20 flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-medium text-accent">
                  <Check size={16} />
                  <span>Today's tasks are complete</span>
                </div>
                <Button
                  size="sm"
                  variant="tertiary"
                  onClick={openChooseTaskModal}
                >
                  Add more
                </Button>
              </div>

              {/* List of completed tasks */}
              <div className="space-y-2">
                {todayTasks.map(task => (
                  <TaskRow
                    key={task.id}
                    task={task}
                    isExpanded={expandedTaskIds.has(task.id)}
                    onToggle={() => handleToggleTask(task)}
                    onExpand={() => toggleExpand(task.id)}
                    onClickTitle={() => openTaskModal(task.id)}
                    todayStr={todayStr}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              {todayTasks.map(task => (
                <TaskRow
                  key={task.id}
                  task={task}
                  isExpanded={expandedTaskIds.has(task.id)}
                  onToggle={() => handleToggleTask(task)}
                  onExpand={() => toggleExpand(task.id)}
                  onClickTitle={() => openTaskModal(task.id)}
                  todayStr={todayStr}
                />
              ))}
            </div>
          )}
        </section>

        {/* SECTION C: TODAY'S STUDY TIME & LIVE TIMER */}
        <section
          className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border space-y-4 transition-colors"
          aria-label="Today's study time"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary block">
                Study Time Today
              </span>
              <span className="text-2xl font-bold text-text-primary">
                {formatMinutes(todayLoggedMinutes)}
              </span>
            </div>

            <Button
              variant="primary"
              size="sm"
              onClick={() => openLogSessionModal({ date: todayStr })}
              icon={<Clock size={15} />}
            >
              Log Session
            </Button>
          </div>

          {/* Quick duration log chips */}
          <div className="flex items-center gap-2 pt-1">
            <span className="text-xs text-text-secondary shrink-0">Quick log:</span>
            <div className="flex gap-2">
              {[15, 30, 45, 60].map(m => (
                <button
                  key={m}
                  onClick={() => handleQuickLog(m)}
                  className="px-2.5 py-1 text-xs rounded-lg bg-bg-subtle border border-border text-text-primary hover:bg-border/60 transition-colors"
                >
                  +{m}m
                </button>
              ))}
            </div>
          </div>

          {/* Live study timer control */}
          <div className="pt-3 border-t border-border flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <div
                className={`w-2.5 h-2.5 rounded-full ${
                  timerState.isRunning ? 'bg-accent animate-pulse' : 'bg-text-secondary/40'
                }`}
              />
              <span className="font-mono text-base font-semibold text-text-primary">
                {formatTimer(timerDisplaySeconds)}
              </span>
              <span className="text-xs text-text-secondary">
                ({timerState.category})
              </span>
            </div>

            <div className="flex items-center gap-1.5">
              {timerState.isRunning ? (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={pauseTimer}
                  icon={<Pause size={14} />}
                >
                  Pause
                </Button>
              ) : (
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => startTimer(timerState.category)}
                  icon={<Play size={14} />}
                >
                  Start Timer
                </Button>
              )}

              {timerDisplaySeconds > 0 && (
                <>
                  <Button
                    size="sm"
                    variant="primary"
                    onClick={handleFinishTimerAndLog}
                  >
                    Finish & Log
                  </Button>
                  <button
                    onClick={resetTimer}
                    className="p-2 text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                    aria-label="Reset timer"
                  >
                    <RotateCcw size={15} />
                  </button>
                </>
              )}
            </div>
          </div>
        </section>

        {/* SECTION D: NEXT MILESTONE */}
        {nextMilestone && (
          <section
            className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border space-y-3 transition-colors"
            aria-label="Upcoming milestone"
          >
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary flex items-center gap-1.5">
                <MilestoneIcon size={14} className="text-accent" />
                Next Milestone
              </span>
              <button
                onClick={() => setCurrentScreen('roadmap')}
                className="text-xs text-accent hover:underline font-medium"
              >
                View in Roadmap
              </button>
            </div>

            <div>
              <h3
                onClick={() => openMilestoneModal(nextMilestone)}
                className="text-sm sm:text-base font-semibold text-text-primary hover:text-accent cursor-pointer transition-colors"
              >
                {nextMilestone.title}
              </h3>
              <p className="text-xs text-text-secondary mt-0.5">
                Target: {formatDisplayDate(nextMilestone.targetDate)}
              </p>
            </div>

            <ProgressBar
              value={nextMilestone.status === 'completed' ? 100 : 25}
              height="sm"
            />
          </section>
        )}

        {/* SECTION E: END-OF-DAY CHECK-IN */}
        <section
          className="bg-bg-card rounded-2xl border border-border overflow-hidden transition-colors"
          aria-label="End of day check-in"
        >
          <button
            onClick={() => setIsCheckinOpen(prev => !prev)}
            className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-bg-subtle transition-colors"
          >
            <span className="text-sm font-semibold text-text-primary">
              End-of-day check-in
            </span>
            <div className="flex items-center gap-2 text-text-secondary text-xs">
              {reflectionSaved && <span className="text-accent">Saved</span>}
              {isCheckinOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </div>
          </button>

          {isCheckinOpen && (
            <div className="p-4 sm:p-5 pt-0 space-y-3 border-t border-border animate-in fade-in duration-150">
              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  What did you work on?
                </label>
                <textarea
                  rows={2}
                  value={workedOn}
                  onChange={e => setWorkedOn(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  placeholder="Key topics and implementations tackled today..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  What blocked you?
                </label>
                <textarea
                  rows={2}
                  value={blockers}
                  onChange={e => setBlockers(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  placeholder="Any stumbling blocks or doubts that need attention..."
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-text-secondary mb-1">
                  What will you do next?
                </label>
                <textarea
                  rows={2}
                  value={nextSteps}
                  onChange={e => setNextSteps(e.target.value)}
                  className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                  placeholder="Immediate priority for tomorrow..."
                />
              </div>

              <div className="flex justify-end pt-1">
                <Button size="sm" variant="primary" onClick={handleSaveReflection}>
                  Save Reflection
                </Button>
              </div>
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

interface TaskRowProps {
  task: RoadmapTask
  isExpanded: boolean
  onToggle: () => void
  onExpand: () => void
  onClickTitle: () => void
  todayStr: string
}

const TaskRow: React.FC<TaskRowProps> = ({
  task,
  isExpanded,
  onToggle,
  onExpand,
  onClickTitle,
  todayStr
}) => {
  const isCompleted = task.status === 'completed'
  const isOverdue = isTaskOverdue(task.targetDate, task.status, todayStr)

  return (
    <div
      className={`rounded-xl border transition-all duration-150 ${
        isCompleted
          ? 'bg-bg/40 border-border/60 opacity-80'
          : 'bg-bg-card border-border hover:border-text-secondary/40'
      }`}
    >
      <div className="flex items-center gap-3 p-3 sm:px-4">
        {/* Checkbox */}
        <button
          onClick={onToggle}
          className="shrink-0 p-1 text-accent transition-transform active:scale-90"
          aria-label={isCompleted ? 'Mark incomplete' : 'Mark completed'}
        >
          {isCompleted ? (
            <CheckCircle2 size={20} className="text-accent" />
          ) : (
            <Circle size={20} className="text-text-secondary hover:text-accent" />
          )}
        </button>

        {/* Title & Metadata */}
        <div className="flex-1 min-w-0" onClick={onClickTitle} role="button" tabIndex={0}>
          <div className="flex items-center gap-2">
            <span
              className={`text-sm font-medium leading-snug cursor-pointer transition-colors ${
                isCompleted
                  ? 'line-through text-text-secondary'
                  : 'text-text-primary hover:text-accent'
              }`}
            >
              {task.title}
            </span>
            {task.priority === 'important' && (
              <span className="shrink-0 text-[10px] uppercase font-bold text-accent bg-accent-subtle px-1.5 py-0.2 rounded">
                Important
              </span>
            )}
            {isOverdue && (
              <span className="shrink-0 text-[10px] uppercase font-bold text-overdue bg-overdue/10 px-1.5 py-0.2 rounded">
                Overdue
              </span>
            )}
          </div>

          <div className="flex items-center gap-2 mt-0.5 text-xs text-text-secondary">
            {task.estimatedMinutes && (
              <span className="flex items-center gap-1">
                <Clock size={11} />
                {task.estimatedMinutes}m
              </span>
            )}
            <span>·</span>
            <span>{task.category}</span>
          </div>
        </div>

        {/* Expand / Collapse description */}
        {task.description && (
          <button
            onClick={onExpand}
            className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg transition-colors"
            aria-label={isExpanded ? 'Collapse task description' : 'Expand task description'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        )}
      </div>

      {isExpanded && task.description && (
        <div className="px-10 pb-3 pt-0 text-xs text-text-secondary border-t border-border/40 mt-1">
          {task.description}
        </div>
      )}
    </div>
  )
}

function formatTimer(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
}
