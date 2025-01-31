import { Inngest } from "inngest";

export const inngest = new Inngest({
  id: "careergpt",
  name: "CareerGPT",
  credentials: {
    gemini: { apiKey: process.env.GEMINI_API_KEY },
  },
});
