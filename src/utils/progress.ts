import {
  RoadmapTask,
  Milestone,
  StudySession,
  AlgorithmProblem,
  StudyCategory,
  RoadmapPhase,
  AppSettings
} from '../types'
import {
  formatLocalDate,
  getMondayOfWeek,
  getSundayOfWeek,
  getLastNWeeksMondays
} from './date'

export interface OverallProgressStats {
  roadmapCompletionPct: number
  totalRoadmapTasks: number
  completedRoadmapTasks: number
  completedMilestonesCount: number
  totalMilestonesCount: number
  totalStudyHours: number
  masteredAlgorithmsCount: number
  totalAlgorithmsCount: number
}

export interface WeekActivityData {
  mondayDate: string
  sundayDate: string
  label: string
  actualMinutes: number
  actualHours: number
  targetHours: number
  diffHours: number
  isCurrentWeek: boolean
  categoryBreakdown: Record<StudyCategory, number> // in minutes
}

export interface CategoryProgressData {
  category: StudyCategory
  completedTasks: number
  totalTasks: number
  completionPct: number
  loggedMinutes: number
  loggedHours: number
  weeklyTargetHours: number
}

/**
 * Calculates overall roadmap progress strictly from eligible non-custom roadmap tasks.
 */
export function calculateOverallProgress(
  tasks: RoadmapTask[],
  milestones: Milestone[],
  sessions: StudySession[],
  problems: AlgorithmProblem[]
): OverallProgressStats {
  // Eligible roadmap tasks are tasks not marked as custom additions
  const roadmapTasks = tasks.filter(t => !t.isCustom)
  const totalRoadmapTasks = roadmapTasks.length
  const completedRoadmapTasks = roadmapTasks.filter(t => t.status === 'completed').length

  const roadmapCompletionPct = totalRoadmapTasks > 0
    ? Math.round((completedRoadmapTasks / totalRoadmapTasks) * 100)
    : 0

  const totalMilestonesCount = milestones.length
  const completedMilestonesCount = milestones.filter(m => m.status === 'completed').length

  const totalStudyMinutes = sessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
  const totalStudyHours = Math.round((totalStudyMinutes / 60) * 10) / 10

  const totalAlgorithmsCount = problems.length
  const masteredAlgorithmsCount = problems.filter(p => p.status === 'solved_independently').length

  return {
    roadmapCompletionPct,
    totalRoadmapTasks,
    completedRoadmapTasks,
    completedMilestonesCount,
    totalMilestonesCount,
    totalStudyHours,
    masteredAlgorithmsCount,
    totalAlgorithmsCount
  }
}

/**
 * Calculates phase-specific progress statistics.
 */
export function calculatePhaseProgress(
  phaseId: string,
  tasks: RoadmapTask[],
  milestones: Milestone[]
): {
  totalTasks: number
  completedTasks: number
  percentage: number
  totalMilestones: number
  completedMilestones: number
} {
  const phaseTasks = tasks.filter(t => t.phaseId === phaseId && !t.isCustom)
  const totalTasks = phaseTasks.length
  const completedTasks = phaseTasks.filter(t => t.status === 'completed').length
  const percentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

  const phaseMilestones = milestones.filter(m => m.phaseId === phaseId)
  const totalMilestones = phaseMilestones.length
  const completedMilestones = phaseMilestones.filter(m => m.status === 'completed').length

  return {
    totalTasks,
    completedTasks,
    percentage,
    totalMilestones,
    completedMilestones
  }
}

/**
 * Computes weekly activity breakdown for the last N weeks (default 8).
 */
