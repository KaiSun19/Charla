import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fab,
  Switch,
  Slider,
  Button,
  ButtonGroup,
  Popover,
  Stack,
  Divider,
  Snackbar,
  Alert,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import Message from "../Message/Message";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ChatNavigation from "../ChatNavigation/ChatNavigation";
import { useTheme } from "@emotion/react";
import CreateChatModal from "../CreateChatModal/CreateChatModal";
import TranslateModal from "../TranslateModal/TranslateModal";
import Record from "../Record/Record";
import { findConversations, findStartEndIndex } from "@/Utils";

export default function ChatLog() {
  const sliderMarks = [
    {
      value: 0.2,
      label: "0.2",
    },
    {
      value: 0.4,
      label: "0.4",
    },
    {
      value: 0.6,
      label: "0.6",
    },
    {
      value: 0.8,
      label: "0.8",
    },
    {
      value: 1,
      label: "1",
    },
  ];

  const {
    conversations,
    currentConversation,
    handleConversationsUpdate,
    createUpdatedConversations,
    mobile,
    navOpen,
    handleNav,
    charlaIsLoading,
    setChatSettings,
    setPrevChatSettings,
  } = useCharlaContext();

  const theme = useTheme();

  const lastUpdatedMessageRef = useRef(null);

  const [sliderValue, setSliderValue] = useState(1);
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  const [createChatModalOpen, setCreateChatModalOpen] = useState(false);
  const [translateModalOpen, setTranslateModalOpen] = useState(false);

  const [highlightedText, setHighlightedText] = useState(null);

  const handleCreateChatModalClose = () => {
    setCreateChatModalOpen(false);
  };

  const handleTranslateModalClose = () => {
    setTranslateModalOpen(false);
  };

  useEffect(() => {
    if (lastUpdatedMessageRef.current) {
      lastUpdatedMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [conversations]);

  useEffect(() => {
    setChatSettings((chatSettings) => {
      setPrevChatSettings(chatSettings);
      return {
        ...chatSettings,
        playbackSpeed: sliderValue,
      };
    });
  }, [sliderValue]);

  const handleRestartChat = () => {
    let updatedConversation = {
      ...currentConversation,
      chat: [currentConversation.chat.shift()],
    };
    handleConversationsUpdate([updatedConversation, ...conversations.slice(1)]);
  };

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection.toString().trim() && selection.toString().trim() !== "") {
        setHighlightedText(selection.toString().trim());
      }
    };
    document.addEventListener("mouseup", handleSelectionChange);
    document.addEventListener("touchend", handleSelectionChange);
    // clean up function when this component gets destroyed
    return () => {
      document.removeEventListener("mouseup", handleSelectionChange);
      document.removeEventListener("touchend", handleSelectionChange);
    };
  }, []);

  //popover logic
  const [popoverAnchorEl, setPopoverAnchorEl] = useState(null);

  const handlePopoverClick = (event) => {
    setPopoverAnchorEl(event.currentTarget);
  };

  const handlePopoverClose = () => {
    setPopoverAnchorEl(null);
  };

  const popoverOpen = Boolean(popoverAnchorEl);

  // states and handlers for Chat Settings

  const [hideText, setHideText] = useState(false);

  const handleHideText = (e) => {
    setHideText(!hideText);
  };

  const [autoplay, setAutoplay] = useState(false);

  const handleAutoplay = (e) => {
    setAutoplay(!hideText);
  };

  const handleSavePhrase = () => {
    let matchingConversations = findConversations(
      highlightedText,
      conversations,
    );
    let messagesToAdd = [];
    matchingConversations.map(({ conversation, index }) => {
      //if highlightedText is already a saved phrase then skip
      if (
        conversation.chat[index].saved.some(
          ({ text }) => text === highlightedText,
        )
      ) {
        return;
      }
      let updatedMessage = conversation.chat[index];
      let [start, end] = findStartEndIndex(
        highlightedText,
        conversation.chat[index].message,
      );
      updatedMessage = {
        ...updatedMessage,
        saved: [
          ...updatedMessage.saved,
          {
            text: highlightedText,
            text_start: start,
            text_end: end,
          },
        ],
      };
      messagesToAdd.push({
        index: conversations.indexOf(conversation),
        message: updatedMessage,
        messageIndex: index,
      });
    });
    let updatedConversations = createUpdatedConversations(...messagesToAdd);
    handleConversationsUpdate(updatedConversations);
    handlePopoverClose();
    setSuccessAlertOpen(true);
  };

  const [successAlertOpen, setSuccessAlertOpen] = useState(false);

  const handleSuccessAlertClose = (e, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setSuccessAlertOpen(false);
  };

  return (
    <>
      <Snackbar
        open={successAlertOpen}
        onClose={handleSuccessAlertClose}
        autoHideDuration={3000}
      >
        <Alert onClose={handleSuccessAlertClose} severity="success">
          Saved.
        </Alert>
      </Snackbar>
      {mobile ? (
        <Drawer
          open={navOpen}
          onClose={() => {
            handleNav();
          }}
        >
          <ChatNavigation />
        </Drawer>
      ) : null}
      <Box className="chat-log-container">
        {conversations.length > 0 ? (
          <>
            <Box
              sx={{ backgroundColor: theme.palette.background.paper }}
              className="chat-log-title"
            >
              {mobile && (
                <IconButton onClick={handleNav}>
                  <MenuRoundedIcon
                    sx={{ color: "#929292", width: "30px", height: "30px" }}
                  />
                </IconButton>
              )}
              <Typography variant={mobile ? "h6" : "h4"}>
                {currentConversation && currentConversation.title}
              </Typography>
            </Box>
            <Accordion className="chat-log-accordion" disableGutters={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                sx={{ height: "6%" }}
              >
                <Typography variant={mobile ? "body1" : "h6"}>
                  Chat settings
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "flex-start",
                  flexDirection: "column",
                  gap: "16px",
                  width: "100%",
                }}
              >
                <Box className="chat-log-accordion-input">
                  <Stack
                    direction="row"
                    gap={1}
                    divider={<Divider orientation="vertical" flexItem />}
                  >
                    <Box className="flex-items-center">
                      <Typography variant="body1">Hide Text</Typography>
                      <Switch
                        color="primary"
                        checked={hideText}
                        onChange={handleHideText}
                      />
                    </Box>
                    <Box className="flex-items-center">
                      <Typography variant="body1">Autoplay Speech</Typography>
                      <Switch
                        color="primary"
                        checked={autoplay}
                        onChange={handleAutoplay}
                      />
                    </Box>
                  </Stack>
                </Box>
                <Box className="chat-log-accordion-input">
                  <Typography variant="body1">Set playback speed</Typography>
                  <Slider
                    value={typeof sliderValue === "number" ? sliderValue : 1}
                    onChange={handleSliderChange}
                    step={0.2}
                    marks={sliderMarks}
                    valueLabelDisplay="auto"
                    min={0.2}
                    max={1}
                    sx={{
                      marginRight: "16px",
                    }}
                  />
                </Box>
              </AccordionDetails>
            </Accordion>
            <Box className="chat-log-conversation">
              {currentConversation &&
                currentConversation.chat.map((message, index) => {
                  return (
                    <Message
                      ref={
                        index === currentConversation.lastUpdatedMessage
                          ? lastUpdatedMessageRef
                          : null
                      }
                      key={`message-${index}`}
                      Index={index}
                      Message={message}
                      Hide={hideText}
                      Autoplay={autoplay}
                    />
                  );
                })}
              {charlaIsLoading && <Message Message={{ type: "Loading" }} />}
            </Box>
          </>
        ) : (
          // state for no current conversation
          <Box
            sx={{
              backgroundColor: theme.palette.background.paper,
            }}
            className="flex-items-center chat-log-empty-conversations"
          >
            <Typography
              variant={mobile ? "h6" : "h4"}
              sx={{ color: "#929292" }}
            >
              No conversations
            </Typography>
            <Button
              variant="outlined"
              sx={{ width: "30%" }}
              onClick={() => {
                setCreateChatModalOpen(true);
              }}
            >
              Start a chat here
            </Button>
            <CreateChatModal
              modalOpen={createChatModalOpen}
              handleModalClose={handleCreateChatModalClose}
            />
          </Box>
        )}
        <Stack
          className="chat-log-action"
          sx={{
            backgroundImage: `linear-gradient(to top, ${theme.palette.background.default}, transparent)`,
          }}
        >
          <Box className="chat-log-action-buttons">
            <Fab
              color="primary"
              className="highlight-action-button"
              disabled={highlightedText === null}
              onClick={handlePopoverClick}
            >
              <UnfoldMoreRoundedIcon />
            </Fab>
            <Fab
              color="primary"
              className="restart-action-button"
              onClick={() => {
                handleRestartChat();
              }}
            >
              <RestartAltRoundedIcon />
            </Fab>
          </Box>

          <Record />
        </Stack>
        <Popover
          anchorOrigin={{
            vertical: "top",
            horizontal: "left",
          }}
          transformOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          open={popoverOpen}
          anchorEl={popoverAnchorEl}
          onClose={handlePopoverClose}
        >
          <ButtonGroup variant="contained">
            <Button
              onClick={() => {
                setTranslateModalOpen(true);
              }}
            >
              Translate
            </Button>
            <Button
              onClick={() => {
                handleSavePhrase();
              }}
            >
              Save
            </Button>
          </ButtonGroup>
        </Popover>
      </Box>
      <TranslateModal
        modalOpen={translateModalOpen}
        handleModalClose={handleTranslateModalClose}
        text={highlightedText}
      />
    </>
  );
}
