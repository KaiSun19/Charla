// Import necessary libraries
import fs from "fs";
import OpenAI from "openai";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function convertWebmToMp3(inputPath, outputPath) {
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("Error: ", err);
      })
      .save(outputPath);
  });
}

export default async function POST(request, res) {
  // Parse the request body
  const req = request;
  // Extract the audio data from the request body
  const base64Audio = req.body.audio;
  const language = req.body.lang;
  // Convert the Base64 audio data back to a Buffer
  const audio = Buffer.from(base64Audio, "base64");
  try {
    // Convert the audio data to text
    const text = await convertAudioToText(audio, language);
    // Return the transcribed text in the response
    res.status(200).json({ result: text });
  } catch (error) {
    // Handle any errors that occur during the request
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(500).json({ error: "Internal server error" });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({ error: "Method not allowed" });
    }
  }
}
// This function converts audio data to text using the OpenAI API
async function convertAudioToText(audioData, language) {
  // Convert the audio data to MP3 format
  const mp3AudioData = await convertAudioToMp3(audioData);

  const outputPath = "/tmp/output.mp3";
  fs.writeFileSync(outputPath, mp3AudioData);

  // Transcribe the audio
  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: fs.createReadStream(outputPath),
    language: language,
  });
  // Delete the temporary file
  fs.unlinkSync(outputPath);
  // The API response contains the transcribed text
  const transcribedText = response.text;
  return transcribedText;
}

// This function converts audio data to MP3 format using ffmpeg
async function convertAudioToMp3(audioData) {
  // Write the audio data to a file
  const inputPath = "/tmp/input.webm";
  fs.writeFileSync(inputPath, audioData);
  // Convert the audio to MP3 using ffmpeg
  const outputPath = "/tmp/output.mp3";

  await convertWebmToMp3(inputPath, outputPath);

  const mp3AudioData = fs.readFileSync(outputPath);
  // Delete the temporary files
  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputPath);
  return mp3AudioData;
}
