import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { db } from '../../db'
import { RoadmapTask, StudyCategory, TaskStatus, PriorityLevel, Project, Milestone } from '../../types'
import { useApp } from '../../context/AppContext'
import { formatLocalDate } from '../../utils/date'
import { Check, Trash2 } from 'lucide-react'

export const TaskModal: React.FC = () => {
  const { taskModal, closeTaskModal, showToast } = useApp()
  const { isOpen, taskId, defaultValues } = taskModal

  const [task, setTask] = useState<RoadmapTask | null>(null)
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [category, setCategory] = useState<StudyCategory>('Learning')
  const [estimatedMinutes, setEstimatedMinutes] = useState(30)
  const [targetDate, setTargetDate] = useState('')
  const [scheduledDate, setScheduledDate] = useState('')
  const [priority, setPriority] = useState<PriorityLevel>('normal')
  const [status, setStatus] = useState<TaskStatus>('not_started')
  const [notes, setNotes] = useState('')
  const [projectId, setProjectId] = useState<string>('')
  const [milestoneId, setMilestoneId] = useState<string>('')

  const [projects, setProjects] = useState<Project[]>([])
  const [milestones, setMilestones] = useState<Milestone[]>([])

  useEffect(() => {
    async function loadData() {
      const [allProjects, allMilestones] = await Promise.all([
        db.projects.toArray(),
        db.milestones.toArray()
      ])
      setProjects(allProjects)
      setMilestones(allMilestones)

      if (taskId) {
        const existing = await db.tasks.get(taskId)
        if (existing) {
          setTask(existing)
          setTitle(existing.title)
          setDescription(existing.description || '')
          setCategory(existing.category)
          setEstimatedMinutes(existing.estimatedMinutes || 30)
          setTargetDate(existing.targetDate || '')
          setScheduledDate(existing.scheduledDate || '')
          setPriority(existing.priority || 'normal')
          setStatus(existing.status || 'not_started')
          setNotes(existing.notes || '')
          setProjectId(existing.projectId || '')
          setMilestoneId(existing.milestoneId || '')
          return
        }
      }

      // New task mode
      setTask(null)
      setTitle(defaultValues?.title || '')
      setDescription(defaultValues?.description || '')
      setCategory(defaultValues?.category || 'Learning')
      setEstimatedMinutes(defaultValues?.estimatedMinutes || 30)
      setTargetDate(defaultValues?.targetDate || '')
      setScheduledDate(defaultValues?.scheduledDate || formatLocalDate())
      setPriority(defaultValues?.priority || 'normal')
      setStatus(defaultValues?.status || 'not_started')
      setNotes(defaultValues?.notes || '')
      setProjectId(defaultValues?.projectId || '')
      setMilestoneId(defaultValues?.milestoneId || '')
    }

    if (isOpen) {
      loadData()
    }
  }, [isOpen, taskId, defaultValues])

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const now = new Date().toISOString()

    if (task) {
      // Update existing
      const isNowCompleted = status === 'completed'
      const updated: RoadmapTask = {
        ...task,
        title: title.trim(),
        description: description.trim(),
        category,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        targetDate: targetDate || undefined,
        scheduledDate: scheduledDate || undefined,
        priority,
        status,
        completedAt: isNowCompleted ? (task.completedAt || now) : undefined,
        notes: notes.trim() || undefined,
        projectId: projectId || undefined,
        milestoneId: milestoneId || undefined,
        updatedAt: now
      }
      await db.tasks.put(updated)
      showToast('Task updated')
    } else {
      // Create new
      const newTask: RoadmapTask = {
        id: `custom-task-${Date.now()}`,
        phaseId: defaultValues?.phaseId || 'phase-1',
        title: title.trim(),
        description: description.trim(),
        category,
        estimatedMinutes: Number(estimatedMinutes) || 30,
        targetDate: targetDate || undefined,
        scheduledDate: scheduledDate || undefined,
        priority,
        status,
        completedAt: status === 'completed' ? now : undefined,
        notes: notes.trim() || undefined,
        projectId: projectId || undefined,
        milestoneId: milestoneId || undefined,
        isCustom: true,
        createdAt: now,
        updatedAt: now
      }
      await db.tasks.put(newTask)
      showToast('Task created')
    }

    closeTaskModal()
  }

  const handleDelete = async () => {
    if (!task) return
    await db.tasks.delete(task.id)
    showToast('Task deleted')
    closeTaskModal()
  }

  const toggleStatus = async () => {
    const nextStatus: TaskStatus = status === 'completed' ? 'not_started' : 'completed'
    setStatus(nextStatus)
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeTaskModal}
      title={task ? 'Edit Task' : 'Add Task'}
      maxWidth="md"
    >
      <form onSubmit={handleSave} className="space-y-4">
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Task Title *
          </label>
          <input
            type="text"
            required
            value={title}
            onChange={e => setTitle(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            placeholder="e.g. Implement input validation"
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Description
          </label>
          <textarea
            rows={2}
            value={description}
            onChange={e => setDescription(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            placeholder="Optional task details and objectives..."
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Category
            </label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value as StudyCategory)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="Learning">Learning</option>
              <option value="Projects">Projects</option>
              <option value="DSA">DSA</option>
              <option value="CS fundamentals">CS Fundamentals</option>
              <option value="Career">Career</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Estimated Duration (min)
            </label>
            <input
              type="number"
              min={5}
              step={5}
              value={estimatedMinutes}
              onChange={e => setEstimatedMinutes(Number(e.target.value))}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Target Deadline
            </label>
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Scheduled Date (Today/Day)
            </label>
            <input
              type="date"
              value={scheduledDate}
              onChange={e => setScheduledDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Status
            </label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value as TaskStatus)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="not_started">Not Started</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="skipped">Skipped</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Priority
            </label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value as PriorityLevel)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="normal">Normal</option>
              <option value="important">Important</option>
            </select>
          </div>
        </div>

        {/* Project & Milestone link */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Linked Project
            </label>
            <select
              value={projectId}
              onChange={e => setProjectId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">None</option>
              {projects.map(p => (
                <option key={p.id} value={p.id}>{p.name}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Linked Milestone
            </label>
            <select
              value={milestoneId}
              onChange={e => setMilestoneId(e.target.value)}
              className="w-full px-3 py-2 text-xs bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            >
              <option value="">None</option>
              {milestones.map(m => (
                <option key={m.id} value={m.id}>{m.title}</option>
              ))}
            </select>
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Personal Notes
          </label>
          <textarea
            rows={2}
            value={notes}
            onChange={e => setNotes(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            placeholder="Key takeaways, references, or blockers..."
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <div>
            {task && (
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={status === 'completed' ? 'secondary' : 'primary'}
                  size="sm"
                  onClick={toggleStatus}
                  icon={<Check size={14} />}
                >
                  {status === 'completed' ? 'Mark Incomplete' : 'Mark Complete'}
                </Button>

                {task.isCustom && (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="p-2 text-overdue hover:bg-overdue/10 rounded-lg transition-colors"
                    aria-label="Delete custom task"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            <Button type="button" variant="secondary" onClick={closeTaskModal}>
              Cancel
            </Button>
            <Button type="submit" variant="primary">
              Save
            </Button>
          </div>
        </div>
      </form>
    </Modal>
  )
}
