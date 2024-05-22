import React from "react";
import { Typography, Button, Box } from "@mui/material"; // Import for Material-UI Typography

function ErrorPage({ error }) {
  return (
    <div className="error-page">
      <Typography variant="h4" component="h1">
        Error
      </Typography>
      <Box className="error-content">
        {error && <Typography variant="body1">{error.message}</Typography>}
        <Button variant="contained" href="/">
          Go back to Home
        </Button>
      </Box>
    </div>
  );
}

export default ErrorPage;
