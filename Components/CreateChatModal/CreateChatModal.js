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
import SendRoundedIcon from "@mui/icons-material/SendRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { convertClassname } from "@/Utils";

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

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    bgcolor: "background.paper",
    border: "1px solid #c8c8c8",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
    ...(mobile
      ? {
          width: "80%",
        }
      : {
          width: 700,
        }),
  };

  const sendButton = (
    <IconButton
      onClick={() => {
        handleUserSend();
      }}
    >
      <SendRoundedIcon
        className={`${convertClassname(mobile, "icon-button")} send-button`}
      />
    </IconButton>
  );

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <Box sx={style}>
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
