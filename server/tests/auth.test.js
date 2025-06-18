const request = require("supertest");
const app = require("./setup");

describe("Auth: Signup & Login", () => {
  it("should sign up a new user", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({ name: "Test", email: "test@example.com", password: "pass123" });

    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty("userId");
  });

  it("should login with valid credentials", async () => {
    await request(app)
      .post("/user/signup")
      .send({ name: "Test", email: "test@example.com", password: "pass123" });

    const res = await request(app)
      .post("/user/login")
      .send({ email: "test@example.com", password: "pass123" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("token");
  });
});
