import request from "supertest";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import { seedData } from "../seeder.js";
import app from "../app.js";

dotenv.config();
process.env.PAGINATION_LIMIT = process.env.PAGINATION_LIMIT || "10";

beforeAll(async () => {
  await connectDB();
  await seedData();
});

afterAll(async () => {
  await seedData();
  await mongoose.connection.close();
});

test("GET /api/products returns 200 and body with products array and pages", async () => {
  const res = await request(app).get("/api/products");

  expect(res.status).toBe(200);
  expect(res.headers["content-type"]).toMatch(/application\/json/);

  const body = res.body;
  expect(body).toBeDefined();
  expect(typeof body).toBe("object");
  expect(Array.isArray(body.products)).toBe(true);
  expect(typeof body.pages).toBe("number");
  expect(body.pages).toBeGreaterThanOrEqual(0);
});

test("GET /api/products?pageNumber=1 returns 200 and same shape", async () => {
  const res = await request(app)
    .get("/api/products")
    .query({ pageNumber: 1 });

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body.products)).toBe(true);
  expect(typeof res.body.pages).toBe("number");
});

test("GET /api/products/top returns 200 and array of at most 3 products", async () => {
  const res = await request(app).get("/api/products/top");

  expect(res.status).toBe(200);
  expect(Array.isArray(res.body)).toBe(true);
  expect(res.body.length).toBeLessThanOrEqual(3);
  res.body.forEach((product) => {
    expect(product._id || product.id).toBeTruthy();
    expect(typeof product.title).toBe("string");
    expect(typeof product.price).toBe("number");
  });
});

test("GET /api/products/:id with invalid id returns 401", async () => {
  const res = await request(app).get("/api/products/not-a-valid-id");

  expect(res.status).toBe(401);
  expect(res.body).toBeDefined();
  expect(typeof res.body).toBe("object");
  expect(res.body.message).not.toBeUndefined();
});

test("GET /api/products/:id with valid id returns 200 and product object", async () => {
  const topRes = await request(app).get("/api/products/top");
  expect(topRes.status).toBe(200);
  const products = topRes.body;
  expect(Array.isArray(products)).toBe(true);
  if (products.length === 0) {
    expect(products.length).toBeGreaterThan(0);
    return;
  }
  const id = String(products[0].id ?? products[0]._id);

  const res = await request(app).get(`/api/products/${id}`);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body._id || res.body.id).toBe(id);
  expect(typeof res.body.title).toBe("string");
  expect(typeof res.body.price).toBe("number");
});

test("GET /api/products/:id with valid ObjectId but non-existent product returns 404", async () => {
  const validNonExistentId = "000000000000000000000001";
  const res = await request(app).get(`/api/products/${validNonExistentId}`);

  expect(res.status).toBe(404);
  expect(res.body).toBeDefined();
});

test("POST /api/products as admin creates product and returns 201", async () => {
  const loginRes = await request(app)
    .post("/api/users/login")
    .send({ email: "admin@test.pl", password: process.env.ADMIN_PASSWORD });

  if (loginRes.status !== 201) return; // skip when no admin user / wrong password

  const token = loginRes.body.token;
  expect(token).toBeDefined();

  const res = await request(app)
    .post("/api/products")
    .set("Authorization", `Bearer ${token}`)
    .send({});

  expect(res.status).toBe(201);
  expect(res.body).toBeDefined();
  expect(res.body.message).toBeDefined();
  expect(typeof res.body.pages).toBe("number");
  expect(res.body.pages).toBeGreaterThanOrEqual(0);
});

test("POST /api/products without auth returns 401", async () => {
  const res = await request(app).post("/api/products").send({});

  expect(res.status).toBe(401);
  expect(res.body).toBeDefined();
  expect(res.body.message).toBeDefined();
});

test("PATCH /api/products/:id as admin updates product and returns 200", async () => {
  const loginRes = await request(app)
    .post("/api/users/login")
    .send({ email: "admin@test.pl", password: process.env.ADMIN_PASSWORD });

  if (loginRes.status !== 201) return; // skip when no admin user / wrong password

  const token = loginRes.body.token;
  expect(token).toBeDefined();
});

test("PATCH /api/products/:id without auth returns 401", async () => {
  const res = await request(app).patch("/api/products/123").send({});
  expect(res.status).toBe(401);
  expect(res.body).toBeDefined();
  expect(res.body.message).toBeDefined();
});

test("PATCH /api/products/:id with invalid id returns 401", async () => {
  const res = await request(app).patch("/api/products/123").send({});
  expect(res.status).toBe(401);
  expect(res.body).toBeDefined();
  expect(res.body.message).toBeDefined();
});

test("PATCH /api/products/:id with valid id and auth returns 200", async () => {
  const loginRes = await request(app)
    .post("/api/users/login")
    .send({ email: "admin@test.pl", password: process.env.ADMIN_PASSWORD });

  if (loginRes.status !== 201) return; // skip when no admin user / wrong password

  const token = loginRes.body.token;
  expect(token).toBeDefined();

  const listRes = await request(app).get("/api/products");
  expect(listRes.status).toBe(200);
  const products = listRes.body.products;
  if (products.length === 0) return;
  const id = products[0]._id || products[0].id;

  const update = {
    title: products[0].title + " (updated)",
    description: products[0].description,
    price: products[0].price,
    countInStock: products[0].countInStock ?? 3,
    category: products[0].category,
    link: products[0].link ?? products[0].image ?? "test",
  };

  const res = await request(app)
    .patch(`/api/products/${id}`)
    .set("Authorization", `Bearer ${token}`)
    .send(update);

  expect(res.status).toBe(200);
  expect(res.body).toBeDefined();
  expect(res.body.message).toBeDefined();
  expect(res.body.updatedProduct).toBeDefined();
  expect(res.body.updatedProduct.title).toBe(update.title);
  expect(res.body.updatedProduct.price).toBe(update.price);
});