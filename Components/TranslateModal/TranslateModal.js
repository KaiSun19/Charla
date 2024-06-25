import { useCharlaContext } from "@/Contexts/UserContext";
import {
  Box,
  Typography,
  IconButton,
  Modal,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Button,
} from "@mui/material";
import React, { useState, useEffect, useRef } from "react";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { convertClassname } from "@/Utils";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const getLanguageCoding = (lang_full) => {
  switch (lang_full) {
    case "english":
      return "en";
    case "spanish":
      return "es";
  }
};

export default function TranslateModal({ modalOpen, handleModalClose, text }) {
  const { mobile, userDetails, setUserInput } = useCharlaContext();

  const [translation, setTranslation] = useState("");
  const [sourceLang, setSourceLang] = useState("");
  const [targetLang, setTargetLang] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (userDetails) {
      setSourceLang(userDetails["knows_languages"][0]);
      setTargetLang(userDetails["learning_languages"][0]);
    }
  }, [userDetails]);

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

  useEffect(() => {
    async function translateText(text, sourceLang, targetLang, testing) {
      setIsLoading(true);
      const response = await fetch("/api/translateText", {
        headers: {
          "Content-Type": "application/json",
        },
        method: "POST",
        body: JSON.stringify({
          text: text,
          sourceLang: sourceLang,
          targetLang: targetLang,
          testing: testing,
        }),
      });
      const { translatedText } = await response.json();
      setIsLoading(false);
      return translatedText;
    }
    if (text && modalOpen) {
      translateText(
        text,
        getLanguageCoding(sourceLang),
        getLanguageCoding(targetLang),
        false,
      ).then((translation) => {
        setTranslation(translation);
      });
    }
  }, [text, modalOpen, sourceLang, targetLang]);

  //logic for language select setters

  const handleSourceLangChange = (event) => {
    setSourceLang(event.target.value);
  };

  const handleTargetLangChange = (event) => {
    setTargetLang(event.target.value);
  };

  const handleReplaceText = () => {
    setUserInput((currentInput) => {
      return currentInput.replace(text, translation);
    });
    handleModalClose();
  };

  return (
    <Modal open={modalOpen} onClose={handleModalClose}>
      <Box sx={style}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #c8c8c8",
            pb: 2,
          }}
        >
          <Typography variant="h5" color="primary">
            {text}
          </Typography>
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
        <Stack
          direction="row"
          justifyContent="flex-start"
          alignItems="center"
          spacing={3}
          sx={{ margin: "1rem 0 1rem 0" }}
        >
          <Box>
            <InputLabel>From</InputLabel>
            <Select
              value={sourceLang}
              label="Source"
              onChange={handleSourceLangChange}
            >
              {userDetails &&
                userDetails["knows_languages"]
                  .concat(userDetails["learning_languages"])
                  .map((lang) => {
                    return <MenuItem value={lang}>{lang}</MenuItem>;
                  })}
            </Select>
          </Box>
          <Box>
            <InputLabel>To</InputLabel>
            <Select
              value={targetLang}
              label="Target"
              onChange={handleTargetLangChange}
            >
              {userDetails &&
                userDetails["knows_languages"]
                  .concat(userDetails["learning_languages"])
                  .map((lang) => {
                    return <MenuItem value={lang}>{lang}</MenuItem>;
                  })}
            </Select>
          </Box>
        </Stack>
        <Typography variant="body1" color="primary" sx={{ mt: 2 }}>
          Translation
        </Typography>
        {isLoading ? (
          <Box
            mt={2}
            sx={
              mobile
                ? { width: "100px", height: "22px" }
                : { width: "250px", height: "33px" }
            }
          >
            <Skeleton height={mobile ? "22px" : "33px"} />
          </Box>
        ) : (
          <Typography variant="body1" sx={{ mt: 2 }}>
            {translation}
          </Typography>
        )}
        <Button
          variant="outlined"
          sx={{ marginTop: "1rem" }}
          onClick={handleReplaceText}
        >
          Replace
        </Button>
      </Box>
    </Modal>
  );
}
