import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useState, useEffect, useRef } from "react";
import { extractResponse, formatCompleteQuery, getCharlaReply } from "../Utils";
import {
  randomResponses,
  mockUserDetails,
  mockConversations,
} from "../Constants";

import { auth, db } from "../firebase";

import { doc, getDoc, setDoc } from "firebase/firestore";

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

  const [conversations, setConversations] = useState([]);

  const [userInput, setUserInput] = useState("");

  const [audioBlob, setAudioBlob] = useState(" ");

  const [language, setLanguage] = useState("es");

  const [hasUpdatedErrorsIndex, setHasUpdatedErrorsIndex] = useState(false);

  const [navOpen, setNavOpen] = useState(false);

  const [currentConversation, setCurrentConversation] = useState(null);

  const [charlaIsLoading, setCharlaIsLoading] = useState(false);

  const [testAudio, setTestAudio] = useState(null);

  const [chatSettings, setChatSettings] = useState({
    showMessages: true,
    playbackSpeed: 1,
  });

  // for checking to see if chat settings has been changed
  const [prevChatSettings, setPrevChatSettings] = useState(null);

  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState("");

  const [userIsLoading, setUserisLoading] = useState(true);

  useEffect(() => {
    //this gets fired whenever a user signs in or refreshes
    const unsubscribe = auth.onAuthStateChanged(
      async (user) => {
        setUser(user);
        if (!testing && user) {
          const userRef = doc(db, "userDetails", user.email); // Document reference based on email
          const docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            const conversationsRef = doc(
              db,
              "conversations",
              docSnap.data().id,
            );
            const conversationsSnap = await getDoc(conversationsRef);
            if (conversationsSnap.exists()) {
              setConversations(conversationsSnap.data().conversations);
              if (conversationsSnap.data().conversations.length > 0) {
                setCurrentConversation(
                  conversationsSnap.data().conversations[1],
                );
              }
            }
          }
        } else {
          setUserDetails(mockUserDetails);
          setConversations(mockConversations);
          setCurrentConversation(mockConversations[0]);
        }
        setUserisLoading(false);
      },
      (error) => {
        console.log(error);
      },
    );

    return unsubscribe; // Cleanup function to prevent memory leaks
  }, []);

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

    fetchData();
  }, []);

  const handleNav = () => {
    setNavOpen(!navOpen);
  };

  const handleConversationsUpdate = (updatedConversations) => {
    setConversations(updatedConversations);
    setCurrentConversation(updatedConversations[0]);
  };
  // args -> index : convetsation index ; message : message to add ; messageIndex : message index within conversation.chat
  const createUpdatedConversations = (...args) => {
    let updatedConversations = conversations;
    for (let i = 0; i < args.length; i++) {
      console.log(args[i]);
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
            lastUpdatedMessage: messageIndex,
          },
          ...updatedConversations.slice(0, index),
          ...updatedConversations.slice(index + 1),
        ];
      } else {
        updatedConversations = [
          {
            ...updatedConversations[index],
            chat: [...updatedConversations[index].chat, message],
            lastUpdatedMessage: updatedConversations[index].chat.length,
          },
          ...updatedConversations.slice(0, index),
          ...updatedConversations.slice(index + 1),
        ];
      }
    }
    return updatedConversations;
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

  const deleteConversation = (lastAttempted) => {
    console.log(
      conversations.filter(
        (conversation) =>
          conversation.chat_details.last_attempted !== lastAttempted,
      ),
    );
    // handleConversationsUpdate(
    //   conversations.filter(
    //     (conversation, index) => index !== conversationIndex,
    //   ),
    // );
    return;
  };

  useEffect(() => {
    if (conversations.length > 0) {
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
            const { responseMessage, updatedUserMessage } =
              await getCharlaReply(testing, currentChat, conversations);
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

  const fetchAudio = async (message) => {
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
    async function updateDatabase() {
      await setDoc(doc(db, "conversations", userDetails.id), {
        id: userDetails.id,
        conversations: conversations,
      });
    }
    if (conversations.length > 0) {
      updateDatabase();
    }
  }, [conversations]);

  useEffect(() => {
    console.log(conversations);
  }, [conversations]);

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
        userDetails,
        setUserDetails,
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
        deleteConversation,
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
        user,
        userIsLoading,
        userInput,
        setUserInput,
      }}
    >
      {children}
    </CharlaContext.Provider>
  );
};
