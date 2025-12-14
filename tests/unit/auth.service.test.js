process.env.JWT_SECRET = "test-secret";

const { createTokenForUser, validateToken } = require("../../services/authentication");

describe("JWT Authentication Service", () => {

  const mockUser = {
    _id: "12345",
    email: "test@example.com",
    profileImageURL: "https://example.com/avatar.png",
    role: "user",
  };

  it("should create a valid JWT token for a user", () => {
    const token = createTokenForUser(mockUser);

    expect(token).toBeDefined();
    expect(typeof token).toBe("string");
    expect(token.split(".").length).toBe(3); // JWT has 3 parts
  });

  it("should validate a JWT token and return correct payload", () => {
    const token = createTokenForUser(mockUser);
    const payload = validateToken(token);

    expect(payload).toHaveProperty("_id", mockUser._id);
    expect(payload).toHaveProperty("email", mockUser.email);
    expect(payload).toHaveProperty("profileImageURL", mockUser.profileImageURL);
    expect(payload).toHaveProperty("role", mockUser.role);
  });

  it("should throw error for invalid token", () => {
    expect(() => validateToken("invalid.token.string")).toThrow();
  });
});
