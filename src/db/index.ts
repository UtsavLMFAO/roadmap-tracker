import Dexie, { type EntityTable } from 'dexie'
import {
  RoadmapPhase,
  RoadmapTask,
  Milestone,
  StudySession,
  DailyReflection,
  WeeklyReview,
  Project,
  AlgorithmProblem,
  JobApplication,
  ResourceItem,
  AppSettings,
  BackupData
} from '../types'
import {
  DEFAULT_SETTINGS,
  SEED_PHASES,
  SEED_TASKS,
  SEED_MILESTONES,
  SEED_PROJECTS,
  SEED_RESOURCES,
  SEED_ALGORITHM_PROBLEMS
} from '../data/seedData'

export class RoadmapDatabase extends Dexie {
  phases!: EntityTable<RoadmapPhase, 'id'>
  tasks!: EntityTable<RoadmapTask, 'id'>
  milestones!: EntityTable<Milestone, 'id'>
  studySessions!: EntityTable<StudySession, 'id'>
  reflections!: EntityTable<DailyReflection, 'id'>
  reviews!: EntityTable<WeeklyReview, 'id'>
  projects!: EntityTable<Project, 'id'>
  problems!: EntityTable<AlgorithmProblem, 'id'>
  applications!: EntityTable<JobApplication, 'id'>
  resources!: EntityTable<ResourceItem, 'id'>
  settings!: EntityTable<AppSettings, 'id'>

  constructor() {
    super('RoadmapTrackerDB')
    this.version(1).stores({
      phases: 'id, phaseNumber, order, status',
      tasks: 'id, phaseId, targetDate, scheduledDate, status, priority, category, projectId, milestoneId',
      milestones: 'id, phaseId, targetDate, status',
      studySessions: 'id, date, category, taskId, createdAt',
      reflections: 'id, date',
      reviews: 'id, weekStartDate',
      projects: 'id, phaseId, status',
      problems: 'id, topic, difficulty, status',
      applications: 'id, company, status, appliedAt',
      resources: 'id, topic, status',
      settings: 'id'
    })
  }
}

export const db = new RoadmapDatabase()

/**
 * Initializes the database and seeds initial content if not already populated.
 * Safe against double-seeding.
 */
export async function initializeDatabase(): Promise<boolean> {
  try {
    await db.open()

    const existingSettings = await db.settings.get('settings')
    if (!existingSettings) {
      await seedInitialData()
    }
    return true
  } catch (error) {
    console.error('Failed to open IndexedDB:', error)
    return false
  }
}

export async function seedInitialData(): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.phases,
      db.tasks,
      db.milestones,
      db.projects,
      db.resources,
      db.problems,
      db.settings
    ],
    async () => {
      await db.phases.bulkPut(SEED_PHASES)
      await db.tasks.bulkPut(SEED_TASKS)
      await db.milestones.bulkPut(SEED_MILESTONES)
      await db.projects.bulkPut(SEED_PROJECTS)
      await db.resources.bulkPut(SEED_RESOURCES)
      await db.problems.bulkPut(SEED_ALGORITHM_PROBLEMS)
      await db.settings.put(DEFAULT_SETTINGS)
    }
  )
}

/**
 * Restores missing roadmap phases/tasks/milestones without resetting user completed status or study logs.
 */
export async function restoreDefaultRoadmapStructure(): Promise<void> {
  await db.transaction('rw', [db.phases, db.tasks, db.milestones], async () => {
    // For phases
    for (const seedPhase of SEED_PHASES) {
      const exists = await db.phases.get(seedPhase.id)
      if (!exists) {
        await db.phases.put(seedPhase)
      }
    }
    // For tasks
    for (const seedTask of SEED_TASKS) {
      const exists = await db.tasks.get(seedTask.id)
      if (!exists) {
        await db.tasks.put(seedTask)
      }
    }
    // For milestones
    for (const seedMilestone of SEED_MILESTONES) {
      const exists = await db.milestones.get(seedMilestone.id)
      if (!exists) {
        await db.milestones.put(seedMilestone)
      }
    }
  })
}

/**
 * Completely resets personal progress and database back to initial seed state.
 */
export async function resetAllData(): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.phases,
      db.tasks,
      db.milestones,
      db.studySessions,
      db.reflections,
      db.reviews,
      db.projects,
      db.problems,
      db.applications,
      db.resources,
      db.settings
    ],
    async () => {
      await db.phases.clear()
      await db.tasks.clear()
      await db.milestones.clear()
      await db.studySessions.clear()
      await db.reflections.clear()
      await db.reviews.clear()
      await db.projects.clear()
      await db.problems.clear()
      await db.applications.clear()
      await db.resources.clear()
      await db.settings.clear()

      await seedInitialData()
    }
  )
}

