import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function POST(request, res) {
  // Parse the request body
  const req = request;
  try {
    // Convert the audio data to text
    const chatCompletion = await openai.chat.completions.create({
      messages: req.body.messages,
      model: "gpt-4",
    });
    res.status(200).json({ result: chatCompletion });
  } catch (error) {
    // Handle any errors that occur during the request
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res
        .status(500)
        .json({ error: "Chat completion : Internal server error" });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({ error: "Method not allowed" });
    }
  }
}
