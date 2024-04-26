import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CharlaProvider, useCharlaContext } from "@/Contexts/UserContext";
import Record from "../Components/Record/Record";
import ChatLog from "../Components/ChatLog/ChatLog";
import ChatNavigation from "../Components/ChatNavigation/ChatNavigation";
import ErrorPage from "@/Components/ErrorPage/ErrorPage";

export default function Chat() {
  const { mobile, user, conversations } = useCharlaContext();

  if (user && user.email === "yksun15@gmail.com" && conversations.length >= 0) {
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
  } else if (
    user &&
    user.email === "yksun15@gmail.com" &&
    !conversations.length >= 0
  ) {
    return <p>Loading ...</p>;
  } else {
    return (
      <ErrorPage error={{ message: "Please sign in or make an account" }} />
    );
  }
}
