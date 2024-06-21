import React, { useEffect, useRef, useState } from "react";
import { Box, IconButton } from "@mui/material";
import { useCharlaContext } from "@/Contexts/UserContext";
import KeyboardVoiceOutlinedIcon from "@mui/icons-material/KeyboardVoiceOutlined";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import PendingOutlinedIcon from "@mui/icons-material/PendingOutlined";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import { convertClassname } from "@/Utils";
import { useTheme } from "@mui/material/styles";

const Record = () => {
  const { language, mobile, testing, currentConversation, addToChat } =
    useCharlaContext();

  const theme = useTheme();

  const rec = useRef(null);

  const [recording, setRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [voiceApiLoading, setVoiceApiLoading] = useState(false);
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

  const handleUserSend = () => {
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
                if (testing) {
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
                  setVoiceApiLoading(false);
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
      setVoiceApiLoading(true);
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
      sx={{ paddingRight: "0" }}
      onClick={() => {
        handleRecording();
      }}
    >
      {recording ? (
        <CancelRoundedIcon
          className={`${convertClassname(mobile, "icon-button")}`}
          color="primary"
        />
      ) : (
        <KeyboardVoiceOutlinedIcon
          className={`${convertClassname(mobile, "icon-button")}`}
          color="primary"
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
          value={userInput}
          onChange={handleUserInput}
          multiline
          maxRows={5}
          startAdornment={
            voiceApiLoading && (
              <InputAdornment position="start">
                <PendingOutlinedIcon
                  className={`${convertClassname(mobile, "icon-button")}`}
                  color="primary.light"
                />
              </InputAdornment>
            )
          }
          endAdornment={
            <>
              <InputAdornment position="end">{recordButton}</InputAdornment>
              <InputAdornment position="end">
                <IconButton
                  sx={{ paddingLeft: "0" }}
                  onClick={() => {
                    handleUserSend();
                  }}
                  disabled={recording}
                >
                  <ArrowUpwardRoundedIcon
                    className={`${convertClassname(mobile, "icon-button")}`}
                    color={recording ? "primary.light" : "primary"}
                  />
                </IconButton>
              </InputAdornment>
            </>
          }
          sx={{
            backgroundColor: theme.palette.background.paper,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #292929",
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default Record;
