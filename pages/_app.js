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
import "../Components/ErrorPage/ErrorPageStyles.css";
import "../Components/TranslateModal/TranslateModalStyles.css";
import "../Components/LoadingScreen/LoadingScreenStyles.css";
import "../Components/VoiceOnlyUI/VoiceOnlyUIStyles.css";
import "../Components/LoadingEllipsis/LoadingEllipsisStyles.css";
import "../styles/profile.css";
import "../styles/dictionary.css";

import Header from "../Components/Header/Header";
import { CharlaProvider } from "@/Contexts/UserContext";

export const ThemePaletteModeContext = React.createContext({
  toggleThemePaletteMode: () => {},
});

export default function App({ Component, pageProps }) {
  const isSystemDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [themePaletteMode, setThemePaletteMode] = React.useState(
    isSystemDarkMode ? "dark" : "light",
  );

  const themePaletteModeContextProvider = React.useMemo(
    () => ({
      toggleThemePaletteMode: () => {
        setThemePaletteMode((prevMode) =>
          prevMode === "light" ? "dark" : "light",
        );
      },
    }),
    [],
  );

  const themeProvider = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: themePaletteMode,
          primary: {
            main: "#6573C3",
            light: "#6573c39c",
          },
          secondary: {
            main: "#f50057",
          },
        },
      }),
    [themePaletteMode],
  );
  return (
    <CharlaProvider>
      <ThemePaletteModeContext.Provider value={themePaletteModeContextProvider}>
        <ThemeProvider theme={themeProvider}>
          <Box className="app-container">
            <Header />
            <Component {...pageProps} />
          </Box>
        </ThemeProvider>
      </ThemePaletteModeContext.Provider>
    </CharlaProvider>
  );
}
