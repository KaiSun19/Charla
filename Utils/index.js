import { initialPrompt } from "@/Constants";
import React, { useContext, useState, useEffect } from "react";

export const findStartEndIndex = (subtext, text) => {
  let startIndex = text.indexOf(subtext);
  if (!startIndex) {
    return null;
  }
  return [startIndex, startIndex + subtext.length - 1];
};

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

export const getCharlaReply = async (testing, chat, conversations) => {
  let query = formatCompleteQuery(chat);
  let updatedUserMessage = {
    ...conversations[0].chat[conversations[0].chat.length - 1],
  };
  let responseMessage;
  if (testing) {
    const randomResponse =
      randomResponses[Math.floor(Math.random() * randomResponses.length)];
    //TODO: when moving onto storing conversations in a database, the message object should only have an id pointing to a saved blob object in the database that contains the the audio content
    responseMessage = {
      type: "Charla",
      message: randomResponse,
      audio: testAudio,
      saved: [],
      errors: [],
    };
  } else {
    let retry = false;
    let retryCount = 0;
    do {
      try {
        const response = await fetch("/api/chatCompletion", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messages: query.messages,
          }),
        });
        const data = await response.json();
        const { Errors, Response } = parseCharlaResponse(
          data.result.choices[0].message.content,
        );
        retry = false;
        if (Errors.length > 0) {
          updatedUserMessage = {
            ...updatedUserMessage,
            errors: Errors,
          };
        }
        responseMessage = {
          type: "Charla",
          message: Response,
          audio: null,
          saved: [],
          errors: [],
        };
      } catch (error) {
        console.error(error);
        console.log(retryCount);
        if (retryCount < 3) {
          retryCount++;
          retry = true;
        } else {
          return;
        }
      }
    } while (retry);
  }
  //responseMessage = the message charla replies with
  //updatedUserMessage = if the user made a mistake, then the message updates with errors, if not then its the same message
  return { responseMessage, updatedUserMessage };
};

export const createUser = (username, email) => {
  return {
    id: btoa(username + email),
    username: username,
    email: email,
    datetimeJoined: new Date().toDateString(),
    initials: username.match(/\b\w/g).join(",").replace(",", ""),
  };
};
// matches phrase with text within a conversation chat and then returns array of matching conversations
export const findConversations = (phrase, conversations) => {
  let matchConversations = [];
  conversations.map((conversation) => {
    conversation.chat.map((chat, i) => {
      if (chat.message.includes(phrase)) {
        matchConversations.push({ conversation, index: i });
      }
    });
  });
  return matchConversations;
};
