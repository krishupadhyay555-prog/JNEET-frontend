// ============================================================
//  JNEET+ AI — tests/chat.test.js  (Comprehensive v3.0)
//  Full coverage of the chat section:
//    - Session creation, saving (new + existing), title generation
//    - Session listing, active-session restore (refresh behavior)
//    - Session switching (activate) without sending a message
//    - Session deletion (incl. active-session reassignment, last-one)
//    - Saved / bookmarked messages (save, un-save, list, errors)
//    - Security: one user can never see/touch another user's chats
//    - Logout revokes chat access immediately
//    - Data integrity: session cap (30) and message cap (150)
//
//  NOTE: generateChatTitle (the real Gemini call) is mocked to
//  always return null in this file. This makes every test
//  deterministic and fast — assertions exercise OUR fallback
//  logic, not the live behavior of a third-party AI, which would
//  make the suite flaky, slow, and dependent on API quota/cost.
//  Real AI title quality should be checked manually in the app.
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../app.js'
import User from '../models/User.js'
import Chat from '../models/Chat.js'

vi.mock('../services/geminiService.js', async (importOriginal) => {
  const actual = await importOriginal()
  return {
    ...actual,
    generateChatTitle: vi.fn().mockResolvedValue(null), // force fallback truncation
  }
})

let mongoServer
let agent // authenticated "browser session" for the primary test user

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

beforeEach(async () => {
  await User.deleteMany({})
  await Chat.deleteMany({})

  agent = request.agent(app)
  await agent.post('/api/auth/register').send({
    name: 'Test Student',
    email: 'chattest@example.com',
    password: 'Password123',
    examMode: 'NEET',
  })
})

afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

// ────────────────────────────────────────────────────────────
describe('Chat — Session Creation', () => {
  it('creates a new empty session with a default title', async () => {
    const res = await agent.post('/api/chat/session/new')

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.sessionId).toBeTruthy()
    expect(res.body.title).toBe('New Chat')
  })

  it('sets the new session as the active session', async () => {
    const created = await agent.post('/api/chat/session/new')
    const listRes = await agent.get('/api/chat/sessions')

    expect(listRes.body.activeSessionId).toBe(created.body.sessionId)
  })
})

// ────────────────────────────────────────────────────────────
describe('Chat — Saving Messages & Titles', () => {
  it('saves a message pair WITHOUT a sessionId (brand-new chat) — used to 400, now must succeed', async () => {
    const res = await agent.post('/api/chat/message/save').send({
      sessionId: null, // exactly what the frontend sends for a fresh chat
      userMessage: { content: 'Mitosis kya hai?' },
      aiMessage:   { content: 'Mitosis ek cell division process hai...' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.sessionId).toBeTruthy()
    expect(res.body.title).toBe('Mitosis kya hai?')
  })

  it('generates a clean, word-boundary-truncated title for long messages (fallback path)', async () => {
    const longMessage = 'Explain the complete mechanism of photosynthesis including light and dark reactions in detail please'
    const res = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: longMessage },
      aiMessage:   { content: 'Photosynthesis has two stages...' },
    })

    expect(res.statusCode).toBe(200)
    expect(res.body.title.length).toBeLessThanOrEqual(50)
    expect(res.body.title.endsWith('…')).toBe(true)
  })

  it('adds a second message pair to an EXISTING session without changing its title', async () => {
    const first = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'Explain gravity' },
      aiMessage:   { content: 'Gravity is a force...' },
    })
    const sessionId = first.body.sessionId
    const originalTitle = first.body.title

    const second = await agent.post('/api/chat/message/save').send({
      sessionId,
      userMessage: { content: 'What about escape velocity?' },
      aiMessage:   { content: 'Escape velocity is...' },
    })

    expect(second.statusCode).toBe(200)
    expect(second.body.sessionId).toBe(sessionId)
    expect(second.body.title).toBe(originalTitle) // title must NOT change on 2nd message

    const sessionRes = await agent.get(`/api/chat/session/${sessionId}`)
    expect(sessionRes.body.session.messages.length).toBe(4)
  })

  it('returns 404 when saving to a sessionId that does not exist', async () => {
    const res = await agent.post('/api/chat/message/save').send({
      sessionId: '000000000000000000000000',
      userMessage: { content: 'Test' },
      aiMessage:   { content: 'Test response' },
    })
    expect(res.statusCode).toBe(404)
  })

  it('rejects a save with missing userMessage content (validation)', async () => {
    const res = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: '' },
      aiMessage:   { content: 'Some response' },
    })
    expect(res.statusCode).toBe(400)
  })
})

