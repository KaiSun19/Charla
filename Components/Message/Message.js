import { useCharlaContext } from "@/Context";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import { useTheme } from "@mui/material/styles";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import React, { forwardRef, useState, useRef } from "react";
import Image from "next/image";
import { convertClassname } from "@/Utils";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import PlayArrowRoundedIcon from "@mui/icons-material/PlayArrowRounded";
import PauseRoundedIcon from "@mui/icons-material/PauseRounded";

const Message = forwardRef(({ Message, Index }, ref) => {
  const {
    mobile,
    mockUserInitials,
    conversations,
    currentConversation,
    charlaIsLoading,
    fetchAudio,
    handleConversationsUpdate,
    createUpdatedConversations,
  } = useCharlaContext();

  const theme = useTheme();

  const messageStyles = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    gap: "15px",
  };

  const audioRef = useRef(null); // Create audio ref

  //idle = audio is not playing or loading
  //loading = audio is loading
  //paused = audio is paused
  //playing = audio is playing
  //error = audio error
  const [audioStatus, setAudioStatus] = useState("idle");

  const playAudio = async () => {
    let messageWithAudio;
    if (!Message.audio && !audioRef.current.src) {
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

  const handleErrorCorrection = (errorIndex, error, correction) => {
    // setMockConversation((currentMockConversation) => ({
    //   ...currentMockConversation,
    //   conversation: currentMockConversation["conversation"].map(
    //     (currentMessage, index) => {
    //       if (index === Index) {
    //         return {
    //           ...currentMessage,
    //           Message: Message.replace(error, correction),
    //           Errors: Errors.filter((error, index) => index !== errorIndex),
    //           ErrorIndex: ErrorIndex.filter(
    //             (error, index) => index !== errorIndex,
    //           ),
    //         };
    //       }
    //       return currentMessage;
    //     },
    //   ),
    // }));
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
        sx={!mobile && { fontSize: "22px" }}
      >
        {/* {messageWithHighlights()} */}
        {message}
      </Typography>
    );
  };

  const ErrorHighlightedMessage = ({ message, errorIndex, errors }) => {
    // const messageWithHighlights = () => {
    //   let renderedMessage = [];
    //   let lastIndex = 0;
    //   errorIndex.map(([start, end], index) => {
    //     renderedMessage.push(message.substring(lastIndex, start));
    //     const substringToHighlight = message.substring(start, end);
    //     const highlightText = (
    //       <HtmlTooltip
    //         title={
    //           <React.Fragment>
    //             <Typography
    //               color="inherit"
    //               sx={{ borderRight: "1px solid #C8C8C8", paddingRight: "5px" }}
    //             >
    //               error
    //             </Typography>
    //             <Typography color="inherit">
    //               {errors[index]["Error"]}
    //             </Typography>
    //             <IconButton
    //               onClick={() => {
    //                 handleErrorCorrection(
    //                   index,
    //                   errors[index]["Phrase"],
    //                   errors[index]["Correction"],
    //                 );
    //               }}
    //             >
    //               <DoneRoundedIcon />
    //             </IconButton>
    //           </React.Fragment>
    //         }
    //       >
    //         <span
    //           className="message-highlight-error"
    //           id={`highlight-error-${index}`}
    //         >
    //           {substringToHighlight}
    //         </span>
    //       </HtmlTooltip>
    //     );
    //     renderedMessage.push(highlightText);
    //     lastIndex = end;
    //   });
    //   renderedMessage.push(<span>{message.substring(lastIndex)}</span>);
    //   return renderedMessage;
    // };
    return (
      <>
        <Typography
          variant="body1"
          className="flex-items-center"
          sx={!mobile && { fontSize: "22px" }}
        >
          {/* {messageWithHighlights()} */}
          {message}
        </Typography>
      </>
    );
  };

  // const HtmlTooltip = styled(({ className, ...Message }) => (
  //   <Tooltip {...Message} classes={{ popper: className }} />
  // ))(({ theme }) => ({
  //   [`& .${tooltipClasses.tooltip}`]: {
  //     display: "flex",
  //     flexDirection: "row",
  //     alignItems: "center",
  //     gap: "10px",
  //     backgroundColor: "#ffffff",
  //     color: "rgba(0, 0, 0, 0.87)",
  //     boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
  //     maxWidth: "fit-content",
  //     padding: "5px",
  //     border: "1px solid #C8C8C8",
  //     borderRadius: "5px",
  //   }}))

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
              {mockUserInitials}
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
                  sx={{ aspectRatio: "1" }}
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
                // errorIndex={ErrorIndex}
                // errors={Errors}
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
                  src={Message.audio}
                  onEnded={() => setAudioStatus("idle")}
                />
                <IconButton
                  sx={{ aspectRatio: "1" }}
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
