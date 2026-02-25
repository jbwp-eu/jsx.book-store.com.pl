import request from "supertest";
import app from "../app.js";

test("GET / returns 200 and API running message", async () => {
  const res = await request(app).get("/");
  expect(res.status).toBe(200);
  expect(res.text).toMatch(/API is running/);
});
