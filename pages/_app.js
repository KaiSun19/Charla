import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import * as React from "react";

import useMediaQuery from "@mui/material/useMediaQuery";

import { Box } from "@mui/material";
import "../Components/Header/HeaderStyles.css";
import "../Components/Record/RecordStyles.css";
import "../Components/ChatLog/ChatLogStyles.css";
import "../Components/Message/MessageStyles.css";
import "../Components/ChatNavigation/ChatNavigationStyles.css";
import "../Components/CreateChatModal/CreateChatModalStyles.css";

import Header from "../Components/Header/Header";
import { CharlaProvider } from "@/Contexts/UserContext";

export default function App({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#6573C3",
          },
          secondary: {
            main: "#f50057",
          },
        },
      }),
    [prefersDarkMode],
  );

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
