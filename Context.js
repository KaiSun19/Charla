import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

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

  const [audioBlob, setAudioBlob] = useState(" ");

  const mockMessages = [
    {
      Type: "Charla",
      Message:
        "¿Cómo estuvo tu día ayer? ¿Hiciste algo especial? Me gustaría saber",
    },
    {
      Type: "User",
      Message:
        "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia también. antes yo dormí, lo haré práctico patinaje.",
    },
    {
      Type: "Charla",
      Message:
        "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
    },
    {
      Type: "User",
      Message:
        "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mis amigos",
    },
  ];

  return (
    <CharlaContext.Provider
      value={{
        desktop,
        tablet,
        mobile,
        audioBlob,
        setAudioBlob,
        mockMessages,
      }}
    >
      {children}
    </CharlaContext.Provider>
  );
};
