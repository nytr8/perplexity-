import { ChatMistralAI } from "@langchain/mistralai";
import { tavily } from "@tavily/core";
import { HumanMessage, SystemMessage, AIMessage } from "langchain";

// import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
// const model = new ChatGoogleGenerativeAI({
//   model: "gemini-2.5-flash-lite",
//   apiKey: process.env.GEMINI_API_KEY,
// });

const tvly = tavily({ apiKey: process.env.TAVILY_API_KEY });

const model = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
});
const titleModel = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-small-latest",
});

function formatMessagesWithSearchContext(messages, searchResults) {
  const systemPrompt = `
You are an AI assistant with access to real-time web search.

Use the following search results to answer the user's question:

${searchResults}

Instructions:
- Give accurate answers
- Use search results when relevant
- If not useful, answer normally
`;

  return [
    new SystemMessage(systemPrompt),
    ...messages
      .map((msg) => {
        if (msg.role === "user") return new HumanMessage(msg.content);
        if (msg.role === "ai") return new AIMessage(msg.content);
        return null;
      })
      .filter(Boolean),
  ];
}

function normalizeChunkContent(content) {
  if (typeof content === "string") {
    return content;
  }

  if (!Array.isArray(content)) {
    return "";
  }

  return content
    .map((part) => {
      if (typeof part === "string") {
        return part;
      }
      if (typeof part?.text === "string") {
        return part.text;
      }
      if (typeof part?.content === "string") {
        return part.content;
      }
      return "";
    })
    .join("");
}

export async function generateResponseStream(messages, onToken) {
  if (!messages || messages.length === 0) {
    throw new Error("Messages array is empty");
  }

  const latestMessage = messages[messages.length - 1];

  if (latestMessage.role !== "user") {
    throw new Error("Last message must be from user");
  }

  const userQuery = latestMessage.content;

  let searchResults = "";
  try {
    const searchResponse = await tvly.search(userQuery);

    searchResults = searchResponse?.results
      ?.map((r, i) => `(${i + 1}) ${r.title}: ${r.content}`)
      .join("\n");
  } catch (err) {
    console.error("Tavily error:", err);
  }

  const formattedMessages = formatMessagesWithSearchContext(
    messages,
    searchResults,
  );

  let fullText = "";
  const stream = await model.stream(formattedMessages);

  for await (const chunk of stream) {
    const delta = normalizeChunkContent(chunk?.content);
    if (!delta) {
      continue;
    }

    fullText += delta;

    if (onToken) {
      await onToken(delta);
    }
  }

  if (!fullText) {
    const fallbackResponse = await model.invoke(formattedMessages);
    fullText = normalizeChunkContent(fallbackResponse?.content);

    if (onToken && fullText) {
      await onToken(fullText);
    }
  }

  return fullText;
}

export async function generateResponse(messages) {
  return generateResponseStream(messages);
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
