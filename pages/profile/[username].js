import { useCharlaContext } from "@/Contexts/UserContext";
import { Box, Typography, IconButton, Stack, TextField } from "@mui/material";
import CreateRoundedIcon from "@mui/icons-material/CreateRounded";
import DoneRoundedIcon from "@mui/icons-material/DoneRounded";

import React, { useEffect, useState, useRef } from "react";
import { useTheme } from "@emotion/react";

export default function Profile() {
  const { userDetails, updateUserDetails, mobile } = useCharlaContext();

  const bio = useRef;

  const [editFields, setEditFields] = useState([{ field: "bio", edit: false }]);

  const handleEditToggle = (field) => {
    setEditFields((prev) => {
      return prev.map((item) =>
        item.field === field ? { ...item, edit: !item.edit } : item,
      );
    });
  };

  const theme = useTheme();

  return (
    <Stack
      className="profile-container"
      direction="row"
      justifyContent="center"
      alignItems="center"
      spacing={2}
    >
      <Box className="profile-hero">
        <Typography
          variant={!mobile ? "h1" : "h3"}
          sx={{
            color: theme.palette.primary.main,
            ...(mobile && { marginTop: "1rem" }),
          }}
        >
          Welcome back,
        </Typography>
        <Typography
          variant={!mobile ? "h2" : "h4"}
          sx={{
            color: theme.palette.primary.main,
            marginTop: mobile ? "3rem" : "1rem",
          }}
        >
          {userDetails.username}
        </Typography>
      </Box>
      <Box className="profile-details">
        <Box>
          <Typography variant="h6" sx={{ fontWeight: "bold" }}>
            Email :
          </Typography>
          <Typography variant="body1">{userDetails.email}</Typography>
        </Box>
        <Box>
          <Stack direction="row" justifyContent="start" alignItems="center">
            {editFields.find((item) => item.field === "bio")["edit"] ? (
              <IconButton
                onClick={() => {
                  updateUserDetails("bio", bio.current);
                  handleEditToggle("bio");
                }}
              >
                <DoneRoundedIcon />
              </IconButton>
            ) : (
              <IconButton onClick={() => handleEditToggle("bio")}>
                <CreateRoundedIcon />
              </IconButton>
            )}
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Introduction :
            </Typography>
          </Stack>
          {editFields.find((item) => item.field === "bio")["edit"] ? (
            <TextField
              multiline
              sx={!mobile && { width: "50%" }}
              placeholder={userDetails.bio}
              onChange={(event) => {
                bio.current = event.target.value;
              }}
            />
          ) : (
            <Typography variant="body1">{userDetails.bio}</Typography>
          )}
        </Box>
      </Box>
    </Stack>
  );
}
