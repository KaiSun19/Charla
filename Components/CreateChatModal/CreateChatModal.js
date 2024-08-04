import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  OutlinedInput,
  InputAdornment,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { convertClassname } from "@/Utils";
import { modalStyle } from "@/Constants";

export default function CreateChatModal({ modalOpen, handleModalClose }) {
  const { mobile, createNewConversation } = useCharlaContext();

  const [userInput, setUserInput] = useState("");

  const handleUserInput = (event) => {
    setUserInput(event.target.value);
  };

  const handleUserSend = () => {
    if (userInput) {
      createNewConversation(userInput);
      setUserInput("");
      handleModalClose();
    }
  };

  const sendButton = (
    <IconButton
      onClick={() => {
        handleUserSend();
      }}
    >
      <ArrowUpwardRounded
        className={`${convertClassname(mobile, "icon-button")}`}
        color="primary"
      />
    </IconButton>
  );

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <Box sx={modalStyle}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">Start a chat</Typography>
          <IconButton
            onClick={() => {
              handleModalClose();
            }}
          >
            <CloseRoundedIcon
              className={`${convertClassname(mobile, "icon-button")} close-button`}
            />
          </IconButton>
        </Box>
        <Typography sx={{ mt: 2 }}>
          Write what you want to talk about here
        </Typography>
        <OutlinedInput
          className="outlined-input record-input"
          color="primary"
          value={userInput}
          onChange={handleUserInput}
          endAdornment={
            <InputAdornment position="end">{sendButton}</InputAdornment>
          }
          sx={{
            marginTop: 4,
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
              border: "1px solid #292929",
            },
          }}
        />
      </Box>
    </Modal>
  );
}
