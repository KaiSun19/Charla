import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import {
  extractResponse,
  formatCompleteQuery,
  parseCharlaResponse,
} from "./Utils";
import {
  mockMessages,
  mockUser,
  mockUserInitials,
  coffeeCompletionQuery,
  randomResponses,
} from "./Constants";

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

  const coffeeChat = coffeeCompletionQuery.messages
    .slice(1)
    .map((message, index) => {
      let response = extractResponse(message.content);
      let type = message.role === "assistant" ? "Charla" : "User";
      return {
        type: type,
        message: response,
        saved: [],
        errors: [],
      };
    });

  const [conversations, setConversations] = useState([
    {
      title: "¿Cómo estuvo tu día ayer? ",
      chat: mockMessages,
      chat_details: {
        last_attempted: "07/01/2023",
        average_chat_time: "342",
        average_word_count: "150",
      },
    },
    {
      title: "Un cafe, por favor",
      chat: coffeeChat,
      chat_details: {
        last_attempted: "07/01/2023",
        average_chat_time: "342",
        average_word_count: "150",
      },
    },
  ]);

  const [audioBlob, setAudioBlob] = useState(" ");

  const [language, setLanguage] = useState("es");

  const [hasUpdatedErrorsIndex, setHasUpdatedErrorsIndex] = useState(false);

  const [navOpen, setNavOpen] = useState(false);

  const [currentConversation, setCurrentConversation] = useState(
    conversations[0],
  );

  const [charlaIsLoading, setCharlaIsLoading] = useState(false);

  const [testAudio, setTestAudio] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (mode === "testing") {
        const text =
          "Normalmente, como es muy tarde en la noche, patino solo. Pero si tengo planes, patinaré con mis amigos";
        const response = await fetch("/api/textToVoice", {
          headers: {
            "Content-Type": "application/json",
          },
          method: "POST",
          body: JSON.stringify({
            text: text,
          }),
        });
        const { audioContent } = await response.json();
        const mp3Data = `data:audio/mp3;base64,${audioContent}`;
        setTestAudio(mp3Data);
      }
    }

    fetchData(); // Call the function here
  }, []);

  const handleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleConversationsUpdate = (index, message, messageIndex) => {
    const existingMessageIndex = messageIndex;
    if (existingMessageIndex !== -1) {
      const updatedConversations = [
        ...conversations.slice(0, index),
        {
          ...conversations[index],
          chat: [
            ...conversations[index].chat.slice(0, existingMessageIndex),
            { ...conversations[index].chat[existingMessageIndex], ...message },
            ...conversations[index].chat.slice(existingMessageIndex + 1),
          ],
        },
        ...conversations.slice(index + 1),
      ];
      setConversations(updatedConversations);
      setCurrentConversation(updatedConversations[index]);
    } else {
      const updatedConversations = [
        ...conversations.slice(0, index),
        {
          ...conversations[index],
          chat: [...conversations[index].chat, message],
        },
        ...conversations.slice(index + 1),
      ];
      setConversations(updatedConversations);
      setCurrentConversation(updatedConversations[index]);
    }
  };

  const addToChat = (text, conversation) => {
    let index = conversations.findIndex((item) => item === conversation);
    if (index !== -1) {
      const newMessage = {
        type: "User",
        message: text,
        saved: [],
        errors: [],
      };
      handleConversationsUpdate(index, newMessage, -1);
    } else {
      console.warn(`Conversation with title : ${conversation.title} not found`);
    }
  };

  const getCharlaReply = async (chat) => {
    let query = formatCompleteQuery(chat);
    let responseMessage;
    if (mode === "testing") {
      const randomResponse =
        randomResponses[Math.floor(Math.random() * randomResponses.length)];
      //TODO: when moving onto storing conversations in a database, the message object should only have an id pointing to a saved blob object in the database that contains the the audio content
      responseMessage = {
        type: "Charla",
        message: randomResponse,
        audio: testAudio,
        saved: [],
        errors: [],
      };
    } else {
      let retry = false;
      let retryCount = 0;
      do {
        try {
          const response = await fetch("/api/chatCompletion", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              messages: query.messages,
            }),
          });
          const data = await response.json();
          const { Errors, Response } = parseCharlaResponse(
            data.result.choices[0].message.content,
          );
          retry = false;
          responseMessage = {
            type: "Charla",
            message: Response,
            audio: testAudio,
            saved: [],
            errors: Errors,
          };
        } catch (error) {
          console.error(error);
          console.log(retryCount);
          if (retryCount < 3) {
            retryCount++;
            retry = true;
          } else {
            return;
          }
        }
      } while (retry);
    }
    return responseMessage;
  };

  useEffect(() => {
    if (
      conversations.length > 0 &&
      conversations[conversations.indexOf(currentConversation)].chat[
        conversations[conversations.indexOf(currentConversation)].chat.length -
          1
      ].type === "User" &&
      !charlaIsLoading
    ) {
      (async () => {
        //TODO: figure out how to code in a small timeout as a function then place in getCharlaReply to remove setTimeout
        setTimeout(async () => {
          setCharlaIsLoading(true);
          // setTimeout(async () => {// timeout during testing to see the loading state
          const responseMessage = await getCharlaReply(
            conversations[conversations.indexOf(currentConversation)].chat,
            conversations.indexOf(currentConversation),
          );
          console.log(responseMessage);
          handleConversationsUpdate(
            conversations.indexOf(currentConversation),
            responseMessage,
            -1,
          );
          setCharlaIsLoading(false);
          // }, 3000);
        }, 500);
      })();
    }
  }, [conversations]);

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

  const fetchAudio = async (message, messageIndex) => {
    const text = message.message;
    const response = await fetch("/api/textToVoice", {
      headers: {
        "Content-Type": "application/json",
      },
      method: "POST",
      body: JSON.stringify({
        text: text,
      }),
    });
    const { audioContent } = await response.json();
    const mp3Data = `data:audio/mp3;base64,${audioContent}`;
    const responseMessage = { ...message, audio: mp3Data };
    return responseMessage;
  };

  useEffect(() => {
    console.log(conversations);
  }, [conversations]);

  return (
    <CharlaContext.Provider
      value={{
        mode,
        desktop,
        tablet,
        mobile,
        audioBlob,
        setAudioBlob,
        language,
        mockUser,
        mockUserInitials,
        hasUpdatedErrorsIndex,
        setHasUpdatedErrorsIndex,
        conversations,
        setConversations,
        handleConversationsUpdate,
        navOpen,
        setNavOpen,
        handleNav,
        currentConversation,
        setCurrentConversation,
        addToChat,
        charlaIsLoading,
        testAudio,
        setTestAudio,
        fetchAudio,
      }}
    >
      {children}
    </CharlaContext.Provider>
  );
};
