import "@/styles/globals.css";
import * as React from "react";

import { Box } from "@mui/material";
import { ThemeProvider, createTheme } from '@mui/material/styles';
import "../Components/Header/HeaderStyles.css";
import "../Components/Record/RecordStyles.css";
import "../Components/ChatLog/ChatLogStyles.css";
import "../Components/Message/MessageStyles.css";
import "../Components/ChatNavigation/ChatNavigationStyles.css";
import "../Components/CreateChatModal/CreateChatModalStyles.css";
import "../Components/ErrorPage/ErrorPageStyles.css";
import "../Components/TranslateModal/TranslateModalStyles.css";
import "../Components/LoadingScreen/LoadingScreenStyles.css";
import "../Components/VoiceOnlyUI/VoiceOnlyUIStyles.css";
import "../Components/LoadingEllipsis/LoadingEllipsisStyles.css";
import "../styles/profile.css";
import "../styles/dictionary.css";

import Header from "../Components/Header/Header";
import { CharlaProvider } from "@/Contexts/UserContext";

export default function App({ Component, pageProps }) {

  const theme = createTheme({
    colorSchemes: {
      dark: true,
    },
  });

  return (
    <CharlaProvider>
      <ThemeProvider theme={theme}>
        <Box className="app-container">
          <Header />
          <Component {...pageProps} />
        </Box>
      </ThemeProvider>
    </CharlaProvider>
  );
}
