import { Box } from "@mui/material";
import React from "react";

import { CssBaseline } from "@mui/material";

export default function LoadingEllipsis({ count }) {
  const items = Array.from({ length: count }, (_, i) => i);

  return (
    <>
      <CssBaseline />
      <Box className="loading-ellipsis-container">
        {items.map((i) => {
          return (
            <Box
              key={`loading-ellipsis-item-${i}`}
              className="loading-ellipsis-item"
              style={{ animationDelay: `${i * 0.3}s` }}
            ></Box>
          );
        })}
      </Box>
    </>
  );
}
