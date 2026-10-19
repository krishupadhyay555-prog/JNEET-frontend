// ============================================================
//  JNEET+ AI — tests/notes.test.js
//  Notes API: create/list/get/update/delete, isolation between students,
//  the 500-note fair-use cap, and the response shape the offline layer
//  (frontend notesApi) depends on.
// ============================================================

import { describe, it, expect, beforeAll, afterAll, beforeEach, vi } from 'vitest'
import { clearMailbox } from './mailbox.js'
import { connectTestDb, disconnectTestDb, signedInClient } from './helpers.js'
import User from '../models/User.js'
import Note from '../models/Note.js'

vi.mock('../services/emailService.js', async (orig) => (await import('./mailbox.js')).mailMock(orig))

let a, b, aId

beforeAll(connectTestDb)
afterAll(disconnectTestDb)
beforeEach(async () => {
  await User.deleteMany({})
  await Note.deleteMany({})
  clearMailbox()
  const one = await signedInClient()
  a = one.c; aId = one.student._id
  b = (await signedInClient()).c
})

describe('Notes', () => {
  it('creates, lists (with preview + timestamps), reads, updates and deletes', async () => {
    const created = await a.post('/api/notes').send({ content: 'Line one\nLine two', tag: 'physics' })
    expect(created.status).toBe(201)
    const id = created.body.note._id

    const list = await a.get('/api/notes')
    expect(list.body.notes).toHaveLength(1)
    expect(list.body.notes[0]).toMatchObject({ _id: id, preview: 'Line one', tag: 'physics' })
    expect(list.body.notes[0].updatedAt).toBeTruthy()          // offline cache compares this

    const got = await a.get(`/api/notes/${id}`)
    expect(got.body.note.content).toBe('Line one\nLine two')

    const upd = await a.patch(`/api/notes/${id}`).send({ content: 'Changed', tag: '' })
    expect(upd.status).toBe(200)
    expect(upd.body.note.content).toBe('Changed')

    expect((await a.delete(`/api/notes/${id}`)).status).toBe(200)
    expect((await a.get(`/api/notes/${id}`)).status).toBe(404)
  })

  it("never lets one student see or change another's notes", async () => {
    const { body } = await a.post('/api/notes').send({ content: 'private' })
    const id = body.note._id
    expect((await b.get(`/api/notes/${id}`)).status).toBe(404)
    expect((await b.patch(`/api/notes/${id}`).send({ content: 'hax' })).status).toBe(404)
    expect((await b.delete(`/api/notes/${id}`)).status).toBe(404)
    expect((await b.get('/api/notes')).body.notes).toHaveLength(0)
  })

  it('stops at 500 notes per student with a clear message', async () => {
    await Note.insertMany(Array.from({ length: 500 }, (_, i) => ({ userId: aId, content: `n${i}` })))
    const res = await a.post('/api/notes').send({ content: 'one too many' })
    expect(res.status).toBe(409)
    expect(res.body.error).toMatch(/500/)
    // another student is unaffected
    expect((await b.post('/api/notes').send({ content: 'fine' })).status).toBe(201)
  })
})
