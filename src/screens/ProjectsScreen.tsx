import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { ProgressBar } from '../components/common/ProgressBar'
import { useApp } from '../context/AppContext'
import { db } from '../../src/db'
import { Project, ProjectStatus, ProjectFeature } from '../types'
import {
  FolderGit2,
  ExternalLink,
  Plus,
  Edit2,
  CheckCircle2,
  Circle,
  Calendar,
  Trash2
} from 'lucide-react'

export const ProjectsScreen: React.FC = () => {
  const { showToast } = useApp()

  const [projects, setProjects] = useState<Project[]>([])
  const [activeProject, setActiveProject] = useState<Project | null>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)

  // Form fields for create/edit
  const [formName, setFormName] = useState('')
  const [formDescription, setFormDescription] = useState('')
  const [formStatus, setFormStatus] = useState<ProjectStatus>('planned')
  const [formStartDate, setFormStartDate] = useState('')
  const [formTargetDate, setFormTargetDate] = useState('')
  const [formRepoUrl, setFormRepoUrl] = useState('')
  const [formDeployUrl, setFormDeployUrl] = useState('')
  const [formNotes, setFormNotes] = useState('')
  const [formPhaseId, setFormPhaseId] = useState('phase-1')
  const [newFeatureTitle, setNewFeatureTitle] = useState('')

  const loadProjects = async () => {
    const list = await db.projects.toArray()
    setProjects(list)
  }

  useEffect(() => {
    loadProjects()
  }, [])

  const openCreateModal = () => {
    setActiveProject(null)
    setFormName('')
    setFormDescription('')
    setFormStatus('in_progress')
    setFormStartDate(new Date().toISOString().slice(0, 10))
    setFormTargetDate('')
    setFormRepoUrl('')
    setFormDeployUrl('')
    setFormNotes('')
    setFormPhaseId('phase-1')
    setIsEditModalOpen(true)
  }

  const openEditModal = (proj: Project) => {
    setActiveProject(proj)
    setFormName(proj.name)
    setFormDescription(proj.description)
    setFormStatus(proj.status)
    setFormStartDate(proj.startDate)
    setFormTargetDate(proj.targetDate)
    setFormRepoUrl(proj.repositoryUrl || '')
    setFormDeployUrl(proj.deploymentUrl || '')
    setFormNotes(proj.notes || '')
    setFormPhaseId(proj.phaseId)
    setIsEditModalOpen(true)
  }

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formName.trim()) return

    if (activeProject) {
      const updated: Project = {
        ...activeProject,
        name: formName.trim(),
        description: formDescription.trim(),
        status: formStatus,
        startDate: formStartDate,
        targetDate: formTargetDate,
        repositoryUrl: formRepoUrl.trim() || undefined,
        deploymentUrl: formDeployUrl.trim() || undefined,
        notes: formNotes.trim() || undefined,
        phaseId: formPhaseId
      }
      await db.projects.put(updated)
      showToast('Project updated')
    } else {
      const newProj: Project = {
        id: `proj-${Date.now()}`,
        name: formName.trim(),
        description: formDescription.trim(),
        status: formStatus,
        startDate: formStartDate,
        targetDate: formTargetDate,
        repositoryUrl: formRepoUrl.trim() || undefined,
        deploymentUrl: formDeployUrl.trim() || undefined,
        notes: formNotes.trim() || undefined,
        phaseId: formPhaseId,
        taskIds: [],
        features: []
      }
      await db.projects.put(newProj)
      showToast('Project created')
    }

    setIsEditModalOpen(false)
    loadProjects()
  }

  const handleDeleteProject = async (projId: string) => {
    await db.projects.delete(projId)
    showToast('Project deleted')
    loadProjects()
  }

  // Toggle Feature checkbox in a project
  const handleToggleFeature = async (project: Project, featureId: string) => {
    const updatedFeatures = project.features.map(f =>
      f.id === featureId ? { ...f, completed: !f.completed } : f
    )

    const allCompleted = updatedFeatures.length > 0 && updatedFeatures.every(f => f.completed)
    const newStatus = allCompleted ? 'complete' : project.status === 'complete' ? 'in_progress' : project.status

    const updated: Project = {
      ...project,
      status: newStatus,
      features: updatedFeatures
    }

    await db.projects.put(updated)
    setProjects(prev => prev.map(p => (p.id === project.id ? updated : p)))
  }

  // Add Feature to existing project
  const handleAddFeature = async (project: Project) => {
    if (!newFeatureTitle.trim()) return
    const newFeature: ProjectFeature = {
      id: `f-${Date.now()}`,
      title: newFeatureTitle.trim(),
      completed: false
    }
    const updated: Project = {
      ...project,
      features: [...project.features, newFeature]
    }
    await db.projects.put(updated)
    setNewFeatureTitle('')
    setProjects(prev => prev.map(p => (p.id === project.id ? updated : p)))
    showToast('Feature added')
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-bg transition-colors">
      <Header
        title="Projects"
        subtitle="Tangible software portfolio for international roles"
        action={
          <Button size="sm" variant="primary" onClick={openCreateModal} icon={<Plus size={14} />}>
            New Project
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        <div className="space-y-4">
          {projects.map(proj => {
            const completedFeatures = proj.features.filter(f => f.completed).length
            const totalFeatures = proj.features.length
            const featurePct = totalFeatures > 0 ? Math.round((completedFeatures / totalFeatures) * 100) : 0

            return (
              <div
                key={proj.id}
                className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border space-y-4 shadow-xs"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs uppercase font-bold text-accent">
                        {proj.phaseId.replace('-', ' ')}
                      </span>
                      <span className="text-xs text-text-secondary">·</span>
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          proj.status === 'complete'
                            ? 'bg-accent-subtle text-accent'
                            : proj.status === 'in_progress'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : 'bg-bg-subtle text-text-secondary'
                        }`}
                      >
                        {proj.status.replace('_', ' ')}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-bold text-text-primary">
                      {proj.name}
                    </h3>

                    <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                      {proj.description}
                    </p>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <button
                      onClick={() => openEditModal(proj)}
                      className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg hover:bg-bg-subtle transition-colors"
                      aria-label="Edit project"
                    >
                      <Edit2 size={15} />
                    </button>
                    {proj.id.startsWith('proj-') && proj.id.length > 10 && (
                      <button
                        onClick={() => handleDeleteProject(proj.id)}
                        className="p-1.5 text-overdue hover:bg-overdue/10 rounded-lg transition-colors"
                        aria-label="Delete project"
                      >
                        <Trash2 size={15} />
                      </button>
                    )}
                  </div>
                </div>

                {/* Progress bar based on features */}
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center text-xs text-text-secondary">
                    <span>Feature Implementation</span>
                    <span className="font-semibold text-text-primary">
                      {completedFeatures} / {totalFeatures} ({featurePct}%)
                    </span>
                  </div>
                  <ProgressBar value={featurePct} height="sm" />
                </div>

                {/* Feature Checklist */}
                {proj.features.length > 0 && (
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[11px] uppercase tracking-wider font-semibold text-text-secondary block">
                      Features Checklist
                    </span>
                    <div className="space-y-1">
                      {proj.features.map(feat => (
                        <div
                          key={feat.id}
                          onClick={() => handleToggleFeature(proj, feat.id)}
                          className="flex items-center gap-2.5 p-2 rounded-lg bg-bg-subtle hover:bg-border/40 cursor-pointer transition-colors"
                        >
                          <button
                            type="button"
                            className="text-accent shrink-0"
                            aria-label={`Toggle feature: ${feat.title}`}
                          >
                            {feat.completed ? (
                              <CheckCircle2 size={15} className="text-accent" />
                            ) : (
                              <Circle size={15} className="text-text-secondary" />
                            )}
                          </button>
                          <span
                            className={`text-xs ${
                              feat.completed ? 'line-through text-text-secondary' : 'text-text-primary'
                            }`}
                          >
                            {feat.title}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Add Feature input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={newFeatureTitle}
                    onChange={e => setNewFeatureTitle(e.target.value)}
                    placeholder="Add a new feature requirement..."
                    className="flex-1 px-3 py-1.5 text-xs bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                    onKeyDown={e => {
                      if (e.key === 'Enter') {
                        e.preventDefault()
                        handleAddFeature(proj)
                      }
                    }}
                  />
                  <Button size="sm" variant="secondary" onClick={() => handleAddFeature(proj)}>
                    Add
                  </Button>
                </div>

                {/* Links & metadata */}
                <div className="pt-2 border-t border-border flex flex-wrap items-center justify-between gap-3 text-xs text-text-secondary">
                  <div className="flex items-center gap-4">
                    {proj.repositoryUrl && (
                      <a
                        href={proj.repositoryUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-accent hover:underline font-medium"
                      >
                        <FolderGit2 size={13} />
                        Repository
                        <ExternalLink size={11} />
                      </a>
                    )}
                    {proj.deploymentUrl && (
                      <a
                        href={proj.deploymentUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1.5 text-accent hover:underline font-medium"
                      >
                        <ExternalLink size={13} />
                        Live Demo
                      </a>
                    )}
                  </div>

                  {proj.targetDate && (
                    <div className="flex items-center gap-1">
                      <Calendar size={12} />
                      <span>Target: {proj.targetDate}</span>
                    </div>
                  )}
                </div>

                {proj.notes && (
                  <div className="p-3 bg-bg-subtle/60 rounded-xl text-xs text-text-secondary border border-border/60">
                    <span className="font-semibold text-text-primary block mb-0.5">Architectural Notes:</span>
                    {proj.notes}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </main>

      {/* CREATE / EDIT PROJECT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title={activeProject ? 'Edit Project' : 'New Project'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveProject} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Project Name *
            </label>
            <input
              type="text"
              required
              value={formName}
              onChange={e => setFormName(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="e.g. Drone Lap-Timing System"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={formDescription}
              onChange={e => setFormDescription(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              placeholder="Primary purpose and architecture of the project..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value as ProjectStatus)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="planned">Planned</option>
                <option value="in_progress">In Progress</option>
                <option value="paused">Paused</option>
                <option value="complete">Complete</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Linked Phase
              </label>
              <select
                value={formPhaseId}
                onChange={e => setFormPhaseId(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="phase-1">Phase 1: Foundations</option>
                <option value="phase-3">Phase 3: Backend</option>
                <option value="phase-4">Phase 4: Production</option>
                <option value="phase-5">Phase 5: Fundamentals</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Start Date
              </label>
              <input
                type="date"
                value={formStartDate}
                onChange={e => setFormStartDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Target Date
              </label>
              <input
                type="date"
                value={formTargetDate}
                onChange={e => setFormTargetDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              GitHub Repository URL
            </label>
            <input
              type="url"
              value={formRepoUrl}
              onChange={e => setFormRepoUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="https://github.com/username/project"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Live Deployment URL
            </label>
            <input
              type="url"
              value={formDeployUrl}
              onChange={e => setFormDeployUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="https://myproject.onrender.com"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Architectural Notes & Lessons Learned
            </label>
            <textarea
              rows={2}
              value={formNotes}
              onChange={e => setFormNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              placeholder="Key design choices, trade-offs, and learnings..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="secondary" onClick={() => setIsEditModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Project
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
