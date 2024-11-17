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
import React, { useState, useEffect } from "react";
import ArrowForwardIosRoundedIcon from '@mui/icons-material/ArrowForwardIosRounded';
import { convertClassname, extractConversationStarters } from "@/Utils";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function CreateChatModal() {
  const {
    mobile,
    createNewConversation,
    userDetails,
    savedPhrases,
    conversations,
    testing,
  } = useCharlaContext();

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
    if (userDetails) {
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
  }, []);

  const sendButton = (
    <IconButton
      onClick={() => {
        handleUserSend();
      }}
    >
      <ArrowForwardIosRoundedIcon
        className={mobile ? "icon-s" : "icon-m"}
        color="primary"
      />
    </IconButton>
  );

  return (
    <Box>
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
          spacing={3}
          sx={{
            justifyContent: "flex-start",
            alignItems: "center",
            marginTop : '1rem'
          }}
        >
          {
            [0,0,0,0].map((i) =>{
              return(<Skeleton height={mobile ? "22px" : "33px"} width="250px" />
            )})
          }
        </Stack>
      ) : (
        <Grid
          container
          spacing={1}
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          sx={{ paddingTop: "32px", width: '100%', justifyContent: "flex-start", alignItems: "flex-start"}}
        >
          {conversationStarters.map((question, i) => {
            return (
              <Grid item xs={12} md={6}>
                <Button
                  key={`starter-question-${i}`}
                  className="starter-question-button"
                  sx={{ border: `1px solid #0000001f` }}
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
  );
}
