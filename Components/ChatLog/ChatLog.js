import { useCharlaContext } from "@/Context";
import {
  Box,
  Typography,
  IconButton,
  Drawer,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormGroup,
  FormControlLabel,
  Switch,
  Slider,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import Message from "../Message/Message";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ChatNavigation from "../ChatNavigation/ChatNavigation";
import { useTheme } from "@emotion/react";

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
    mobile,
    navOpen,
    handleNav,
    charlaIsLoading,
    setChatSettings,
    setPrevChatSettings,
  } = useCharlaContext();

  const theme = useTheme();

  const lastMessageRef = useRef(null);

  const [sliderValue, setSliderValue] = useState(1);
  const handleSliderChange = (event, newValue) => {
    setSliderValue(newValue);
  };

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
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
        <Box
          sx={{ backgroundColor: theme.palette.background.paper }}
          className="chat-log-title"
        >
          {mobile && (
            <IconButton
              onClick={() => {
                handleNav();
              }}
            >
              <MenuRoundedIcon
                sx={{ color: "#929292", width: "30px", height: "30px" }}
              />
            </IconButton>
          )}
          <Typography variant={mobile ? "h6" : "h4"}>
            {currentConversation.title}
          </Typography>
          <IconButton>
            <MoreHorizRoundedIcon
              sx={{ color: "#929292", width: "30px", height: "30px" }}
            />
          </IconButton>
        </Box>
        <Accordion className="chat-log-accordion" disableGutters={true}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
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
          {currentConversation.chat.map((message, index) => (
            <Message
              ref={
                index === currentConversation.chat.length - 1
                  ? lastMessageRef
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
      </Box>
    </>
  );
}
