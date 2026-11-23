// ============================================================
//  JNEET+ AI — tests/all-india.test.js
//  PYQs in chapter Revision + the weekly All-India Mock: window (IST),
//  same paper for everyone, one sitting each, answers hidden until it
//  closes, rank list (marks, then time; codes instead of names).
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { clearMailbox } from './mailbox.js'
import { connectTestDb, disconnectTestDb, signedInClient } from './helpers.js'
import User from '../models/User.js'
import Question from '../models/Question.js'
import TestAttempt from '../models/TestAttempt.js'
import AllIndiaMock from '../models/AllIndiaMock.js'
import { currentWeekKey, previousWeekKey, windowFor, studentCode } from '../services/allIndiaMock.js'

vi.mock('../services/emailService.js', async (orig) => (await import('./mailbox.js')).mailMock(orig))

const realAggregate = Question.aggregate.bind(Question)
beforeAll(async () => {
  await connectTestDb()
  vi.spyOn(Question, 'aggregate').mockImplementation(async (pipeline) => {
    const [match, sample] = pipeline
    if (!match?.$match || !sample?.$sample) return realAggregate(pipeline)
    const docs = await Question.find(match.$match).lean()
    return docs.sort(() => Math.random() - 0.5).slice(0, sample.$sample.size)
  })
})
afterAll(disconnectTestDb)
beforeEach(async () => {
  await User.deleteMany({}); await Question.deleteMany({}); await TestAttempt.deleteMany({}); await AllIndiaMock.deleteMany({})
  clearMailbox()
})

const q = (n, over = {}) => ({
  examMode: 'JEE', subject: 'Physics', chapter: 'Kinematics', difficulty: 'tough',
  questionText: `Question ${n}?`, options: ['A', 'B', 'C', 'D'], correctIndex: 1, explanation: `Because ${n}`, ...over,
})
const bank = (subject, n) => Array.from({ length: n }, (_, i) => q(`${subject}-${i}`, { subject, chapter: `${subject} ch` }))

describe('All-India Mock week (IST)', () => {
  it('a Monday points to the coming Sunday; Sunday morning to the same day', () => {
    expect(currentWeekKey(new Date('2026-11-23T06:00:00Z'))).toBe('2026-11-29')          // Mon 11:30 IST
    expect(currentWeekKey(new Date('2026-11-29T04:00:00Z'))).toBe('2026-11-29')          // Sun 09:30 IST
    expect(currentWeekKey(new Date('2026-11-29T18:31:00Z'))).toBe('2026-12-06')          // Mon 00:01 IST
    expect(previousWeekKey('2026-11-29')).toBe('2026-11-22')
  })
  it('opens 08:00 IST, closes 23:59:59 IST, last start leaves the full time', () => {
    const w = windowFor('2026-11-29', 180)
    expect(w.opensAt.toISOString()).toBe('2026-11-29T02:30:00.000Z')
    expect(w.closesAt.toISOString()).toBe('2026-11-29T18:29:59.000Z')
    expect(w.closesAt - w.lastStartAt).toBe(180 * 60 * 1000)
  })
})

describe('PYQs in chapter Revision', () => {
  it('lists PYQ counts per chapter and mixes real PYQs into a Revision', async () => {
    const { c } = await signedInClient({ examMode: 'JEE' })
    await Question.insertMany(Array.from({ length: 5 }, (_, i) => q(i, { chapter: 'Kinematics', difficulty: 'easy' })))
    const list = await c.get('/api/test/chapters')
    const kin = list.body.chapters.find((x) => x.chapter === 'Kinematics')
    expect(kin.pyq).toBeGreaterThan(50)

    const res = await c.post('/api/test/start').send({ subject: 'Physics', chapter: 'Kinematics', easy: 2, pyq: 6 })
    expect(res.status).toBe(200)
    expect(res.body.totalQuestions).toBe(8)
    const pyqs = res.body.questions.filter((x) => x.source === 'pyq')
    expect(pyqs).toHaveLength(6)
    expect(pyqs.every((x) => x.chapter === 'Kinematics' && /^JEE Main 20\d\d · /.test(x.pyqLabel))).toBe(true)
    for (const x of res.body.questions) { expect(x).not.toHaveProperty('correctIndex'); expect(x).not.toHaveProperty('answers') }

    // instant feedback works for a PYQ numerical, and the finish keeps it
    const saved = await TestAttempt.findById(res.body.attemptId).lean()
    const num = saved.questions.find((x) => x.type === 'numeric')
    if (num) {
      const fb = await c.post(`/api/test/${res.body.attemptId}/answer`).send({ questionId: String(num.questionId), textAnswer: num.answers[0] })
      expect(fb.body).toMatchObject({ type: 'numeric', isCorrect: true, correctAnswer: num.answers[0] })
      const done = await c.post(`/api/test/${res.body.attemptId}/submit`).send({ answers: saved.questions.map((x) => ({ questionId: String(x.questionId), selectedIndex: null })) })
      expect(done.body.attempt.correctCount).toBe(1)
    }
  })

  it('a Revision of PYQs only is allowed', async () => {
    const { c } = await signedInClient({ examMode: 'JEE' })
    const res = await c.post('/api/test/start').send({ subject: 'Mathematics', chapter: 'Binomial Theorem', pyq: 5 })
    expect(res.status).toBe(200)
    expect(res.body.questions.every((x) => x.source === 'pyq')).toBe(true)
  })
})

