import { ChatMistralAI } from "@langchain/mistralai";

export async function main() {
  const llm = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-large-latest",
  });

  const res = await llm.invoke("What is artificial intelligence?");

  console.log(res);
}
