import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useEffect, useState, useRef } from "react";

const CharlaContext = React.createContext(); // creates a context

export function useCharlaContext() {
  return useContext(CharlaContext);
}

export const CharlaProvider = ({ children }) => {
  // different display size listeners
  const theme = useTheme();
  const desktop = useMediaQuery(theme.breakpoints.up("md"));
  const tablet = useMediaQuery(theme.breakpoints.between("xs", "md"));
  const mobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [audioBlob, setAudioBlob] = useState(null);

  const mediaStream = useRef(null);

  useEffect(() => {
    console.log(audioBlob);
  }, [audioBlob]);

  return (
    <CharlaContext.Provider
      value={{
        desktop,
        tablet,
        mobile,
        audioBlob,
        setAudioBlob,
        mediaStream,
      }}
    >
      {children}
    </CharlaContext.Provider>
  );
};
