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
