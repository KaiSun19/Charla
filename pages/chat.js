import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import { CharlaProvider, useCharlaContext } from "@/Contexts/UserContext";
import CssBaseline from '@mui/material/CssBaseline';
import ChatLog from "../Components/ChatLog/ChatLog";
import ChatNavigation from "../Components/ChatNavigation/ChatNavigation";
import ErrorPage from "@/Components/ErrorPage/ErrorPage";
import LoadingScreen from "@/Components/LoadingScreen/LoadingScreen";

export default function Chat() {
  const { user, userIsLoading  } =
    useCharlaContext();

  if (userIsLoading) {
    return <LoadingScreen />;
  }
  if (user && user.email === "yksun15@gmail.com") {
    return (
      <CharlaProvider>
        <CssBaseline />
        <Box className="chat-container">
          <ChatNavigation />
          <Box className="conversation-container">
            <ChatLog />
          </Box>
        </Box>
      </CharlaProvider>
    );
  } else if (user.email !== "yksun15@gmail.com") {
    return (
      <ErrorPage error={{ message: "We're working on welcoming new users!" }} />
    );
  } else {
    return (
      <ErrorPage error={{ message: "Please sign in or make an account" }} />
    );
  }
}
