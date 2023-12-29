import { Box, TextField, Typography, styled } from "@mui/material";

export const WhiteTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "white",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "white",
    },
    "&:hover fieldset": {
      borderColor: "white",
    },
    "&.Mui-focused fieldset": {
      borderColor: "white",
    },
  },
});

export const NoColorTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "#26232b",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#26232b",
    },
    "&:hover fieldset": {
      borderColor: "#26232b",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#26232b",
    },
  },
});
