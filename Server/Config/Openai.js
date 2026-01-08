import openAI from "openai";

const openai = new openAI({
  apiKey: process.env.GEMINI_API_KEY,
  baseURL: "https://api.groq.com/openai/v1",
});

export default openai;
