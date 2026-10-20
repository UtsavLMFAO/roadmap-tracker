import { describe, it, expect } from 'vitest'
import { validateBackupData } from '../db'

describe('Backup Validation', () => {
  it('rejects invalid inputs', () => {
    expect(validateBackupData(null).valid).toBe(false)
    expect(validateBackupData('string').valid).toBe(false)
    expect(validateBackupData({}).valid).toBe(false)
    expect(validateBackupData({ version: 1 }).valid).toBe(false)
  })

  it('accepts valid backup data and returns summary', () => {
    const validData = {
      version: 1,
      exportedAt: new Date().toISOString(),
      phases: [{ id: 'p1' }],
      tasks: [{ id: 't1' }, { id: 't2' }],
      studySessions: [{ id: 's1' }],
      projects: []
    }
    const result = validateBackupData(validData)
    expect(result.valid).toBe(true)
    expect(result.summary?.tasks).toBe(2)
    expect(result.summary?.sessions).toBe(1)
  })
})
