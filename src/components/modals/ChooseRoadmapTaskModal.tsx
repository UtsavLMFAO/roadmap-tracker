import React, { useState, useEffect } from 'react'
import { Modal } from '../common/Modal'
import { Button } from '../common/Button'
import { db } from '../../db'
import { RoadmapTask, RoadmapPhase } from '../../types'
import { useApp } from '../../context/AppContext'
import { formatLocalDate } from '../../utils/date'
import { Plus } from 'lucide-react'

export const ChooseRoadmapTaskModal: React.FC = () => {
  const { chooseTaskModal, closeChooseTaskModal, showToast } = useApp()
  const { isOpen } = chooseTaskModal

  const [phases, setPhases] = useState<RoadmapPhase[]>([])
  const [tasks, setTasks] = useState<RoadmapTask[]>([])
  const [selectedPhaseId, setSelectedPhaseId] = useState<string>('phase-1')

  useEffect(() => {
    async function loadData() {
      const [allPhases, allTasks] = await Promise.all([
        db.phases.orderBy('order').toArray(),
        db.tasks.where('status').noneOf(['completed', 'skipped']).toArray()
      ])
      setPhases(allPhases)
      setTasks(allTasks)
      if (allPhases.length > 0) {
        setSelectedPhaseId(allPhases[0].id)
      }
    }

    if (isOpen) {
      loadData()
    }
  }, [isOpen])

  const handleSelectTask = async (task: RoadmapTask) => {
    const today = formatLocalDate()
    await db.tasks.update(task.id, {
      scheduledDate: today,
      updatedAt: new Date().toISOString()
    })
    showToast(`Scheduled "${task.title.slice(0, 30)}..." for Today`)
    closeChooseTaskModal()
  }

  const phaseTasks = tasks.filter(t => t.phaseId === selectedPhaseId)

  return (
    <Modal
      isOpen={isOpen}
      onClose={closeChooseTaskModal}
      title="Choose a Roadmap Task for Today"
      maxWidth="md"
    >
      <div className="space-y-4">
        {/* Phase selector tabs */}
        <div className="flex gap-1.5 overflow-x-auto pb-2 scrollbar-none">
          {phases.map(p => (
            <button
              key={p.id}
              onClick={() => setSelectedPhaseId(p.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedPhaseId === p.id
                  ? 'bg-accent text-white'
                  : 'bg-bg-subtle text-text-secondary hover:text-text-primary'
              }`}
            >
              Phase {p.phaseNumber}
            </button>
          ))}
        </div>

        {/* Task list */}
        <div className="space-y-2 max-h-80 overflow-y-auto">
          {phaseTasks.length === 0 ? (
            <div className="text-center py-8 text-xs text-text-secondary">
              No incomplete tasks in this phase.
            </div>
          ) : (
            phaseTasks.map(task => (
              <div
                key={task.id}
                className="flex items-center justify-between p-3 rounded-xl border border-border bg-bg hover:bg-bg-subtle transition-colors gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-text-primary truncate">
                    {task.title}
                  </div>
                  <div className="flex items-center gap-2 mt-1 text-[11px] text-text-secondary">
                    <span className="bg-bg-card px-1.5 py-0.5 rounded border border-border">
                      {task.category}
                    </span>
                    {task.estimatedMinutes && (
                      <span>{task.estimatedMinutes} min</span>
                    )}
                  </div>
                </div>

                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() => handleSelectTask(task)}
                  icon={<Plus size={14} />}
                >
                  Schedule
                </Button>
              </div>
            ))
          )}
        </div>

        <div className="flex justify-end pt-2 border-t border-border">
          <Button variant="secondary" onClick={closeChooseTaskModal}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  )
}
