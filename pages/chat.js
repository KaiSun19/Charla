import { Box, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CharlaProvider, useCharlaContext } from "@/Contexts/UserContext";
import Record from "../Components/Record/Record";
import ChatLog from "../Components/ChatLog/ChatLog";
import ChatNavigation from "../Components/ChatNavigation/ChatNavigation";
import ErrorPage from "@/Components/ErrorPage/ErrorPage";
import LoadingScreen from "@/Components/LoadingScreen/LoadingScreen";

export default function Chat() {
  const { mobile, user, conversations, userIsLoading } = useCharlaContext();

  if (userIsLoading) {
    return <LoadingScreen />;
  }
  if (user && user.email === "yksun15@gmail.com") {
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
  } else {
    return (
      <ErrorPage error={{ message: "Please sign in or make an account" }} />
    );
  }
}
