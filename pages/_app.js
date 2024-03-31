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
import { CharlaProvider } from "@/Context";

import Header from "../Components/Header/Header";

export default function App({ Component, pageProps }) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          // palette: {
          //   // Light mode colors
          //   light: {
          //     primary: {
          //       main: "#3F51B5",
          //     },
          //     secondary: {
          //       main: "#f50057",
          //     },
          //   },
          //   // Dark mode colors
          //   dark: {
          //     primary: {
          //       main: "#3F51B5",
          //     },
          //     secondary: {
          //       main: "#f50057",
          //     },
          //   },
          // },
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
