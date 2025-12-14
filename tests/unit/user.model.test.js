const User = require("../../models/user");
const db = require("../setup/mongo");

beforeAll(async () => await db.connect());
afterEach(async () => await db.clear());
afterAll(async () => await db.close());

describe("User Model - Password Hashing", () => {
  it("should hash password", async () => {
    const user = new User({
      fullname: "Test",
      email: "test@test.com",
      password: "secret123",
    });
    await user.save();
    expect(user.password).not.toBe("secret123");
  });
});
