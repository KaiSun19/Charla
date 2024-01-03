import "@/styles/globals.css";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "../Components/Header/HeaderStyles.css";
import "../Components/Record/RecordStyles.css";
import "../Components/Chat/ChatStyles.css";
import "../Components/Message/MessageStyles.css";
import Header from "../Components/Header/Header";

const theme = createTheme({
  palette: {
    primary: {
      main: "#242128",
      light: "#39343f",
      dark: "#1a181d",
    },
    secondary: {
      main: "#f50057",
    },
  },
});

export default function App({ Component, pageProps }) {
  return (
    <ThemeProvider theme={theme}>
      <Header />
      <Component {...pageProps} />
    </ThemeProvider>
  );
}