// ────────────────────────────────────────────────────────────
describe('Chat — Listing & Refresh-Restore Behavior', () => {
  it('lists sessions and reports the correct activeSessionId after saving', async () => {
    const saveRes = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'Newton laws' },
      aiMessage:   { content: 'Newton has 3 laws...' },
    })
    const sessionId = saveRes.body.sessionId

    const listRes = await agent.get('/api/chat/sessions')
    expect(listRes.statusCode).toBe(200)
    expect(listRes.body.sessions.length).toBe(1)
    expect(listRes.body.activeSessionId).toBe(sessionId)
  })

  it('REGRESSION: every session in the list has a valid _id field (the actual refresh-bug root cause)', async () => {
    // This is the specific bug that caused the whole "chats vanish on
    // refresh" saga: a MongoDB .select() projection was missing
    // "sessions._id", so every session object silently arrived at the
    // frontend with _id === undefined, which the frontend correctly
    // (and defensively) filtered out as garbage — making a perfectly
    // healthy database look completely empty. If this test ever
    // fails again, THIS is the first place to look.
    await agent.post('/api/chat/session/new')
    await agent.post('/api/chat/session/new')

    const listRes = await agent.get('/api/chat/sessions')
    expect(listRes.statusCode).toBe(200)
    expect(listRes.body.sessions.length).toBe(2)

    for (const session of listRes.body.sessions) {
      expect(session._id).toBeTruthy()
      expect(typeof session._id).toBe('string')
      expect(session._id).toMatch(/^[a-f\d]{24}$/i)
    }
  })

  it('keeps activeSessionId pointed at an OLDER session after sending a message there (the original refresh bug)', async () => {
    // Create session A, then session B (B becomes active)
    const sessionA = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'Topic A' },
      aiMessage:   { content: 'Answer A' },
    })
    const sessionB = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'Topic B' },
      aiMessage:   { content: 'Answer B' },
    })

    let listRes = await agent.get('/api/chat/sessions')
    expect(listRes.body.activeSessionId).toBe(sessionB.body.sessionId)

    // Now send a message in the OLDER session A directly (simulating the
    // user switching back and continuing that conversation)
    await agent.post('/api/chat/message/save').send({
      sessionId: sessionA.body.sessionId,
      userMessage: { content: 'Follow-up on Topic A' },
      aiMessage:   { content: 'More on A' },
    })

    // activeSessionId must now correctly point back to session A —
    // this is the exact scenario that used to restore the WRONG
    // session after a page refresh.
    listRes = await agent.get('/api/chat/sessions')
    expect(listRes.body.activeSessionId).toBe(sessionA.body.sessionId)
  })

  it('retrieves full messages for a specific session, in order', async () => {
    const saveRes = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'Ohms law' },
      aiMessage:   { content: 'V = IR' },
    })
    const sessionId = saveRes.body.sessionId

    const getRes = await agent.get(`/api/chat/session/${sessionId}`)
    expect(getRes.statusCode).toBe(200)
    expect(getRes.body.session.messages.length).toBe(2)
    expect(getRes.body.session.messages[0].content).toBe('Ohms law')
    expect(getRes.body.session.messages[0].role).toBe('user')
    expect(getRes.body.session.messages[1].content).toBe('V = IR')
    expect(getRes.body.session.messages[1].role).toBe('ai')
  })

  it('returns 404 for a session that does not exist', async () => {
    const res = await agent.get('/api/chat/session/000000000000000000000000')
    expect(res.statusCode).toBe(404)
  })
})

// ────────────────────────────────────────────────────────────
describe('Chat — Switching Sessions (Activate)', () => {
  it('switches active session via /activate WITHOUT sending a message', async () => {
    const first  = await agent.post('/api/chat/session/new')
    await agent.post('/api/chat/session/new') // second — becomes active by default

    const activateRes = await agent.patch(`/api/chat/session/${first.body.sessionId}/activate`)
    expect(activateRes.statusCode).toBe(200)

    const listRes = await agent.get('/api/chat/sessions')
    expect(listRes.body.activeSessionId).toBe(first.body.sessionId)
  })

  it('returns 404 when activating a session that does not exist', async () => {
    const res = await agent.patch('/api/chat/session/000000000000000000000000/activate')
    expect(res.statusCode).toBe(404)
  })
})

