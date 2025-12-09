const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let app;

describe("Authentication Routes", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URL = mongoServer.getUri();

    app = require("../app");
    await mongoose.connect(process.env.MONGO_URL);
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should register a new user", async () => {
    const res = await request(app)
      .post("/user/signup")
      .send({ fullname: "Test User", email: "test@test.com", password: "password" });

    expect(res.statusCode).toBe(302); // Redirect to signin or home
  });

  it("should login a user and set cookie", async () => {
    const res = await request(app)
      .post("/user/signin")
      .send({ email: "test@test.com", password: "password" });

    expect(res.statusCode).toBe(302);
    expect(res.headers["set-cookie"]).toBeDefined();
  });
});
