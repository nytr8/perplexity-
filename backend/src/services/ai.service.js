import readline from "readline";
import { ChatMistralAI } from "@langchain/mistralai";
import { tool } from "@langchain/core/tools";
import { z } from "zod";
import { sendEnmail } from "./mail.service.js";
import { TavilySearch } from "@langchain/tavily";
import { HumanMessage, ToolMessage } from "langchain";

//mail service so ai can send emails
export const sendEmailTool = tool(
  async ({ to, subject, message }) => {
    try {
      await sendEnmail({
        to,
        subject,
        text: message,
        html: `<p>${message}</p>`,
      });

      return `Email sent successfully to ${to}`;
    } catch (error) {
      return `Email sending failed: ${error.message}`;
    }
  },
  {
    name: "send_email",
    description:
      "Send an email to a recipient. Use this tool when the user asks to send an email.",
    schema: z.object({
      to: z.string().describe("Recipient email address"),
      subject: z.string().describe("Email subject"),
      message: z.string().describe("Email body content"),
    }),
  },
);

//tavily so ai can search the web
export const tavilyTool = new TavilySearch({
  apiKey: process.env.TAVILY_API_KEY,
  maxResults: 5,
});

export async function interactiveChat() {
  const llm = new ChatMistralAI({
    apiKey: process.env.MISTRAL_API_KEY,
    model: "mistral-large-latest",
  }).bindTools([sendEmailTool, tavilyTool]);

  const messageMemory = [];
  const tools = {
    sendEmail: sendEmailTool,
    tavily_search: tavilyTool,
  };

  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
    terminal: true,
  });

  function askQuestion(promptText) {
    return new Promise((resolve) => {
      rl.question(promptText, resolve);
    });
  }

  console.log("AI chat started. Type 'exit' to quit.");

  while (true) {
    const userInput = (await askQuestion("You: ")).trim();

    if (!userInput) continue;
    if (userInput.toLowerCase() === "exit") break;

    messageMemory.push(new HumanMessage(userInput));

    try {
      const aiResponse = await llm.invoke(messageMemory);

      // Check if AI wants to call a tool

      if (aiResponse.tool_calls?.length) {
        messageMemory.push(aiResponse);
        for (const toolCall of aiResponse.tool_calls) {
          console.log("Tool requested:", toolCall.name);

          const selectedTool = tools[toolCall.name];

          if (!selectedTool) {
            console.log("Tool not found:", toolCall.name);
            continue;
          }

          const result = await selectedTool.invoke(toolCall.args);

          messageMemory.push(
            new ToolMessage({
              tool_call_id: toolCall.id,
              content: JSON.stringify(result),
            }),
          );
        }

        const finalResponse = await llm.invoke(messageMemory);

        console.log("AI:", finalResponse.content);
        messageMemory.push(finalResponse);
      } else {
        console.log("AI:", aiResponse.content);
        messageMemory.push(aiResponse);
      }
    } catch (err) {
      console.error("AI request failed:", err);
    }
  }

  rl.close();
  console.log("Chat ended.");
}
