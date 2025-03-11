import { NextResponse } from "next/server";
import { GENERAL_MESSAGES } from "@/app/constants";
import { openai } from "@/app/lib/openai";

export async function POST(request) {
  try {
    const body = await request.json();
    const { paragraph } = body;

    try {
      const systemPrompt = {
          role: "system",
          content: `You are a grammar checker. Your task is to verify grammatical errors in the provided paragraph. Figure the incorrect words`,
        };
    
      const userPrompt = {
        role: "user",
        content: `Check the grammar in the paragraph: "${paragraph}"
        
        Return a JSON response in this format:
        {
          incorrect_words: ["string", "string", "string"],
        }`,
      };

      const response = await openai.chat.completions.create({
        model: "gpt-4o-mini", // Using a model with strong grammar capabilities
        messages: [systemPrompt, userPrompt],
        temperature: 0.1,
        max_tokens: 1000,
      });

      const result = JSON.parse(response.choices[0].message.content);
      
      // Create HTML with errors highlighted in bold red

      let htmlText = paragraph;

      result.incorrect_words.forEach((word) => {
        htmlText = htmlText.replace(word, `<span class="text-red-500 font-bold">${word}</span>`);
      });

      return NextResponse.json({
        success: true,
        htmlText,
      });
    } catch (error) {
      console.error("Grammar check error:", error);
      return NextResponse.json({
        success: false,
        error: error || GENERAL_MESSAGES.INTERNAL_SERVER_ERROR,
      });
    }
  } catch (error) {
    console.error("Grammar check error:", error);
    return NextResponse.json(
      { error: error || GENERAL_MESSAGES.INTERNAL_SERVER_ERROR },
      { status: 500 }
    );
  }
}