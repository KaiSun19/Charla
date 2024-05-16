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
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import { convertClassname } from "@/Utils";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

export default function TranslateModal({ modalOpen, handleModalClose, text }) {
  const { mobile } = useCharlaContext();

  const [translation, setTranslation] = useState("example translation");
  const [isLoading, setIsLoading] = useState(false);
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 700,
    bgcolor: "background.paper",
    border: "1px solid #c8c8c8",
    boxShadow: 24,
    p: 4,
    borderRadius: 1,
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
      translateText(text, "es", "en", false).then((translation) => {
        setTranslation(translation);
      });
    }
  }, [text, modalOpen]);

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
      </Box>
    </Modal>
  );
}
