import { useCharlaContext } from "@/Contexts/UserContext";
import { Box, Avatar, IconButton } from "@mui/material";
import React, { forwardRef, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { convertClassname } from "@/Utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

import ErrorHighlightedMessage from "./ErrorHighlightedMessage";
import VoiceOnlyUI from "../VoiceOnlyUI/VoiceOnlyUI";
import SavedHighlightedMessage from "./SavedHighlightedMessage";
import { db } from "@/firebase";
import { collection, doc, getDocs, query, setDoc, where } from "firebase/firestore";

const messageStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "15px",
};

const decodeBase64Audio = (base64) => {
  const binaryString = atob(base64.split(",")[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);

  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }

  return bytes.buffer;
};

const calculateAudioDuration = async (arrayBuffer) => {
  const audioContext = new (window.AudioContext || window.webkitAudioContext)();

  const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

  return audioBuffer.duration;
};

const Message = forwardRef(({ Message, Index, Hide, Autoplay }, ref) => {
  const {
    mobile,
    userDetails,
    conversations,
    currentConversation,
    fetchAudio,
    handleConversationsUpdate,
    chatSettings,
    prevChatSettings,
  } = useCharlaContext();

  const isSettingsSpeedChanged = prevChatSettings
    ? prevChatSettings.playbackSpeed !== chatSettings.playbackSpeed
    : false;

  const audioRef = useRef(null); // Create audio ref

  //audio duration count to pass to voice only ui
  const audioDurationRef = useRef(null);

  //idle = audio is not playing or loading
  //loading = audio is loading
  //paused = audio is paused
  //playing = audio is playing
  //error = audio error
  const [audioStatus, setAudioStatus] = useState("idle");

  const playAudio = async () => {
    if (!audioRef.current.src || isSettingsSpeedChanged) {
      setAudioStatus("loading");
      // If message does not have audio, fetch audio
      const { audio } = await fetchAudio(Message.message);
      audioRef.current.src = audio

      const audioDuration = await calculateAudioDuration(
        decodeBase64Audio(audio),
      );

      audioDurationRef.current = audioDuration;

      //TODO: for audio to be uploaded to firebase the audio cannot be stopped before it ends
      audioRef.current.onended = async () => {
        // after playback endupdate message state if message state does not have audio
        const audioDocPath = `audios/${Index}_${userDetails.id}/${conversations.indexOf(currentConversation)}/${Index}`
        await setDoc(doc(db, 'audios', `${Index}_${userDetails.id}`), {
          audio : audio,
          audioDuration,
          path : audioDocPath
        })

      };
    }
    try {
      await audioRef.current.play(); // Wait for playback to start
      setAudioStatus("playing"); // Set before play to indicate attempt
    } catch (error) {
      console.error("Error during playback attempt:", error);
      // Handle other potential errors
      setAudioStatus("error"); // Reset state on error
    }
  };

  const pauseAudio = () => {
    if (audioStatus !== "playing") return;
    audioRef.current.pause();
    setAudioStatus("paused");
  };

  const handleErrorCorrection = (errorIndex, phrase, correction) => {
    let updatedChat = currentConversation.chat;
    updatedChat = [
      ...updatedChat.slice(0, Index),
      {
        ...updatedChat[Index],
        message: Message.message.replace(phrase, correction),
        errors: Message.errors.filter(({ Phrase }) => Phrase !== phrase),
      },
      ...updatedChat.slice(Index + 1),
    ];
    let updatedConversations = [
      {
        ...currentConversation,
        chat: updatedChat,
      },
      ...conversations.slice(1),
    ];
    handleConversationsUpdate(updatedConversations);
  };

  const calcSpeechOnlyWidth = (count) => {
    if (mobile) {
      if (count / 5 > 20) {
        return 20;
      }
      return count / 5;
    }
    if (count / 2 > 50) {
      return 50;
    }
    return count / 2;
  };

  useEffect(() => {
    //fetch audio if it exists and updates audioData and audioDuration state
    const retrieveAudio = async () =>{
      const audioDocPath = `audios/${Index}_${userDetails.id}/${conversations.indexOf(currentConversation)}/${Index}`
      const audioCollectionRef = collection(db, `audios`);
      const q = query(audioCollectionRef, where('path', '==', audioDocPath));
      const querySnapshot = await getDocs(q);
      if(!querySnapshot.isEmpty){
        querySnapshot.forEach((doc)=>{
          if(audioRef.current){
            audioRef.current.src = doc.data().audio
          }
          audioDurationRef.current = doc.data().audioDuration;
        })
      }
    }
    if (
      Autoplay &&
      Index === currentConversation.lastUpdatedMessage &&
      !audioRef.current.src &&
      Message.type === "Charla"
    ) {
      playAudio()
    }
    else{
      retrieveAudio()
    }
  }, []);

  return (
    <Box
      ref={ref}
      sx={messageStyles}
      className="message-container"
      key={`message-container-${Index}`}
    >
      <Box
        className={
          Message.type === "User"
            ? "message-text-container text-container-user"
            : "message-text-container text-container-charla"
        }
      >
        <Box
          className={
            Message.type === "User"
              ? "message-icon-user"
              : "message-icon-charla"
          }
        >
          {Message.type === "User" ? (
            <Avatar
              className={`${convertClassname(mobile, "message-icon")}`}
              sx={{ backgroundColor: "#6573C3" }}
            >
              {userDetails.initials}
            </Avatar>
          ) : (
            <Image
              src="/charla-icon-light.svg"
              alt="Charla Icon"
              width={30}
              height={30}
              className={`${convertClassname(mobile, "message-icon")}`}
            />
          )}
        </Box>
        <Box
          className={
            Message.type === "User"
              ? "message-text message-text-user"
              : "message-text message-text-charla"
          }
        >
          {Message.type === "User" ? (
            <>
              <>
                <audio
                  ref={audioRef}
                  onEnded={() => setAudioStatus("idle")}
                />
                <IconButton
                  sx={{ width: "36px", height: "36px" }}
                  onClick={audioStatus === "playing" ? pauseAudio : playAudio}
                >
                  {audioStatus === "playing" ? (
                    <PauseRoundedIcon />
                  ) : audioStatus === "loading" ? (
                    <Skeleton
                      baseColor="##c8c8c891"
                      circle={true}
                      height={24}
                      width={24}
                    />
                  ) : (
                    <PlayArrowRoundedIcon />
                  )}
                </IconButton>
              </>
              <ErrorHighlightedMessage
                message={Message.message}
                errors={Message.errors}
                saved={Message.saved}
                handleErrorCorrection={handleErrorCorrection}
              />
            </>
          ) : Message.type === "Loading" ? (
            <Box
              sx={
                mobile
                  ? { width: "100px", height: "22px" }
                  : { width: "100px", height: "33px" }
              }
            >
              <Skeleton height={mobile ? "22px" : "33px"} />
            </Box>
          ) : (
            <>
              <>
                <audio
                  ref={audioRef}
                  onEnded={() => setAudioStatus("idle")}
                />
                <IconButton
                  sx={{ width: "36px", height: "36px" }}
                  onClick={audioStatus === "playing" ? pauseAudio : playAudio}
                >
                  {audioStatus === "playing" ? (
                    <PauseRoundedIcon />
                  ) : audioStatus === "loading" ? (
                    <Skeleton
                      baseColor="#6573c3a3"
                      circle={true}
                      height={24}
                      width={24}
                    />
                  ) : (
                    <PlayArrowRoundedIcon />
                  )}
                </IconButton>
              </>
              {Hide ? (
                <VoiceOnlyUI
                  count={Math.ceil(calcSpeechOnlyWidth(Message.message.length))}
                  duration={audioDuration}
                  isPlaying={audioStatus === "playing"}
                />
              ) : (
                <SavedHighlightedMessage
                  message={Message.message}
                  saved={Message.saved}
                />
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
});

Message.displayName = "Message";

export default Message;
