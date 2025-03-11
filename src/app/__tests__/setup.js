jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, init) => ({ 
      ...data,
      status: init?.status || 200 
    })),
  },
}));

jest.mock("next-auth", () => ({
  getServerSession: jest.fn(),
}));

jest.mock("@/app/lib/prisma", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}));

jest.mock("@/app/lib/openai", () => ({
  openai: {
    chat: {
      completions: {
        create: jest.fn(),
      },
    },
  },
}));

jest.mock("bcryptjs", () => ({
  hash: jest.fn(),
}));
