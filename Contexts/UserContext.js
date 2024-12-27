import { useMediaQuery, useTheme } from "@mui/material";
import React, { useContext, useState, useEffect, useCallback } from "react";
import { getAllSaved, getCharlaReply, getTranslations } from "../Utils";

import { auth, db } from "../firebase";

import { doc, getDoc, setDoc } from "firebase/firestore";
import { getLanguageCoding } from "@/Components/TranslateModal/TranslateModal";

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
  const [savedPhrases, setSavedPhrases] = useState([]);

  const [userInput, setUserInput] = useState("");

  const [audioBlob, setAudioBlob] = useState(" ");

  const [language, setLanguage] = useState("es");

  const [hasUpdatedErrorsIndex, setHasUpdatedErrorsIndex] = useState(false);

  const [currentConversation, setCurrentConversation] = useState(null);

  const [charlaIsLoading, setCharlaIsLoading] = useState(false);

  const [initialLoad, setInitialLoad] = useState(true);

  const [testAudio, setTestAudio] = useState(null);

  const [chatSettings, setChatSettings] = useState({
    showMessages: true,
    playbackSpeed: 1,
  });

  // for checking to see if chat settings has been changed
  const [prevChatSettings, setPrevChatSettings] = useState(null);

  //for opening chat nav drawer in desktop mode
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerInfo, setDrawerInfo] = useState("newConversation");
  const [drawerTitle, setDrawerTitle] = useState("New chat");

  const [chatNavDrawerMobileOpen, setChatNavDrawerMobileOpen] = useState(false);

  const [user, setUser] = useState(null);
  const [userDetails, setUserDetails] = useState("");

  const [userIsLoading, setUserisLoading] = useState(true);

  const handleDrawerOpen = (e, drawerType, drawerTitle) => {
    setDrawerTitle(drawerTitle);
    setDrawerInfo(drawerType);
    setDrawerOpen(!drawerOpen);
  };

  const handleMobileNavigationOpen = (e) => {
    e.preventDefault();
    setChatNavDrawerMobileOpen(!chatNavDrawerMobileOpen);
  };

  const handleConversationsUpdate = (updatedConversations) => {
    setConversations(updatedConversations);
    setCurrentConversation(updatedConversations[0]);
  };
  // args -> index : convetsation index ; message : message to add ; messageIndex : message index within conversation.chat
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
          conversation.chat_details.last_attempted !== lastAttempted
      )
    );
    // handleConversationsUpdate(
    //   conversations.filter(
    //     (conversation, index) => index !== conversationIndex,
    //   ),
    // );
    return;
  };

  const fetchAudio = async (text) => {
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
    const responseMessage = { audio: mp3Data };

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

  const updateUserDetails = (field, data) => {
    switch (field) {
      case "bio":
        setUserDetails((prev) => {
          return { ...prev, bio: data };
        });
        break;
      case "interests":
        setUserDetails((prev) => {
          console.log([...prev.interests, data]);
          return { ...prev, interests: [...prev.interests, data] };
        });
        break;
      case "interests-delete":
        setUserDetails((prev) => {
          const newInterests = prev.interests.filter(
            (interest) => interest !== data
          );
          return { ...prev, interests: newInterests };
        });
        break;
    }
  };

  const uploadUserDetailsFirebase = useCallback(async () => {
    try {
      await setDoc(doc(db, "userDetails", userDetails.email), {
        ...userDetails,
      });
      console.log("User details uploaded to Firebase!");
    } catch (error) {
      console.error("Error uploading user details to Firebase:", error);
    }
  }, [userDetails]);

  const deleteSavedPhrase = (conversation_index, message_index, phrase) => {
    const currentMessage =
      conversations[conversation_index].chat[message_index];
    const messageWithoutSavedPhrase = {
      ...currentMessage,
      saved: currentMessage.saved.filter((saved) => saved.text !== phrase),
    };
    const updatedConversations = createUpdatedConversations({
      index: conversation_index,
      message: messageWithoutSavedPhrase,
      messageIndex: message_index,
    });
    handleConversationsUpdate(updatedConversations);
  };

  useEffect(() => {
    //this gets fired whenever a user signs in or refreshes
    const unsubscribe = auth.onAuthStateChanged(
      async (currentUser) => {
        let docSnap;
        setUser(currentUser);
        if (!testing && currentUser) {
          const userRef = doc(db, "userDetails", currentUser.email);
          docSnap = await getDoc(userRef);
          if (docSnap.exists()) {
            setUserDetails(docSnap.data());
            const conversationsRef = doc(
              db,
              "conversations",
              docSnap.data().id
            );

            const conversationsSnap = await getDoc(conversationsRef);
            if (conversationsSnap.exists()) {
              setConversations(conversationsSnap.data().conversations);
              if (conversationsSnap.data().conversations.length > 0) {
                setCurrentConversation(
                  conversationsSnap.data().conversations[1]
                );
              }
            }

            const savedPhrasesRef = doc(db, "savedPhrases", docSnap.data().id);
            docSnap = await getDoc(savedPhrasesRef);
            if (docSnap.exists()) {
              setSavedPhrases(docSnap.data().saved_phrases);
            }
          }
        }
        setUserisLoading(false);
        setInitialLoad(false);
      },
      (error) => {
        console.log(error);
      }
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
                { index: 0, message: responseMessage, messageIndex: -1 }
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

  useEffect(() => {
    setCurrentConversation(conversations[0]);
  }, [conversations.length]);

  useEffect(() => {
    async function updateDatabaseConversations() {
      await setDoc(doc(db, "conversations", userDetails.id), {
        id: userDetails.id,
        conversations: conversations,
      });
    }

    async function updateDatabaseSavedPhrases() {
      let savedPhrasesCurrent = getAllSaved(conversations);
      if (
        savedPhrasesCurrent.length > 0 &&
        savedPhrases.length > 0 &&
        savedPhrasesCurrent.filter(
          ({ currentPhrase }) =>
            !savedPhrases.some(({ phrase }) => phrase === currentPhrase)
        )
      ) {
        const translations = await getTranslations(
          savedPhrasesCurrent.flatMap(({ phrase }) => phrase),
          getLanguageCoding(userDetails["learning_languages"][0]),
          getLanguageCoding(userDetails["knows_languages"][0])
        );
        savedPhrasesCurrent = savedPhrasesCurrent.map((phrase, i) => {
          return { ...phrase, translation: translations[i] };
        });
        setSavedPhrases(savedPhrasesCurrent);
      }
    }
    if (conversations.length > 0) {
      updateDatabaseConversations();
      updateDatabaseSavedPhrases();
    }
  }, [conversations]);

  const uploadSavedPhrases = useCallback(async () => {
    await setDoc(doc(db, "savedPhrases", userDetails.id), {
      id: userDetails.id,
      saved_phrases: savedPhrases,
    });
  }, [savedPhrases]);

  useEffect(() => {
    if (savedPhrases.length > 0 && userDetails.id) {
      console.log(savedPhrases);
      uploadSavedPhrases();
    }
  }, [savedPhrases]);

  useEffect(() => {
    if (userDetails.email && !initialLoad) {
      uploadUserDetailsFirebase();
    }
  }, [userDetails, uploadUserDetailsFirebase]);

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
        updateUserDetails,
        hasUpdatedErrorsIndex,
        setHasUpdatedErrorsIndex,
        conversations,
        setConversations,
        savedPhrases,
        setSavedPhrases,
        createUpdatedConversations,
        handleConversationsUpdate,
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
        deleteSavedPhrase,
        drawerOpen,
        drawerInfo,
        drawerTitle,
        handleDrawerOpen,
        chatNavDrawerMobileOpen,
        setChatNavDrawerMobileOpen,
        handleMobileNavigationOpen,
      }}
    >
      {children}
    </CharlaContext.Provider>
  );
};
