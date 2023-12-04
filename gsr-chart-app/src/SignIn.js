// SignIn.js
import React, { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "./firebase";
import {
  TextField,
  Button,
  Paper,
  Box,
  Typography,
  Container,
} from "@mui/material";

const SignIn = ({ onSignIn }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSignIn = async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      onSignIn(); // Inform the parent component about the successful sign-in
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Paper elevation={6} style={{ padding: "20px" }}>
        <Box
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="center"
        >
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          <form onSubmit={handleSignIn} style={{ marginTop: "1rem" }}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Email Address"
              autoComplete="email"
              autoFocus
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              label="Password"
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              color="primary"
              style={{ marginTop: "24px" }}
            >
              Sign In
            </Button>
            {error && <Typography color="error">{error}</Typography>}
          </form>
        </Box>
      </Paper>
    </Container>
  );
};

export default SignIn;
