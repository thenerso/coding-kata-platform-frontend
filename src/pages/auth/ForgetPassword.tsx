import { useState } from "react";

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
import EmptyState from "../../components/EmptyState";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const ForgetPassword = () => {
  const [email, setEmail] = useState("");

  const [emailError, setEmailError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [successMessage, setSuccessMessage] = useState("");

  const handleValidation = () => {
    let passed = true;

    if (email === "") {
      setEmailError("Email cannot be blank");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Please enter a valid email");
      return false;
    }

    setEmailError("");

    return passed;
  };

  const submit = async () => {
    if (handleValidation()) {
      setError("");
      setLoading(true);
      try {
        const response = await authService.forgetPassword(email);

        setSuccessMessage(response.message);
        setLoading(false);
      } catch (err: any) {
        setError(err.message ? err.message : "Server Error");
        setLoading(false);
      }
    }
  };

  if (successMessage) return <EmptyState message={successMessage} />;
  return (
    <>
      <Card>
        <CardHeader title="Enter your email" />
        <StyledCardContent>
          <TextField
            variant="standard"
            name="email"
            label="Email"
            autoFocus={true}
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && submit()}
            error={emailError !== ""}
            helperText={emailError}
          />
          <br />

          <Typography variant="caption">
            Remember your password? <Link to={"/login"}>Sign in</Link>
          </Typography>
          <br />
          <Typography variant="caption" color="error">
            {error}
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
            Send
          </Button>
        </CardActions>
      </Card>
    </>
  );
};

export default ForgetPassword;
