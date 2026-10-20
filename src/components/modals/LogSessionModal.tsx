import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { db } from '../../db'
import { StudyCategory, StudySession, RoadmapTask } from '../../types'
import { useApp } from '../../context/AppContext'
import { formatLocalDate } from '../../utils/date'

const quickDurations = [15, 30, 45, 60]

export const LogSessionModal: React.FC = () => {
  const { logSessionModal, closeLogSessionModal, showToast } = useApp()
  const { isOpen, defaultValues } = logSessionModal

  const [durationMinutes, setDurationMinutes] = useState(30)
  const [category, setCategory] = useState<StudyCategory>('Learning')
  const [date, setDate] = useState(formatLocalDate())
  const [taskId, setTaskId] = useState<string>('')
  const [note, setNote] = useState('')
  const [availableTasks, setAvailableTasks] = useState<RoadmapTask[]>([])

  useEffect(() => {
    async function loadTasks() {
      const tasks = await db.tasks.toArray()
      setAvailableTasks(tasks)

      if (defaultValues) {
        if (defaultValues.durationMinutes) setDurationMinutes(defaultValues.durationMinutes)
        if (defaultValues.category) setCategory(defaultValues.category)
        if (defaultValues.date) setDate(defaultValues.date)
        if (defaultValues.taskId) setTaskId(defaultValues.taskId)
        if (defaultValues.note) setNote(defaultValues.note)
      } else {
        setDurationMinutes(30)
        setCategory('Learning')
        setDate(formatLocalDate())
        setTaskId('')
        setNote('')
      }
    }

    if (isOpen) {
      loadTasks()
    }
  }, [isOpen, defaultValues])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (durationMinutes <= 0) return

    const newSession: StudySession = {
      id: `session-${Date.now()}`,
      date: date || formatLocalDate(),
      durationMinutes: Number(durationMinutes),
      category,
      taskId: taskId || undefined,
      note: note.trim() || undefined,
      createdAt: new Date().toISOString()
    }

    await db.studySessions.put(newSession)
    showToast(`Logged ${durationMinutes} minutes in ${category}`)
    closeLogSessionModal()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeLogSessionModal}
      title="Log Study Session"
      maxWidth="sm"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Quick choices */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1.5">
            Quick Duration
          </label>
          <div className="grid grid-cols-4 gap-2">
            {quickDurations.map(m => (
              <button
                key={m}
                type="button"
                onClick={() => setDurationMinutes(m)}
                className={`py-1.5 text-xs font-medium rounded-lg border transition-colors ${
                  durationMinutes === m
                    ? 'bg-accent text-white border-accent'
                    : 'bg-bg-subtle text-text-primary border-border hover:bg-border/60'
                }`}
              >
                {m}m
              </button>
            ))}
          </div>
        </div>

        {/* Manual duration & Date */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Minutes *
            </label>
            <input
              type="number"
              min={1}
              required
              value={durationMinutes}
              onChange={e => setDurationMinutes(Math.max(1, Number(e.target.value)))}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Date
            </label>
            <input
              type="date"
              required
              value={date}
              onChange={e => setDate(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
          </div>
        </div>

        {/* Category */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Category *
          </label>
          <select
            value={category}
            onChange={e => setCategory(e.target.value as StudyCategory)}
            className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="Projects">Projects</option>
            <option value="DSA">Data Structures & Algorithms</option>
            <option value="Learning">Learning Concepts</option>
            <option value="CS fundamentals">CS Fundamentals</option>
            <option value="Career">Career & Communication</option>
          </select>
        </div>

        {/* Optional Associated Task */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Associated Task (Optional)
          </label>
          <select
            value={taskId}
            onChange={e => setTaskId(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
          >
            <option value="">No specific task</option>
            {availableTasks.map(t => (
              <option key={t.id} value={t.id}>
                {t.title}
              </option>
            ))}
          </select>
        </div>

        {/* Optional Note */}
        <div>
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Short Note (Optional)
          </label>
          <textarea
            rows={2}
            value={note}
            onChange={e => setNote(e.target.value)}
            className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
            placeholder="What did you focus on during this block?"
          />
        </div>

        {/* Actions */}
        <div className="flex justify-end gap-2 pt-2 border-t border-border">
          <Button type="button" variant="secondary" onClick={closeLogSessionModal}>
            Cancel
          </Button>
          <Button type="submit" variant="primary">
            Save Session
          </Button>
        </div>
      </form>
    </Modal>
  )
}
