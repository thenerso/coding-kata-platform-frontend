import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  Box,
  Button,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Check } from "@mui/icons-material";

import authService from "../../services/authService";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleValidation = () => {
    let passed = true;

    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      passed = false;
    } else setUsernameError("");

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      passed = false;
    } else setPasswordError("");

    return passed;
  };

  const submit = async () => {
    if (handleValidation()) {
      setError("");
      setLoading(true);
      try {
        const response = await authService.signin(username, password);

        if (response?.userId) {
          navigate("/profile");
          return;
        }
        setError(response.message ? response.message : "Server Error");
        setLoading(false);
      } catch (err: any) {
        setError(err.message ? err.message : "Server Error");
        setLoading(false);
      }
    }
  };

  return (
    <Box component="form">
      <TextField
        name="username"
        label="Username"
        autoFocus={true}
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        error={usernameError !== ""}
        helperText={usernameError}
      />
      <br />
      <TextField
        name="password"
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && submit()}
        error={passwordError !== ""}
        helperText={passwordError}
      />

      <br />

      <Typography variant="caption" color="error">
        {error}
      </Typography>
      <br />
      <Button
        color="secondary"
        variant="contained"
        onClick={submit}
        disabled={loading}
        endIcon={loading ? <CircularProgress size={18} /> : <Check />}
      >
        Login
      </Button>
      <br />
      <Link to="/">Home</Link>
    </Box>
  );
};

export default Login;