/**
 * Exports all database records to a structured JSON object.
 */
export async function exportDatabaseBackup(): Promise<BackupData> {
  const [
    settings,
    phases,
    tasks,
    milestones,
    studySessions,
    reflections,
    reviews,
    projects,
    problems,
    applications,
    resources
  ] = await Promise.all([
    db.settings.get('settings').then(s => s || DEFAULT_SETTINGS),
    db.phases.toArray(),
    db.tasks.toArray(),
    db.milestones.toArray(),
    db.studySessions.toArray(),
    db.reflections.toArray(),
    db.reviews.toArray(),
    db.projects.toArray(),
    db.problems.toArray(),
    db.applications.toArray(),
    db.resources.toArray()
  ])

  return {
    version: 1,
    exportedAt: new Date().toISOString(),
    settings,
    phases,
    tasks,
    milestones,
    studySessions,
    reflections,
    reviews,
    projects,
    problems,
    applications,
    resources
  }
}

/**
 * Validates a parsed backup object before importing.
 */
export function validateBackupData(data: unknown): { valid: boolean; error?: string; summary?: { tasks: number; sessions: number; projects: number } } {
  if (!data || typeof data !== 'object') {
    return { valid: false, error: 'Backup content must be a valid JSON object.' }
  }

  const b = data as Partial<BackupData>

  if (!b.version || typeof b.version !== 'number') {
    return { valid: false, error: 'Missing or invalid backup version field.' }
  }

  if (!Array.isArray(b.tasks)) {
    return { valid: false, error: 'Invalid backup: missing tasks array.' }
  }

  if (!Array.isArray(b.phases)) {
    return { valid: false, error: 'Invalid backup: missing phases array.' }
  }

  return {
    valid: true,
    summary: {
      tasks: b.tasks.length,
      sessions: Array.isArray(b.studySessions) ? b.studySessions.length : 0,
      projects: Array.isArray(b.projects) ? b.projects.length : 0
    }
  }
}

/**
 * Restores database from a validated backup data object.
 */
export async function restoreDatabaseFromBackup(backup: BackupData): Promise<void> {
  await db.transaction(
    'rw',
    [
      db.phases,
      db.tasks,
      db.milestones,
      db.studySessions,
      db.reflections,
      db.reviews,
      db.projects,
      db.problems,
      db.applications,
      db.resources,
      db.settings
    ],
    async () => {
      // Clear existing records
      await db.phases.clear()
      await db.tasks.clear()
      await db.milestones.clear()
      await db.studySessions.clear()
      await db.reflections.clear()
      await db.reviews.clear()
      await db.projects.clear()
      await db.problems.clear()
      await db.applications.clear()
      await db.resources.clear()
      await db.settings.clear()

      // Insert backup records
      if (backup.phases?.length) await db.phases.bulkPut(backup.phases)
      if (backup.tasks?.length) await db.tasks.bulkPut(backup.tasks)
      if (backup.milestones?.length) await db.milestones.bulkPut(backup.milestones)
      if (backup.studySessions?.length) await db.studySessions.bulkPut(backup.studySessions)
      if (backup.reflections?.length) await db.reflections.bulkPut(backup.reflections)
      if (backup.reviews?.length) await db.reviews.bulkPut(backup.reviews)
      if (backup.projects?.length) await db.projects.bulkPut(backup.projects)
      if (backup.problems?.length) await db.problems.bulkPut(backup.problems)
      if (backup.applications?.length) await db.applications.bulkPut(backup.applications)
      if (backup.resources?.length) await db.resources.bulkPut(backup.resources)
      if (backup.settings) await db.settings.put(backup.settings)
    }
  )
}

/**
 * Exports study sessions as CSV text
 */
export async function exportStudySessionsCSV(): Promise<string> {
  const sessions = await db.studySessions.toArray()
  const tasks = await db.tasks.toArray()
  const taskMap = new Map(tasks.map(t => [t.id, t.title]))

  const headers = ['Date', 'DurationMinutes', 'Hours', 'Category', 'TaskTitle', 'Note', 'CreatedAt']
  const rows = sessions.map(s => {
    const taskTitle = s.taskId ? (taskMap.get(s.taskId) || '') : ''
    const escape = (val: string | number) => `"${String(val).replace(/"/g, '""')}"`
    return [
      escape(s.date),
      s.durationMinutes,
      (s.durationMinutes / 60).toFixed(2),
      escape(s.category),
      escape(taskTitle),
      escape(s.note || ''),
      escape(s.createdAt)
    ].join(',')
  })

  return [headers.join(','), ...rows].join('\n')
}
