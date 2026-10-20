import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { db } from '../../db'
import { Milestone } from '../../types'
import { useApp } from '../../context/AppContext'
import { formatDisplayDate } from '../../utils/date'
import { CheckCircle2, Circle, Calendar } from 'lucide-react'

export const MilestoneModal: React.FC = () => {
  const { milestoneModal, closeMilestoneModal, showToast } = useApp()
  const { isOpen, milestone } = milestoneModal

  const [currentMilestone, setCurrentMilestone] = useState<Milestone | null>(null)
  const [targetDate, setTargetDate] = useState('')
  const [checkedCriteria, setCheckedCriteria] = useState<Record<number, boolean>>({})

  useEffect(() => {
    if (milestone) {
      setCurrentMilestone(milestone)
      setTargetDate(milestone.targetDate)
      // Check all criteria if milestone is completed
      const initialChecked: Record<number, boolean> = {}
      milestone.completionCriteria.forEach((_, idx) => {
        initialChecked[idx] = milestone.status === 'completed'
      })
      setCheckedCriteria(initialChecked)
    }
  }, [milestone])

  if (!currentMilestone) return null

  const isCompleted = currentMilestone.status === 'completed'

  const toggleCriteria = (index: number) => {
    setCheckedCriteria(prev => ({
      ...prev,
      [index]: !prev[index]
    }))
  }

  const handleToggleMilestone = async () => {
    const nextStatus = isCompleted ? 'pending' : 'completed'
    const now = new Date().toISOString()
    const updated: Milestone = {
      ...currentMilestone,
      targetDate,
      status: nextStatus,
      completedAt: nextStatus === 'completed' ? now : undefined
    }

    await db.milestones.put(updated)
    setCurrentMilestone(updated)
    showToast(nextStatus === 'completed' ? 'Milestone marked complete' : 'Milestone marked pending')
    closeMilestoneModal()
  }

  const handleSaveDate = async () => {
    const updated: Milestone = {
      ...currentMilestone,
      targetDate
    }
    await db.milestones.put(updated)
    setCurrentMilestone(updated)
    showToast('Target date updated')
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeMilestoneModal}
      title={currentMilestone.title}
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Status & Target Date */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-3 bg-bg-subtle rounded-xl border border-border">
          <div className="flex items-center gap-2 text-xs text-text-secondary">
            <Calendar size={14} className="text-accent" />
            <span>Target: {formatDisplayDate(targetDate)}</span>
          </div>

          <span
            className={`text-xs px-2.5 py-1 rounded-full font-medium ${
              isCompleted
                ? 'bg-accent-subtle text-accent'
                : 'bg-bg text-text-secondary border border-border'
            }`}
          >
            {isCompleted ? 'Completed' : 'Pending'}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-text-secondary leading-relaxed">
          {currentMilestone.description}
        </p>

        {/* Completion Criteria Checklist */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-text-secondary mb-2">
            Measurable Completion Criteria
          </h4>
          <div className="space-y-2">
            {currentMilestone.completionCriteria.map((criterion, idx) => {
              const checked = !!checkedCriteria[idx]
              return (
                <div
                  key={idx}
                  onClick={() => toggleCriteria(idx)}
                  className="flex items-start gap-3 p-2.5 rounded-lg border border-border bg-bg hover:bg-bg-subtle cursor-pointer transition-colors"
                >
                  <button
                    type="button"
                    className="mt-0.5 text-accent shrink-0"
                    aria-label={`Toggle criterion: ${criterion}`}
                  >
                    {checked ? <CheckCircle2 size={16} /> : <Circle size={16} className="text-text-secondary" />}
                  </button>
                  <span
                    className={`text-xs leading-normal ${
                      checked ? 'line-through text-text-secondary' : 'text-text-primary'
                    }`}
                  >
                    {criterion}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Edit Target Date */}
        <div className="pt-2">
          <label className="block text-xs font-medium text-text-secondary mb-1">
            Change Target Date
          </label>
          <div className="flex gap-2">
            <input
              type="date"
              value={targetDate}
              onChange={e => setTargetDate(e.target.value)}
              className="flex-1 px-3 py-1.5 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
            />
            <Button size="sm" variant="secondary" onClick={handleSaveDate}>
              Update
            </Button>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-border">
          <Button
            variant={isCompleted ? 'secondary' : 'primary'}
            onClick={handleToggleMilestone}
          >
            {isCompleted ? 'Mark Pending' : 'Mark Milestone Complete'}
          </Button>
          <Button variant="secondary" onClick={closeMilestoneModal}>
            Close
          </Button>
        </div>
      </div>
    </Modal>
  )
}
