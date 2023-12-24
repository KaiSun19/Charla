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
