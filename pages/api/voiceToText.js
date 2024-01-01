// Import necessary libraries
import { exec } from "child_process";
import fs from "fs";
import { NextResponse } from "next/server";
import OpenAI from "openai";

const ffmpegPath = require("@ffmpeg-installer/ffmpeg").path;
const ffmpeg = require("fluent-ffmpeg");
ffmpeg.setFfmpegPath(ffmpegPath);

import speech from "@google-cloud/speech";
import { GoogleAuth } from "google-auth-library";

const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
const auth = new GoogleAuth({ credentials });

const speechClient = new speech.SpeechClient({ auth });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function convertWebmToFlac(inputPath, outputPath) {
  console.log(inputPath);
  return new Promise((resolve, reject) => {
    ffmpeg()
      .input(inputPath)
      .audioCodec("flac")
      .on("end", () => {
        resolve(outputPath);
      })
      .on("error", (err) => {
        console.error("Error: ", err);
      })
      .save(outputPath);
  });
}

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

// Promisify the exec function from child_process
const util = require("util");
const execAsync = util.promisify(exec);

export default async function POST(request) {
  // Parse the request body
  const req = request;
  // Extract the audio data from the request body
  const base64Audio = req.body.audio;
  // Convert the Base64 audio data back to a Buffer
  const audio = Buffer.from(base64Audio, "base64");
  try {
    // Convert the audio data to text
    const text = await convertAudioToText(audio);
    // Return the transcribed text in the response
    return NextResponse.json({ result: text }, { status: 200 });
  } catch (error) {
    // Handle any errors that occur during the request
    if (error.response) {
      console.error(error.response.status, error.response.data);
      return NextResponse.json({ error: error.response.data }, { status: 500 });
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      return NextResponse.json(
        { error: "An error occurred during your request." },
        { status: 500 },
      );
    }
  }
}
// This function converts audio data to text using the OpenAI API
async function convertAudioToText(audioData) {
  // Convert the audio data to MP3 format
  // const flacAudioData = await convertAudioToFlac(audioData);
  const mp3AudioData = await convertAudioToMp3(audioData);

  const outputPath = "/tmp/output.mp3";
  fs.writeFileSync(outputPath, mp3AudioData);
  // Transcribe the audio

  const response = await openai.audio.transcriptions.create({
    model: "whisper-1",
    file: fs.createReadStream(outputPath),
    language: "es",
  });
  // Delete the temporary file
  fs.unlinkSync(outputPath);
  // The API response contains the transcribed text
  const transcribedText = response;
  console.log(transcribedText);
  return transcribedText;

  // const config = {
  //   encoding: "FLAC",
  //   languageCode: "en-US",
  // };
  // const request = {
  //   audio: {
  //     content: flacAudioData,
  //   },
  //   config: config,
  // };

  // Detects speech in the audio file
  // const [response] = await speechClient.recognize(request);
  // const transcription = response.results
  //   .map((result) => result.alternatives[0].transcript)
  //   .join("\n");
  // console.log(`Transcription: ${transcription}`);

  // console.log(flacAudioData);
  // Write the MP3 audio data to a file
  // const outputPath = "/tmp/output.flac";
  // fs.writeFileSync(outputPath, flacAudioData);
  //   // Transcribe the audio
  //   const response = await openai.createTranscription(
  //     fs.createReadStream(outputPath),
  //     "whisper-1",
  //   );
  //   // Delete the temporary file
  //   fs.unlinkSync(outputPath);
  //   // The API response contains the transcribed text
  //   const transcribedText = response.data.text;
  // const transcribedText = "null";
  return transcribedText;
}
// This function converts audio data to MP3 format using ffmpeg
async function convertAudioToFlac(audioData) {
  // Write the audio data to a file
  const inputPath = "/tmp/input.webm";
  const outputFLACPath = "/tmp/output.flac";
  fs.writeFileSync(inputPath, audioData);

  //convert to FLAC using convertWebmToFlac
  await convertWebmToFlac(inputPath, outputFLACPath);

  // console.log("here");
  // const outputPath = "/tmp/output.linear16";
  // await execAsync(
  //   `ffmpeg -i ${outputFLACPath} -f s16le -acodec pcm_s16le -ar 16000 -ac 1 ${outputPath}`,
  // );
  // // Read the converted audio data
  const flacAudioData = fs.readFileSync(outputFLACPath);
  // Delete the temporary files
  fs.unlinkSync(inputPath);
  fs.unlinkSync(outputFLACPath);
  return flacAudioData;
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
