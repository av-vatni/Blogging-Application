const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let app;

describe("Base API Tests", () => {
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

  it("GET / should return homepage", async () => {
    const res = await request(app).get("/");
    expect(res.statusCode).toBe(200);
  });

  it("invalid route should return 404", async () => {
    const res = await request(app).get("/invalid-route");
    expect(res.statusCode).toBe(404);
  });
});
