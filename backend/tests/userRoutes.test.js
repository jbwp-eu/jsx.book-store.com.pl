import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { seedData } from "../seeder.js";
import app from "../app.js";

dotenv.config();

beforeAll(async () => {
  await connectDB();
});

afterAll(async () => {
  await seedData();
  await mongoose.connection.close();
});

test("POST /api/users/register with new user returns 201 and token", async () => {
  const uniqueEmail = `test-${Date.now()}@test.pl`;
  const res = await request(app)
    .post("/api/users/register")
    .send({ name: "Test User", email: uniqueEmail, password: "testpass123" });

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.token).toBeDefined();
  expect(res.body.email).toBe(uniqueEmail);
  expect(res.body.name).toBe("Test User");
});

test("POST /api/users/login with valid credentials returns 201 and token", async () => {
  if (!process.env.ADMIN_PASSWORD) return;

  const res = await request(app)
    .post("/api/users/login")
    .send({ email: "admin@test.pl", password: process.env.ADMIN_PASSWORD });

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.token).toBeDefined();
  expect(res.body.email).toBe("admin@test.pl");
  expect(res.body.name).toBeDefined();
  expect(res.body.isAdmin).toBe(true);
});

test("POST /api/users/login with invalid password returns 401", async () => {
  const res = await request(app)
    .post("/api/users/login")
    .send({ email: "admin@test.pl", password: "wrong-password" });

  expect(res.status).toBe(401);
  expect(res.body).toBeDefined();
  expect(res.body.message).toBeDefined();
});



test("GET /api/users without auth returns 401", async () => {
  const res = await request(app).get("/api/users");

  expect(res.status).toBe(401);
  expect(res.body).toBeDefined();
  expect(res.body.message).toBeDefined();
});

test("GET /api/users with auth returns 200 and user data", async () => {
  if (!process.env.ADMIN_PASSWORD) return;

  const loginRes = await request(app)
    .post("/api/users/login")
    .send({ email: "admin@test.pl", password: process.env.ADMIN_PASSWORD });

  if (!loginRes.body.token) return;

  const { token, email, name, isAdmin } = loginRes.body;

  const res = await request(app)
    .get("/api/users")
    .set("Authorization", `Bearer ${token}`);

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeGreaterThan(0);
  const admin = res.body.find((u) => u.email === email);
  expect(admin).toBeDefined();
  expect(admin.name).toBe(name);
  expect(admin.isAdmin).toBe(isAdmin);
});
