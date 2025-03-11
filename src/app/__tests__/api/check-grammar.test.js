import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { openai } from "@/app/lib/openai";
import { POST } from "../../api/check-grammar/route";
import { GENERAL_MESSAGES } from "@/app/constants";

describe("WriteRight API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return unauthorized if no session", async () => {
    getServerSession.mockResolvedValueOnce(null);

    const request = {
      json: jest.fn().mockResolvedValueOnce({ paragraph: "Test paragraph" }),
    };

    await POST(request);

    expect(getServerSession).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        success: false,
        error: GENERAL_MESSAGES.UNAUTHORIZED,
      },
      { status: 401 }
    );
  });

  it("should check grammar and return highlighted HTML", async () => {
    getServerSession.mockResolvedValueOnce({ user: { email: "test@example.com" } });

    const paragraph = "Output text goess here, with incorrectt words highlighted as shown.";
    const request = {
      json: jest.fn().mockResolvedValueOnce({ paragraph }),
    };

    openai.chat.completions.create.mockResolvedValueOnce({
      choices: [
        {
          message: {
            content: JSON.stringify({
              incorrect_words: ["goess", "incorrectt"],
            }),
          },
        },
      ],
    });

    await POST(request);

    expect(getServerSession).toHaveBeenCalled();
    expect(openai.chat.completions.create).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "gpt-4o-mini",
        messages: expect.arrayContaining([
          expect.objectContaining({ role: "system" }),
          expect.objectContaining({ role: "user" }),
        ]),
      })
    );

    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        success: true,
        htmlText: 'Output text <span class="text-red-500 font-bold">goess</span> here, with <span class="text-red-500 font-bold">incorrectt</span> words highlighted as shown.',
      },
      { status: 200 }
    );
  });

  it("should handle OpenAI API errors", async () => {
    getServerSession.mockResolvedValueOnce({ user: { email: "test@example.com" } });

    const request = {
      json: jest.fn().mockResolvedValueOnce({ paragraph: "Test paragraph" }),
    };

    openai.chat.completions.create.mockRejectedValueOnce(new Error("API Error"));

    await POST(request);

    expect(getServerSession).toHaveBeenCalled();
    expect(NextResponse.json).toHaveBeenCalledWith(
      {
        success: false,
        error: new Error("API Error"),
      },
      { status: 500 }
    );
  });
});
