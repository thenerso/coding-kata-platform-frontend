import { Box, Button, CircularProgress, TextField } from "@mui/material";
import { useState } from "react";

import { IUser } from "../../../interfaces/user";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { Check } from "@mui/icons-material";

interface ICreateMemberProps {
  members: IUser[];
  setMembers: (member: IUser[]) => void;
}

const CreateMember = ({ members, setMembers }: ICreateMemberProps) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [joinDate, setStartDate] = useState<Dayjs | null>(dayjs());

  const [usernameError, setUsernameError] = useState("");
  const [emailError, setEmailError] = useState("");

  const [loading, setLoading] = useState(false);

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

    // Some start date validation? Maybe not necessary

    return passed;
  };

  const submit = () => {
    if (handleValidation()) {
      setLoading(true);
      const newMember = {
        username,
        email,
        joinDate: dayjs(joinDate).format("YYYY-MM-DD"),
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
    <div>
      <h2>Members</h2>
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
        <TextField
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
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="DD/MM/YYYY"
            value={joinDate}
            onChange={(e: Dayjs | null) => setStartDate(e)}
            renderInput={(params) => <TextField {...params} />}
          />
        </LocalizationProvider>
        <br />
        <Button
          color="secondary"
          variant="contained"
          onClick={submit}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} /> : <Check />}
        >
          Create
        </Button>
      </Box>
    </div>
  );
};
export default CreateMember;
