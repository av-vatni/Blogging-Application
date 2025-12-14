const mongoose = require("mongoose");
const Blog = require("../../models/blog");

describe("Blog Model - Validation Rules", () => {

  beforeAll(async () => {
    await mongoose.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  });

  it("should save a valid blog", async () => {
    const blog = new Blog({
      title: "My DevOps Journey",
      body: "This is my first blog",
    });

    const savedBlog = await blog.save();
    expect(savedBlog._id).toBeDefined();
  });

  it("should fail without title", async () => {
    const blog = new Blog({ content: "No title here" });

    await expect(blog.save()).rejects.toThrow();
  });

  it("should fail without content", async () => {
    const blog = new Blog({ title: "Missing content" });

    await expect(blog.save()).rejects.toThrow();
  });
});
