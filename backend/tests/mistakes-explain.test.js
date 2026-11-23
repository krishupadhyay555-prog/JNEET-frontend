import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'

vi.hoisted(() => { process.env.OPENAI_API_KEY = 'sk-test-not-real' })
const ai = vi.hoisted(() => ({ replies: [], calls: 0 }))
vi.mock('../services/ai/openaiClient.js', async (orig) => ({
  ...(await orig()),
  createResponse: vi.fn(async () => { ai.calls += 1; return { text: ai.replies.shift() ?? '', usage: { inputTokens: 100, outputTokens: 50 } } }),
}))
vi.mock('../services/emailService.js', async (orig) => (await import('./mailbox.js')).mailMock(orig))

import { connectTestDb, disconnectTestDb, signedInClient } from './helpers.js'
import { clearMailbox } from './mailbox.js'
import User from '../models/User.js'
import Question from '../models/Question.js'
import TestAttempt from '../models/TestAttempt.js'
import MistakeEntry from '../models/MistakeEntry.js'
import PyqExplanation from '../models/PyqExplanation.js'
import AiDaily from '../models/AiDaily.js'
import { pyqPools } from '../services/pyqPool.js'
import { nextState, INTERVAL_DAYS } from '../services/mistakes.js'
import { finalAnswer, matchesKey } from '../services/pyqExplain.js'

const realAggregate = Question.aggregate.bind(Question)
beforeAll(async () => {
  await connectTestDb()
  vi.spyOn(Question, 'aggregate').mockImplementation(async (pipeline) => {
    const [match, sample] = pipeline
    if (!match?.$match || !sample?.$sample) return realAggregate(pipeline)
    const docs = await Question.find(match.$match).lean()
    return docs.slice(0, sample.$sample.size)
  })
})
afterAll(disconnectTestDb)
beforeEach(async () => {
  await Promise.all([User, Question, TestAttempt, MistakeEntry, PyqExplanation, AiDaily].map((m) => m.deleteMany({})))
  clearMailbox(); ai.replies = []; ai.calls = 0
})

const q = (n) => ({ examMode: 'JEE', subject: 'Physics', chapter: 'Kinematics', difficulty: 'easy',
  questionText: `Q${n}?`, options: ['A', 'B', 'C', 'D'], correctIndex: 1, explanation: `Because ${n}` })
const setPlan = (email, plan) => User.updateOne({ email }, { $set: { plan, planExpiresAt: null } })

async function attemptWithMistakes() {
  const s = await signedInClient({ examMode: 'JEE' })
  await Question.insertMany([q(1), q(2), q(3)])
  const st = await s.c.post('/api/test/start').send({ subject: 'Physics', chapter: 'Kinematics', easy: 3 })
  expect(st.status).toBe(200)
  const att = await TestAttempt.findById(st.body.attemptId).lean()
  const [a, b] = att.questions
  // a right, b wrong, c left blank (revision → blanks are not mistakes)
  const sub = await s.c.post(`/api/test/${att._id}/submit`).send({ answers: [
    { questionId: String(a.questionId), selectedIndex: a.correctIndex }, { questionId: String(b.questionId), selectedIndex: (b.correctIndex + 1) % 4 }] })
  expect(sub.status).toBe(200)
  return { ...s, att }
}

describe('Mistake Notebook', () => {
  it('copies wrong answers once, counts for free users, unlocks the list for Pro', async () => {
    const { c, body } = await attemptWithMistakes()
    expect(await MistakeEntry.countDocuments()).toBe(1)
    const sum = await c.get('/api/mistakes/summary')
    expect(sum.body).toMatchObject({ open: 1, due: 0, unlocked: false })
    expect((await c.get('/api/mistakes?status=open')).body.code).toBe('PLAN_REQUIRED')

    await setPlan(body.email, 'pro')
    const list = await c.get('/api/mistakes?status=open')
    expect(list.body.items).toHaveLength(1)
    expect(list.body.items[0].q).not.toHaveProperty('correctIndex')
    expect(list.body.items[0].q).not.toHaveProperty('explanation')
  })

  it('wrong review → tomorrow; two right in a row → cleared', async () => {
    const { c, body } = await attemptWithMistakes()
    await setPlan(body.email, 'pro')
    const m = await MistakeEntry.findOne().lean()
    const ok = m.q.correctIndex
    const r0 = await c.post(`/api/mistakes/${m._id}/answer`).send({ selectedIndex: (ok + 1) % 4 })
    expect(r0.body).toMatchObject({ correct: false, correctIndex: ok })
    const r1 = await c.post(`/api/mistakes/${m._id}/answer`).send({ selectedIndex: ok })
    expect(r1.body.correct).toBe(true)
    expect(r1.body.mistake.resolvedAt).toBeNull()
    const r2 = await c.post(`/api/mistakes/${m._id}/answer`).send({ selectedIndex: ok })
    expect(r2.body.mistake.resolvedAt).toBeTruthy()
    expect((await c.get('/api/mistakes/summary')).body).toMatchObject({ open: 0, cleared: 1, clearedThisWeek: 1 })
  })

  it('schedule steps 1 → 3 days', () => {
    const now = new Date('2026-11-23T00:00:00Z')
    const day = 86_400_000
    expect(nextState({ streak: 0, stage: 0 }, false, now).nextReviewAt - now).toBe(INTERVAL_DAYS[0] * day)
    expect(nextState({ streak: 0, stage: 0 }, true, now).nextReviewAt - now).toBe(3 * day)
  })
})

