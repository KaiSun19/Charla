import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const exampleStarters =
  "cual es tu clima favorito, ¿Cómo describirías tu personalidad?, que tipo de comida te gusta";

const initialPrompt = (info) => {
  return `You are a student learning beginner spanish  and want to start a conversation in simple spanish with your spanish tutor . These are some example starters I want you to give : ${exampleStarters} Give me just 3 conversation starters and some must be about a new topic . Do not give the translation . You must use simple spanish`;
};

export default async function POST(request, res) {
  // Parse the request body
  const req = request;
  try {
    if (!req.body.testing) {
      const response = await openai.chat.completions.create({
        messages: [{ role: "system", content: initialPrompt(req.body.data) }],
        model: "gpt-4",
      });
      res.status(200).json({ result: response });
    }
  } catch (error) {
    // Handle any errors that occur during the request
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res
        .status(500)
        .json({ error: "Conversation starter : Internal server error" });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({ error: "Method not allowed" });
    }
  }
}
