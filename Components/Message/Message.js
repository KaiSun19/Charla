import { useCharlaContext } from "@/Contexts/UserContext";
import { Box, Typography, Avatar, IconButton, Button } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import React, { forwardRef, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { convertClassname } from "@/Utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

import ErrorHighlightedMessage from "./ErrorHighlightedMessage";

const messageStyles = {
  display: "flex",
  flexDirection: "row",
  justifyContent: "flex-start",
  alignItems: "center",
  gap: "15px",
};

const Message = forwardRef(({ Message, Index }, ref) => {
  const {
    mobile,
    userDetails,
    conversations,
    currentConversation,
    charlaIsLoading,
    fetchAudio,
    createUpdatedConversations,
    handleConversationsUpdate,
    chatSettings,
    prevChatSettings,
  } = useCharlaContext();

  const isSettingsSpeedChanged = prevChatSettings
    ? prevChatSettings.playbackSpeed !== chatSettings.playbackSpeed
    : false;

  const theme = useTheme();

  const audioRef = useRef(null); // Create audio ref

  //idle = audio is not playing or loading
  //loading = audio is loading
  //paused = audio is paused
  //playing = audio is playing
  //error = audio error
  const [audioStatus, setAudioStatus] = useState("idle");

  // state and handling related to error toolip
  const [errorTooltipOpen, setErrorTooltipOpen] = useState(
    Message.errors ? new Array(Message.errors.length).fill(false) : null,
  );

  //text that is highlighted for translation
  const [highlightedText, setHighlightedText] = useState(null);

  const playAudio = async () => {
    let messageWithAudio;
    if ((!Message.audio && !audioRef.current.src) || isSettingsSpeedChanged) {
      setAudioStatus("loading");
      // If message does not have audio, fetch audio
      messageWithAudio = await fetchAudio(Message, Index);
      audioRef.current.src = messageWithAudio.audio;
    }
    try {
      await audioRef.current.play(); // Wait for playback to start
      setAudioStatus("playing"); // Set before play to indicate attempt
    } catch (error) {
      console.error("Error during playback attempt:", error);
      // Handle other potential errors
      setAudioStatus("error"); // Reset state on error
    }
    audioRef.current.onended = () => {
      // after playback endupdate message state if message state does not have audio
      if (!Message.audio) {
        const updatedConversations = createUpdatedConversations({
          index: conversations.indexOf(currentConversation),
          message: messageWithAudio,
          messageIndex: Index,
        });
        handleConversationsUpdate(updatedConversations);
      }
    };
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
    setErrorTooltipOpen(new Array(Message.errors.length).fill(false));
  };

  const SavedHighlightedMessage = ({ message, savedIndex }) => {
    // const messageWithHighlights = () => {
    //   let renderedMessage = [];
    //   let lastIndex = 0;
    //   savedIndex.map(([start, end]) => {
    //     renderedMessage.push(message.substring(lastIndex, start));
    //     const substringToHighlight = message.substring(start, end);
    //     const highlightText = (
    //       <span className="message-highlight-saved">
    //         {substringToHighlight}
    //       </span>
    //     );
    //     renderedMessage.push(highlightText);
    //     lastIndex = end;
    //   });
    //   renderedMessage.push(<span>{message.substring(lastIndex)}</span>);
    //   return renderedMessage;
    // };
    return (
      <Typography
        variant="body1"
        className="flex-items-center"
        sx={mobile ? {} : { fontSize: "22px" }}
      >
        {/* {messageWithHighlights()} */}
        {message}
      </Typography>
    );
  };

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
          sx={{
            backgroundColor: theme.palette.background.default,
          }}
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
                  src={Message.audio}
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
              {Message.errors.length > 0 ? (
                <ErrorHighlightedMessage
                  message={Message.message}
                  errors={Message.errors}
                  setErrorTooltipOpen={setErrorTooltipOpen}
                  errorTooltipOpen={errorTooltipOpen}
                  handleErrorCorrection={handleErrorCorrection}
                />
              ) : (
                <Typography
                  variant="body1"
                  className="flex-items-center"
                  sx={!mobile ? { fontSize: "22px" } : {}}
                >
                  {Message.message}
                </Typography>
              )}
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
                  src={Message.audio}
                  onEnded={() => setAudioStatus("idle")}
                />
                <IconButton
                  sx={{ width: "36px", height: "36px" }}
                  onClick={audioStatus === "playing" ? pauseAudio : playAudio}
                >
                  {/* TODO FIX : the button should have the same height as its width */}
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
              <SavedHighlightedMessage
                message={Message.message}
                // savedIndex={SavedIndex}
              />
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
});

Message.displayName = "Message";

export default Message;