export function calculateWeeklyActivity(
  sessions: StudySession[],
  weeklyTargetHours: number,
  todayStr = formatLocalDate(),
  numWeeks = 8
): WeekActivityData[] {
  const mondays = getLastNWeeksMondays(numWeeks, todayStr)
  const currentMonday = getMondayOfWeek(todayStr)

  return mondays.map(mondayDate => {
    const sundayDate = getSundayOfWeek(mondayDate)
    const isCurrentWeek = mondayDate === currentMonday

    // Filter sessions that fall in this week [mondayDate, sundayDate]
    const weekSessions = sessions.filter(s => s.date >= mondayDate && s.date <= sundayDate)

    const categoryBreakdown: Record<StudyCategory, number> = {
      Projects: 0,
      DSA: 0,
      Learning: 0,
      'CS fundamentals': 0,
      Career: 0
    }

    let actualMinutes = 0
    for (const s of weekSessions) {
      actualMinutes += s.durationMinutes || 0
      if (categoryBreakdown[s.category] !== undefined) {
        categoryBreakdown[s.category] += s.durationMinutes || 0
      } else {
        categoryBreakdown.Learning += s.durationMinutes || 0
      }
    }

    const actualHours = Math.round((actualMinutes / 60) * 10) / 10
    const diffHours = Math.round((actualHours - weeklyTargetHours) * 10) / 10

    // Label: e.g. "19 Oct"
    const [y, m, d] = mondayDate.split('-').map(Number)
    const labelDate = new Date(y, m - 1, d)
    const label = labelDate.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })

    return {
      mondayDate,
      sundayDate,
      label,
      actualMinutes,
      actualHours,
      targetHours: weeklyTargetHours,
      diffHours,
      isCurrentWeek,
      categoryBreakdown
    }
  })
}

/**
 * Calculates progress for each learning category.
 */
export function calculateCategoryProgress(
  tasks: RoadmapTask[],
  sessions: StudySession[],
  settings?: AppSettings
): CategoryProgressData[] {
  const categories: StudyCategory[] = ['Projects', 'DSA', 'Learning', 'CS fundamentals', 'Career']
  const targetSplit = settings?.categoryTargets || {
    Projects: 7,
    DSA: 4,
    Learning: 3,
    'CS fundamentals': 2,
    Career: 1
  }

  return categories.map(cat => {
    const catTasks = tasks.filter(t => t.category === cat && !t.isCustom)
    const totalTasks = catTasks.length
    const completedTasks = catTasks.filter(t => t.status === 'completed').length
    const completionPct = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0

    const catSessions = sessions.filter(s => s.category === cat)
    const loggedMinutes = catSessions.reduce((acc, s) => acc + (s.durationMinutes || 0), 0)
    const loggedHours = Math.round((loggedMinutes / 60) * 10) / 10

    return {
      category: cat,
      completedTasks,
      totalTasks,
      completionPct,
      loggedMinutes,
      loggedHours,
      weeklyTargetHours: targetSplit[cat] || 0
    }
  })
}

/**
 * Calculates consistency: days studied in current week and past 14 days activity map.
 */
export function calculateConsistencyStats(
  sessions: StudySession[],
  todayStr = formatLocalDate()
): {
  daysStudiedThisWeek: number
  totalDaysInWeek: number
  studiedDatesSet: Set<string>
  past14Days: { dateStr: string; dayLabel: string; studied: boolean; minutes: number }[]
} {
  const currentMonday = getMondayOfWeek(todayStr)
  const currentSunday = getSundayOfWeek(currentMonday)

  const studiedDatesSet = new Set<string>()
  const dateMinutesMap = new Map<string, number>()

  for (const s of sessions) {
    if (s.durationMinutes > 0) {
      studiedDatesSet.add(s.date)
      const current = dateMinutesMap.get(s.date) || 0
      dateMinutesMap.set(s.date, current + s.durationMinutes)
    }
  }

  // Count unique days studied in current week
  let daysStudiedThisWeek = 0
  const today = new Date()

  // Build past 14 days
  const past14Days: { dateStr: string; dayLabel: string; studied: boolean; minutes: number }[] = []
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dStr = formatLocalDate(d)
    const minutes = dateMinutesMap.get(dStr) || 0
    const dayLabel = d.toLocaleDateString('en-GB', { weekday: 'narrow' })

    past14Days.push({
      dateStr: dStr,
      dayLabel,
      studied: minutes > 0,
      minutes
    })

    if (dStr >= currentMonday && dStr <= currentSunday && minutes > 0) {
      daysStudiedThisWeek++
    }
  }

  return {
    daysStudiedThisWeek,
    totalDaysInWeek: 7,
    studiedDatesSet,
    past14Days
  }
}

/**
 * Finds the currently active roadmap phase.
 */
export function getActivePhase(phases: RoadmapPhase[]): RoadmapPhase | undefined {
  return phases.find(p => p.status === 'active') || phases[0]
}
