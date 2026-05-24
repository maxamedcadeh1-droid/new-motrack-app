import { generateAiSuggestion, getAiSuggestionError } from "../../server/aiSuggest";

function jsonResponse(body: unknown, status = 200, extraHeaders: HeadersInit = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      "content-type": "application/json; charset=utf-8",
      ...extraHeaders,
    },
  });
}

export default {
  async fetch(request: Request) {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed." }, 405, {
        allow: "POST",
      });
    }

    let payload: unknown;
    try {
      payload = await request.json();
    } catch {
      return jsonResponse({ error: "Invalid JSON body." }, 400);
    }

    try {
      const text = await generateAiSuggestion(payload as Parameters<typeof generateAiSuggestion>[0]);
      return jsonResponse({ text });
    } catch (error) {
      const { message, statusCode } = getAiSuggestionError(error);
      console.error("Gemini AI integration error:", message);

      return jsonResponse(
        {
          error: message,
          isMisconfigured: !process.env.GEMINI_API_KEY,
        },
        statusCode,
      );
    }
  },
};
