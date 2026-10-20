import { describe, it, expect } from 'vitest'
import {
  SEED_PHASES,
  SEED_TASKS,
  SEED_MILESTONES,
  SEED_PROJECTS,
  SEED_RESOURCES,
  SEED_ALGORITHM_PROBLEMS,
  DEFAULT_SETTINGS
} from '../data/seedData'

describe('Seed Data Integrity', () => {
  it('seeds all 9 roadmap phases consecutively', () => {
    expect(SEED_PHASES.length).toBe(9)
    SEED_PHASES.forEach((phase, index) => {
      expect(phase.phaseNumber).toBe(index + 1)
      expect(phase.id).toBe(`phase-${index + 1}`)
      expect(phase.title.length).toBeGreaterThan(0)
      expect(phase.objective.length).toBeGreaterThan(0)
      expect(phase.topics.length).toBeGreaterThan(0)
      expect(phase.taskIds.length).toBeGreaterThan(0)
      expect(phase.milestoneIds.length).toBeGreaterThan(0)
    })
  })

  it('contains the initial 7-day checklist in Phase 1', () => {
    const phase1Tasks = SEED_TASKS.filter(t => t.phaseId === 'phase-1')
    expect(phase1Tasks.length).toBeGreaterThanOrEqual(7)

    const first7Days = phase1Tasks.slice(0, 7)
    expect(first7Days[0].title).toContain('Verify JDK')
    expect(first7Days[0].scheduledDate).toBe('2026-10-20')
    expect(first7Days[6].title).toContain('Review code')
    expect(first7Days[6].scheduledDate).toBe('2026-10-26')
  })

  it('verifies all tasks reference valid phases and valid categories', () => {
    const validPhases = new Set(SEED_PHASES.map(p => p.id))
    const validCategories = new Set(['Projects', 'DSA', 'Learning', 'CS fundamentals', 'Career'])

    SEED_TASKS.forEach(task => {
      expect(validPhases.has(task.phaseId)).toBe(true)
      expect(validCategories.has(task.category)).toBe(true)
      expect(task.estimatedMinutes).toBeGreaterThan(0)
      expect(task.status).toBe('not_started')
    })
  })

  it('verifies all milestones have measurable criteria and target dates', () => {
    SEED_MILESTONES.forEach(ms => {
      expect(ms.title.length).toBeGreaterThan(0)
      expect(ms.completionCriteria.length).toBeGreaterThan(0)
      expect(ms.targetDate).toMatch(/^\d{4}-\d{2}-\d{2}$/)
      expect(ms.status).toBe('pending')
    })
  })

  it('verifies 4 projects are seeded including CLI, API, Drone app, and Open-Source', () => {
    expect(SEED_PROJECTS.length).toBe(4)
    expect(SEED_PROJECTS[0].name).toContain('Expense Tracker')
    expect(SEED_PROJECTS[1].name).toContain('API')
    expect(SEED_PROJECTS[2].name).toContain('Drone')
    expect(SEED_PROJECTS[3].name).toContain('Open-Source')
  })

  it('verifies all 8 curated resources from SPEC Section 12 are seeded', () => {
    expect(SEED_RESOURCES.length).toBeGreaterThanOrEqual(8)
    const titles = SEED_RESOURCES.map(r => r.title)
    expect(titles.some(t => t.includes('Dev.java'))).toBe(true)
    expect(titles.some(t => t.includes('Spring Boot'))).toBe(true)
    expect(titles.some(t => t.includes('SQLBolt'))).toBe(true)
    expect(titles.some(t => t.includes('Pro Git'))).toBe(true)
    expect(titles.some(t => t.includes('Backend'))).toBe(true)
    expect(titles.some(t => t.includes('NeetCode'))).toBe(true)
    expect(titles.some(t => t.includes('Interviewing'))).toBe(true)
    expect(titles.some(t => t.includes('Student Developer Pack'))).toBe(true)
  })

  it('verifies algorithm problems include core patterns and complexities', () => {
    expect(SEED_ALGORITHM_PROBLEMS.length).toBeGreaterThan(0)
    SEED_ALGORITHM_PROBLEMS.forEach(prob => {
      expect(prob.title.length).toBeGreaterThan(0)
      expect(prob.complexity.length).toBeGreaterThan(0)
      expect(['Easy', 'Medium', 'Hard']).toContain(prob.difficulty)
    })
  })

  it('verifies default settings has 17 hours weekly target and category split', () => {
    expect(DEFAULT_SETTINGS.weeklyTargetHours).toBe(17)
    const splitSum = Object.values(DEFAULT_SETTINGS.categoryTargets).reduce((a, b) => a + b, 0)
    expect(splitSum).toBe(17)
    expect(DEFAULT_SETTINGS.categoryTargets.Projects).toBe(7)
    expect(DEFAULT_SETTINGS.categoryTargets.DSA).toBe(4)
    expect(DEFAULT_SETTINGS.categoryTargets.Learning).toBe(3)
    expect(DEFAULT_SETTINGS.categoryTargets['CS fundamentals']).toBe(2)
    expect(DEFAULT_SETTINGS.categoryTargets.Career).toBe(1)
  })
})
