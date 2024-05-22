import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  OutlinedInput,
  CssBaseline,
} from "@mui/material";
import React, { useState, useContext, useRef } from "react";
import { CharlaProvider, useCharlaContext } from "@/Contexts/UserContext";

import { useSignInWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/router";

export default function SignIn() {
  const { mobile } = useCharlaContext();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  let error = useRef(false);

  const [signInWithEmailAndPassword] = useSignInWithEmailAndPassword(auth);

  let router = useRouter();

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const res = await signInWithEmailAndPassword(email, password);
    console.log({ res });
    if (res) {
      router.push("/");
      setEmail("");
      setPassword("");
    } else {
      error.current = true;
    }
  };

  return (
    <CharlaProvider>
      <CssBaseline />
      <Box className="sign-in-container">
        <Typography variant="h4" component="h1">
          Sign In
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            error={error.current ? true : false}
            label="Email"
            type="email"
            value={email}
            onChange={handleEmailChange}
            margin="normal"
            fullWidth
            required
          />
          <TextField
            error={error.current ? true : false}
            label="Password"
            type="password"
            value={password}
            onChange={handlePasswordChange}
            margin="normal"
            fullWidth
            required
          />
          {error.current && (
            <Typography variant="body2" color="error">
              Invalid credentials
            </Typography>
          )}
          <Button variant="contained" color="primary" type="submit" fullWidth>
            Sign In
          </Button>
          <Stack direction="row" spacing={2} alignItems="center" mt={2}>
            <Typography variant="body2">Need to sign up?</Typography>
            <Button variant="outlined" href="/sign-up">
              Sign Up
            </Button>
          </Stack>
        </form>
      </Box>
    </CharlaProvider>
  );
}
