import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { useApp } from '../context/AppContext'
import { db } from '../../src/db'
import { DailyReflection, WeeklyReview, StudySession, RoadmapTask } from '../types'
import {
  formatLocalDate,
  formatDisplayDate,
  formatMinutes,
  getMondayOfWeek,
  getSundayOfWeek
} from '../utils/date'
import {
  Calendar,
  Clock,
  CheckCircle2,
  Edit3,
  CalendarCheck,
  ChevronRight,
  Plus
} from 'lucide-react'

interface JournalDaySummary {
  dateStr: string
  displayDate: string
  loggedMinutes: number
  tasksCompletedCount: number
  reflection?: DailyReflection
}

export const JournalScreen: React.FC = () => {
  const { currentScreen, setCurrentScreen, showToast } = useApp()
  const todayStr = formatLocalDate()

  const [activeTab, setActiveTab] = useState<'daily' | 'weekly'>(
    currentScreen === 'weekly-review' ? 'weekly' : 'daily'
  )

  useEffect(() => {
    if (currentScreen === 'weekly-review') {
      setActiveTab('weekly')
    }
  }, [currentScreen])

  // Daily entries state
  const [daySummaries, setDaySummaries] = useState<JournalDaySummary[]>([])
  const [activeDailyModal, setActiveDailyModal] = useState<DailyReflection | null>(null)
  const [isDailyModalOpen, setIsDailyModalOpen] = useState(false)
  const [autoSavedNotice, setAutoSavedNotice] = useState(false)

  // Weekly reviews state
  const [weeklyReviews, setWeeklyReviews] = useState<WeeklyReview[]>([])
  const [activeWeeklyReview, setActiveWeeklyReview] = useState<WeeklyReview | null>(null)
  const [isWeeklyModalOpen, setIsWeeklyModalOpen] = useState(false)

  useEffect(() => {
    async function loadJournalData() {
      const [allReflections, allSessions, allTasks, allReviews] = await Promise.all([
        db.reflections.toArray(),
        db.studySessions.toArray(),
        db.tasks.toArray(),
        db.reviews.orderBy('weekStartDate').reverse().toArray()
      ])

      setWeeklyReviews(allReviews)

      // Collect all distinct dates from reflections and study sessions + past 14 days
      const dateSet = new Set<string>()
      dateSet.add(todayStr)
      allReflections.forEach(r => dateSet.add(r.date))
      allSessions.forEach(s => dateSet.add(s.date))

      // Also ensure past 7 days are visible even if empty
      const now = new Date()
      for (let i = 0; i < 7; i++) {
        const d = new Date(now)
        d.setDate(d.getDate() - i)
        dateSet.add(formatLocalDate(d))
      }

      const sortedDates = Array.from(dateSet).sort().reverse()

      // Build daily summaries
      const summaries: JournalDaySummary[] = sortedDates.map(dStr => {
        const reflection = allReflections.find(r => r.date === dStr)
        const daySessions = allSessions.filter(s => s.date === dStr)
        const loggedMinutes = daySessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)

        const completedOnDate = allTasks.filter(t => {
          if (t.status !== 'completed' || !t.completedAt) return false
          return t.completedAt.startsWith(dStr)
        }).length

        return {
          dateStr: dStr,
          displayDate: formatDisplayDate(dStr),
          loggedMinutes,
          tasksCompletedCount: completedOnDate,
          reflection
        }
      })

      setDaySummaries(summaries)
    }

    loadJournalData()
  }, [todayStr, isDailyModalOpen, isWeeklyModalOpen])

  // Open Daily Edit Modal
  const openDailyEntry = async (dateStr: string) => {
    const existing = await db.reflections.get(dateStr)
    const entry: DailyReflection = existing || {
      id: dateStr,
      date: dateStr,
      workedOn: '',
      learned: '',
      blockers: '',
      nextSteps: '',
      updatedAt: new Date().toISOString()
    }
    setActiveDailyModal(entry)
    setIsDailyModalOpen(true)
  }

  // Save Daily Entry
  const handleSaveDaily = async () => {
    if (!activeDailyModal) return
    const updated: DailyReflection = {
      ...activeDailyModal,
      updatedAt: new Date().toISOString()
    }
    await db.reflections.put(updated)
    setAutoSavedNotice(true)
    setTimeout(() => setAutoSavedNotice(false), 2000)
    showToast('Daily reflection saved')
    setIsDailyModalOpen(false)
  }

  // Open / Create Weekly Review
  const openNewWeeklyReview = async () => {
    const currentMonday = getMondayOfWeek(todayStr)
    const existing = await db.reviews.get(`review-${currentMonday}`)

    if (existing) {
      setActiveWeeklyReview(existing)
      setIsWeeklyModalOpen(true)
      return
    }

    // Pre-fill factual summaries
    const sundayStr = getSundayOfWeek(currentMonday)
    const weekSessions = await db.studySessions.where('date').between(currentMonday, sundayStr, true, true).toArray()
    const weekMins = weekSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)

    const allTasks = await db.tasks.toArray()
    const weekCompletedTasks = allTasks.filter(t => {
      if (t.status !== 'completed' || !t.completedAt) return false
      const cDate = t.completedAt.slice(0, 10)
      return cDate >= currentMonday && cDate <= sundayStr
    })

    const completedText = weekCompletedTasks.length > 0
      ? weekCompletedTasks.map(t => `- ${t.title} (${t.category})`).join('\n')
      : 'No tasks marked completed this week yet.'

    const newReview: WeeklyReview = {
      id: `review-${currentMonday}`,
      weekStartDate: currentMonday,
      wentWell: '',
      difficulties: '',
      completedWork: `Logged ${formatMinutes(weekMins)} across ${weekSessions.length} sessions.\nCompleted tasks:\n${completedText}`,
      unfinishedWork: '',
      nextWeekPriority: '',
      scheduleAdjustment: '',
      updatedAt: new Date().toISOString()
    }

    setActiveWeeklyReview(newReview)
    setIsWeeklyModalOpen(true)
  }

  // Save Weekly Review
  const handleSaveWeeklyReview = async () => {
    if (!activeWeeklyReview) return
    const updated: WeeklyReview = {
      ...activeWeeklyReview,
      updatedAt: new Date().toISOString()
    }
    await db.reviews.put(updated)
    showToast('Weekly review saved')
    setIsWeeklyModalOpen(false)
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-bg transition-colors">
      <Header
        title="Journal"
        subtitle="Daily reflections and weekly reviews"
        action={
          activeTab === 'weekly' ? (
            <Button
              size="sm"
              variant="primary"
              onClick={openNewWeeklyReview}
              icon={<Plus size={14} />}
            >
              New Review
            </Button>
          ) : (
            <Button
              size="sm"
              variant="secondary"
              onClick={() => openDailyEntry(todayStr)}
              icon={<Edit3 size={14} />}
            >
              Today’s Entry
            </Button>
          )
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* TAB SWITCHER */}
        <div className="flex border-b border-border">
          <button
            onClick={() => setActiveTab('daily')}
            className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'daily'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Daily Reflections
          </button>
          <button
            onClick={() => setActiveTab('weekly')}
            className={`pb-3 px-4 text-sm font-semibold transition-colors relative ${
              activeTab === 'weekly'
                ? 'text-accent border-b-2 border-accent'
                : 'text-text-secondary hover:text-text-primary'
            }`}
          >
            Weekly Reviews
          </button>
        </div>

        {/* TAB 1: DAILY REFLECTIONS LIST */}
        {activeTab === 'daily' && (
          <section className="space-y-3" aria-label="Daily reflections list">
            {daySummaries.map(summary => {
              const hasReflection = !!summary.reflection && (
                summary.reflection.workedOn ||
                summary.reflection.learned ||
                summary.reflection.blockers ||
                summary.reflection.nextSteps
              )

              const previewText = summary.reflection?.workedOn ||
                summary.reflection?.learned ||
                (summary.loggedMinutes > 0 ? `Logged ${formatMinutes(summary.loggedMinutes)} study time` : 'No notes written')

              return (
                <div
                  key={summary.dateStr}
                  onClick={() => openDailyEntry(summary.dateStr)}
                  className="bg-bg-card rounded-2xl p-4 border border-border hover:border-accent/40 cursor-pointer transition-all flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-text-primary">
                        {summary.displayDate}
                      </span>
                      {summary.dateStr === todayStr && (
                        <span className="text-[10px] uppercase font-bold text-accent bg-accent-subtle px-1.5 py-0.2 rounded">
                          Today
                        </span>
                      )}
                    </div>

                    <p className="text-xs text-text-secondary line-clamp-1 leading-relaxed">
                      {previewText}
                    </p>

                    <div className="flex items-center gap-3 mt-2 text-[11px] text-text-secondary">
                      <span className="flex items-center gap-1">
                        <Clock size={11} className="text-accent" />
                        {formatMinutes(summary.loggedMinutes)}
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <CheckCircle2 size={11} className="text-accent" />
                        {summary.tasksCompletedCount} tasks completed
                      </span>
                      {hasReflection && (
                        <>
                          <span>·</span>
                          <span className="text-accent">Notes recorded</span>
                        </>
                      )}
                    </div>
                  </div>

                  <ChevronRight size={16} className="text-text-secondary shrink-0" />
                </div>
              )
            })}
          </section>
        )}

        {/* TAB 2: WEEKLY REVIEWS LIST */}
        {activeTab === 'weekly' && (
          <section className="space-y-3" aria-label="Weekly reviews list">
            <div className="bg-bg-card rounded-2xl p-4 border border-border flex items-center justify-between gap-3">
              <div>
                <h3 className="text-sm font-semibold text-text-primary">Weekly Review System</h3>
                <p className="text-xs text-text-secondary">
                  Reflect on wins, blockers, and set the next week's priority outcome.
                </p>
              </div>
              <Button size="sm" variant="primary" onClick={openNewWeeklyReview}>
                Review Current Week
              </Button>
            </div>

            {weeklyReviews.length === 0 ? (
              <div className="bg-bg-card rounded-2xl p-8 border border-border text-center space-y-3">
                <CalendarCheck size={28} className="mx-auto text-accent opacity-80" />
                <p className="text-xs text-text-secondary">
                  No weekly reviews recorded yet.
                </p>
                <Button size="sm" variant="secondary" onClick={openNewWeeklyReview}>
                  Create your first weekly review
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {weeklyReviews.map(review => (
                  <div
                    key={review.id}
                    onClick={() => {
                      setActiveWeeklyReview(review)
                      setIsWeeklyModalOpen(true)
                    }}
                    className="bg-bg-card rounded-2xl p-4 border border-border hover:border-accent/40 cursor-pointer transition-all flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0 flex-1">
                      <span className="text-xs font-bold text-text-primary block">
                        Week of {formatDisplayDate(review.weekStartDate)}
                      </span>
                      {review.nextWeekPriority && (
                        <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                          Priority: {review.nextWeekPriority}
                        </p>
                      )}
                      <span className="text-[11px] text-text-secondary mt-1 block">
                        Updated: {new Date(review.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                    <ChevronRight size={16} className="text-text-secondary shrink-0" />
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </main>

      {/* DAILY REFLECTION MODAL */}
      {activeDailyModal && (
        <Modal
          isOpen={isDailyModalOpen}
          onClose={() => setIsDailyModalOpen(false)}
          title={`Reflection: ${formatDisplayDate(activeDailyModal.date)}`}
          maxWidth="md"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                What did I work on?
              </label>
              <textarea
                rows={3}
                value={activeDailyModal.workedOn}
                onChange={e =>
                  setActiveDailyModal({ ...activeDailyModal, workedOn: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="Key concepts, projects, or exercises worked on..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                What did I learn?
              </label>
              <textarea
                rows={2}
                value={activeDailyModal.learned}
                onChange={e =>
                  setActiveDailyModal({ ...activeDailyModal, learned: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="Key insights, syntax discoveries, or mental models..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                What blocked or confused me?
              </label>
              <textarea
                rows={2}
                value={activeDailyModal.blockers}
                onChange={e =>
                  setActiveDailyModal({ ...activeDailyModal, blockers: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="Bugs, unclear documentation, or topics to revisit..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                What will I do next?
              </label>
              <textarea
                rows={2}
                value={activeDailyModal.nextSteps}
                onChange={e =>
                  setActiveDailyModal({ ...activeDailyModal, nextSteps: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="Immediate outcome to tackle next session..."
              />
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-border">
              <span className="text-xs text-text-secondary">
                {autoSavedNotice ? 'Saved' : ''}
              </span>
              <div className="flex gap-2">
                <Button variant="secondary" onClick={() => setIsDailyModalOpen(false)}>
                  Close
                </Button>
                <Button variant="primary" onClick={handleSaveDaily}>
                  Save Entry
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}

      {/* WEEKLY REVIEW MODAL */}
      {activeWeeklyReview && (
        <Modal
          isOpen={isWeeklyModalOpen}
          onClose={() => setIsWeeklyModalOpen(false)}
          title={`Weekly Review: ${formatDisplayDate(activeWeeklyReview.weekStartDate)}`}
          maxWidth="lg"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                1. What went well?
              </label>
              <textarea
                rows={2}
                value={activeWeeklyReview.wentWell}
                onChange={e =>
                  setActiveWeeklyReview({ ...activeWeeklyReview, wentWell: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="Wins, consistency, or breakthrough moments..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                2. What did I struggle with?
              </label>
              <textarea
                rows={2}
                value={activeWeeklyReview.difficulties}
                onChange={e =>
                  setActiveWeeklyReview({ ...activeWeeklyReview, difficulties: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="Distractions, technical roadblocks, or time constraints..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                3. What did I finish? (Factual Summary)
              </label>
              <textarea
                rows={3}
                value={activeWeeklyReview.completedWork}
                onChange={e =>
                  setActiveWeeklyReview({ ...activeWeeklyReview, completedWork: e.target.value })
                }
                className="w-full px-3 py-2 text-xs font-mono bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                4. What remains incomplete?
              </label>
              <textarea
                rows={2}
                value={activeWeeklyReview.unfinishedWork}
                onChange={e =>
                  setActiveWeeklyReview({ ...activeWeeklyReview, unfinishedWork: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="Unfinished tasks carried over..."
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                5. What is next week’s most important outcome?
              </label>
              <input
                type="text"
                value={activeWeeklyReview.nextWeekPriority}
                onChange={e =>
                  setActiveWeeklyReview({ ...activeWeeklyReview, nextWeekPriority: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. Finish CLI Expense Tracker file persistence & tests"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                6. What adjustment should I make to my schedule?
              </label>
              <textarea
                rows={2}
                value={activeWeeklyReview.scheduleAdjustment}
                onChange={e =>
                  setActiveWeeklyReview({ ...activeWeeklyReview, scheduleAdjustment: e.target.value })
                }
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
                placeholder="e.g. Shift 2 hours to Saturday morning around exam prep..."
              />
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t border-border">
              <Button variant="secondary" onClick={() => setIsWeeklyModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="primary" onClick={handleSaveWeeklyReview}>
                Save Weekly Review
              </Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
