import { useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { Check } from "@mui/icons-material";
import styled from "@emotion/styled";

import authService from "../../services/authService";
import { Link } from "react-router-dom";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

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
        const res = await authService.signin(username, password);
        console.log(res);
        if (res.roles && res.roles[0] === "ADMIN") {
          navigate("/admin/dashboard");
        } else if(res.roles && res.roles[0] === "CLIENT") {
          navigate("/client/dashboard");
        } else navigate("/dashboard");
      } catch (err: any) {
        setError(err.message ? err.message : "Server Error");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Card>
        <CardHeader title="Sign in" />
        <StyledCardContent>
          <TextField
            variant="standard"
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
            variant="standard"
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

          <Typography variant="caption">
            Don't remember your password?{" "}
            <Link to={"/forget-password"}>Forgot Password</Link>
          </Typography>
        </StyledCardContent>
        <CardActions>
          <Button
            color="secondary"
            variant="contained"
            onClick={submit}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={18} /> : <Check />}
          >
            Login
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default Login;
