import { useCharlaContext } from "@/Context";
import { Box, Typography, Avatar, IconButton } from "@mui/material";
import Tooltip, { tooltipClasses } from "@mui/material/Tooltip";
import { styled } from "@mui/material/styles";
import React, { useState } from "react";
import Image from "next/image";
import { convertClassname } from "@/Utils";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

export default function Message({
  Index,
  Type,
  Message,
  Saved,
  SavedIndex,
  Errors,
  ErrorIndex,
}) {
  const { mobile, mockUserInitials, setMockConversation } = useCharlaContext();

  const handleErrorCorrection = (errorIndex, error, correction) => {
    setMockConversation((currentMockConversation) => ({
      ...currentMockConversation,
      conversation: currentMockConversation["conversation"].map(
        (currentMessage, index) => {
          if (index === Index) {
            return {
              ...currentMessage,
              Message: Message.replace(error, correction),
              Errors: Errors.filter((error, index) => index !== errorIndex),
              ErrorIndex: ErrorIndex.filter(
                (error, index) => index !== errorIndex,
              ),
            };
          }
          return currentMessage;
        },
      ),
    }));
  };

  const SavedHighlightedMessage = ({ message, savedIndex }) => {
    const messageWithHighlights = () => {
      let renderedMessage = [];
      let lastIndex = 0;
      savedIndex.map(([start, end]) => {
        renderedMessage.push(message.substring(lastIndex, start));
        const substringToHighlight = message.substring(start, end);
        const highlightText = (
          <span className="message-highlight-saved">
            {substringToHighlight}
          </span>
        );
        renderedMessage.push(highlightText);
        lastIndex = end;
      });
      renderedMessage.push(<span>{message.substring(lastIndex)}</span>);
      return renderedMessage;
    };
    return (
      <Typography variant="body1" sx={!mobile && { fontSize: "22px" }}>
        {messageWithHighlights()}
      </Typography>
    );
  };

  const ErrorHighlightedMessage = ({ message, errorIndex, errors }) => {
    const messageWithHighlights = () => {
      let renderedMessage = [];
      let lastIndex = 0;
      errorIndex.map(([start, end], index) => {
        renderedMessage.push(message.substring(lastIndex, start));
        const substringToHighlight = message.substring(start, end);
        const highlightText = (
          <HtmlTooltip
            title={
              <React.Fragment>
                <Typography
                  color="inherit"
                  sx={{ borderRight: "1px solid #C8C8C8", paddingRight: "5px" }}
                >
                  error
                </Typography>
                <Typography color="inherit">
                  {errors[index]["Error"]}
                </Typography>
                <IconButton
                  onClick={() => {
                    handleErrorCorrection(
                      index,
                      errors[index]["Phrase"],
                      errors[index]["Correction"],
                    );
                  }}
                >
                  <DoneRoundedIcon />
                </IconButton>
              </React.Fragment>
            }
          >
            <span
              className="message-highlight-error"
              id={`highlight-error-${index}`}
            >
              {substringToHighlight}
            </span>
          </HtmlTooltip>
        );
        renderedMessage.push(highlightText);
        lastIndex = end;
      });
      renderedMessage.push(<span>{message.substring(lastIndex)}</span>);
      return renderedMessage;
    };
    return (
      <Typography variant="body1" sx={!mobile && { fontSize: "22px" }}>
        {messageWithHighlights()}
      </Typography>
    );
  };

  const HtmlTooltip = styled(({ className, ...props }) => (
    <Tooltip {...props} classes={{ popper: className }} />
  ))(({ theme }) => ({
    [`& .${tooltipClasses.tooltip}`]: {
      display: "flex",
      flexDirection: "row",
      alignItems: "center",
      gap: "10px",
      backgroundColor: "#ffffff",
      color: "rgba(0, 0, 0, 0.87)",
      boxShadow: "rgba(149, 157, 165, 0.2) 0px 8px 24px",
      maxWidth: "fit-content",
      padding: "5px",
      border: "1px solid #C8C8C8",
      borderRadius: "5px",
    },
  }));

  return (
    <Box className="message-container" key={`message-container-${Index}`}>
      <Box
        className={
          Type === "User"
            ? "message-text-container text-container-user"
            : "message-text-container text-container-charla"
        }
      >
        <Box
          className={
            Type === "User" ? "message-icon-user" : "message-icon-charla"
          }
        >
          {Type === "User" ? (
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
          className={
            Type === "User"
              ? "message-text message-text-user"
              : "message-text message-text-charla"
          }
        >
          {Type === "User" ? (
            <ErrorHighlightedMessage
              message={Message}
              errorIndex={ErrorIndex}
              errors={Errors}
            />
          ) : (
            <SavedHighlightedMessage
              message={Message}
              savedIndex={SavedIndex}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
