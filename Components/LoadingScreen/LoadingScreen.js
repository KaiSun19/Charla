import { useCharlaContext } from "@/Contexts/UserContext";
import { Box, Stack } from "@mui/material";
import React, { useState } from "react";

import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import { CssBaseline } from "@mui/material";

export default function LoadingScreen() {
  const { mobile } = useCharlaContext();

  return (
    <>
      <CssBaseline />
      <Box className="loading-screen-container">
        <Stack spacing={3} sx={{ width: "22%" }}>
          <Skeleton baseColor="#c8c8c891" height={210} />
          <Skeleton baseColor="#c8c8c891" height={70} />
          <Skeleton baseColor="#c8c8c891" height={70} />
          <Skeleton baseColor="#c8c8c891" height={70} />
        </Stack>
        <Stack spacing={3} sx={{ width: "22%" }}>
          <Skeleton baseColor="#c8c8c891" height={70} />
          <Skeleton baseColor="#c8c8c891" height={70} />
          <Skeleton baseColor="#c8c8c891" height={70} />
          <Skeleton baseColor="#c8c8c891" height={210} />
        </Stack>
      </Box>
    </>
  );
}
