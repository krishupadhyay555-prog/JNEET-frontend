// ============================================================
//  JNEET+ AI — tests/session-safety.test.js
//  A typo in a "confirm your password" box must never sign the student out:
//  those endpoints answer 400 (not 401), and the session stays valid.
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { clearMailbox } from './mailbox.js'
import { connectTestDb, disconnectTestDb, signedInClient, STRONG_PASSWORD } from './helpers.js'
import User from '../models/User.js'

vi.mock('../services/emailService.js', async (orig) => (await import('./mailbox.js')).mailMock(orig))

let a

beforeAll(connectTestDb)
afterAll(disconnectTestDb)
beforeEach(async () => { await User.deleteMany({}); clearMailbox(); a = (await signedInClient()).c })

describe('Wrong password in a confirm box', () => {
  it('change-password: 400 with a field error, session untouched', async () => {
    const res = await a.patch('/api/user/password').send({ currentPassword: 'Totally-Wrong-1', newPassword: 'Mn8-Cobalt-River' })
    expect(res.status).toBe(400)
    expect(res.body.fieldErrors[0].field).toBe('currentPassword')
    expect((await a.get('/api/auth/me')).status).toBe(200)
  })

  it('delete-account: 400, account stays active, session untouched', async () => {
    const res = await a.delete('/api/user/account').send({ password: 'Totally-Wrong-1' })
    expect(res.status).toBe(400)
    expect((await a.get('/api/auth/me')).status).toBe(200)
    expect((await User.findOne({}).lean()).isActive).toBe(true)
  })

  it('delete-account with the right password signs out and blocks login afterwards', async () => {
    const res = await a.delete('/api/user/account').send({ password: STRONG_PASSWORD })
    expect(res.status).toBe(200)
    expect((await a.get('/api/auth/me')).status).toBe(401)
    const u = await User.findOne({}).lean()
    expect(u.isActive).toBe(false)
    expect(u.deletedAt).toBeTruthy()
  })
})
