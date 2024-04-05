import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useState, useEffect } from "react";
import {
  extractResponse,
  formatCompleteQuery,
  parseCharlaResponse,
  usePrevious,
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

  const testing = false;

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

  const [chatSettings, setChatSettings] = useState({
    showMessages: true,
    playbackSpeed: 1,
  });

  // for checking to see if chat settings has been changed
  const [prevChatSettings, setPrevChatSettings] = useState(null);

  useEffect(() => {
    async function fetchData() {
      if (testing) {
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

  const createUpdatedConversations = (...args) => {
    let updatedConversations = conversations;
    for (let i = 0; i < args.length; i++) {
      let { index, message, messageIndex } = args[i];
      let newChat;
      if (messageIndex !== -1) {
        newChat = [
          ...updatedConversations[index].chat.slice(0, messageIndex),
          { ...updatedConversations[index].chat[messageIndex], ...message },
          ...updatedConversations[index].chat.slice(messageIndex + 1),
        ];
        updatedConversations = [
          {
            ...updatedConversations[index],
            chat: newChat,
          },
          ...updatedConversations.slice(0, index),
          ...updatedConversations.slice(index + 1),
        ];
      } else {
        updatedConversations = [
          {
            ...updatedConversations[index],
            chat: [...updatedConversations[index].chat, message],
          },
          ...updatedConversations.slice(0, index),
          ...updatedConversations.slice(index + 1),
        ];
      }
    }
    return updatedConversations;
  };

  const handleConversationsUpdate = (updatedConversations) => {
    console.log("at handler");
    console.log(updatedConversations);
    setConversations(updatedConversations);
    setCurrentConversation(updatedConversations[0]);
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
      const updatedConversations = createUpdatedConversations({
        index: index,
        message: newMessage,
        messageIndex: -1,
      });
      handleConversationsUpdate(updatedConversations);
    } else {
      console.warn(`Conversation with title : ${conversation.title} not found`);
    }
  };

  const getCharlaReply = async (chat) => {
    let query = formatCompleteQuery(chat);
    let updatedUserMessage = {
      ...conversations[0].chat[conversations[0].chat.length - 1],
    };
    let responseMessage;
    if (testing) {
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
          if (Errors.length > 0) {
            updatedUserMessage = {
              ...updatedUserMessage,
              errors: Errors,
            };
          }
          responseMessage = {
            type: "Charla",
            message: Response,
            audio: null,
            saved: [],
            errors: [],
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
    //responseMessage = the message charla replies with
    //updatedUserMessage = if the user made a mistake, then the message updates with errors, if not then its the same message
    return { responseMessage, updatedUserMessage };
  };

  useEffect(() => {
    const currentChat = conversations[0].chat;
    if (
      conversations.length > 0 &&
      currentChat[currentChat.length - 1].type === "User" &&
      !charlaIsLoading
    ) {
      (async () => {
        //TODO: figure out how to code in a small timeout as a function then place in getCharlaReply to remove setTimeout
        setTimeout(async () => {
          setCharlaIsLoading(true);
          // setTimeout(async () => {// timeout during testing to see the loading state
          const { responseMessage, updatedUserMessage } = await getCharlaReply(
            currentChat,
            conversations[0],
          );
          if (updatedUserMessage.errors.length > 0) {
            let updatedConversations = createUpdatedConversations(
              {
                index: 0,
                message: updatedUserMessage,
                messageIndex: conversations[0].chat.length - 1,
              },
              { index: 0, message: responseMessage, messageIndex: -1 },
            );
            handleConversationsUpdate(updatedConversations);
          } else {
            let updatedConversations = createUpdatedConversations({
              index: 0,
              message: responseMessage,
              messageIndex: -1,
            });
            handleConversationsUpdate(updatedConversations);
          }
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
        testing: testing,
        speakingRate: chatSettings.playbackSpeed,
      }),
    });
    const { audioContent } = await response.json();
    const mp3Data = `data:audio/mp3;base64,${audioContent}`;
    const responseMessage = { ...message, audio: mp3Data };

    // settings prev chat settings to match current settings
    setPrevChatSettings(chatSettings);
    return responseMessage;
  };

  const createNewConversation = (userInput) => {
    setConversations((prevConversations) => [
      {
        title: userInput,
        chat: [{ type: "User", message: userInput, saved: [], errors: [] }],
        chat_details: {
          last_attempted: new Date(),
          average_chat_time: 0,
          average_word_count: 0,
        },
      },
      ...prevConversations,
    ]);
  };

  useEffect(() => {
    setCurrentConversation(conversations[0]);
  }, [conversations.length]);

  useEffect(() => {
    console.log(conversations);
  }, [conversations]);

  useEffect(() => {
    console.log("chatSettings", chatSettings);
    console.log("prevChatSettings", prevChatSettings);
  }, [chatSettings]);

  return (
    <CharlaContext.Provider
      value={{
        testing,
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
        createUpdatedConversations,
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
        createNewConversation,
        chatSettings,
        setChatSettings,
        prevChatSettings,
        setPrevChatSettings,
      }}
    >
      {children}
    </CharlaContext.Provider>
  );
};
