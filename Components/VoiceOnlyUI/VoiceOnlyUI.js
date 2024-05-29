import { useCharlaContext } from "@/Contexts/UserContext";
import { Box, Stack } from "@mui/material";
import React, { useState, useEffect } from "react";

import "react-loading-skeleton/dist/skeleton.css";

import { useTheme } from "@emotion/react";

export default function VoiceOnlyUI({ count, duration, isPlaying }) {
  const heights = [25, 12, 36, 18, 9, 36, 6, 30, 17, 36];

  const theme = useTheme();

  // State to track the current block index
  const [currentBlock, setCurrentBlock] = useState(0);

  useEffect(() => {
    if (isPlaying) {
      setCurrentBlock(0); // Reset the current block index when recording starts
      const interval = (duration / count) * 1000; // Time interval for each block to change color

      const timer = setInterval(() => {
        setCurrentBlock((prev) => {
          if (prev < count) {
            return prev + 1;
          } else {
            clearInterval(timer); // Clear the interval when all blocks are updated
            return prev;
          }
        });
      }, interval);

      return () => clearInterval(timer); // Clean up the interval on component unmount
    }
  }, [isPlaying, count, duration]);

  return (
    <>
      <Box className="voice-only-ui-container">
        <Stack spacing={0.5} direction={"row"} alignItems="center">
          {Array(count)
            .fill()
            .map((_, i) => (
              <Box
                key={`voice-only-char-${i}`}
                sx={{
                  width: "7px",
                  height: `${heights[i % heights.length]}px`,
                  backgroundColor:
                    i < currentBlock // if index of block is below or the same as the currentBlock then block has main color
                      ? theme.palette.primary.main
                      : theme.palette.primary.light,
                  borderRadius: "5px",
                }}
              ></Box>
            ))}
        </Stack>
      </Box>
    </>
  );
}
