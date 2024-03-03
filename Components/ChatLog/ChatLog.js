import { useCharlaContext } from "@/Context";
import { Box, Typography, IconButton, Drawer } from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import Message from "../Message/Message";
import MoreHorizRoundedIcon from "@mui/icons-material/MoreHorizRounded";
import MenuRoundedIcon from "@mui/icons-material/MenuRounded";
import ChatNavigation from "../ChatNavigation/ChatNavigation";

export default function ChatLog() {
  const {
    coffeeConversation,
    mockConversation,
    currentConversation,
    mobile,
    navOpen,
    handleNav,
  } = useCharlaContext();

  const lastMessageRef = useRef(null);

  useEffect(() => {
    if (lastMessageRef.current) {
      lastMessageRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [coffeeConversation, mockConversation]);

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
        <Box className="chat-log-title">
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
              Type={message["type"]}
              Message={message["message"]}
              // Saved={message["Saved"]}
              // SavedIndex={message["SavedIndex"]}
              // Errors={message["Errors"]}
              // ErrorIndex={message["ErrorIndex"]}
            />
          ))}
        </Box>
      </Box>
    </>
  );
}
