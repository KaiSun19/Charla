import { v2 } from "@google-cloud/translate";

const translateClient = new v2.Translate({
  projectId: "charla-409115",
  key: process.env.GOOGLE_TTS_API_KEY,
});

export default async function POST(request, res) {
  // Parse the request body
  const req = request;
  const { text, sourceLang, targetLang } = req.body;
  // Check for required fields
  if (!text || !sourceLang) {
    return res
      .status(400)
      .json({ error: "Missing required fields: text and sourceLang" });
  }

  try {
    // Using fetch for basic requests
    // const endpoint = "https://translation.googleapis.com/language/translate/v2";
    // const payload = JSON.stringify({
    //   key: process.env.GOOGLE_TTS_API_KEY,
    //   q: text,
    //   source: sourceLang,
    //   target: targetLang,
    // });

    const response = await translateClient.translate(text, targetLang);
    const [translatedText] = response;
    res.status(200).json({ translatedText });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred during translation" });
  }
}
