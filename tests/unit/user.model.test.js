require("dotenv").config({ path: ".env.test" });

const mongoose = require("mongoose");
const User = require("../../models/user");
const DB_NAME = 'test_users';

describe("User Model - Password Hashing", () => {

  beforeAll(async () => {
  await mongoose.connect(process.env.MONGO_URL);
});

afterEach(async () => {
    await mongoose.connection.collection('users').deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  it("should hash the password before saving", async () => {
    const plainPassword = "mysecret123";

    const user = new User({
      fullname: "Hash User",
      email: "hash@test.com",
      password: plainPassword,
    });

    await user.save();

    expect(user.password).not.toBe(plainPassword); // Should be hashed
    expect(user.password.length).toBeGreaterThan(20); // Hashes are long
  });
});
