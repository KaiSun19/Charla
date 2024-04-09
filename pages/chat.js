import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import { CharlaProvider, useCharlaContext } from "@/Contexts/UserContext";
import Record from "../Components/Record/Record";
import ChatLog from "../Components/ChatLog/ChatLog";
import ChatNavigation from "../Components/ChatNavigation/ChatNavigation";

export default function Chat() {
  const { mobile } = useCharlaContext();

  return (
    <CharlaProvider>
      <Box className="chat-container">
        {!mobile && <ChatNavigation />}
        <Box className="conversation-container">
          <ChatLog />
          <Record />
        </Box>
      </Box>
    </CharlaProvider>
  );
}
