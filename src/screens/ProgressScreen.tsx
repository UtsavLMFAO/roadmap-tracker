import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { ProgressBar } from '../components/common/ProgressBar'
import { useApp } from '../context/AppContext'
import { db } from '../../src/db'
import {
  RoadmapTask,
  Milestone,
  StudySession,
  AlgorithmProblem,
  RoadmapPhase,
  StudyCategory
} from '../types'
import {
  calculateOverallProgress,
  calculateWeeklyActivity,
  calculateCategoryProgress,
  calculateConsistencyStats,
  WeekActivityData,
  CategoryProgressData,
  OverallProgressStats
} from '../utils/progress'
import {
  formatLocalDate,
  formatDisplayDate,
  formatMinutes
} from '../utils/date'
import {
  Award,
  Clock,
  Code2,
  CalendarCheck,
  TrendingUp,
  Milestone as MilestoneIcon,
  CheckCircle2,
  Circle
} from 'lucide-react'

export const ProgressScreen: React.FC = () => {
  const { settings, openMilestoneModal } = useApp()
  const todayStr = formatLocalDate()

  const [overallStats, setOverallStats] = useState<OverallProgressStats | null>(null)
  const [weeklyActivity, setWeeklyActivity] = useState<WeekActivityData[]>([])
  const [categoryProgress, setCategoryProgress] = useState<CategoryProgressData[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [selectedWeek, setSelectedWeek] = useState<WeekActivityData | null>(null)
  const [consistency, setConsistency] = useState<{
    daysStudiedThisWeek: number
    totalDaysInWeek: number
    past14Days: { dateStr: string; dayLabel: string; studied: boolean; minutes: number }[]
  } | null>(null)

  useEffect(() => {
    async function loadProgressData() {
      const [allTasks, allMilestones, allSessions, allProblems] = await Promise.all([
        db.tasks.toArray(),
        db.milestones.toArray(),
        db.studySessions.toArray(),
        db.problems.toArray()
      ])

      // 1. Overall stats
      const stats = calculateOverallProgress(allTasks, allMilestones, allSessions, allProblems)
      setOverallStats(stats)

      // 2. Weekly activity (last 8 weeks)
      const weekly = calculateWeeklyActivity(allSessions, settings.weeklyTargetHours, todayStr, 8)
      setWeeklyActivity(weekly)
      if (weekly.length > 0) {
        setSelectedWeek(weekly[weekly.length - 1]) // Default select current week
      }

      // 3. Category progress
      const catProgress = calculateCategoryProgress(allTasks, allSessions, settings)
      setCategoryProgress(catProgress)

      // 4. Milestones
      setMilestones(allMilestones)

      // 5. Consistency
      const conStats = calculateConsistencyStats(allSessions, todayStr)
      setConsistency(conStats)
    }

    loadProgressData()
  }, [settings, todayStr])

  if (!overallStats) {
    return <div className="p-8 text-center text-text-secondary text-sm">Calculating progress...</div>
  }

  // Find max hours in weekly chart for scale
  const maxWeeklyHours = Math.max(
    settings.weeklyTargetHours + 5,
    ...weeklyActivity.map(w => w.actualHours)
  )

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-bg transition-colors">
      <Header
        title="Progress"
        subtitle="Consistent personal growth without artificial gamification"
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* SECTION A: OVERALL PROGRESS METRICS */}
        <section
          aria-label="Overall metrics"
          className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs uppercase tracking-wider font-semibold text-text-secondary">
              Overall Roadmap Completion
            </span>
            <span className="text-xl font-bold text-accent">
              {overallStats.roadmapCompletionPct}%
            </span>
          </div>

          <ProgressBar value={overallStats.roadmapCompletionPct} height="md" />

          {/* Quick metric tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3 bg-bg-subtle rounded-xl border border-border">
              <span className="text-[11px] text-text-secondary flex items-center gap-1 font-medium">
                <Clock size={12} className="text-accent" />
                Study Hours
              </span>
              <div className="text-lg font-bold text-text-primary mt-0.5">
                {overallStats.totalStudyHours}h
              </div>
              <div className="text-[11px] text-text-secondary">Logged total</div>
            </div>

            <div className="p-3 bg-bg-subtle rounded-xl border border-border">
              <span className="text-[11px] text-text-secondary flex items-center gap-1 font-medium">
                <TrendingUp size={12} className="text-accent" />
                Tasks Done
              </span>
              <div className="text-lg font-bold text-text-primary mt-0.5">
                {overallStats.completedRoadmapTasks} / {overallStats.totalRoadmapTasks}
              </div>
              <div className="text-[11px] text-text-secondary">Roadmap tasks</div>
            </div>

            <div className="p-3 bg-bg-subtle rounded-xl border border-border">
              <span className="text-[11px] text-text-secondary flex items-center gap-1 font-medium">
                <Award size={12} className="text-accent" />
                Milestones
              </span>
              <div className="text-lg font-bold text-text-primary mt-0.5">
                {overallStats.completedMilestonesCount} / {overallStats.totalMilestonesCount}
              </div>
              <div className="text-[11px] text-text-secondary">Completed</div>
            </div>

            <div className="p-3 bg-bg-subtle rounded-xl border border-border">
              <span className="text-[11px] text-text-secondary flex items-center gap-1 font-medium">
                <Code2 size={12} className="text-accent" />
                DSA Mastered
              </span>
              <div className="text-lg font-bold text-text-primary mt-0.5">
                {overallStats.masteredAlgorithmsCount} / {overallStats.totalAlgorithmsCount}
              </div>
              <div className="text-[11px] text-text-secondary">Independent solutions</div>
            </div>
          </div>
        </section>

        {/* SECTION B: WEEKLY ACTIVITY (LAST 8 WEEKS) */}
        <section
          aria-label="Weekly activity"
          className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                Weekly Study Hours (Last 8 Weeks)
              </h3>
              <p className="text-xs text-text-secondary">
                Target: {settings.weeklyTargetHours}h / week outside university coursework
              </p>
            </div>

            {selectedWeek && (
              <div className="text-right">
                <span className="text-xs font-semibold text-text-primary">
                  {selectedWeek.actualHours}h
                </span>
                <span className="text-[11px] text-text-secondary ml-1">
                  ({selectedWeek.diffHours >= 0 ? `+${selectedWeek.diffHours}` : selectedWeek.diffHours}h vs target)
                </span>
              </div>
            )}
          </div>

          {/* Clean SVG Bar Chart */}
          <div className="h-44 w-full pt-2 flex flex-col justify-end">
            <div className="relative h-36 flex items-end justify-between gap-2 px-1 border-b border-border">
              {/* Target threshold line */}
              <div
                className="absolute left-0 right-0 border-t border-dashed border-accent/40 z-0 pointer-events-none"
                style={{
                  bottom: `${(settings.weeklyTargetHours / maxWeeklyHours) * 100}%`
                }}
              >
                <span className="absolute right-1 -top-4 text-[10px] text-accent/80 font-mono">
                  {settings.weeklyTargetHours}h target
                </span>
              </div>

              {weeklyActivity.map((week, idx) => {
                const heightPct = Math.min(100, Math.max(4, (week.actualHours / maxWeeklyHours) * 100))
                const isSelected = selectedWeek?.mondayDate === week.mondayDate

                return (
                  <div
                    key={idx}
                    onClick={() => setSelectedWeek(week)}
                    className="flex-1 flex flex-col items-center justify-end h-full z-10 cursor-pointer group"
                  >
                    <span className="text-[10px] font-mono text-text-secondary mb-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {week.actualHours}h
                    </span>
                    <div
                      className={`w-full max-w-[28px] rounded-t-md transition-all duration-200 ${
                        isSelected
                          ? 'bg-accent'
                          : week.actualHours >= settings.weeklyTargetHours
                          ? 'bg-accent/80 hover:bg-accent'
                          : 'bg-border hover:bg-text-secondary/50'
                      }`}
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                )
              })}
            </div>

            {/* X Axis Labels */}
            <div className="flex justify-between items-center px-1 pt-1.5 text-[10px] text-text-secondary">
              {weeklyActivity.map((w, idx) => (
                <span
                  key={idx}
                  className={`text-center flex-1 ${
                    selectedWeek?.mondayDate === w.mondayDate ? 'font-bold text-accent' : ''
                  }`}
                >
                  {w.label}
                </span>
              ))}
            </div>
          </div>

          {/* Selected Week Category Breakdown */}
          {selectedWeek && (
            <div className="p-3 bg-bg-subtle rounded-xl border border-border space-y-2 mt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-semibold text-text-primary">
                  Week of {formatDisplayDate(selectedWeek.mondayDate)}
                </span>
                <span className="text-text-secondary">
                  Total: {selectedWeek.actualHours}h
                </span>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-[11px]">
                {Object.entries(selectedWeek.categoryBreakdown).map(([cat, mins]) => (
                  <div key={cat} className="p-2 bg-bg-card rounded-lg border border-border">
                    <span className="text-text-secondary block truncate">{cat}</span>
                    <span className="font-bold text-text-primary">
                      {formatMinutes(mins)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* SECTION C: LEARNING CATEGORIES PROGRESS */}
        <section
          aria-label="Learning categories"
          className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3"
        >
          <h3 className="text-sm sm:text-base font-semibold text-text-primary">
            Categories & Syllabus Progress
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {categoryProgress.map(cat => (
              <div
                key={cat.category}
                className="p-3.5 bg-bg-subtle rounded-xl border border-border space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-text-primary">
                    {cat.category}
                  </span>
                  <span className="text-xs text-text-secondary font-mono">
                    {cat.loggedHours}h logged
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs text-text-secondary">
                  <span>{cat.completedTasks} of {cat.totalTasks} tasks completed</span>
                  <span className="font-semibold text-text-primary">{cat.completionPct}%</span>
                </div>

                <ProgressBar value={cat.completionPct} height="sm" />
              </div>
            ))}
          </div>
        </section>

        {/* SECTION D: MILESTONES SUMMARY */}
        <section
          aria-label="Milestones summary"
          className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-sm sm:text-base font-semibold text-text-primary">
              Roadmap Milestones ({milestones.filter(m => m.status === 'completed').length}/{milestones.length})
            </h3>
          </div>

          <div className="space-y-2 max-h-80 overflow-y-auto">
            {milestones.map(m => {
              const isDone = m.status === 'completed'
              return (
                <div
                  key={m.id}
                  onClick={() => openMilestoneModal(m)}
                  className="flex items-center justify-between p-3 rounded-xl border border-border bg-bg hover:bg-bg-subtle cursor-pointer transition-colors gap-3"
                >
                  <div className="flex items-center gap-2.5 min-w-0 flex-1">
                    {isDone ? (
                      <CheckCircle2 size={16} className="text-accent shrink-0" />
                    ) : (
                      <Circle size={16} className="text-text-secondary shrink-0" />
                    )}
                    <div className="min-w-0">
                      <span
                        className={`text-xs font-semibold block truncate ${
                          isDone ? 'line-through text-text-secondary' : 'text-text-primary'
                        }`}
                      >
                        {m.title}
                      </span>
                      <span className="text-[11px] text-text-secondary block">
                        Target: {formatDisplayDate(m.targetDate)}
                      </span>
                    </div>
                  </div>

                  <span
                    className={`text-[10px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded shrink-0 ${
                      isDone ? 'bg-accent-subtle text-accent' : 'bg-bg-subtle text-text-secondary'
                    }`}
                  >
                    {isDone ? 'Complete' : 'Pending'}
                  </span>
                </div>
              )
            })}
          </div>
        </section>

        {/* SECTION E: CONSISTENCY */}
        {consistency && (
          <section
            aria-label="Consistency"
            className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border shadow-xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm sm:text-base font-semibold text-text-primary">
                  Consistency & Rhythm
                </h3>
                <p className="text-xs text-text-secondary">
                  Studied on {consistency.daysStudiedThisWeek} of {consistency.totalDaysInWeek} days this week
                </p>
              </div>
            </div>

            {/* 14-day activity strip without streak guilt */}
            <div className="pt-2">
              <span className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary block mb-2">
                Recent 14-Day Activity
              </span>
              <div className="grid grid-cols-7 sm:grid-cols-14 gap-2">
                {consistency.past14Days.map((d, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center gap-1"
                    title={`${d.dateStr}: ${d.studied ? formatMinutes(d.minutes) : 'No sessions'}`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-mono transition-colors ${
                        d.studied
                          ? 'bg-accent text-white font-bold'
                          : 'bg-bg-subtle border border-border text-text-secondary'
                      }`}
                    >
                      {d.studied ? '✓' : ''}
                    </div>
                    <span className="text-[10px] text-text-secondary">{d.dayLabel}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
    </div>
  )
}
