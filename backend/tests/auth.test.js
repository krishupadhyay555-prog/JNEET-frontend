import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest'
import request from 'supertest'
import mongoose from 'mongoose'
import { MongoMemoryServer } from 'mongodb-memory-server'
import app from '../app.js'
import User from '../models/User.js'

let mongoServer

// Test shuru hone se pehle: fake temporary database banao aur connect karo
beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create()
  const uri = mongoServer.getUri()
  await mongoose.connect(uri)
})

// Har test se pehle: purana data saaf karo (taaki tests ek-dusre ko affect na karein)
beforeEach(async () => {
  await User.deleteMany({})
})

// Saare tests khatam hone ke baad: fake database band karo
afterAll(async () => {
  await mongoose.disconnect()
  await mongoServer.stop()
})

describe('Auth — Register', () => {
  it('registers a new user successfully', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Student',
        email: 'test@example.com',
        password: 'Password123',
        examMode: 'NEET',
      })

    expect(res.statusCode).toBe(201)
    expect(res.body.success).toBe(true)
    expect(res.body.student.email).toBe('test@example.com')
  })

  it('rejects duplicate email registration', async () => {
    // Pehle ek user banao
    await request(app).post('/api/auth/register').send({
      name: 'Test Student',
      email: 'test@example.com',
      password: 'Password123',
      examMode: 'NEET',
    })

    // Wahi email se dobara register karne ki koshish karo
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Another Student',
        email: 'test@example.com',
        password: 'Password456',
        examMode: 'JEE',
      })

    expect(res.statusCode).toBe(409)
    expect(res.body.success).toBe(false)
  })
})

describe('Auth — Login', () => {
  beforeEach(async () => {
    // Har login test se pehle ek user register karo taaki login karne ke liye account ho
    await request(app).post('/api/auth/register').send({
      name: 'Test Student',
      email: 'test@example.com',
      password: 'Password123',
      examMode: 'NEET',
    })
  })

  it('logs in successfully with correct credentials', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'Password123',
      })

    expect(res.statusCode).toBe(200)
    expect(res.body.success).toBe(true)
    expect(res.body.student.email).toBe('test@example.com')
  })

  it('rejects login with wrong password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'WrongPassword',
      })

    expect(res.statusCode).toBe(401)
    expect(res.body.success).toBe(false)
  })

  it('rejects login with non-existent email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'doesnotexist@example.com',
        password: 'Password123',
      })

    expect(res.statusCode).toBe(401)
    expect(res.body.success).toBe(false)
  })
})