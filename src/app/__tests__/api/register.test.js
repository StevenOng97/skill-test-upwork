import bcrypt from "bcryptjs";
import { prisma } from "@/app/lib/prisma";
import { POST } from "../../api/register/route";
import { AUTH_MESSAGES } from "@/app/constants";

describe("Registration API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should register a new user successfully", async () => {
    const userData = {
      email: "test@example.com",
      password: "password123",
    };

    const request = {
      json: jest.fn().mockResolvedValueOnce(userData),
    };

    prisma.user.findUnique.mockResolvedValueOnce(null);
    bcrypt.hash.mockResolvedValueOnce("hashed_password");
    prisma.user.create.mockResolvedValueOnce({
      id: 1,
      email: userData.email,
    });

    const response = await POST(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: userData.email },
    });

    expect(bcrypt.hash).toHaveBeenCalledWith(userData.password, 12);

    expect(prisma.user.create).toHaveBeenCalledWith({
      data: {
        email: userData.email,
        hashedPassword: "hashed_password",
      },
    });

    expect(response).toEqual({
      success: true,
      status: 201,
    });
  });

  it("should return error if email already exists", async () => {
    const userData = {
      email: "existing@example.com",
      password: "password123",
    };

    const request = {
      json: jest.fn().mockResolvedValueOnce(userData),
    };

    prisma.user.findUnique.mockResolvedValueOnce({
      id: 1,
      email: userData.email,
    });

    const response = await POST(request);

    expect(prisma.user.findUnique).toHaveBeenCalledWith({
      where: { email: userData.email },
    });

    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();

    expect(response).toEqual({
      error: AUTH_MESSAGES.EMAIL_EXISTS,
      status: 400,
    });
  });

  it("should handle missing required fields", async () => {
    const userData = {
      email: "test@example.com",
      // missing password and name
    };

    const request = {
      json: jest.fn().mockResolvedValueOnce(userData),
    };

    const response = await POST(request);

    expect(prisma.user.findUnique).not.toHaveBeenCalled();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prisma.user.create).not.toHaveBeenCalled();

    expect(response).toEqual({
      error: AUTH_MESSAGES.MISSING_FIELDS,
      status: 400,
    });
  });

  it("should handle request parsing errors", async () => {
    const request = {
      json: jest.fn().mockRejectedValueOnce(new Error("Request parsing error")),
    };

    const response = await POST(request);

    expect(response).toEqual({
      error: new Error("Request parsing error"),
      status: 500,
    });
  });
});
