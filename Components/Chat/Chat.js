import { useCharlaContext } from "@/Context";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import Message from "../Message/Message";

export default function Chat() {
  const { mockMessages } = useCharlaContext();

  return (
    <Box className="chat-container">
      {mockMessages.map((message, index) => (
        <Message
          key={`message-${index}`}
          Type={message["Type"]}
          Message={message["Message"]}
        />
      ))}
    </Box>
  );
}
