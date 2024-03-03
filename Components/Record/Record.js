import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { useCharlaContext } from "@/Context";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import UnfoldMoreOutlinedIcon from "@mui/icons-material/UnfoldMoreOutlined";
import { convertClassname } from "@/Utils";

const Record = () => {
  const { language, mobile, mode, currentConversation, addToChat } =
    useCharlaContext();

  const rec = useRef(null);

  const [recording, setRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [userInput, setUserInput] = useState("");
  const [expandInput, setExpandInput] = useState(false);

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

  const handleExpandInput = () => {
    setExpandInput(!expandInput);
  };

  const handleUserSend = () => {
    console.log(document.getElementById("message-text-12"));
    addToChat(userInput, currentConversation);
    setUserInput("");
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
                if (mode === "testing") {
                  setVoiceText("example voice text");
                } else {
                  const base64Audio = reader.result.split(",")[1]; // Remove the data URL prefix
                  const response = await fetch("/api/voiceToText", {
                    method: "POST",
                    headers: {
                      "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                      audio: base64Audio,
                      lang: language,
                    }),
                  });
                  const data = await response.json();
                  setVoiceText(data.result);
                  if (response.status !== 200) {
                    throw (
                      data.error ||
                      new Error(`Request failed with status ${response.status}`)
                    );
                  }
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

  const recordButton = (
    <IconButton
      onClick={() => {
        handleRecording();
      }}
    >
      {recording ? (
        <CancelRoundedIcon
          className={`${convertClassname(mobile, "icon-button")}`}
          sx={{ color: "text" }}
        />
      ) : (
        <KeyboardVoiceOutlinedIcon
          className={`${convertClassname(mobile, "icon-button")}`}
          sx={{ color: "text" }}
        />
      )}
    </IconButton>
  );

  return (
    <Box
      className="record-container"
      sx={mobile ? { paddingLeft: "1%" } : { paddingLeft: "5%" }}
    >
      <Box
        className="record-input-container"
        sx={mobile ? { width: "95%" } : { width: "80%" }}
      >
        <OutlinedInput
          placeholder="Decir algo..."
          className="outlined-input record-input"
          color="primary"
          value={userInput}
          onChange={handleUserInput}
          multiline={expandInput ? true : false}
          minRows={5}
          endAdornment={
            <InputAdornment position="end">{recordButton}</InputAdornment>
          }
        />
      </Box>
      <Box className="record-icon-buttons-container">
        {mobile && (
          <IconButton
            onClick={() => {
              handleExpandInput();
            }}
          >
            <UnfoldMoreOutlinedIcon
              className={`${convertClassname(mobile, "icon-button")}`}
            />
          </IconButton>
        )}
        <IconButton
          onClick={() => {
            handleUserSend();
          }}
        >
          <SendRoundedIcon
            className={`${convertClassname(mobile, "icon-button")} send-button`}
          />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Record;
