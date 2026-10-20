import React, { useState, useEffect } from 'react'
import { Header } from '../components/layout/Header'
import { Button } from '../components/common/Button'
import { Modal } from '../components/common/Modal'
import { useApp } from '../context/AppContext'
import { db } from '../../src/db'
import { ResourceItem, ResourceStatus } from '../types'
import {
  Bookmark,
  ExternalLink,
  Wifi,
  Plus,
  CheckCircle2,
  Clock,
  Circle,
  Edit2,
  Trash2
} from 'lucide-react'

export const ResourcesScreen: React.FC = () => {
  const { showToast } = useApp()

  const [resources, setResources] = useState<ResourceItem[]>([])
  const [selectedTopic, setSelectedTopic] = useState<string>('All')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingResource, setEditingResource] = useState<ResourceItem | null>(null)

  // Form fields
  const [formTitle, setFormTitle] = useState('')
  const [formTopic, setFormTopic] = useState('Java')
  const [formDescription, setFormDescription] = useState('')
  const [formUrl, setFormUrl] = useState('')
  const [formRequiresInternet, setFormRequiresInternet] = useState(true)
  const [formStatus, setFormStatus] = useState<ResourceStatus>('not_started')
  const [formNotes, setFormNotes] = useState('')

  const loadResources = async () => {
    const list = await db.resources.toArray()
    setResources(list)
  }

  useEffect(() => {
    loadResources()
  }, [])

  const topics = ['All', ...Array.from(new Set(resources.map(r => r.topic)))]

  const displayedResources = selectedTopic === 'All'
    ? resources
    : resources.filter(r => r.topic === selectedTopic)

  const openCreateModal = () => {
    setEditingResource(null)
    setFormTitle('')
    setFormTopic('Java')
    setFormDescription('')
    setFormUrl('')
    setFormRequiresInternet(true)
    setFormStatus('not_started')
    setFormNotes('')
    setIsModalOpen(true)
  }

  const openEditModal = (res: ResourceItem) => {
    setEditingResource(res)
    setFormTitle(res.title)
    setFormTopic(res.topic)
    setFormDescription(res.description)
    setFormUrl(res.url)
    setFormRequiresInternet(res.requiresInternet)
    setFormStatus(res.status)
    setFormNotes(res.notes || '')
    setIsModalOpen(true)
  }

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formTitle.trim() || !formUrl.trim()) return

    if (editingResource) {
      const updated: ResourceItem = {
        ...editingResource,
        title: formTitle.trim(),
        topic: formTopic.trim(),
        description: formDescription.trim(),
        url: formUrl.trim(),
        requiresInternet: formRequiresInternet,
        status: formStatus,
        notes: formNotes.trim() || undefined
      }
      await db.resources.put(updated)
      showToast('Resource updated')
    } else {
      const newRes: ResourceItem = {
        id: `res-${Date.now()}`,
        title: formTitle.trim(),
        topic: formTopic.trim(),
        description: formDescription.trim(),
        url: formUrl.trim(),
        requiresInternet: formRequiresInternet,
        status: formStatus,
        notes: formNotes.trim() || undefined
      }
      await db.resources.put(newRes)
      showToast('Resource added')
    }

    setIsModalOpen(false)
    loadResources()
  }

  const handleStatusChange = async (res: ResourceItem, newStatus: ResourceStatus) => {
    const updated: ResourceItem = { ...res, status: newStatus }
    await db.resources.put(updated)
    setResources(prev => prev.map(r => (r.id === res.id ? updated : r)))
    showToast(`Status updated to ${newStatus.replace('_', ' ')}`)
  }

  const handleDeleteResource = async (id: string) => {
    await db.resources.delete(id)
    showToast('Resource removed')
    loadResources()
  }

  return (
    <div className="min-h-screen pb-24 md:pb-12 bg-bg transition-colors">
      <Header
        title="Learning Resources"
        subtitle="Official and established guides for deep work"
        action={
          <Button size="sm" variant="primary" onClick={openCreateModal} icon={<Plus size={14} />}>
            Add Resource
          </Button>
        }
      />

      <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-5 space-y-6">
        {/* Topic filter bar */}
        <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {topics.map(t => (
            <button
              key={t}
              onClick={() => setSelectedTopic(t)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                selectedTopic === t
                  ? 'bg-accent text-white font-semibold'
                  : 'bg-bg-card border border-border text-text-secondary hover:text-text-primary'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Resources list */}
        <div className="grid grid-cols-1 gap-3">
          {displayedResources.map(res => (
            <div
              key={res.id}
              className="bg-bg-card rounded-2xl p-4 sm:p-5 border border-border space-y-3 shadow-xs transition-colors"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-semibold text-accent">
                      {res.topic}
                    </span>
                    {res.requiresInternet && (
                      <span className="inline-flex items-center gap-1 text-[10px] text-text-secondary bg-bg-subtle px-1.5 py-0.5 rounded border border-border">
                        <Wifi size={10} />
                        Requires Internet
                      </span>
                    )}
                  </div>

                  <a
                    href={res.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-base font-bold text-text-primary hover:text-accent transition-colors inline-flex items-center gap-1.5 group"
                  >
                    <span>{res.title}</span>
                    <ExternalLink size={14} className="text-text-secondary group-hover:text-accent shrink-0" />
                  </a>

                  <p className="text-xs sm:text-sm text-text-secondary mt-1 leading-relaxed">
                    {res.description}
                  </p>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => openEditModal(res)}
                    className="p-1.5 text-text-secondary hover:text-text-primary rounded-lg transition-colors"
                    aria-label="Edit resource"
                  >
                    <Edit2 size={15} />
                  </button>
                  {res.id.startsWith('res-custom') && (
                    <button
                      onClick={() => handleDeleteResource(res.id)}
                      className="p-1.5 text-overdue hover:bg-overdue/10 rounded-lg transition-colors"
                      aria-label="Delete resource"
                    >
                      <Trash2 size={15} />
                    </button>
                  )}
                </div>
              </div>

              {/* Status and Notes */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-border">
                <div className="flex items-center gap-2">
                  <span className="text-xs text-text-secondary">Study Status:</span>
                  <select
                    value={res.status}
                    onChange={e => handleStatusChange(res, e.target.value as ResourceStatus)}
                    className="px-2.5 py-1 text-xs bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                  >
                    <option value="not_started">Not Started</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                {res.notes && (
                  <span className="text-xs text-text-secondary italic">
                    Note: {res.notes}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* CREATE / EDIT MODAL */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingResource ? 'Edit Resource' : 'Add Learning Resource'}
        maxWidth="md"
      >
        <form onSubmit={handleSaveResource} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Title *
            </label>
            <input
              type="text"
              required
              value={formTitle}
              onChange={e => setFormTitle(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="e.g. Modern Java in Action"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Topic *
              </label>
              <input
                type="text"
                required
                value={formTopic}
                onChange={e => setFormTopic(e.target.value)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
                placeholder="e.g. Spring Boot, Java, DSA"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-text-secondary mb-1">
                Status
              </label>
              <select
                value={formStatus}
                onChange={e => setFormStatus(e.target.value as ResourceStatus)}
                className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              >
                <option value="not_started">Not Started</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              External URL *
            </label>
            <input
              type="url"
              required
              value={formUrl}
              onChange={e => setFormUrl(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent"
              placeholder="https://dev.java/learn/"
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
              placeholder="One-sentence description of the resource..."
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-text-secondary mb-1">
              Personal Notes
            </label>
            <textarea
              rows={2}
              value={formNotes}
              onChange={e => setFormNotes(e.target.value)}
              className="w-full px-3 py-2 text-sm bg-bg border border-border rounded-lg text-text-primary focus:outline-none focus:ring-1 focus:ring-accent resize-none"
              placeholder="Specific chapters, exercises, or prerequisites..."
            />
          </div>

          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="requiresInternet"
              checked={formRequiresInternet}
              onChange={e => setFormRequiresInternet(e.target.checked)}
              className="rounded text-accent focus:ring-accent"
            />
            <label htmlFor="requiresInternet" className="text-xs text-text-secondary select-none">
              Requires internet connection to view
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-border">
            <Button variant="secondary" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="primary" type="submit">
              Save Resource
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