// ────────────────────────────────────────────────────────────
describe('Chat — Deleting Sessions', () => {
  it('deletes a session successfully', async () => {
    const created = await agent.post('/api/chat/session/new')
    const deleteRes = await agent.delete(`/api/chat/session/${created.body.sessionId}`)

    expect(deleteRes.statusCode).toBe(200)

    const listRes = await agent.get('/api/chat/sessions')
    expect(listRes.body.sessions.length).toBe(0)
  })

  it('reassigns activeSessionId to another session when the ACTIVE one is deleted', async () => {
    const first  = await agent.post('/api/chat/session/new')
    const second = await agent.post('/api/chat/session/new') // becomes active

    await agent.delete(`/api/chat/session/${second.body.sessionId}`)

    const listRes = await agent.get('/api/chat/sessions')
    expect(listRes.body.activeSessionId).toBe(first.body.sessionId)
  })

  it('sets activeSessionId to null when the LAST remaining session is deleted', async () => {
    const only = await agent.post('/api/chat/session/new')
    await agent.delete(`/api/chat/session/${only.body.sessionId}`)

    const listRes = await agent.get('/api/chat/sessions')
    expect(listRes.body.activeSessionId).toBeNull()
    expect(listRes.body.sessions.length).toBe(0)
  })

  it('returns 404 (never a crash) when deleting a non-existent/invalid session id', async () => {
    const res = await agent.delete('/api/chat/session/000000000000000000000000')
    expect(res.statusCode).toBe(404)
    expect(res.body.success).toBe(false)
  })

  it('deleting one session never affects another session\'s messages', async () => {
    const keep = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'Keep me' },
      aiMessage:   { content: 'I should survive' },
    })
    const remove = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'Delete me' },
      aiMessage:   { content: 'I will be removed' },
    })

    await agent.delete(`/api/chat/session/${remove.body.sessionId}`)

    const getRes = await agent.get(`/api/chat/session/${keep.body.sessionId}`)
    expect(getRes.statusCode).toBe(200)
    expect(getRes.body.session.messages[0].content).toBe('Keep me')
  })
})

// ────────────────────────────────────────────────────────────
describe('Chat — Saved / Bookmarked Messages', () => {
  it('marks a message as saved and it appears in the saved list', async () => {
    const saveRes = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'What is osmosis?' },
      aiMessage:   { content: 'Osmosis is...' },
    })
    const sessionId = saveRes.body.sessionId

    const sessionRes = await agent.get(`/api/chat/session/${sessionId}`)
    const aiMessageId = sessionRes.body.session.messages[1]._id

    const toggleRes = await agent.patch('/api/chat/message/save-toggle').send({
      sessionId, messageId: aiMessageId, saved: true,
    })
    expect(toggleRes.statusCode).toBe(200)
    expect(toggleRes.body.saved).toBe(true)

    const savedList = await agent.get('/api/chat/saved')
    expect(savedList.body.saved.length).toBe(1)
    expect(savedList.body.saved[0]._id).toBe(aiMessageId)
    expect(savedList.body.saved[0].sessionTitle).toBeTruthy()
  })

  it('un-saves a message and it disappears from the saved list', async () => {
    const saveRes = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'What is diffusion?' },
      aiMessage:   { content: 'Diffusion is...' },
    })
    const sessionId = saveRes.body.sessionId
    const sessionRes = await agent.get(`/api/chat/session/${sessionId}`)
    const aiMessageId = sessionRes.body.session.messages[1]._id

    await agent.patch('/api/chat/message/save-toggle').send({ sessionId, messageId: aiMessageId, saved: true })
    const untoggle = await agent.patch('/api/chat/message/save-toggle').send({ sessionId, messageId: aiMessageId, saved: false })

    expect(untoggle.statusCode).toBe(200)
    expect(untoggle.body.saved).toBe(false)

    const savedList = await agent.get('/api/chat/saved')
    expect(savedList.body.saved.find((m) => m._id === aiMessageId)).toBeUndefined()
  })

  it('returns 404 when toggling saved on a non-existent message', async () => {
    const created = await agent.post('/api/chat/session/new')
    const res = await agent.patch('/api/chat/message/save-toggle').send({
      sessionId: created.body.sessionId,
      messageId: '000000000000000000000000',
      saved: true,
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns 404 when toggling saved on a non-existent session', async () => {
    const res = await agent.patch('/api/chat/message/save-toggle').send({
      sessionId: '000000000000000000000000',
      messageId: '000000000000000000000000',
      saved: true,
    })
    expect(res.statusCode).toBe(404)
  })

  it('returns an empty saved list when nothing has been saved', async () => {
    const res = await agent.get('/api/chat/saved')
    expect(res.statusCode).toBe(200)
    expect(res.body.saved).toEqual([])
  })
})