describe('All-India Mock', () => {
  async function openMock(c) {
    await Question.insertMany([...bank('Mathematics', 8), ...bank('Physics', 8), ...bank('Chemistry', 8)])
    const res = await c.get('/api/all-india')
    expect(res.status).toBe(200)
    const id = res.body.current.id
    // make it open right now
    await AllIndiaMock.updateOne({ _id: id }, { opensAt: new Date(Date.now() - 60000), lastStartAt: new Date(Date.now() + 3600000), closesAt: new Date(Date.now() + 4 * 3600000) })
    return id
  }

  it('makes one paper per week: mostly PYQs, NTA order, same for every student', async () => {
    const s1 = await signedInClient({ examMode: 'JEE' })
    const s2 = await signedInClient({ examMode: 'JEE' })
    const id = await openMock(s1.c)
    const again = await s2.c.get('/api/all-india')
    expect(String(again.body.current.id)).toBe(String(id))
    expect(again.body.current).toMatchObject({ totalQuestions: 75, pyqCount: 57, status: 'open', maxMarks: 300 })
    expect(await AllIndiaMock.countDocuments()).toBe(1)

    const a1 = await s1.c.post(`/api/all-india/${id}/start`)
    const a2 = await s2.c.post(`/api/all-india/${id}/start`)
    expect(a1.status).toBe(200); expect(a2.status).toBe(200)
    expect(a1.body.questions.map((x) => x.questionId)).toEqual(a2.body.questions.map((x) => x.questionId))
    expect(a1.body.questions[0].subject).toBe('Mathematics')
    for (const x of a1.body.questions) expect(x).not.toHaveProperty('correctIndex')
  })

  it('one sitting each, answers hidden until close, rank by marks then time, codes not names', async () => {
    const s1 = await signedInClient({ examMode: 'JEE', name: 'Riya Sharma' })
    const s2 = await signedInClient({ examMode: 'JEE', name: 'Aman Verma' })
    const id = await openMock(s1.c)

    const st1 = await s1.c.post(`/api/all-india/${id}/start`)
    const resumed = await s1.c.post(`/api/all-india/${id}/start`)
    expect(resumed.body).toMatchObject({ resumed: true, attemptId: st1.body.attemptId })
    const st2 = await s2.c.post(`/api/all-india/${id}/start`)

    const mock = await AllIndiaMock.findById(id).lean()
    const mcq = mock.questions.filter((x) => x.type === 'mcq')
    // s1: 3 right → 12; s2: 1 right, 1 wrong → 3
    const right = (x) => ({ questionId: String(x.questionId), selectedIndex: x.correctIndex })
    const wrong = (x) => ({ questionId: String(x.questionId), selectedIndex: (x.correctIndex + 1) % 4 })
    const sub1 = await s1.c.post(`/api/test/${st1.body.attemptId}/submit`).send({ answers: mcq.slice(0, 3).map(right) })
    expect(sub1.status).toBe(200)
    expect(sub1.body.attempt).not.toHaveProperty('questions')   // no answer key while open
    expect((await s2.c.post(`/api/test/${st2.body.attemptId}/submit`).send({ answers: [right(mcq[0]), wrong(mcq[1])] })).status).toBe(200)

    expect((await s1.c.post(`/api/all-india/${id}/start`)).status).toBe(409)

    // answers hidden while the mock is open
    const r1 = await s1.c.get(`/api/test/${st1.body.attemptId}`)
    expect(r1.body.attempt.reviewOpensAt).toBeTruthy()
    for (const x of r1.body.attempt.questions) expect(x).not.toHaveProperty('correctIndex')

    const lb = await s2.c.get(`/api/all-india/${id}/leaderboard`)
    expect(lb.body).toMatchObject({ participants: 2, topperMarks: 12, final: false })
    expect(lb.body.me).toMatchObject({ rank: 2, marks: 3, percentile: 50 })
    expect(lb.body.top[0]).toMatchObject({ rank: 1, marks: 12, you: false })
    expect(lb.body.top[0].code).toMatch(/^#[0-9A-Z]{4}$/)
    expect(JSON.stringify(lb.body)).not.toMatch(/Riya|Aman|Sharma|Verma|@/)

    // after close: review opens, rank list final
    await AllIndiaMock.updateOne({ _id: id }, { closesAt: new Date(Date.now() - 1000), lastStartAt: new Date(Date.now() - 2000) })
    const r2 = await s1.c.get(`/api/test/${st1.body.attemptId}`)
    expect(r2.body.attempt.questions[0]).toHaveProperty('correctIndex')
    expect((await s1.c.get(`/api/all-india/${id}/leaderboard`)).body.final).toBe(true)
  })

  it('cannot start before it opens or after the last start time; other exam cannot see it', async () => {
    const s1 = await signedInClient({ examMode: 'JEE' })
    const neet = await signedInClient({ examMode: 'NEET' })
    const id = await openMock(s1.c)
    await AllIndiaMock.updateOne({ _id: id }, { opensAt: new Date(Date.now() + 60000) })
    expect((await s1.c.post(`/api/all-india/${id}/start`)).status).toBe(403)
    await AllIndiaMock.updateOne({ _id: id }, { opensAt: new Date(Date.now() - 7200000), lastStartAt: new Date(Date.now() - 60000) })
    expect((await s1.c.post(`/api/all-india/${id}/start`)).status).toBe(403)
    expect((await neet.c.get(`/api/all-india/${id}/leaderboard`)).status).toBe(404)
  })

  it('student codes are stable per mock and differ between students', () => {
    expect(studentCode('m1', 'u1')).toBe(studentCode('m1', 'u1'))
    expect(studentCode('m1', 'u1')).not.toBe(studentCode('m1', 'u2'))
  })
})
