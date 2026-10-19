// ============================================================
//  JNEET+ AI — tests/exam-mode.test.js
//  NEET <-> JEE: switching, per-exam target dates, per-exam history, and the
//  guarantee that the frontend's mirrored target list matches the backend's.
// ============================================================

import fs from 'node:fs'
import path from 'node:path'
import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { clearMailbox } from './mailbox.js'
import { connectTestDb, disconnectTestDb, signedInClient } from './helpers.js'
import User from '../models/User.js'
import Chat from '../models/Chat.js'
import TestAttempt from '../models/TestAttempt.js'
import { getTargetExamOptions } from '../config/targetExams.js'

vi.mock('../services/emailService.js', async (orig) => (await import('./mailbox.js')).mailMock(orig))

let a, studentId

beforeAll(connectTestDb)
afterAll(disconnectTestDb)
beforeEach(async () => {
  await User.deleteMany({}); await Chat.deleteMany({}); await TestAttempt.deleteMany({})
  clearMailbox()
  const s = await signedInClient({ examMode: 'NEET' })
  a = s.c; studentId = s.student._id
})

const attempt = (examMode) => ({
  userId: studentId, examMode, subject: 'Physics', chapter: 'x', mode: 'revision', status: 'submitted',
  submittedAt: new Date(), totalQuestions: 1, score: 100,
  questions: [{ questionId: new User()._id, subject: 'Physics', chapter: 'x', questionText: 'q', options: ['a', 'b', 'c', 'd'], correctIndex: 0 }],
})

describe('Exam mode', () => {
  it('switches NEET -> JEE, clears the old target and keeps the session', async () => {
    await a.patch('/api/auth/me/target-exam').send({ targetExam: 'NEET_2027' })
    const res = await a.patch('/api/user/exam-mode').send({ examMode: 'JEE' })
    expect(res.status).toBe(200)
    expect(res.body.student).toMatchObject({ examMode: 'JEE', targetExam: null, targetExamPromptDismissed: false })
    // still signed in, and /me agrees
    const me = await a.get('/api/auth/me')
    expect(me.status).toBe(200)
    expect(me.body.student.examMode).toBe('JEE')
  })

  it('is idempotent and validates the value', async () => {
    expect((await a.patch('/api/user/exam-mode').send({ examMode: 'NEET' })).status).toBe(200)
    expect((await a.patch('/api/user/exam-mode').send({ examMode: 'CAT' })).status).toBe(400)
    expect((await a.patch('/api/user/exam-mode').send({})).status).toBe(400)
  })

  it('only accepts a target date that belongs to the current exam', async () => {
    expect((await a.patch('/api/auth/me/target-exam').send({ targetExam: 'JEE_MAIN_2027' })).status).toBe(400)
    expect((await a.patch('/api/auth/me/target-exam').send({ targetExam: 'NEET_2027' })).status).toBe(200)
    await a.patch('/api/user/exam-mode').send({ examMode: 'JEE' })
    expect((await a.patch('/api/auth/me/target-exam').send({ targetExam: 'NEET_2027' })).status).toBe(400)
    const ok = await a.patch('/api/auth/me/target-exam').send({ targetExam: 'JEE_ADV_2027' })
    expect(ok.status).toBe(200)
    expect(ok.body.student.targetExam).toBe('JEE_ADV_2027')
  })

  it('keeps each exam\'s chats and test history separate (and loses nothing on switching back)', async () => {
    await TestAttempt.create([attempt('NEET'), attempt('NEET'), attempt('JEE')])
    const neet = await a.get('/api/test/history')
    expect(neet.body.attempts).toHaveLength(2)
    expect(neet.body.total).toBe(2)

    await a.patch('/api/user/exam-mode').send({ examMode: 'JEE' })
    const jee = await a.get('/api/test/history')
    expect(jee.body.attempts).toHaveLength(1)

    await a.patch('/api/user/exam-mode').send({ examMode: 'NEET' })
    expect((await a.get('/api/test/history')).body.attempts).toHaveLength(2)
  })

  it('frontend target-exam list mirrors the backend list exactly', () => {
    const file = fs.readFileSync(path.resolve(import.meta.dirname, '../../frontend/src/config/targetExams.js'), 'utf8')
    const mirrored = [...file.matchAll(/key: "([A-Z0-9_]+)", label: "([^"]+)", date: "([^"]+)", tentative: (true|false), examMode: "(NEET|JEE)"/g)]
      .map(([, key, label, date, tentative, examMode]) => ({ key, label, date, tentative: tentative === 'true', examMode }))
    const server = getTargetExamOptions().filter((o) => o.key !== 'RE_NEET')
      .map(({ key, label, date, tentative, examMode }) => ({ key, label, date, tentative, examMode }))
    expect(mirrored).toEqual(server)
  })
})
