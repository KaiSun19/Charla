import { useCharlaContext } from "@/Context";
import { Box, Typography, Button, IconButton } from "@mui/material";
import React, { useState } from "react";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputAdornment from "@mui/material/InputAdornment";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { convertClassname } from "@/Utils";
import CreateChatModal from "../CreateChatModal/CreateChatModal";

export default function ChatNavigation() {
  const { conversations, mobile, handleNav, setCurrentConversation } =
    useCharlaContext();

  const [modalOpen, setModalOpen] = useState(false);

  const handleModalClose = () => {
    setModalOpen(false);
  };

  return (
    <Box className={`${convertClassname(mobile, "chat-nav-container", true)}`}>
      <CreateChatModal
        modalOpen={modalOpen}
        handleModalClose={handleModalClose}
      />
      {mobile && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
            marginBottom: "-5%",
          }}
        >
          <IconButton
            onClick={() => {
              handleNav();
            }}
          >
            <CloseRoundedIcon />
          </IconButton>
        </Box>
      )}
      <OutlinedInput
        placeholder=""
        className="outlined-input record-input"
        color="primary"
        // value={userInput}
        // onChange={handleUserInput}
        endAdornment={
          <InputAdornment position="end">
            <SearchRoundedIcon />
          </InputAdornment>
        }
        sx={{
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            border: "1px solid #292929",
          },
        }}
      />
      <Button
        variant="outlined"
        color="inherit"
        className="chat-navigation-button"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Start a chat here
      </Button>
      {conversations.map((conversation, index) => {
        return (
          <Box
            className="chat-nav-item"
            onClick={() => {
              setCurrentConversation(conversation);
            }}
            key={`chat-nav-item-${index}`}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="h6">{conversation.title}</Typography>
              <IconButton>
                <DeleteRoundedIcon color="error" />
              </IconButton>
            </Box>
            <Typography variant="body1">
              {conversation.chat[conversation.chat.length - 1].message}
            </Typography>
          </Box>
        );
      })}
    </Box>
  );
}
