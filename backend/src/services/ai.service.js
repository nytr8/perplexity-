import { ChatMistralAI } from "@langchain/mistralai";
// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import { HumanMessage, SystemMessage, AIMessage } from "langchain";

// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash-lite",
//   apiKey: process.env.GEMINI_API_KEY,
// });
const model = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
});
const titleModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
});

export async function generateResponse(messages) {
  if (!messages || messages.length === 0) {
    throw new Error("Messages array is empty");
  }

  const formattedMessages = messages
    .map((msg) => {
      if (msg.role === "user") return new HumanMessage(msg.content);
      if (msg.role === "ai") return new AIMessage(msg.content);
      return null;
    })
    .filter(Boolean);

  if (formattedMessages.length === 0) {
    throw new Error("No valid messages");
  }

  const response = await model.invoke(formattedMessages);

  return response.content;
}
export async function generateTitle(message) {
  try {
    const response = await titleModel.invoke([
      new SystemMessage(
        "You generate short, concise titles (max 2 to 4 words) from user messages. Do not include quotes or extra text.",
      ),
      new HumanMessage(message),
    ]);

    // Clean the output
    let title = response.content.trim();

    // Optional: remove quotes if model adds them
    title = title.replace(/^["']|["']$/g, "");

    return title;
  } catch (error) {
    console.error("Title generation error:", error);
    return "New Chat";
  }
}
