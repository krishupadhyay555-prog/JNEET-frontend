// Shared test plumbing. Uses TEST_MONGO_URI when set (e.g. a local
// Mongo-compatible server), else downloads an in-memory MongoDB (CI).
import mongoose from "mongoose";
import request from "supertest";
import app from "../app.js";
import { mailbox } from "./mailbox.js";

let memServer = null;

export async function connectTestDb() {
  if (process.env.TEST_MONGO_URI) {
    await mongoose.connect(process.env.TEST_MONGO_URI, { dbName: `jneet_test_${process.pid}` });
    return;
  }
  const { MongoMemoryServer } = await import("mongodb-memory-server");
  memServer = await MongoMemoryServer.create();
  await mongoose.connect(memServer.getUri());
}

export async function disconnectTestDb() {
  if (process.env.TEST_MONGO_URI) await mongoose.connection.dropDatabase();
  await mongoose.disconnect();
  if (memServer) await memServer.stop();
}

let ipCounter = 10;
let emailCounter = 0;
export const nextIp = () => `10.${Math.floor(++ipCounter / 250)}.${ipCounter % 250}.7`;
export const uniqueEmail = (tag = "s") => `${tag}${Date.now()}${++emailCounter}@example.com`;

export const STRONG_PASSWORD = "Zx9-Quartz-Lamp";
export const ADULT_DOB = "2000-05-15";

// A client that appears to come from its own IP (so per-IP limiters
// never bleed across tests).
export function client() {
  const ip = nextIp();
  const agent = request.agent(app);
  const wrap = (m) => (...a) => agent[m](...a).set("X-Forwarded-For", ip);
  return {
    ip,
    agent,
    get: wrap("get"), post: wrap("post"), patch: wrap("patch"), put: wrap("put"), delete: wrap("delete"),
  };
}

export function registerBody(overrides = {}) {
  return {
    name: "Test Student",
    email: uniqueEmail(),
    password: STRONG_PASSWORD,
    examMode: "NEET",
    dateOfBirth: ADULT_DOB,
    acceptTerms: true,
    ...overrides,
  };
}

// Register + verify email → returns a signed-in client and its user info.
export async function signedInClient(overrides = {}) {
  const c = client();
  const body = registerBody(overrides);
  const reg = await c.post("/api/auth/register").send(body);
  if (reg.status !== 201) throw new Error(`register failed: ${reg.status} ${JSON.stringify(reg.body)}`);
  const otp = mailbox.verify.get(body.email);
  const ver = await c.post("/api/auth/verify-email").send({ email: body.email, otp });
  if (ver.status !== 200) throw new Error(`verify failed: ${ver.status} ${JSON.stringify(ver.body)}`);
  return { c, body, student: ver.body.student };
}
