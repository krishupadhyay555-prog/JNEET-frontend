// ============================================================
//  JNEET+ AI — tests/tests-api.test.js
//  Revision tests + full mocks: chapter listing, start (answers never
//  leak), instant feedback, scoring (+4 / -1), double-submit, isolation.
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { clearMailbox } from './mailbox.js'
import { connectTestDb, disconnectTestDb, signedInClient } from './helpers.js'
import User from '../models/User.js'
import Question from '../models/Question.js'
import TestAttempt from '../models/TestAttempt.js'

vi.mock('../services/emailService.js', async (orig) => (await import('./mailbox.js')).mailMock(orig))

let a, b

const q = (n, over = {}) => ({
  examMode: 'NEET', subject: 'Physics', chapter: 'Laws of Motion', difficulty: 'easy',
  questionText: `Question ${n}?`, options: ['A', 'B', 'C', 'D'], correctIndex: 1, explanation: `Because ${n}`, ...over,
})

// Random sampling ($sample) is a MongoDB built-in but not implemented by the
// lightweight local DB some contributors run tests against, so the random pick
// is replaced by an equivalent in-memory one. Everything else hits the real DB.
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
  await User.deleteMany({}); await Question.deleteMany({}); await TestAttempt.deleteMany({})
  clearMailbox()
  a = (await signedInClient()).c
  b = (await signedInClient()).c
  await Question.insertMany([1, 2, 3, 4, 5].map((n) => q(n)))
})

describe('Tests API', () => {
  it('lists chapters with per-difficulty counts for the student\'s exam only', async () => {
    await Question.create(q(9, { examMode: 'JEE', subject: 'Mathematics', chapter: 'Limits' }))
    const res = await a.get('/api/test/chapters')
    expect(res.status).toBe(200)
    expect(res.body.chapters).toHaveLength(1)
    expect(res.body.chapters[0]).toMatchObject({ subject: 'Physics', chapter: 'Laws of Motion', easy: 5, total: 5 })
  })

  it('rejects a subject that is not in the student\'s syllabus', async () => {
    const res = await a.post('/api/test/start').send({ subject: 'Mathematics', chapter: 'Limits', easy: 3 })
    expect(res.status).toBe(400)
  })

  it('404s with a friendly message when a chapter has no questions yet', async () => {
    const res = await a.post('/api/test/start').send({ subject: 'Physics', chapter: 'Optics', easy: 3 })
    expect(res.status).toBe(404)
    expect(res.body.error).toMatch(/No questions available/)
  })

  it('starts a revision without leaking correct answers or explanations', async () => {
    const res = await a.post('/api/test/start').send({ subject: 'Physics', chapter: 'Laws of Motion', easy: 3 })
    expect(res.status).toBe(200)
    expect(res.body.totalQuestions).toBe(3)
    for (const item of res.body.questions) {
      expect(item).not.toHaveProperty('correctIndex')
      expect(item).not.toHaveProperty('explanation')
      expect(item.options).toHaveLength(4)
    }
    // reading it back mid-attempt must not leak either
    const got = await a.get(`/api/test/${res.body.attemptId}`)
    expect(JSON.stringify(got.body)).not.toMatch(/correctIndex|explanation/)
  })

  it('gives instant feedback per answer and scores +4 / -1 on submit', async () => {
    const start = await a.post('/api/test/start').send({ subject: 'Physics', chapter: 'Laws of Motion', easy: 3 })
    const { attemptId, questions } = start.body
    const stored = await TestAttempt.findById(attemptId).lean()
    const correctOf = (id) => stored.questions.find((x) => String(x.questionId) === String(id)).correctIndex

    const [q1, q2, q3] = questions
    const fb = await a.post(`/api/test/${attemptId}/answer`).send({ questionId: String(q1.questionId), selectedIndex: correctOf(q1.questionId) })
    expect(fb.body).toMatchObject({ success: true, isCorrect: true })
    expect(fb.body.explanation).toMatch(/Because/)

    const wrongIdx = (correctOf(q2.questionId) + 1) % 4
    const fb2 = await a.post(`/api/test/${attemptId}/answer`).send({ questionId: String(q2.questionId), selectedIndex: wrongIdx })
    expect(fb2.body.isCorrect).toBe(false)
    expect(fb2.body.correctIndex).toBe(correctOf(q2.questionId))

    const sub = await a.post(`/api/test/${attemptId}/submit`).send({
      answers: [
        { questionId: String(q1.questionId), selectedIndex: correctOf(q1.questionId) },
        { questionId: String(q2.questionId), selectedIndex: wrongIdx },
        { questionId: String(q3.questionId), selectedIndex: null },
      ],
    })
    expect(sub.status).toBe(200)
    expect(sub.body.attempt).toMatchObject({ correctCount: 1, wrongCount: 1, unattemptedCount: 1, marksObtained: 3, score: 33, status: 'submitted' })

    // cannot submit or answer twice
    expect((await a.post(`/api/test/${attemptId}/submit`).send({ answers: [{ questionId: String(q1.questionId), selectedIndex: 0 }] })).status).toBe(409)
    expect((await a.post(`/api/test/${attemptId}/answer`).send({ questionId: String(q1.questionId), selectedIndex: 0 })).status).toBe(409)

    // history lists it without the heavy questions array
    const hist = await a.get('/api/test/history')
    expect(hist.body.attempts).toHaveLength(1)
    expect(hist.body.attempts[0]).not.toHaveProperty('questions')
  })

  it('does not allow instant feedback on a full mock (answers stay hidden until submit)', async () => {
    const t = await TestAttempt.create({
      userId: (await User.findOne({}))._id, examMode: 'NEET', subject: 'All Subjects', chapter: 'NEET Full Test', mode: 'test',
      questions: [{ questionId: (await Question.findOne({}))._id, subject: 'Physics', chapter: 'x', questionText: 'q', options: ['a', 'b', 'c', 'd'], correctIndex: 0 }],
      totalQuestions: 1,
    })
    const res = await a.post(`/api/test/${t._id}/answer`).send({ questionId: String(t.questions[0].questionId), selectedIndex: 0 })
    expect([400, 404]).toContain(res.status) // 404 when it belongs to another student, 400 for mock mode
  })

  it('refuses a full mock when the bank is too small', async () => {
    const res = await a.post('/api/test/start-full')
    expect(res.status).toBe(404)
    expect(res.body.error).toMatch(/Not enough questions/)
  })

  it('keeps attempts private to their owner', async () => {
    const start = await a.post('/api/test/start').send({ subject: 'Physics', chapter: 'Laws of Motion', easy: 2 })
    const id = start.body.attemptId
    expect((await b.get(`/api/test/${id}`)).status).toBe(404)
    expect((await b.post(`/api/test/${id}/submit`).send({ answers: [{ questionId: 'x', selectedIndex: 0 }] })).status).toBe(404)
  })

  it('validates input', async () => {
    expect((await a.post('/api/test/start').send({ subject: 'Physics', chapter: 'Laws of Motion' })).status).toBe(400)
    expect((await a.post('/api/test/start').send({ subject: 'Physics', chapter: 'Laws of Motion', easy: 999 })).status).toBe(400)
  })
})
