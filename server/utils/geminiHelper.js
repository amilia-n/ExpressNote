require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const flashcardPrompt = (content) => ({
  contents: [
    {
      parts: [
        {
          text: `Extract important concepts from the content below and format them as up to 10 flashcards.
  
  Each flashcard should include:
  - "header": a short, clear summary or topic title
  - "summary": bullet points breaking down the key details of that topic
  
  Return the flashcards in this **exact JSON format**:
  {
    "flashcards": [
      {
        "header": "Header Title",
        "summary": "• Key detail 1\\n• Key detail 2\\n• Key detail 3"
      }
    ]
  }
  
  Content to extract from:
  ${content}`,
        },
      ],
    },
  ],
});
const callGemini = async (content, noteId) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-pro-exp-03-25",
    });
    const prompt = flashcardPrompt(content);

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();
    text = text.replaceAll("```", "");
    text = text.replace("json", "");
    const parsed = JSON.parse(text);
    return parsed.flashcards;
  } catch (error) {
    console.error("Error generating flashcards with Gemini:", error);
    throw error;
  }
};

module.exports = callGemini;
