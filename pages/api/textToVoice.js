import fs from "fs";
const testing = false;

export default async function POST(request, res) {
  // Parse the request body
  const req = request;
  const text = req.body.text;
  const endpoint = `https://texttospeech.googleapis.com/v1beta1/text:synthesize?key=${process.env.GOOGLE_TTS_API_KEY}`;
  const payload = JSON.stringify({
    audioConfig: {
      audioEncoding: "MP3",
      effectsProfileId: ["small-bluetooth-speaker-class-device"],
      pitch: 0,
      speakingRate: 1,
    },
    input: {
      text: text,
    },
    voice: {
      languageCode: "es-ES",
      name: "es-ES-Neural2-A",
    },
  });
  try {
    if (testing) {
      const response = {
        data: {
          audioContent: fs.readFileSync("./audio.mp3").toString("base64"),
        },
      };
      res.status(200).json(response.data);
      return;
    } else {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: payload,
      });
      if (!response.ok) {
        throw new Error(
          `TTS API request failed with status ${response.status}`,
        );
      }
      const data = await response.json();
      res.status(200).json(data); // Return the response data
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to generate audio" }); // Handle errors
  }
}
