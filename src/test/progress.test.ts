import { describe, it, expect } from 'vitest'
import {
  formatLocalDate,
  formatDisplayDate,
  formatMinutes,
  getMondayOfWeek,
  getSundayOfWeek,
  isTaskOverdue
} from '../utils/date'
import {
  calculateOverallProgress,
  calculatePhaseProgress,
  calculateWeeklyActivity
} from '../utils/progress'
import { RoadmapTask, Milestone, StudySession, AlgorithmProblem } from '../types'

describe('Date Utilities', () => {
  it('formats local date correctly to YYYY-MM-DD', () => {
    const d = new Date(2026, 9, 20) // October 20, 2026
    expect(formatLocalDate(d)).toBe('2026-10-20')
  })

  it('formats display dates', () => {
    const formatted = formatDisplayDate('2026-10-20')
    expect(formatted).toContain('20 October')
  })

  it('formats duration in minutes', () => {
    expect(formatMinutes(45)).toBe('45m')
    expect(formatMinutes(60)).toBe('1h')
    expect(formatMinutes(80)).toBe('1h 20m')
  })

  it('identifies Monday and Sunday of a week', () => {
    // 2026-10-20 is a Tuesday
    const monday = getMondayOfWeek('2026-10-20')
    expect(monday).toBe('2026-10-19')
    const sunday = getSundayOfWeek(monday)
    expect(sunday).toBe('2026-10-25')
  })

  it('calculates overdue tasks properly', () => {
    expect(isTaskOverdue('2026-10-15', 'not_started', '2026-10-20')).toBe(true)
    expect(isTaskOverdue('2026-10-25', 'not_started', '2026-10-20')).toBe(false)
    expect(isTaskOverdue('2026-10-15', 'completed', '2026-10-20')).toBe(false)
  })
})

describe('Progress Calculations', () => {
  const mockTasks: RoadmapTask[] = [
    {
      id: 't1',
      phaseId: 'p1',
      title: 'T1',
      description: '',
      category: 'Learning',
      estimatedMinutes: 30,
      status: 'completed',
      priority: 'normal',
      createdAt: '2026-10-20',
      updatedAt: '2026-10-20'
    },
    {
      id: 't2',
      phaseId: 'p1',
      title: 'T2',
      description: '',
      category: 'Projects',
      estimatedMinutes: 45,
      status: 'not_started',
      priority: 'important',
      createdAt: '2026-10-20',
      updatedAt: '2026-10-20'
    },
    {
      id: 't3',
      phaseId: 'p1',
      title: 'Custom Task',
      description: '',
      category: 'Learning',
      estimatedMinutes: 15,
      status: 'completed',
      priority: 'normal',
      isCustom: true,
      createdAt: '2026-10-20',
      updatedAt: '2026-10-20'
    }
  ]

  const mockMilestones: Milestone[] = [
    {
      id: 'm1',
      phaseId: 'p1',
      title: 'M1',
      description: '',
      completionCriteria: ['C1'],
      targetDate: '2026-10-26',
      status: 'completed'
    },
    {
      id: 'm2',
      phaseId: 'p1',
      title: 'M2',
      description: '',
      completionCriteria: ['C2'],
      targetDate: '2026-12-31',
      status: 'pending'
    }
  ]

  const mockSessions: StudySession[] = [
    {
      id: 's1',
      date: '2026-10-20',
      durationMinutes: 90,
      category: 'Learning',
      createdAt: '2026-10-20T10:00:00Z'
    },
    {
      id: 's2',
      date: '2026-10-21',
      durationMinutes: 30,
      category: 'Projects',
      createdAt: '2026-10-21T10:00:00Z'
    }
  ]

  const mockProblems: AlgorithmProblem[] = [
    {
      id: 'a1',
      title: 'Two Sum',
      url: '',
      topic: 'Arrays',
      difficulty: 'Easy',
      status: 'solved_independently',
      complexity: 'O(N)',
      solutionNotes: ''
    },
    {
      id: 'a2',
      title: 'Add Two Numbers',
      url: '',
      topic: 'Linked List',
      difficulty: 'Medium',
      status: 'solved_with_help',
      complexity: 'O(N)',
      solutionNotes: ''
    }
  ]

  it('calculates roadmap completion without including custom tasks', () => {
    const stats = calculateOverallProgress(mockTasks, mockMilestones, mockSessions, mockProblems)
    // Non-custom tasks: 2 (t1 and t2). Completed: 1 (t1). 1/2 = 50%
    expect(stats.totalRoadmapTasks).toBe(2)
    expect(stats.completedRoadmapTasks).toBe(1)
    expect(stats.roadmapCompletionPct).toBe(50)
    expect(stats.completedMilestonesCount).toBe(1)
    expect(stats.totalMilestonesCount).toBe(2)
    expect(stats.totalStudyHours).toBe(2) // 120 minutes = 2 hours
    expect(stats.masteredAlgorithmsCount).toBe(1)
  })

  it('calculates phase progress accurately', () => {
    const p1Progress = calculatePhaseProgress('p1', mockTasks, mockMilestones)
    expect(p1Progress.totalTasks).toBe(2)
    expect(p1Progress.completedTasks).toBe(1)
    expect(p1Progress.percentage).toBe(50)
  })

  it('aggregates weekly activity correctly without penalties', () => {
    const activity = calculateWeeklyActivity(mockSessions, 17, '2026-10-20', 4)
    expect(activity.length).toBe(4)
    // The current week should contain s1 (90m) and s2 (30m) = 120m (2 hours)
    const currentWeek = activity[activity.length - 1]
    expect(currentWeek.actualMinutes).toBe(120)
    expect(currentWeek.actualHours).toBe(2)
    expect(currentWeek.diffHours).toBe(-15)
    expect(currentWeek.categoryBreakdown.Learning).toBe(90)
    expect(currentWeek.categoryBreakdown.Projects).toBe(30)
  })
})
