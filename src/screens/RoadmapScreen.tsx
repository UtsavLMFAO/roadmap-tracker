import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/common/Button'
import { ProgressBar } from '../components/common/ProgressBar'
import { useApp } from '../context/AppContext'
import { db } from '../../src/db'
import {
  RoadmapPhase,
  RoadmapTask,
  Milestone,
  TaskStatus
} from '../types'
import {
  formatLocalDate,
  formatDisplayDate,
  formatMinutes,
  isTaskOverdue
} from '../utils/date'
import {
  calculatePhaseProgress,
  calculateOverallProgress
} from '../utils/progress'
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  ChevronDown,
  ChevronUp,
  Filter,
  Milestone as MilestoneIcon,
  BookOpen,
  ExternalLink,
  Calendar,
  AlertCircle
} from 'lucide-react'

type FilterType = 'all_phases' | 'current_phase' | 'incomplete' | 'completed' | 'overdue'

export const RoadmapScreen: React.FC = () => {
  const { openTaskModal, openMilestoneModal, showToast } = useApp()
  const todayStr = formatLocalDate()

  const [phases, setPhases] = useState<RoadmapPhase[]>([])
  const [tasks, setTasks] = useState<RoadmapTask[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])
  const [expandedPhaseIds, setExpandedPhaseIds] = useState<Set<string>>(new Set(['phase-1']))
  const [activeFilter, setActiveFilter] = useState<FilterType>('current_phase')
  const [showFilters, setShowFilters] = useState(false)

  // Overall stats
  const [overallCompletion, setOverallCompletion] = useState(0)

  useEffect(() => {
    async function loadRoadmap() {
      const [allPhases, allTasks, allMilestones, allSessions, allProblems] = await Promise.all([
        db.phases.orderBy('order').toArray(),
        db.tasks.toArray(),
        db.milestones.toArray(),
        db.studySessions.toArray(),
        db.problems.toArray()
      ])

      setPhases(allPhases)
      setTasks(allTasks)
      setMilestones(allMilestones)

      const overall = calculateOverallProgress(allTasks, allMilestones, allSessions, allProblems)
      setOverallCompletion(overall.roadmapCompletionPct)
    }

    loadRoadmap()
  }, [])

  const togglePhaseExpand = (phaseId: string) => {
    setExpandedPhaseIds(prev => {
      const next = new Set(prev)
      if (next.has(phaseId)) next.delete(phaseId)
      else next.add(phaseId)
      return next
    })
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

    setTasks(prev => prev.map(t => (t.id === task.id ? updated : t)))
    showToast(isNowCompleted ? 'Task completed' : 'Task marked incomplete')
  }

  // Filter Phases
  const displayedPhases = phases.filter(p => {
    if (activeFilter === 'current_phase') {
      return p.status === 'active' || p.id === 'phase-1'
    }
    return true
  })

  // Filter Tasks within a phase
  const filterPhaseTasks = (phaseTasks: RoadmapTask[]) => {
    return phaseTasks.filter(t => {
      if (activeFilter === 'incomplete') return t.status !== 'completed' && t.status !== 'skipped'
      if (activeFilter === 'completed') return t.status === 'completed'
      if (activeFilter === 'overdue') return isTaskOverdue(t.targetDate, t.status, todayStr)
      return true
    })
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-bg transition-colors">
      <Header
        title="Roadmap"
        subtitle="20 October 2026 – December 2028"
        action={
          <button
            onClick={() => setShowFilters(prev => !prev)}
            className={`p-2 rounded-lg border transition-colors ${
              showFilters || activeFilter !== 'current_phase'
                ? 'bg-accent-subtle text-accent border-accent/30'
                : 'text-text-secondary border-border hover:bg-bg-subtle'
            }`}
            aria-label="Toggle roadmap filters"
          >
            <Filter size={18} />
          </button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* SUMMARY HEADER BAR */}
        <section className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <span className="text-xs uppercase tracking-wider font-semibold text-accent block">
                Current Phase
              </span>
              <h2 className="text-base sm:text-lg font-bold text-text-primary">
                Phase 1: Programming Foundations
              </h2>
            </div>
            <div className="text-right">
              <span className="text-xs text-text-secondary block">Overall Plan</span>
              <span className="text-lg font-bold text-text-primary">{overallCompletion}%</span>
            </div>
          </div>
          <ProgressBar value={overallCompletion} height="sm" />
        </section>

        {/* EXPANDABLE FILTER ROW */}
        {showFilters && (
          <section className="bg-bg-card rounded-xl p-3 border border-border flex flex-wrap gap-1.5 animate-in fade-in duration-150">
            {[
              { id: 'current_phase', label: 'Current Phase' },
              { id: 'all_phases', label: 'All 9 Phases' },
              { id: 'incomplete', label: 'Incomplete' },
              { id: 'completed', label: 'Completed' },
              { id: 'overdue', label: 'Overdue' }
            ].map(f => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id as FilterType)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  activeFilter === f.id
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-bg-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                {f.label}
              </button>
            ))}
          </section>
        )}

        {/* VERTICALLY STACKED PHASES */}
        <div className="space-y-4">
          {displayedPhases.map(phase => {
            const isExpanded = expandedPhaseIds.has(phase.id)
            const phaseTasks = tasks.filter(t => t.phaseId === phase.id)
            const phaseMilestones = milestones.filter(m => m.phaseId === phase.id)
            const filteredTasks = filterPhaseTasks(phaseTasks)
            const progress = calculatePhaseProgress(phase.id, tasks, milestones)

            return (
              <div
                key={phase.id}
                className="bg-bg-card rounded-2xl border border-border overflow-hidden transition-all shadow-xs"
              >
                {/* Phase Header Row */}
                <div
                  onClick={() => togglePhaseExpand(phase.id)}
                  className="p-4 sm:p-5 flex items-start sm:items-center justify-between gap-3 cursor-pointer hover:bg-bg-subtle/50 transition-colors select-none"
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-bold text-accent uppercase tracking-wider">
                        Phase {phase.phaseNumber}
                      </span>
                      <span className="text-xs text-text-secondary">·</span>
                      <span className="text-xs text-text-secondary">{phase.startDate} – {phase.endDate}</span>
                    </div>

                    <h3 className="text-base font-bold text-text-primary leading-tight">
                      {phase.title}
                    </h3>
                    <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                      {phase.objective}
                    </p>
                  </div>

                  {/* Progress & Expand Icon */}
                  <div className="flex items-center gap-3 shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-semibold text-text-primary">
                        {progress.completedTasks}/{progress.totalTasks} tasks
                      </div>
                      <div className="text-[11px] text-text-secondary">
                        {progress.percentage}%
                      </div>
                    </div>

                    <div className="p-1 rounded-lg text-text-secondary">
                      {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                    </div>
                  </div>
                </div>

                {/* Progress bar line under phase header */}
                <div className="h-1 bg-border/40 w-full">
                  <div
                    className="h-full bg-accent transition-all duration-300"
                    style={{ width: `${progress.percentage}%` }}
                  />
                </div>

                {/* Phase Expanded Detail */}
                {isExpanded && (
                  <div className="p-4 sm:p-6 space-y-6 bg-bg/20 border-t border-border">
                    {/* Objective */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-1">
                        Phase Objective
                      </h4>
                      <p className="text-sm text-text-primary leading-relaxed">
                        {phase.objective}
                      </p>
                    </div>

                    {/* Key Topics */}
                    <div>
                      <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
                        Key Topics
                      </h4>
                      <div className="flex flex-wrap gap-1.5">
                        {phase.topics.map((topic, i) => (
                          <span
                            key={i}
                            className="text-xs px-2.5 py-1 rounded-lg bg-bg-card border border-border text-text-primary font-normal"
                          >
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Milestones */}
                    {phaseMilestones.length > 0 && (
                      <div className="space-y-2.5">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                          Milestones
                        </h4>
                        <div className="grid grid-cols-1 gap-2.5">
                          {phaseMilestones.map(m => (
                            <div
                              key={m.id}
                              onClick={() => openMilestoneModal(m)}
                              className="p-3 rounded-xl border border-border bg-bg-card hover:border-accent/40 cursor-pointer transition-all flex items-start justify-between gap-3"
                            >
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center gap-2">
                                  <MilestoneIcon size={14} className="text-accent shrink-0" />
                                  <span className="text-sm font-semibold text-text-primary truncate">
                                    {m.title}
                                  </span>
                                </div>
                                <p className="text-xs text-text-secondary mt-1 line-clamp-1">
                                  {m.description}
                                </p>
                                <div className="flex items-center gap-2 mt-2 text-[11px] text-text-secondary">
                                  <span>Target: {formatDisplayDate(m.targetDate)}</span>
                                  <span>·</span>
                                  <span>{m.completionCriteria.length} criteria</span>
                                </div>
                              </div>

                              <span
                                className={`text-[11px] uppercase tracking-wider font-semibold px-2 py-0.5 rounded ${
                                  m.status === 'completed'
                                    ? 'bg-accent-subtle text-accent'
                                    : 'bg-bg-subtle text-text-secondary'
                                }`}
                              >
                                {m.status === 'completed' ? 'Completed' : 'Pending'}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Tasks Checklist */}
                    <div className="space-y-2.5">
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                          Actionable Tasks ({filteredTasks.length})
                        </h4>
                        <Button
                          size="sm"
                          variant="secondary"
                          onClick={() => openTaskModal(undefined, { phaseId: phase.id })}
                          icon={<Plus size={13} />}
                        >
                          Add Task
                        </Button>
                      </div>

                      {filteredTasks.length === 0 ? (
                        <div className="p-4 text-center text-xs text-text-secondary border border-dashed border-border rounded-xl">
                          No tasks match the active filter in this phase.
                        </div>
                      ) : (
                        <div className="space-y-2">
                          {filteredTasks.map(task => {
                            const isCompleted = task.status === 'completed'
                            const isOverdue = isTaskOverdue(task.targetDate, task.status, todayStr)

                            return (
                              <div
                                key={task.id}
                                className={`flex items-start gap-3 p-3 rounded-xl border transition-all ${
                                  isCompleted
                                    ? 'bg-bg/40 border-border/60 opacity-80'
                                    : 'bg-bg-card border-border hover:border-text-secondary/40'
                                }`}
                              >
                                <button
                                  onClick={() => handleToggleTask(task)}
                                  className="mt-0.5 shrink-0 text-accent transition-transform active:scale-90"
                                  aria-label={isCompleted ? 'Mark incomplete' : 'Mark complete'}
                                >
                                  {isCompleted ? (
                                    <CheckCircle2 size={18} className="text-accent" />
                                  ) : (
                                    <Circle size={18} className="text-text-secondary hover:text-accent" />
                                  )}
                                </button>

                                <div
                                  className="flex-1 min-w-0 cursor-pointer"
                                  onClick={() => openTaskModal(task.id)}
                                >
                                  <div className="flex items-center gap-2">
                                    <span
                                      className={`text-sm font-medium leading-snug ${
                                        isCompleted
                                          ? 'line-through text-text-secondary'
                                          : 'text-text-primary hover:text-accent'
                                      }`}
                                    >
                                      {task.title}
                                    </span>
                                    {task.priority === 'important' && (
                                      <span className="shrink-0 text-[10px] font-bold text-accent bg-accent-subtle px-1.5 py-0.2 rounded uppercase">
                                        Important
                                      </span>
                                    )}
                                    {isOverdue && (
                                      <span className="shrink-0 text-[10px] font-bold text-overdue bg-overdue/10 px-1.5 py-0.2 rounded uppercase">
                                        Overdue
                                      </span>
                                    )}
                                  </div>

                                  {task.description && (
                                    <p className="text-xs text-text-secondary mt-1 line-clamp-2">
                                      {task.description}
                                    </p>
                                  )}

                                  <div className="flex flex-wrap items-center gap-2 mt-2 text-[11px] text-text-secondary">
                                    <span className="bg-bg-subtle px-1.5 py-0.5 rounded border border-border">
                                      {task.category}
                                    </span>
                                    {task.estimatedMinutes && (
                                      <span className="flex items-center gap-1">
                                        <Clock size={11} />
                                        {task.estimatedMinutes}m
                                      </span>
                                    )}
                                    {task.targetDate && (
                                      <span className="flex items-center gap-1">
                                        <Calendar size={11} />
                                        Target: {task.targetDate}
                                      </span>
                                    )}
                                    {task.isCustom && (
                                      <span className="text-accent italic">Custom</span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>

                    {/* Recommended Resources */}
                    {phase.recommendedResources.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                          Recommended Resources
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                          {phase.recommendedResources.map((res, i) => (
                            <a
                              key={i}
                              href={res.url}
                              target="_blank"
                              rel="noreferrer"
                              className="flex items-center justify-between p-2.5 rounded-lg border border-border bg-bg-card hover:bg-bg-subtle transition-colors group"
                            >
                              <div className="min-w-0">
                                <span className="text-xs font-medium text-text-primary group-hover:text-accent block truncate">
                                  {res.title}
                                </span>
                                {res.note && (
                                  <span className="text-[11px] text-text-secondary block truncate">
                                    {res.note}
                                  </span>
                                )}
                              </div>
                              <ExternalLink size={13} className="text-text-secondary shrink-0 ml-2" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Completion Requirements */}
                    {phase.completionCriteria.length > 0 && (
                      <div className="space-y-1.5 pt-2 border-t border-border/60">
                        <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary">
                          End-of-Phase Criteria
                        </h4>
                        <ul className="space-y-1 text-xs text-text-secondary">
                          {phase.completionCriteria.map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="text-accent font-bold">✓</span>
                              <span>{c}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
