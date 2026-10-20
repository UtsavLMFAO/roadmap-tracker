export type StudyCategory = 
  | 'Projects' 
  | 'DSA' 
  | 'Learning' 
  | 'CS fundamentals' 
  | 'Career'

export type TaskStatus = 'not_started' | 'in_progress' | 'completed' | 'skipped'
export type PriorityLevel = 'normal' | 'important'
export type ProjectStatus = 'planned' | 'in_progress' | 'paused' | 'complete'
export type ProblemDifficulty = 'Easy' | 'Medium' | 'Hard'
export type ProblemStatus = 'attempted' | 'solved_independently' | 'solved_with_help' | 'needs_revision'
export type ApplicationStatus = 'Wishlist' | 'Applied' | 'Screening' | 'Interview' | 'Offer' | 'Rejected' | 'Withdrawn'
export type ResourceStatus = 'not_started' | 'in_progress' | 'completed'

export interface RoadmapPhase {
  id: string
  phaseNumber: number
  title: string
  startDate: string
  endDate: string
  objective: string
  topics: string[]
  taskIds: string[]
  milestoneIds: string[]
  completionCriteria: string[]
  recommendedResources: {
    title: string
    url: string
    note?: string
  }[]
  order: number
  status: 'active' | 'completed' | 'upcoming' | 'paused'
}

export interface RoadmapTask {
  id: string
  phaseId: string
  title: string
  description: string
  category: StudyCategory
  estimatedMinutes: number
  targetDate?: string // YYYY-MM-DD
  status: TaskStatus
  priority: PriorityLevel
  completedAt?: string // ISO string
  notes?: string
  resourceIds?: string[]
  projectId?: string
  milestoneId?: string
  isCustom?: boolean
  scheduledDate?: string // YYYY-MM-DD (e.g. today or specific date)
  createdAt: string
  updatedAt: string
}

export interface Milestone {
  id: string
  phaseId: string
  title: string
  description: string
  completionCriteria: string[]
  targetDate: string
  completedAt?: string
  status: 'pending' | 'completed'
}

export interface StudySession {
  id: string
  date: string // Local YYYY-MM-DD
  durationMinutes: number
  category: StudyCategory
  taskId?: string
  note?: string
  createdAt: string
}

export interface DailyReflection {
  id: string // YYYY-MM-DD
  date: string // YYYY-MM-DD
  workedOn: string
  learned: string
  blockers: string
  nextSteps: string
  updatedAt: string
}

export interface WeeklyReview {
  id: string // review-YYYY-MM-DD
  weekStartDate: string // YYYY-MM-DD
  wentWell: string
  difficulties: string
  completedWork: string
  unfinishedWork: string
  nextWeekPriority: string
  scheduleAdjustment: string
  updatedAt: string
}

export interface ProjectFeature {
  id: string
  title: string
  completed: boolean
}

export interface Project {
  id: string
  name: string
  description: string
  status: ProjectStatus
  startDate: string
  targetDate: string
  repositoryUrl?: string
  deploymentUrl?: string
  notes?: string
  phaseId: string
  taskIds: string[]
  features: ProjectFeature[]
}

export interface AlgorithmProblem {
  id: string
  title: string
  url: string
  topic: string
  difficulty: ProblemDifficulty
  status: ProblemStatus
  attemptedAt?: string
  solvedAt?: string
  complexity: string
  solutionNotes: string
  nextReviewDate?: string
}

export interface JobApplication {
  id: string
  company: string
  role: string
  url: string
  location: string
  eligibilityNotes: string
  appliedAt: string
  status: ApplicationStatus
  nextAction: string
  nextActionDate?: string
  interviewNotes: string
  outcome: string
}

export interface ResourceItem {
  id: string
  title: string
  topic: string
  description: string
  url: string
  requiresInternet: boolean
  status: ResourceStatus
  notes?: string
}

export interface ActiveTimerState {
  isRunning: boolean
  startEpochMs: number // Timestamp when started/resumed
  accumulatedSeconds: number
  taskId?: string
  category: StudyCategory
  note?: string
}

export interface AppSettings {
  id: string // 'settings'
  theme: 'light' | 'dark' | 'system'
  dailyFocusOverride?: string
  weeklyTargetHours: number
  categoryTargets: {
    Projects: number
    DSA: number
    Learning: number
    'CS fundamentals': number
    Career: number
  }
  preferredStudyDays: string[]
  remindersEnabled: boolean
  roadmapVersion: number
  showSkippedTasks: boolean
  activeTimer?: ActiveTimerState
}

export interface BackupData {
  version: number
  exportedAt: string
  settings: AppSettings
  phases: RoadmapPhase[]
  tasks: RoadmapTask[]
  milestones: Milestone[]
  studySessions: StudySession[]
  reflections: DailyReflection[]
  reviews: WeeklyReview[]
  projects: Project[]
  problems: AlgorithmProblem[]
  applications: JobApplication[]
  resources: ResourceItem[]
}
