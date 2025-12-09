const request = require("supertest");
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
let app, agent;

describe("Blog CRUD", () => {
  let mongoServer;

  beforeAll(async () => {
    mongoServer = await MongoMemoryServer.create();
    process.env.MONGO_URL = mongoServer.getUri();

    app = require("../app");
    await mongoose.connect(process.env.MONGO_URL);

    agent = request.agent(app);

    // Register + Login user
    await agent.post("/user/signup").send({
      fullname: "Blog User",
      email: "blog@test.com",
      password: "password"
    });

    await agent.post("/user/signin").send({
      email: "blog@test.com",
      password: "password"
    });
  });

  afterAll(async () => {
    await mongoose.disconnect();
    await mongoServer.stop();
  });

  it("should create a new blog", async () => {
    const res = await agent.post("/blog/add-new").send({
      title: "My first blog",
      content: "Hello world"
    });
    expect([200, 302]).toContain(res.statusCode);
  });

  it("should fetch blogs list", async () => {
    const res = await agent.get("/blog");
    expect(res.statusCode).toBe(200);
  });
});
