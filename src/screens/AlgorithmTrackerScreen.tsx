import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { useApp } from '../context/AppContext'
import { db } from '../../src/db'
import {
  AlgorithmProblem,
  ProblemDifficulty,
  ProblemStatus
} from '../types'
import {
  Code2,
  ExternalLink,
  Plus,
  Edit2,
  CheckCircle2,
  AlertTriangle,
  HelpCircle,
  Clock,
  Trash2,
  Filter
} from 'lucide-react'

export const AlgorithmTrackerScreen: React.FC = () => {
  const { showToast } = useApp()

  const [problems, setProblems] = useState<AlgorithmProblem[]>([])
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>('All')
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [selectedTopic, setSelectedTopic] = useState<string>('All')

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingProblem, setEditingProblem] = useState<AlgorithmProblem | null>(null)

  // Form states
  const [formTitle, setFormTitle] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formTopic, setFormTopic] = useState('Arrays & Hashing')
  const [formDifficulty, setFormDifficulty] = useState<ProblemDifficulty>('Easy')
  const [formStatus, setFormStatus] = useState<ProblemStatus>('attempted')
  const [formComplexity, setFormComplexity] = useState('')
  const [formSolutionNotes, setFormSolutionNotes] = useState('')
  const [formNextReviewDate, setFormNextReviewDate] = useState('')

  const loadProblems = async () => {
    const list = await db.problems.toArray()
    setProblems(list)
  }

  useEffect(() => {
    loadProblems()
  }, [])

  const topics = ['All', ...Array.from(new Set(problems.map(p => p.topic)))]

  const displayedProblems = problems.filter(p => {
    if (selectedDifficulty !== 'All' && p.difficulty !== selectedDifficulty) return false
    if (selectedStatus !== 'All' && p.status !== selectedStatus) return false
    if (selectedTopic !== 'All' && p.topic !== selectedTopic) return false
    return true
  })

  // Summary counts
  const totalCount = problems.length
  const masteredCount = problems.filter(p => p.status === 'solved_independently').length
  const revisionCount = problems.filter(p => p.status === 'needs_revision' || p.status === 'solved_with_help').length

  const openCreateModal = () => {
    setEditingProblem(null)
    setFormTitle('')
    setFormUrl('')
    setFormTopic('Arrays & Hashing')
    setFormDifficulty('Easy')
    setFormStatus('attempted')
    setFormComplexity('O(N) time, O(1) space')
    setFormSolutionNotes('')
    setFormNextReviewDate('')
    setIsModalOpen(true)
  }

  const openEditModal = (problem: AlgorithmProblem) => {
    setEditingProblem(problem)
    setFormTitle(problem.title)
    setFormUrl(problem.url)
    setFormTopic(problem.topic)
    setFormDifficulty(problem.difficulty)
    setFormStatus(problem.status)
    setFormComplexity(problem.complexity)
    setFormSolutionNotes(problem.solutionNotes)
    setFormNextReviewDate(problem.nextReviewDate || '')
    setIsModalOpen(true)
  }

  const handleSaveProblem = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim()) return

    const now = new Date().toISOString()

    if (editingProblem) {
      const updated: AlgorithmProblem = {
        ...editingProblem,
        title: formTitle.trim(),
        url: formUrl.trim(),
        topic: formTopic.trim(),
        difficulty: formDifficulty,
        status: formStatus,
        complexity: formComplexity.trim(),
        solutionNotes: formSolutionNotes.trim(),
        nextReviewDate: formNextReviewDate || undefined,
        solvedAt: formStatus === 'solved_independently' ? (editingProblem.solvedAt || now) : editingProblem.solvedAt
      }
      await db.problems.put(updated)
      showToast('Problem updated')
    } else {
      const newProb: AlgorithmProblem = {
        id: `algo-${Date.now()}`,
        title: formTitle.trim(),
        url: formUrl.trim(),
        topic: formTopic.trim(),
        difficulty: formDifficulty,
        status: formStatus,
        complexity: formComplexity.trim(),
        solutionNotes: formSolutionNotes.trim(),
        nextReviewDate: formNextReviewDate || undefined,
        attemptedAt: now,
        solvedAt: formStatus === 'solved_independently' ? now : undefined
      }
      await db.problems.put(newProb)
      showToast('Problem added')
    }

    setIsModalOpen(false)
    loadProblems()
  }

  const handleDeleteProblem = async (id: string) => {
    await db.problems.delete(id)
    showToast('Problem removed')
    loadProblems()
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-bg transition-colors">
      <Header
        title="Algorithm Tracker"
        subtitle="Mastery through pattern comprehension and revision"
        action={
          <Button size="sm" variant="primary" onClick={openCreateModal} icon={<Plus size={14} />}>
            Add Problem
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* Metric tiles */}
        <section className="grid grid-cols-3 gap-3">
          <div className="p-3 bg-bg-card rounded-2xl border border-border shadow-xs">
            <span className="text-[11px] text-text-secondary font-medium">Logged Problems</span>
            <div className="text-xl font-bold text-text-primary mt-0.5">{totalCount}</div>
            <span className="text-[10px] text-text-secondary">Target: 40–60 (P2), 80–120 (P6)</span>
          </div>

          <div className="p-3 bg-bg-card rounded-2xl border border-border shadow-xs">
            <span className="text-[11px] text-accent font-medium">Independently Mastered</span>
            <div className="text-xl font-bold text-accent mt-0.5">{masteredCount}</div>
            <span className="text-[10px] text-text-secondary">Solved without hints</span>
          </div>

          <div
            onClick={() => setSelectedStatus('needs_revision')}
            className="p-3 bg-bg-card rounded-2xl border border-border shadow-xs cursor-pointer hover:border-amber-500/50 transition-colors"
          >
            <span className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Revision List</span>
            <div className="text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">{revisionCount}</div>
            <span className="text-[10px] text-text-secondary">Needs review / had help</span>
          </div>
        </section>

        {/* Filter bar */}
        <section className="bg-bg-card rounded-2xl p-3 border border-border space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-text-secondary px-1">
            <span className="flex items-center gap-1.5">
              <Filter size={13} /> Filters
            </span>
            {(selectedDifficulty !== 'All' || selectedStatus !== 'All' || selectedTopic !== 'All') && (
              <button
                onClick={() => {
                  setSelectedDifficulty('All')
                  setSelectedStatus('All')
                  setSelectedTopic('All')
                }}
                className="text-accent hover:underline text-[11px]"
              >
                Reset filters
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            {/* Status pills */}
            {[
              { id: 'All', label: 'All Status' },
              { id: 'solved_independently', label: 'Mastered' },
              { id: 'needs_revision', label: 'Needs Revision' },
              { id: 'solved_with_help', label: 'With Help' },
              { id: 'attempted', label: 'Attempted' }
            ].map(s => (
              <button
                key={s.id}
                onClick={() => setSelectedStatus(s.id)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedStatus === s.id
                    ? 'bg-accent text-white'
                    : 'bg-bg-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                {s.label}
              </button>
            ))}

            {/* Difficulty */}
            {['All', 'Easy', 'Medium', 'Hard'].map(d => (
              <button
                key={d}
                onClick={() => setSelectedDifficulty(d)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-colors ${
                  selectedDifficulty === d
                    ? 'bg-text-primary text-bg'
                    : 'bg-bg-subtle text-text-secondary hover:text-text-primary'
                }`}
              >
                {d}
              </button>
            ))}
          </div>
        </section>

        {/* Problem cards list */}
        <div className="space-y-3">
          {displayedProblems.length === 0 ? (
            <div className="bg-bg-card rounded-2xl p-8 border border-border text-center text-xs text-text-secondary">
              No algorithm problems match the current filter criteria.
            </div>
          ) : (
            displayedProblems.map(p => {
              const isMastered = p.status === 'solved_independently'
              const needsRev = p.status === 'needs_revision' || p.status === 'solved_with_help'

              return (
                <div
                  key={p.id}
                  className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border space-y-3 shadow-xs transition-all hover:border-text-secondary/40"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span
                          className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded ${
                            p.difficulty === 'Easy'
                              ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                              : p.difficulty === 'Medium'
                              ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                              : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                          }`}
                        >
                          {p.difficulty}
                        </span>
                        <span className="text-xs text-text-secondary font-medium">
                          {p.topic}
                        </span>
                        <span className="text-xs text-text-secondary">·</span>
                        <span
                          className={`text-[10px] uppercase font-semibold px-2 py-0.5 rounded ${
                            isMastered
                              ? 'bg-accent-subtle text-accent'
                              : needsRev
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-400'
                              : 'bg-bg-subtle text-text-secondary'
                          }`}
                        >
                          {p.status.replace(/_/g, ' ')}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <h3 className="text-base font-bold text-text-primary">
                          {p.title}
                        </h3>
                        {p.url && (
                          <a
                            href={p.url}
                            target="_blank"
                            rel="noreferrer"
                            className="text-text-secondary hover:text-accent"
                            aria-label={`Open external link for ${p.title}`}
                          >
                            <ExternalLink size={13} />
                          </a>
                        )}
                      </div>

                      {p.complexity && (
                        <div className="text-xs font-mono text-text-secondary mt-1">
                          Complexity: {p.complexity}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => openEditModal(p)}
                        className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                        aria-label="Edit problem"
                      >
                        <Edit2 size={15} />
                      </button>
                      <button
                        onClick={() => handleDeleteProblem(p.id)}
                        className="p-1.5 text-overdue hover:bg-overdue/10 rounded-lg transition-colors"
                        aria-label="Delete problem"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  </div>

                  {p.solutionNotes && (
                    <div className="p-3 bg-bg-subtle rounded-xl text-xs text-text-secondary border border-border/60">
                      <span className="font-semibold text-text-primary block mb-0.5">Solution Pattern:</span>
                      {p.solutionNotes}
                    </div>
                  )}

                  {p.nextReviewDate && (
                    <div className="text-[11px] text-text-secondary flex items-center gap-1.5 pt-1 border-t border-border/50">
                      <Clock size={11} className="text-accent" />
                      <span>Next Revision: {p.nextReviewDate}</span>
                    </div>
                  )}
                </div>
              )
            })
          )}
        </div>
      </main>

      {/* CREATE / EDIT PROBLEM MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingProblem ? 'Edit Algorithm Problem' : 'Log Algorithm Problem'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveProblem} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Problem Title *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="e.g. 3Sum"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Problem URL (LeetCode / NeetCode)
            </label>
            <input
              type="url"
              value={formUrl}
              onChange={e => setFormUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="https://leetcode.com/problems/..."
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Topic
              </label>
              <input
                type="text"
                required
                value={formTopic}
                onChange={e => setFormTopic(e.target.value)}
                className="w-full px-3 py-2 text-xs bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. Two Pointers"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Difficulty
              </label>
              <select
                value={formDifficulty}
                onChange={e => setFormDifficulty(e.target.value as ProblemDifficulty)}
                className="w-full px-3 py-2 text-xs bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="Easy">Easy</option>
                <option value="Medium">Medium</option>
                <option value="Hard">Hard</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value as ProblemStatus)}
                className="w-full px-3 py-2 text-xs bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="attempted">Attempted</option>
                <option value="solved_independently">Solved Independently</option>
                <option value="solved_with_help">Solved With Help</option>
                <option value="needs_revision">Needs Revision</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Time & Space Complexity
              </label>
              <input
                type="text"
                value={formComplexity}
                onChange={e => setFormComplexity(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="O(N) time, O(1) space"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Next Review Date
              </label>
              <input
                type="date"
                value={formNextReviewDate}
                onChange={e => setFormNextReviewDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Solution Approach & Notes
            </label>
            <textarea
              rows={3}
              value={formSolutionNotes}
              onChange={e => setFormSolutionNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              placeholder="Why this pattern works, edge cases handled..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Problem
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
