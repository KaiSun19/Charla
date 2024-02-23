import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { Box } from "@mui/material";
import "../Components/Header/HeaderStyles.css";
import "../Components/Record/RecordStyles.css";
import "../Components/ChatLog/ChatLogStyles.css";
import "../Components/Message/MessageStyles.css";
import "../Components/ChatNavigation/ChatNavigationStyles.css";
import { CharlaProvider } from "@/Context";

import Header from "../Components/Header/Header";

const theme = createTheme({
  palette: {},
});

export default function App({ Component, pageProps }) {
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
