import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";

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

  const [language, setLanguage] = useState("es");

  const [hasUpdatedErrorsIndex, setHasUpdatedErrorsIndex] = useState(false);

  const mockUser = {
    name: "Yuankai Sun",
    dateJoined: "14/01/2024",
  };

  const mockUserInitials = mockUser.name
    .match(/\b\w/g)
    .join(",")
    .replace(",", "");

  const mockMessages = [
    {
      Type: "Charla",
      Message:
        "¿Cómo estuvo tu día ayer? ¿Hiciste algo especial? Me gustaría saber",
      Saved: ["ayer", "¿Hiciste algo especial?"],
      SavedIndex: [],
    },
    {
      Type: "User",
      Message:
        "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia tambne. antes yo dormí, lo haré práctico patinaje.",
      Saved: [],
      SavedIndex: [],
      Errors: [
        {
          Phrase: "tambne",
          Error: "The correct word should be también",
          Correction: "también",
        },
      ],
      ErrorIndex: [],
    },
    {
      Type: "Charla",
      Message:
        "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
      Saved: ["suena"],
      SavedIndex: [],
    },
    {
      Type: "User",
      Message:
        "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mi amigas",
      Saved: [],
      SavedIndex: [],
      Errors: [
        {
          Phrase: "mi",
          Error: "The translation for my should be in plural",
          Correction: "mis",
        },
        {
          Phrase: "amigas",
          Error: "The translation for friends should be masculine",
          Correction: "amigos",
        },
      ],
      ErrorIndex: [],
    },
    {
      Type: "Charla",
      Message:
        "Ah entiendio! Entonces, ¿patinas en tu ciudad o patinas alrededor de tu casa?",
      Saved: ["alrededor de tu casa"],
      SavedIndex: [],
    },
    {
      Type: "User",
      Message: "Normalmente patinamos en lugares donde no ayer mucha gente.",
      Saved: [],
      SavedIndex: [],
      Errors: [
        {
          Phrase: "ayer",
          Error: "ayer is yesterday the correct word should be hay",
          Correction: "hay",
        },
      ],
      ErrorIndex: [],
    },
    {
      Type: "Charla",
      Message:
        "¿Cómo estuvo tu día ayer? ¿Hiciste algo especial? Me gustaría saber",
      Saved: ["ayer", "¿Hiciste algo especial?"],
      SavedIndex: [],
    },
    {
      Type: "User",
      Message:
        "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia también. antes yo dormí, lo haré práctico patinaje.",
      Saved: [],
      SavedIndex: [],
      Errors: [],
      ErrorIndex: [],
    },
    {
      Type: "Charla",
      Message:
        "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
      Saved: ["suena"],
      SavedIndex: [],
    },
    {
      Type: "User",
      Message:
        "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mis amigos",
      Saved: [],
      SavedIndex: [],
      Errors: [],
      ErrorIndex: [],
    },
    {
      Type: "Charla",
      Message:
        "Ah entiendio! Entonces, ¿patinas en tu ciudad o patinas alrededor de tu casa?",
      Saved: ["alrededor de tu casa"],
      SavedIndex: [],
    },
    {
      Type: "User",
      Message: "Normalmente patinamos en lugares donde no hay mucha gente.",
      Saved: [],
      SavedIndex: [],
      Errors: [],
      ErrorIndex: [],
    },
    {
      Type: "User",
      Message:
        "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia también. antes yo dormí, lo haré práctico patinaje.",
      Saved: [],
      SavedIndex: [],
      Errors: [],
      ErrorIndex: [],
    },
    {
      Type: "Charla",
      Message:
        "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
      Saved: ["suena"],
      SavedIndex: [],
    },
    {
      Type: "User",
      Message:
        "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mis amigos",
      Saved: [],
      SavedIndex: [],
      Errors: [],
      ErrorIndex: [],
    },
  ];

  const [mockConversation, setMockConversation] = useState({
    title: "¿Cómo estuvo tu día ayer? ",
    conversation: mockMessages,
    chat_details: {
      last_attempted: "07/01/2023",
      average_chat_time: "342",
      average_word_count: "150",
    },
  });

  mockConversation.conversation.map((message) => {
    if (
      message["Saved"].length > 0 &&
      message["Saved"].length > message["SavedIndex"].length
    ) {
      message["Saved"].map((saved) => {
        const savedStartIndex = message["Message"].indexOf(saved);
        message["SavedIndex"].push([
          savedStartIndex,
          savedStartIndex + saved.length,
        ]);
      });
    }
    if (
      message["Errors"] &&
      message["Errors"].length > 0 &&
      message["Errors"].length > message["ErrorIndex"].length
    ) {
      message["Errors"].map((errors) => {
        const errorsStartIndex = message["Message"].indexOf(errors["Phrase"]);
        message["ErrorIndex"].push([
          errorsStartIndex,
          errorsStartIndex + errors["Phrase"].length,
        ]);
      });
    }
    return message;
  });

  return (
    <CharlaContext.Provider
      value={{
        desktop,
        tablet,
        mobile,
        audioBlob,
        setAudioBlob,
        mockConversation,
        language,
        mockUser,
        mockUserInitials,
        setMockConversation,
        hasUpdatedErrorsIndex,
        setHasUpdatedErrorsIndex,
      }}
    >
      {children}
    </CharlaContext.Provider>
  );
};
