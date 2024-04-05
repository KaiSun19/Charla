import { initialPrompt } from "@/Constants";
import React, { useContext, useState, useEffect } from "react";

const handleBlobToBase64 = ({ blob, continuous }) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);

  reader.onloadend = async () => {
    const base64data = reader.result;

    let sampleRate = audioContextRef.current?.sampleRate;

    // Google only accepts max 48000 sample rate: if
    // greater recorder js will down-sample to 48000
    if (sampleRate && sampleRate > 48000) {
      sampleRate = 48000;
    }

    const audio = { content: "" };

    const config = {
      encoding: "LINEAR16",
      languageCode: "en-US",
      sampleRateHertz: sampleRate,
      ...googleCloudRecognitionConfig,
    };

    const data = {
      config,
      audio,
    };

    // Gets raw base 64 string data
    audio.content = base64data.substr(base64data.indexOf(",") + 1);

    if (continuous) {
      startSpeechToText();
    } else {
      stopMediaStream();
      setIsRecording(false);
    }
  };
};

const stopMediaStream = () => {
  mediaStream.current?.getAudioTracks()[0].stop();
};

//Voice to text if using google stt api

// const credentials = JSON.parse(process.env.GOOGLE_APPLICATION_CREDENTIALS);
// const auth = new GoogleAuth({ credentials });

// const speechClient = new speech.SpeechClient({ auth });

// async function convertWebmToFlac(inputPath, outputPath) {
//   return new Promise((resolve, reject) => {
//     ffmpeg()
//       .input(inputPath)
//       .audioCodec("flac")
//       .on("end", () => {
//         resolve(outputPath);
//       })
//       .on("error", (err) => {
//         console.error("Error: ", err);
//       })
//       .save(outputPath);
//   });
// };

// async function convertAudioToText(audioData) {
//   // const flacAudioData = await convertAudioToFlac(audioData);

//   const outputPath = "/tmp/output.flac";
//   fs.writeFileSync(outputPath, flacAudioData);
//   // Transcribe the audio

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
// }

export const convertClassname = (mobile, classname, agg) => {
  if (mobile) {
    if (agg) {
      return `${classname} ${classname}-mobile`;
    }
    return `${classname}-mobile`;
  }
  return classname;
};

export function parseCharlaResponse(response) {
  // Try parsing the string as JSON
  try {
    if (!response.includes("Errors")) {
      return {
        Errors: [],
        Response: response,
      };
    }
    return JSON.parse(response);
  } catch (error) {
    // Handle potential parsing errors (fallback)
    console.error("Error parsing JSON:", error);
  }
}

// export function parseCharlaResponse(response) {
//   // Split the string by semicolons, removing extra spaces
//   const errorParts = response.split(";").map((part) => part.trim());

//   const hasErrors = errorParts.length > 1;
//   const errors = hasErrors ? [] : null;
//   let extractedResponse = null;

//   if (hasErrors) {
//     const errorObject = {};
//     for (let i = 0; i < errorParts.length; i++) {
//       const part = errorParts[i];
//       const keyValuePair = (i === 0 ? part.slice(7) : part).split(":");
//       const key = keyValuePair[0].trim();
//       const value = keyValuePair[1].trim().replace(/^'(.*)'$/, "$1");

//       if (i !== errorParts.length - 1) {
//         // Skip last key-value pair (response)
//         errorObject[key] = value;
//       } else {
//         extractedResponse = value;
//       }
//     }
//     errors.push(errorObject);
//   }

//   console.log({
//     Errors: errors,
//     Response: hasErrors ? extractedResponse : response,
//   });
// }

export const extractResponse = (text) => {
  if (!text.includes("Response")) {
    return text;
  }
  let match = text.match(/Response:\s*(.*)/);
  let res;
  if (match && match.length > 1) {
    res = match[1];
    if (res[0] === "'") {
      res = res.slice(1);
    }
    if (res[res.length - 1] === "'") {
      res = res.slice(0, -1);
    }
  } else {
    res = null;
  }
  return res;
};

export const formatCompleteQuery = (chat) => {
  let initialMessage = [
    {
      role: "system",
      content: initialPrompt,
    },
  ];
  let formattedMessages = chat.map((message) => {
    if (message.type === "Charla") {
      return { role: "system", content: message.message };
    } else if (message.type === "User") {
      return { role: "user", content: message.message };
    }
  });
  return {
    model: "gpt-4",
    messages: [...initialMessage, ...formattedMessages],
  };
};
