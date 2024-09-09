"use server";

import { WebClient } from "@slack/web-api";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const slackClient = new WebClient(process.env.SLACK_BOT_TOKEN);

interface Message {
  role: "system" | "user" | "assistant";
  content: string;
}

const systemMessage: Message = {
  role: "system",
  content: "You are a helpful customer support agent. Assist the user with their queries and try to resolve their issues."
};

const tools = [
  {
    type: "function" as const,
    function: {
      name: "classify_and_check_issue",
      description: "Classify the issue and check if it has been resolved",
      parameters: {
        type: "object",
        properties: {
          isResolved: {
            type: "boolean",
            description: "Whether the issue is resolved or not"
          },
          category: {
            type: "string",
            enum: ["bug", "feature", "billing"],
            description: "The category of the issue"
          },
          summary: {
            type: "string",
            description: "A brief summary of the issue"
          }
        },
        required: ["isResolved", "category", "summary"]
      }
    }
  }
];

async function sendToSlackChannel(slackData: { category: string; summary: string; isResolved: boolean }) {
  const channelMap = {
    bug: process.env.SLACK_BUGS_CHANNEL_ID,
    feature: process.env.SLACK_FEATURES_CHANNEL_ID,
    billing: process.env.SLACK_BILLING_CHANNEL_ID
  };

  const channelId = channelMap[slackData.category as keyof typeof channelMap];

  if (!channelId) {
    console.error(`No Slack channel found for category: ${slackData.category}`);
    return;
  }

  const message = `
*New ${slackData.category} issue*
Status: ${slackData.isResolved ? "Resolved" : "Unresolved"}
Summary: ${slackData.summary}
  `.trim();

  try {
    await slackClient.chat.postMessage({
      channel: channelId,
      text: message
    });
    console.log(`Message sent to Slack channel: ${channelId}`);
  } catch (error) {
    console.error("Error sending message to Slack:", error);
    throw error; // Re-throw the error to handle it in the calling function
  }
}

export async function handleCustomerSupport(userMessage: string, chatHistory: Message[]) {
  const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [systemMessage, ...chatHistory, { role: "user", content: userMessage }];

  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages,
    tools,
    tool_choice: "auto"
  });

  const assistantMessage = response.choices[0].message;

  if (assistantMessage.tool_calls) {
    const functionCall = assistantMessage.tool_calls[0].function;
    const functionArgs = JSON.parse(functionCall.arguments);

    const slackData = {
      category: functionArgs.category,
      summary: functionArgs.summary,
      isResolved: functionArgs.isResolved
    };

    try {
      await sendToSlackChannel(slackData);
    } catch (error) {
      console.error("Failed to send message to Slack:", error);
      // Handle the error gracefully, maybe return an error message to the user
    }

    return {
      message: assistantMessage.content || "I apologize, but I couldn't process your request. Could you please rephrase your question?",
      isResolved: functionArgs.isResolved,
      slackData
    };
  }

  return {
    message: assistantMessage.content || "I apologize, but I couldn't process your request. Could you please rephrase your question?",
    isResolved: false,
    slackData: null
  };
}
