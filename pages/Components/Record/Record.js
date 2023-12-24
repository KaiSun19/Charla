import React, { useEffect, useRef, useState } from "react";
import { Button, IconButton } from "@mui/material";
import { useCharlaContext } from "@/Context";
import { stopMediaStream } from "@/Utils";
import HeadsetIcon from "@mui/icons-material/Headset";
import CancelRoundedIcon from "@mui/icons-material/CancelRounded";
import Header from "../Header/Header";
import TextField from "@mui/material/TextField";
import { WhiteTextField } from "@/StyledComponents";

const Record = () => {
  const { setAudioBlob, mediaStream } = useCharlaContext();

  const rec = useRef(null);
  const recordingStepRef = useRef(null);

  const [recording, setRecording] = useState(false);
  const [userInput, setUserInput] = useState(" ");

  const handleStopRecording = () => {
    if (rec.current) {
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
        if (mediaStream.current) {
          stopMediaStream();
        }
        mediaStream.current = stream.clone();
        rec.current = new MediaRecorder(stream);
        rec.current.start();
        rec.current.ondataavailable = async (e) => {
          audioChunks.push(e.data);
          if (rec.current.state == "inactive") {
            let blob = new Blob(audioChunks, { type: "audio/mp3" });
            const audioBuffer = await blob.arrayBuffer();
            const audioData = new Int16Array(audioBuffer);
            const linear16Blob = new Blob([audioData], { type: "audio/l16" });
            console.log(linear16Blob);

            // document.getElementById("audioElement").src =
            //   URL.createObjectURL(blob);
          }
        };
      }
      function startusingBrowserMicrophone(boolean) {
        getUserMedia({ audio: boolean }).then((stream) => {
          handlerFunction(stream);
        });
      }
      startusingBrowserMicrophone(true);
    } else {
      setRecording(false);
      handleStopRecording();
    }
  }

  return (
    <div className="record-container">
      <WhiteTextField
        sx={{
          width: "50%",
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
          <HeadsetIcon className="recorder-icon" />
        )}
      </IconButton>
      {/* <audio src="" id="audioElement" controls></audio> */}
    </div>
  );
};

export default Record;