// ────────────────────────────────────────────────────────────
describe('Chat — Security: Cross-User Isolation', () => {
  it('prevents one user from VIEWING another user\'s session', async () => {
    const created = await agent.post('/api/chat/session/new')

    const userB = request.agent(app)
    await userB.post('/api/auth/register').send({
      name: 'Other Student', email: 'other1@example.com',
      password: 'Password123', examMode: 'NEET',
    })

    const getRes = await userB.get(`/api/chat/session/${created.body.sessionId}`)
    expect(getRes.statusCode).toBe(404)
  })

  it('prevents one user from DELETING another user\'s session', async () => {
    const created = await agent.post('/api/chat/session/new')

    const userB = request.agent(app)
    await userB.post('/api/auth/register').send({
      name: 'Other Student', email: 'other2@example.com',
      password: 'Password123', examMode: 'NEET',
    })

    const deleteRes = await userB.delete(`/api/chat/session/${created.body.sessionId}`)
    expect(deleteRes.statusCode).toBe(404)

    // Original owner's session must be untouched
    const listRes = await agent.get('/api/chat/sessions')
    expect(listRes.body.sessions.some((s) => s._id === created.body.sessionId)).toBe(true)
  })

  it('prevents one user from seeing another user\'s sessions in their own list', async () => {
    await agent.post('/api/chat/session/new')

    const userB = request.agent(app)
    await userB.post('/api/auth/register').send({
      name: 'Other Student', email: 'other3@example.com',
      password: 'Password123', examMode: 'NEET',
    })

    const listRes = await userB.get('/api/chat/sessions')
    expect(listRes.body.sessions.length).toBe(0)
  })
})

// ────────────────────────────────────────────────────────────
describe('Chat — Logout Revokes Access Immediately', () => {
  it('blocks all chat routes right after logout', async () => {
    const before = await agent.get('/api/chat/sessions')
    expect(before.statusCode).toBe(200)

    const logoutRes = await agent.post('/api/auth/logout')
    expect(logoutRes.statusCode).toBe(200)

    const after = await agent.get('/api/chat/sessions')
    expect(after.statusCode).toBe(401)
  })

  it('blocks saving a message after logout', async () => {
    await agent.post('/api/auth/logout')

    const res = await agent.post('/api/chat/message/save').send({
      sessionId: null,
      userMessage: { content: 'Should not save' },
      aiMessage:   { content: 'Should not save' },
    })
    expect(res.statusCode).toBe(401)
  })
})

// ────────────────────────────────────────────────────────────
// Model-level tests — direct DB checks, no HTTP/auth overhead.
// These verify the safeguards baked into Chat.js itself.
// ────────────────────────────────────────────────────────────
describe('Chat Model — Data Integrity Limits', () => {
  it('caps sessions at 30 per user, dropping the OLDEST first', async () => {
    const chat = new Chat({ userId: new mongoose.Types.ObjectId(), examMode: 'NEET', sessions: [] })
    for (let i = 0; i < 31; i++) {
      chat.sessions.push({ title: `Session ${i}`, messages: [] })
    }
    await chat.save()

    expect(chat.sessions.length).toBe(30)
    expect(chat.sessions[0].title).toBe('Session 1')   // "Session 0" was dropped
    expect(chat.sessions[29].title).toBe('Session 30') // newest retained
  })

  it('caps messages per session at 150, dropping the OLDEST first', async () => {
    const chat = new Chat({
      userId: new mongoose.Types.ObjectId(),
      examMode: 'NEET',
      sessions: [{ title: 'Long Chat', messages: [] }],
    })
    const session = chat.sessions[0]
    for (let i = 0; i < 151; i++) {
      session.messages.push({ role: i % 2 === 0 ? 'user' : 'ai', content: `Message ${i}` })
    }
    await chat.save()

    expect(chat.sessions[0].messages.length).toBe(150)
    expect(chat.sessions[0].messages[0].content).toBe('Message 1') // "Message 0" dropped
  })
})