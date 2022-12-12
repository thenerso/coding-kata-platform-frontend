import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

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

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const token = window.location.search.split("token=")[1];

  const handleValidation = () => {
    let passed = true;

    if (password !== confirmPassword) {
      setPasswordError("Passwords do not match");
      setConfirmPasswordError("Passwords do not match");
      passed = false;
    } else {
      setPasswordError("");
      setConfirmPasswordError("");
    }

    if (password === "") {
      setPasswordError("Password cannot be blank");
      passed = false;
    } else setPasswordError("");

    if (password.length < 6) {
      setPasswordError("Password must be at least 6 characters");
      passed = false;
    } else setPasswordError("");

    if (confirmPassword === "") {
      setConfirmPasswordError("Confirm Password cannot be blank");
      passed = false;
    } else setConfirmPasswordError("");
    if (confirmPassword.length < 6) {
      setConfirmPasswordError("Confirm Password must be at least 6 characters");
      passed = false;
    } else setConfirmPasswordError("");

    return passed;
  };

  const submit = async () => {
    if (handleValidation()) {
      setError("");
      setLoading(true);
      const body = {
        secret: token,
        userId: id,
        newPassword: password,
      };
      try {
        await authService.resetPassword(body);

        navigate("/login");
      } catch (err: any) {
        setError(err.message ? err.message : "Server Error");
        setLoading(false);
      }
    }
  };

  return (
    <>
      <Card component="form">
        <CardHeader title="Reset Password" />
        <StyledCardContent>
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
          <TextField
            variant="standard"
            name="confirmPassword"
            label="Confirm Password"
            type="password"
            margin="normal"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            error={confirmPasswordError !== ""}
            helperText={confirmPasswordError}
          />

          <Typography variant="caption" color="error">
            {error}
          </Typography>

          <Typography variant="caption">
            Already know your password? <Link to={"/login"}>Login</Link>
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
            ResetPassword
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ResetPassword;
