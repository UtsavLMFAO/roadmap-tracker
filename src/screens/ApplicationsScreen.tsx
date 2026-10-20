import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { useApp } from '../context/AppContext'
import { db } from '../../src/db'
import { JobApplication, ApplicationStatus } from '../types'
import {
  Briefcase,
  ExternalLink,
  Plus,
  Edit2,
  Calendar,
  Trash2,
  MapPin,
  Clock
} from 'lucide-react'

export const ApplicationsScreen: React.FC = () => {
  const { showToast } = useApp()

  const [applications, setApplications] = useState<JobApplication[]>([])
  const [selectedStatus, setSelectedStatus] = useState<string>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingApp, setEditingApp] = useState<JobApplication | null>(null)

  // Form states
  const [formCompany, setFormCompany] = useState('')
  const [formRole, setFormRole] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formLocation, setFormLocation] = useState('')
  const [formEligibility, setFormEligibility] = useState('')
  const [formAppliedAt, setFormAppliedAt] = useState('')
  const [formStatus, setFormStatus] = useState<ApplicationStatus>('Wishlist')
  const [formNextAction, setFormNextAction] = useState('')
  const [formNextActionDate, setFormNextActionDate] = useState('')
  const [formInterviewNotes, setFormInterviewNotes] = useState('')
  const [formOutcome, setFormOutcome] = useState('')

  const loadApps = async () => {
    const list = await db.applications.toArray()
    setApplications(list)
  }

  useEffect(() => {
    loadApps()
  }, [])

  const statuses: { id: string; label: string }[] = [
    { id: 'All', label: 'All' },
    { id: 'Wishlist', label: 'Wishlist' },
    { id: 'Applied', label: 'Applied' },
    { id: 'Screening', label: 'Screening' },
    { id: 'Interview', label: 'Interview' },
    { id: 'Offer', label: 'Offer' },
    { id: 'Rejected', label: 'Rejected' },
    { id: 'Withdrawn', label: 'Withdrawn' }
  ]

  const displayedApps = selectedStatus === 'All'
    ? applications
    : applications.filter(a => a.status === selectedStatus)

  const openCreateModal = () => {
    setEditingApp(null)
    setFormCompany('')
    setFormRole('Junior Software Engineer')
    setFormUrl('')
    setFormLocation('Remote / International')
    setFormEligibility('Eligible for candidates residing in Nepal')
    setFormAppliedAt(new Date().toISOString().slice(0, 10))
    setFormStatus('Wishlist')
    setFormNextAction('')
    setFormNextActionDate('')
    setFormInterviewNotes('')
    setFormOutcome('')
    setIsModalOpen(true)
  }

  const openEditModal = (app: JobApplication) => {
    setEditingApp(app)
    setFormCompany(app.company)
    setFormRole(app.role)
    setFormUrl(app.url)
    setFormLocation(app.location)
    setFormEligibility(app.eligibilityNotes)
    setFormAppliedAt(app.appliedAt)
    setFormStatus(app.status)
    setFormNextAction(app.nextAction)
    setFormNextActionDate(app.nextActionDate || '')
    setFormInterviewNotes(app.interviewNotes)
    setFormOutcome(app.outcome)
    setIsModalOpen(true)
  }

  const handleSaveApp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formCompany.trim() || !formRole.trim()) return

    if (editingApp) {
      const updated: JobApplication = {
        ...editingApp,
        company: formCompany.trim(),
        role: formRole.trim(),
        url: formUrl.trim(),
        location: formLocation.trim(),
        eligibilityNotes: formEligibility.trim(),
        appliedAt: formAppliedAt,
        status: formStatus,
        nextAction: formNextAction.trim(),
        nextActionDate: formNextActionDate || undefined,
        interviewNotes: formInterviewNotes.trim(),
        outcome: formOutcome.trim()
      }
      await db.applications.put(updated)
      showToast('Application updated')
    } else {
      const newApp: JobApplication = {
        id: `app-${Date.now()}`,
        company: formCompany.trim(),
        role: formRole.trim(),
        url: formUrl.trim(),
        location: formLocation.trim(),
        eligibilityNotes: formEligibility.trim(),
        appliedAt: formAppliedAt,
        status: formStatus,
        nextAction: formNextAction.trim(),
        nextActionDate: formNextActionDate || undefined,
        interviewNotes: formInterviewNotes.trim(),
        outcome: formOutcome.trim()
      }
      await db.applications.put(newApp)
      showToast('Application added')
    }

    setIsModalOpen(false)
    loadApps()
  }

  const handleDeleteApp = async (id: string) => {
    await db.applications.delete(id)
    showToast('Application removed')
    loadApps()
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-bg transition-colors">
      <Header
        title="Job Applications"
        subtitle="Tracking international internships and junior engineering roles"
        action={
          <Button size="sm" variant="primary" onClick={openCreateModal} icon={<Plus size={14} />}>
            Add Opportunity
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* Status filter bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {statuses.map(s => {
            const count = s.id === 'All' ? applications.length : applications.filter(a => a.status === s.id).length
            return (
              <button
                key={s.id}
                onClick={() => setSelectedStatus(s.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
                  selectedStatus === s.id
                    ? 'bg-accent text-white font-semibold'
                    : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary'
                }`}
              >
                <span>{s.label}</span>
                <span className="text-[10px] opacity-80 font-mono">({count})</span>
              </button>
            )
          })}
        </div>

        {/* Application Cards List */}
        <div className="space-y-3">
          {displayedApps.length === 0 ? (
            <div className="bg-bg-card rounded-2xl p-8 border border-border text-center text-xs text-text-secondary">
              No applications logged in this category.
            </div>
          ) : (
            displayedApps.map(app => (
              <div
                key={app.id}
                className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border space-y-3 shadow-xs transition-colors hover:border-text-secondary/40"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span
                        className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${
                          app.status === 'Offer'
                            ? 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                            : app.status === 'Interview' || app.status === 'Screening'
                            ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400'
                            : app.status === 'Applied'
                            ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400'
                            : 'bg-bg-subtle text-text-secondary'
                        }`}
                      >
                        {app.status}
                      </span>
                      <span className="text-xs text-text-secondary">·</span>
                      <span className="text-xs text-text-secondary">Applied: {app.appliedAt}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <h3 className="text-base font-bold text-text-primary">
                        {app.company}
                      </h3>
                      <span className="text-sm font-medium text-text-secondary">— {app.role}</span>
                      {app.url && (
                        <a
                          href={app.url}
                          target="_blank"
                          rel="noreferrer"
                          className="text-text-secondary hover:text-accent"
                          aria-label={`Open job posting for ${app.company}`}
                        >
                          <ExternalLink size={13} />
                        </a>
                      )}
                    </div>

                    {app.location && (
                      <div className="flex items-center gap-1.5 text-xs text-text-secondary mt-1">
                        <MapPin size={12} className="text-accent" />
                        <span>{app.location}</span>
                        {app.eligibilityNotes && (
                          <span className="text-accent/90">({app.eligibilityNotes})</span>
                        )}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={() => openEditModal(app)}
                      className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                      aria-label="Edit application"
                    >
                      <Edit2 size={15} />
                    </button>
                    <button
                      onClick={() => handleDeleteApp(app.id)}
                      className="p-1.5 text-overdue hover:bg-overdue/10 rounded-lg transition-colors"
                      aria-label="Delete application"
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                </div>

                {/* Next action & notes */}
                {app.nextAction && (
                  <div className="p-3 bg-bg-subtle rounded-xl text-xs flex items-center justify-between border border-border/60">
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-accent" />
                      <span className="text-text-primary font-medium">Next Action: {app.nextAction}</span>
                    </div>
                    {app.nextActionDate && (
                      <span className="text-text-secondary font-mono">{app.nextActionDate}</span>
                    )}
                  </div>
                )}

                {app.interviewNotes && (
                  <div className="p-3 bg-bg-subtle/60 rounded-xl text-xs text-text-secondary border border-border/60">
                    <span className="font-semibold text-text-primary block mb-0.5">Interview & Follow-up Notes:</span>
                    {app.interviewNotes}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </main>

      {/* CREATE / EDIT APPLICATION MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingApp ? 'Edit Job Application' : 'Add Opportunity'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveApp} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Company *
              </label>
              <input
                type="text"
                required
                value={formCompany}
                onChange={e => setFormCompany(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. Spotify"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Role *
              </label>
              <input
                type="text"
                required
                value={formRole}
                onChange={e => setFormRole(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. Backend Engineering Intern"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value as ApplicationStatus)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="Wishlist">Wishlist</option>
                <option value="Applied">Applied</option>
                <option value="Screening">Screening</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Date Applied
              </label>
              <input
                type="date"
                value={formAppliedAt}
                onChange={e => setFormAppliedAt(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Job Posting URL
            </label>
            <input
              type="url"
              value={formUrl}
              onChange={e => setFormUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="https://company.com/careers/..."
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Location (Remote / City)
              </label>
              <input
                type="text"
                value={formLocation}
                onChange={e => setFormLocation(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. Remote (APAC/Global)"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Eligibility Notes (Nepal Candidate)
              </label>
              <input
                type="text"
                value={formEligibility}
                onChange={e => setFormEligibility(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. Visa sponsorship offered / Nepal resident ok"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Next Action
              </label>
              <input
                type="text"
                value={formNextAction}
                onChange={e => setFormNextAction(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. Complete HackerRank OA"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Next Action Deadline
              </label>
              <input
                type="date"
                value={formNextActionDate}
                onChange={e => setFormNextActionDate(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Interview Notes & Lessons
            </label>
            <textarea
              rows={2}
              value={formInterviewNotes}
              onChange={e => setFormInterviewNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              placeholder="Questions asked, topics to improve, contact names..."
            />
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Application
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
