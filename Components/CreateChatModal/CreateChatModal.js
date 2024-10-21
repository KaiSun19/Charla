import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  OutlinedInput,
  InputAdornment,
  Button,
  Stack,
  Grid,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import ArrowUpwardRounded from "@mui/icons-material/ArrowUpwardRounded";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { convertClassname, extractConversationStarters } from "@/Utils";
import { modalStyle } from "@/Constants";
import { useTheme } from "@emotion/react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CreateChatModal({ modalOpen, handleModalClose }) {
  const {
    mobile,
    createNewConversation,
    userDetails,
    savedPhrases,
    conversations,
    testing,
  } = useCharlaContext();

  const theme = useTheme();

  const [userInput, setUserInput] = useState("");
  const [conversationStarters, setConversationStarters] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

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

  const getUserInfo = () => {
    if (!userDetails) {
      return;
    }
    let { bio, interests } = userDetails;
    let information =
      "bio:" +
      bio +
      "interests:" +
      interests.join(",") +
      "Phrases saved in the past:" +
      savedPhrases.map((item) => item.translation).join(",") +
      "Conversation starters used in the past:" +
      conversations.map((item) => item.title);
    return information;
  };

  const handleStarterButtonClick = (question) => {
    setUserInput(question);
  };

  useEffect(() => {
    if (modalOpen && userDetails) {
      let user_info = getUserInfo();
      async function getConversationStarters(info) {
        setIsLoading(true);
        const response = await fetch("/api/conversationStarter", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            data: info,
            testing: testing,
          }),
        });
        const data = await response.json();
        setConversationStarters(
          extractConversationStarters(data.result.choices[0].message.content)
        );
        setIsLoading(false);
      }
      getConversationStarters(user_info);
    }
  }, [modalOpen, userDetails]);

  useEffect(() => {
    console.log(conversationStarters);
  }, [conversationStarters]);

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
      <Box sx={{ ...modalStyle, ...(mobile ? { width: "80%" } : {}) }}>
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography variant="h5">Start a chat</Typography>
          <IconButton
            onClick={() => {
              handleModalClose();
            }}
          >
            <CloseRoundedIcon
              className={`${convertClassname(
                mobile,
                "icon-button"
              )} close-button`}
            />
          </IconButton>
        </Box>
        <OutlinedInput
          className="outlined-input record-input"
          placeholder="Write what you want to talk about here"
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
        {isLoading ? (
          <Stack
            direction="column"
            justifyContent="center"
            alignItems="flex-start"
            spacing={1}
            sx={{ paddingTop: "32px", width: mobile ? "100%" : "70%" }}
          >
            <Box
              sx={
                mobile
                  ? { width: "100px", height: "22px" }
                  : { width: "250px", height: "33px" }
              }
            >
              <Skeleton height={mobile ? "22px" : "33px"} />
            </Box>
          </Stack>
        ) : (
          <Grid
            container
            spacing={1}
            direction="row"
            justifyContent="flex-start"
            alignItems="center"
            sx={{ paddingTop: "32px", width: mobile ? "100%" : "70%" }}
          >
            {conversationStarters.map((question, i) => {
              return (
                <Grid item xs={6}>
                  <Button
                    key={`starter-question-${i}`}
                    className="starter-question-button"
                    sx={{ border: `1px solid ${theme.palette.divider} ` }}
                    variant="text"
                    color="inherit"
                    onClick={() => {
                      handleStarterButtonClick(question);
                    }}
                    isDisabled={userInput === question ? true : false}
                  >
                    {question}
                  </Button>
                </Grid>
              );
            })}
          </Grid>
        )}
      </Box>
    </Modal>
  );
}
