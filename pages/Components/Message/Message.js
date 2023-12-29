import { useCharlaContext } from "@/Context";
import { Box, Typography } from "@mui/material";
import React, { useState } from "react";
import PersonOutlineRoundedIcon from "@mui/icons-material/PersonOutlineRounded";
import PersonRoundedIcon from "@mui/icons-material/PersonRounded";

export default function Message({ Type, Message }) {
  const { mockMessages } = useCharlaContext();

  return (
    <Box className="message-container">
      <PersonOutlineRoundedIcon />
      <Box
        className="message-text-container"
        sx={{ backgroundColor: Type === "User" ? "#39343F" : "#242128" }}
      >
        <Typography variant="body1">{Message}</Typography>
      </Box>
    </Box>
  );
}
