const mongoose = require("mongoose");
const Blog = require("../../models/blog");
const db = require("../setup/mongo");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe("Blog Model - Validation Rules", () => {
  it("should save a valid blog", async () => {
    const blog = new Blog({ title: "Test", body: "Content" });
    const saved = await blog.save();
    expect(saved._id).toBeDefined();
  });
});
