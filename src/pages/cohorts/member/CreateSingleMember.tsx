import {
  Button,
  CardActions,
  CardContent,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  FormGroup,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Check } from "@mui/icons-material";
import styled from "@emotion/styled";
import { ICreateBulkMember } from "./CreateMemberWrapper";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const CreateSingleMember = ({
  members,
  setMembers,
  startDate,
}: ICreateBulkMember) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  const [customJoinDate, setCustomJoinDate] = useState(true);
  const [joinDate, setStartDate] = useState<Dayjs | null>(dayjs());

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleValidation = () => {
    let passed = true;

    if (username === "") {
      setUsernameError("Name cannot be blank");
      passed = false;
    } else setUsernameError("");

    if (username.length < 3) {
      setUsernameError("Username must be at least 3 characters");
      passed = false;
    } else setUsernameError("");

    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Not a valid email");
      passed = false;
    } else setEmailError("");

    const memberIndex = members.findIndex((member) => {
      return member.username === username || member.email === email;
    });

    if (memberIndex !== -1) {
      setError("Member username and email must be unique");
      passed = false;
    } else setError("");

    return passed;
  };

  const submit = () => {
    if (handleValidation()) {
      setLoading(true);
      const newMember = {
        username,
        email,
        joinDate: customJoinDate
          ? startDate?.format("YYYY-MM-DD")
          : dayjs(joinDate).format("YYYY-MM-DD"),
        roles: ["USER"],
      };
      setMembers([...members, newMember]);
      setUsername("");
      setEmail("");
      setStartDate(dayjs());
      setLoading(false);
    }
  };

  return (
    <>
      <StyledCardContent>
        <TextField
          variant="standard"
          name="username"
          label="Username"
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
          name="email"
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          error={emailError !== ""}
          helperText={emailError}
        />
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="DD/MM/YYYY"
            value={customJoinDate ? startDate : joinDate}
            disabled={customJoinDate}
            onChange={(e: Dayjs | null) => setStartDate(e)}
            renderInput={(params) => (
              <TextField variant="standard" {...params} />
            )}
          />
        </LocalizationProvider>

        <FormGroup>
          <FormControlLabel
            control={<Checkbox defaultChecked />}
            onChange={() => setCustomJoinDate(!customJoinDate)}
            value={customJoinDate}
            label="Same start date as Cohort"
          />
        </FormGroup>

        <br />

        <Typography variant="caption" color="error">
          {error}
        </Typography>
      </StyledCardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={submit}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} /> : <Check />}
        >
          Add
        </Button>
      </CardActions>
    </>
  );
};
export default CreateSingleMember;
