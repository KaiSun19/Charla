import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { useCharlaContext } from "@/Context";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import { NoColorTextField } from "@/StyledComponents";

const Record = () => {
  const { language } = useCharlaContext();

  const rec = useRef(null);

  const [recording, setRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [userInput, setUserInput] = useState("");

  const handleStopRecording = () => {
    if (rec.current) {
      rec.current.stream.getAudioTracks().forEach((track) => {
        track.stop();
      });
      rec.current.stop();
    }
  };

  const handleUserInput = (e) => {
    setUserInput(e.target.value);
  };

  function handleRecording() {
    if (!recording) {
      setRecording(true);
      // Display recording
      async function getUserMedia(constraints) {
        if (window.navigator.mediaDevices) {
          return window.navigator.mediaDevices.getUserMedia(constraints);
        }
        let legacyApi =
          navigator.getUserMedia ||
          navigator.webkitGetUserMedia ||
          navigator.mozGetUserMedia ||
          navigator.msGetUserMedia;
        if (legacyApi) {
          return new Promise(function (resolve, reject) {
            legacyApi.bind(window.navigator)(constraints, resolve, reject);
          });
        } else {
          alert("user api not supported");
        }
      }
      let audioChunks = [];
      async function handlerFunction(stream) {
        rec.current = new MediaRecorder(stream);
        rec.current.start();
        rec.current.ondataavailable = async (e) => {
          audioChunks.push(e.data);
          if (rec.current.state == "inactive") {
            const audioBlob = new Blob(audioChunks, { type: "audio/webm" });
            try {
              const reader = new FileReader();
              reader.readAsDataURL(audioBlob);
              reader.onloadend = async function () {
                const base64Audio = reader.result.split(",")[1]; // Remove the data URL prefix
                const response = await fetch("/api/voiceToText", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ audio: base64Audio, lang: language }),
                });
                const data = await response.json();
                setVoiceText(data.result);
                if (response.status !== 200) {
                  throw (
                    data.error ||
                    new Error(`Request failed with status ${response.status}`)
                  );
                }
              };
            } catch (error) {
              console.error(error);
              alert(error.message);
            }
          }
        };
      }
      function startusingBrowserMicrophone(boolean) {
        getUserMedia({ audio: boolean })
          .then((stream) => {
            handlerFunction(stream);
          })
          .catch((err) => console.error("Error accessing microphone:", err));
      }
      startusingBrowserMicrophone(true);
    } else {
      setRecording(false);
      handleStopRecording();
    }
  }

  useEffect(() => {
    setUserInput((prevUserInput) => {
      return prevUserInput.length > 0
        ? prevUserInput + ` ${voiceText}`
        : voiceText;
    });
  }, [voiceText]);

  return (
    <div className="record-container">
      <Box className="record-input-container">
        <NoColorTextField
          autoFocus={true}
          sx={{
            width: "95%",
            padding: "1%",
            color: "white",
            borderRadius: "30px",
          }}
          value={userInput}
          placeholder="Decir algo..."
          className="record-textfield"
          onChange={handleUserInput}
        />
        <IconButton
          onClick={() => {
            handleRecording();
          }}
        >
          {recording ? (
            <CancelRoundedIcon className="recorder-icon" />
          ) : (
            <KeyboardVoiceOutlinedIcon className="recorder-icon" />
          )}
        </IconButton>
      </Box>
      <IconButton>
        <SendRoundedIcon
          className="recorder-icon"
          sx={{ marginLeft: "10px" }}
        />
      </IconButton>
    </div>
  );
};

export default Record;
