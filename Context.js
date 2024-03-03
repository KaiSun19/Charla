import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import { extractResponse } from "./Utils";

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

  const mode = "testing";

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
      type: "Charla",
      message:
        "¿Cómo estuvo tu día ayer? ¿Hiciste algo especial? Me gustaría saber",
      // Saved: [
      //   { text: "ayer", text_start: null, text_end: null },
      //   { text: "¿Hiciste algo especial?", text_start: null, text_end: null },
      // ],
    },
    {
      type: "User",
      message:
        "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia tambne. antes yo dormí, lo haré práctico patinaje.",
      // saved: [],
      // errors: [
      //   {
      //     text: "tambne",
      //     error: "The correct word should be también",
      //     correction: "también",
      //     text_start : null,
      //     text_end : null
      //   },
      // ],
    },
    {
      type: "Charla",
      message:
        "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
      // saved: ["suena"],
    },
    {
      type: "User",
      message:
        "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mi amigas",
      // saved: [],
      // errors: [
      //   {
      //     Phrase: "mi",
      //     Error: "The translation for my should be in plural",
      //     Correction: "mis",
      //   },
      //   {
      //     Phrase: "amigas",
      //     Error: "The translation for friends should be masculine",
      //     Correction: "amigos",
      //   },
      // ],
    },
    {
      type: "Charla",
      message:
        "Ah entiendio! Entonces, ¿patinas en tu ciudad o patinas alrededor de tu casa?",
      // saved: ["alrededor de tu casa"],
    },
    {
      type: "User",
      message: "Normalmente patinamos en lugares donde no ayer mucha gente.",
      // saved: [],
      // errors: [
      //   {
      //     Phrase: "ayer",
      //     Error: "ayer is yesterday the correct word should be hay",
      //     Correction: "hay",
      //   },
      // ],
    },
    {
      type: "Charla",
      message:
        "¿Cómo estuvo tu día ayer? ¿Hiciste algo especial? Me gustaría saber",
      // saved: ["ayer", "¿Hiciste algo especial?"],
    },
    {
      type: "User",
      message:
        "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia también. antes yo dormí, lo haré práctico patinaje.",
    },
    {
      type: "Charla",
      message:
        "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
      // saved: ["suena"],
    },
    {
      type: "User",
      message:
        "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mis amigos",
    },
    {
      type: "Charla",
      message:
        "Ah entiendio! Entonces, ¿patinas en tu ciudad o patinas alrededor de tu casa?",
      // saved: ["alrededor de tu casa"],
    },
    {
      type: "User",
      message: "Normalmente patinamos en lugares donde no hay mucha gente.",
    },
    {
      type: "User",
      message:
        "la mayor  de la tiempo, cuando vuelvo a casa , yo termino mi trabajo para la día, y entonces, cocino mi cina a veces para mí familia también. antes yo dormí, lo haré práctico patinaje.",
    },
    {
      type: "Charla",
      message:
        "Patinar en las calles suena muy divertido. Dime, ¿patinas solo o con amigos?",
      // saved: ["suena"],
    },
    {
      type: "User",
      message:
        "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mis amigos",
    },
  ];

  const coffeeCompletionQuery = {
    model: "gpt-4",
    messages: [
      {
        role: "system",
        content:
          "You are a spanish tutor. Your job is to carry on a conversation that I will start. I will set the scenario of the conversation in the first chat as the user and the initial chat I want you to reply to . You will reply in this format : Errors: Phrase : the phrase that is incorrect ; Error: why the phrase is incorrect ; Correction: the correct phrase  ; Response : your response in spanish . An example is this . My first prompt is 'I want to order a coffee from you. Hola, yo quiero comprar un cafe contigas.' Your reply should be : Errors : Phrase : 'contigas''; Error : 'you should use contigo to say with you instead' ; Correction: 'contigo'; Response: 'Claro. ¿Qué tipo de café quieres?' . ",
      },
      {
        role: "user",
        content:
          "You are a friendly barista that replies in a casual and simple tone and I want to order a coffee. Hola, como estas?",
      },
      {
        role: "assistant",
        content:
          "Errors: \nPhrase: N/A.\nError: N/A.\nCorrection: N/A.\nResponse: 'Hola, estoy bien, gracias. ¿Qué tipo de café te gustaría?'",
      },
    ],
  };

  const coffeeChat = coffeeCompletionQuery.messages.map((message) => {
    let response = extractResponse(message.content);
    let type = message.role === "assistant" ? "Charla" : "User";
    return {
      type: type,
      message: response,
    };
  });

  const [mockConversation, setMockConversation] = useState({
    title: "¿Cómo estuvo tu día ayer? ",
    chat: mockMessages,
    chat_details: {
      last_attempted: "07/01/2023",
      average_chat_time: "342",
      average_word_count: "150",
    },
  });

  const [coffeeConversation, setCoffeeConversation] = useState({
    title: "Un cafe, por favor",
    chat: coffeeChat.slice(2),
    chat_details: {
      last_attempted: "07/01/2023",
      average_chat_time: "342",
      average_word_count: "150",
    },
  });

  //TOOD: we have to add new convos to these arrays everytime we adda. new chat => only state should be an array holding every chat
  const conversations = [mockConversation, coffeeConversation];
  const conversationSetters = [setMockConversation, setCoffeeConversation];

  const [audioBlob, setAudioBlob] = useState(" ");

  const [language, setLanguage] = useState("es");

  const [hasUpdatedErrorsIndex, setHasUpdatedErrorsIndex] = useState(false);

  const [navOpen, setNavOpen] = useState(false);

  const [currentConversation, setCurrentConversation] = useState(
    conversations[0],
  );

  const handleNav = () => {
    setNavOpen(!navOpen);
  };

  const addToChat = (text, conversation) => {
    let index = conversations.findIndex((item) => item === conversation);
    conversationSetters[index]((current) => {
      let newChat = current.chat.push({
        type: "User",
        message: text,
        saved: [],
        errors: [],
      });
      return { ...current, newChat };
    });
  };

  // mockConversation.conversation.map((message) => {
  //   if (
  //     message["Saved"].length > 0 &&
  //     message["Saved"].length > message["SavedIndex"].length
  //   ) {
  //     message["Saved"].map((saved) => {
  //       const savedStartIndex = message["Message"].indexOf(saved);
  //       message["SavedIndex"].push([
  //         savedStartIndex,
  //         savedStartIndex + saved.length,
  //       ]);
  //     });
  //   }
  //   if (
  //     message["Errors"] &&
  //     message["Errors"].length > 0 &&
  //     message["Errors"].length > message["ErrorIndex"].length
  //   ) {
  //     message["Errors"].map((errors) => {
  //       const errorsStartIndex = message["Message"].indexOf(errors["Phrase"]);
  //       message["ErrorIndex"].push([
  //         errorsStartIndex,
  //         errorsStartIndex + errors["Phrase"].length,
  //       ]);
  //     });
  //   }
  //   return message;
  // });

  return (
    <CharlaContext.Provider
      value={{
        mode,
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
        coffeeCompletionQuery,
        conversations,
        navOpen,
        setNavOpen,
        handleNav,
        currentConversation,
        setCurrentConversation,
        addToChat,
      }}
    >
      {children}
    </CharlaContext.Provider>
  );
};
