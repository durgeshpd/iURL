const request = require("supertest");
const app = require("./setup");

let token = "";

beforeAll(async () => {
  await request(app)
    .post("/user/signup")
    .send({ name: "Durgesh", email: "durgesh@example.com", password: "pass123" });

  const res = await request(app)
    .post("/user/login")
    .send({ email: "durgesh@example.com", password: "pass123" });

  token = res.body.token;
});

describe("URL Shortener", () => {
  it("should create a short URL", async () => {
    const res = await request(app)
      .post("/url")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://example.com" });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("id");
  });

  it("should return analytics", async () => {
    const res1 = await request(app)
      .post("/url")
      .set("Authorization", `Bearer ${token}`)
      .send({ url: "https://example.com" });

    const shortId = res1.body.id;

    // Simulate a redirect hit
    await request(app).get(`/url/${shortId}`);

    // Get analytics
    const res2 = await request(app)
      .get(`/url/analytics/${shortId}`)
      .set("Authorization", `Bearer ${token}`);

    expect(res2.statusCode).toBe(200);
    expect(res2.body.totalClicks).toBe(1);
  });
});
