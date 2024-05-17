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
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import Message from "../Message/Message";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import UnfoldMoreRoundedIcon from "@mui/icons-material/UnfoldMoreRounded";
import RestartAltRoundedIcon from "@mui/icons-material/RestartAltRounded";
import ChatNavigation from "../ChatNavigation/ChatNavigation";
import { useTheme } from "@emotion/react";
import CreateChatModal from "../CreateChatModal/CreateChatModal";
import TranslateModal from "../TranslateModal/TranslateModal";

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

  return (
    <>
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
              <IconButton>
                <MoreHorizRoundedIcon
                  sx={{ color: "#929292", width: "30px", height: "30px" }}
                />
              </IconButton>
            </Box>
            <Accordion className="chat-log-accordion" disableGutters={true}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
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
                  <Typography variant="body1">Show messages</Typography>
                  <Switch defaultChecked color="primary" />
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
                currentConversation.chat.map((message, index) => (
                  <Message
                    ref={
                      index === currentConversation.chat.lastUpdatedMessage
                        ? lastUpdatedMessageRef
                        : null
                    }
                    key={`message-${index}`}
                    Index={index}
                    Message={message}
                    // Saved={message["Saved"]}
                    // SavedIndex={message["SavedIndex"]}
                    // Errors={message["Errors"]}
                    // ErrorIndex={message["ErrorIndex"]}
                  />
                ))}
              {charlaIsLoading && (
                // <Box sx={{}}>
                <Message Message={{ type: "Loading" }} />
                // </Box>
              )}
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
            <Button>Save</Button>
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
