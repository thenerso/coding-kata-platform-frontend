import { Check } from "@mui/icons-material";
import {
  Box,
  TextField,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";

import dayjs, { Dayjs } from "dayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import cohortServices from "../../services/cohortService";
import Members from "./member/Members";
import { ICohort } from "../../interfaces/cohort";
import { IUser } from "../../interfaces/user";

const CreateCohort = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());

  const [members, setMembers] = useState<IUser[]>([]);

  const [nameError, setNameError] = useState("");
  // const [startDateError, setStartDateError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleValidation = () => {
    let passed = true;

    if (name === "") {
      setNameError("Name cannot be blank");
      passed = false;
    } else setNameError("");

    // Some start date validation? Maybe not necessary

    return passed;
  };

  const submit = async () => {
    const token = authService.getAccessToken();

    if (token) {
      if (handleValidation()) {
        const body: ICohort = {
          name,
          startDate: dayjs(startDate).format("YYYY-MM-DD"),
          members,
        };
        setError("");
        setLoading(true);
        try {
          const response = await cohortServices.create(token, body);

          if (response?.id) {
            navigate(`/cohorts/${response?.id}`);
            return;
          }
          setError(response.message ? response.message : "Server Error");
          setLoading(false);
        } catch (err: any) {
          setError(err.message ? err.message : "Server Error");
          setLoading(false);
        }
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  };

  return (
    <>
      <p>Create</p>
      <Box component="form">
        <TextField
          name="name"
          label="Name"
          autoFocus={true}
          margin="normal"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          error={nameError !== ""}
          helperText={nameError}
        />
        <br />
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="DD/MM/YYYY"
            value={startDate}
            onChange={(e: Dayjs | null) => setStartDate(e)}
            renderInput={(params) => (
              <TextField
                {...params}
                // error={startDateError !== ""}
                // helperText={startDateError}
              />
            )}
          />
        </LocalizationProvider>
        <br />

        <Members members={members} setMembers={setMembers} />

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
          Create
        </Button>
        <br />
        <Link to="/cohorts">Back</Link>
      </Box>
    </>
  );
};

export default CreateCohort;
