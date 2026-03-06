import OpenAI from "openai";
import { NextResponse } from "next/server";

const client = new OpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: "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",
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const apiResponse = await client.chat.completions.create({
      model: "sourceful/riverflow-v2-pro",
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      modalities: ["image"],
    });

    const response = apiResponse.choices[0].message;

    return NextResponse.json({
      image: response.images?.[0]?.image_url?.url,
    });

  } catch (error) {
    console.error("IMAGE ERROR:", error);

    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}