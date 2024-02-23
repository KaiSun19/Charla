import { useCharlaContext } from "@/Context";
import { Box, Typography, IconButton } from "@mui/material";
import React, { useState, useEffect } from "react";
import Message from "../Message/Message";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";

export default function ChatLog() {
  const { mockConversation, mobile } = useCharlaContext();

  return (
    <Box className="chat-log-container">
      <Box className="chat-log-title">
        <Typography variant={mobile ? "h6" : "h4"}>
          {mockConversation.title}
        </Typography>
        <IconButton>
          <MoreHorizRoundedIcon
            sx={{ color: "#929292", width: "30px", height: "30px" }}
          />
        </IconButton>
      </Box>
      <Box className="chat-log-conversation">
        {mockConversation.conversation.map((message, index) => (
          <Message
            key={`message-${index}`}
            Index={index}
            Type={message["Type"]}
            Message={message["Message"]}
            Saved={message["Saved"]}
            SavedIndex={message["SavedIndex"]}
            Errors={message["Errors"]}
            ErrorIndex={message["ErrorIndex"]}
          />
        ))}
      </Box>
    </Box>
  );
}