describe('Deep analysis (Elite)', () => {
  it('is Elite-only and reports chapters, negative marks and tips', async () => {
    const { c, body, att } = await attemptWithMistakes()
    expect((await c.get(`/api/test/${att._id}/analysis`)).body.code).toBe('PLAN_REQUIRED')
    await setPlan(body.email, 'elite')
    const r = await c.get(`/api/test/${att._id}/analysis`)
    expect(r.status).toBe(200)
    expect(r.body.analysis.overall).toMatchObject({ correct: 1, wrong: 1, skipped: 1, marks: 3, accuracy: 50 })
    expect(r.body.analysis.weakest[0]).toMatchObject({ chapter: 'Kinematics', subject: 'Physics' })
    expect(r.body.analysis.tips.join(' ')).toMatch(/Negative marking cost you 1 mark/)
  })
})

describe('Explain with AI (PYQ)', () => {
  const p = pyqPools().JEE.Physics.mcq[0]
  const right = `Step 1...\nFINAL: ${p.correctIndex + 1}`
  const wrong = `Step 1...\nFINAL: ${((p.correctIndex + 1) % 4) + 1}`

  it('parses FINAL and checks it against NTA key', () => {
    expect(finalAnswer('blah\nFINAL: (2)')).toBe('2')
    expect(matchesKey(p, String(p.correctIndex + 1))).toBe(true)
    expect(matchesKey(p, String(((p.correctIndex + 1) % 4) + 1))).toBe(false)
  })

  it('Pro only; retries with deep model; saves only a key-matching answer; cache is free', async () => {
    const { c, body } = await signedInClient({ examMode: 'JEE' })
    expect((await c.post('/api/pyq-explain').send({ ref: p.ref })).body.code).toBe('PLAN_REQUIRED')
    await setPlan(body.email, 'pro')
    ai.replies = [wrong, right]
    const r = await c.post('/api/pyq-explain').send({ ref: p.ref, lang: 'english' })
    expect(r.body).toMatchObject({ available: true, cached: false })
    expect(r.body.text).toMatch(/Answer \(NTA key\): option/)
    expect(r.body.text).not.toMatch(/FINAL:/)
    expect(ai.calls).toBe(2)
    const again = await c.post('/api/pyq-explain').send({ ref: p.ref, lang: 'english' })
    expect(again.body).toMatchObject({ available: true, cached: true })
    expect(ai.calls).toBe(2)
  })

  it('never shows a solution that disagrees with the key, and gives the doubt back', async () => {
    const { c, body } = await signedInClient({ examMode: 'JEE' })
    await setPlan(body.email, 'pro')
    ai.replies = [wrong, wrong]
    const r = await c.post('/api/pyq-explain').send({ ref: p.ref, lang: 'hinglish' })
    expect(r.body).toMatchObject({ available: false })
    expect((await PyqExplanation.findOne({ ref: p.ref, lang: 'hinglish' })).status).toBe('failed')
    const daily = await AiDaily.find().lean()
    expect(daily.every((d) => (d.used ?? d.count ?? 0) === 0)).toBe(true)
  })
})

describe('Explain with AI by question id', () => {
  it('works with the questionId the test screens have', async () => {
    const p = pyqPools().JEE.Physics.mcq[1]
    const { c, body } = await signedInClient({ examMode: 'JEE' })
    await setPlan(body.email, 'elite')
    ai.replies = [`ok\nFINAL: ${p.correctIndex + 1}`]
    const r = await c.post('/api/pyq-explain').send({ questionId: String(p.id) })
    expect(r.body).toMatchObject({ available: true })
    expect((await c.post('/api/pyq-explain').send({})).status).toBe(400)
  })
})
