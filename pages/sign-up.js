import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CssBaseline,
} from "@mui/material";
import React, { useRef, useState } from "react";
import { CharlaProvider, useCharlaContext } from "@/Contexts/UserContext";

import { useCreateUserWithEmailAndPassword } from "react-firebase-hooks/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";

import { useRouter } from "next/router";

import { createUser } from "@/Utils";

export default function SignUp() {
  const { mobile, setUserDetails } = useCharlaContext();

  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");

  const [createUserWithEmailAndPassword] =
    useCreateUserWithEmailAndPassword(auth);

  let error = useRef(false);

  const handleUsernameChange = (event) => {
    setUsername(event.target.value);
  };

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const res = await createUserWithEmailAndPassword(email, password);
    console.log({ res });
    if (res) {
      const userDetails = createUser(username, email);
      await setDoc(doc(db, "userDetails", `${email}`), userDetails);
      console.log(userDetails.id);
      await setDoc(doc(db, "conversations", userDetails.id), {
        id: userDetails.id,
        conversations: [],
      });
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
      <Box className="sign-up-container">
        <Typography variant="h4" component="h1">
          Sign Up
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            error={error.current ? true : false}
            label="Username"
            type="username"
            value={username}
            onChange={handleUsernameChange}
            margin="normal"
            fullWidth
            required
          />
          <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
            <Box sx={{ width: "50%" }}>
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
            </Box>
            <Box sx={{ width: "50%" }}>
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
            </Box>
          </Stack>
          {error.current && (
            <Typography variant="body2" color="error">
              Invalid format
            </Typography>
          )}
          <Button
            variant="contained"
            color="primary"
            type="submit"
            className="sign-up-button"
          >
            Sign Up
          </Button>
          <Stack direction="row" spacing={2} alignItems="center" mt={2}>
            <Typography variant="body2">Already have an account?</Typography>
            <Button variant="outlined" href="/sign-in">
              Sign In
            </Button>
          </Stack>
        </form>
      </Box>
    </CharlaProvider>
  );
}
