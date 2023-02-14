import { useState, FC} from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

import styled from "@emotion/styled";

import { IUser } from "../../interfaces/user";
import dayjs, { Dayjs } from "dayjs";
import { ArrowBack, Check } from "@mui/icons-material";
import { Button, Typography, Grid, Card, CardHeader, TextField, FormControl, InputLabel, Select, MenuItem, Autocomplete, Chip, CircularProgress, CardContent } from "@mui/material";
import { useSnackbar } from "notistack";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ICohort } from "../../interfaces/cohort";
import { UserRoles } from "../../routing/routes";
import userService from "../../services/userService";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;


const CreateUser : FC = () => {

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [cohort, setCohort] = useState<ICohort | null>();
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState<string[]>([]);

  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleValidation = () => {
    let passed = true;

    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Not a valid email");
      passed = false;
    } else setEmailError("");

    if (email === "") {
      setEmailError("Email cannot be blank");
      passed = false;
    } else setEmailError("");

    return passed;
  };


  const submit = async () => {
    const token = authService.getAccessToken();

    if (token) {
      if (handleValidation()) {
        setUsername(email.split("@")[0])

        const body: IUser = {
          username,
          email,
          startDate,
          roles,
          cohort
        };
        setLoading(true);
        try {
          const response = await userService.create(token, body);

          enqueueSnackbar(`User created`, {
            variant: "success",
          });

          navigate(`/users/${response?.id}`);
        } catch (err: any) {
          enqueueSnackbar(err.message, {
            variant: "error",
          });

          setLoading(false);
        }
      }
    } else {
      enqueueSnackbar("Authentication error, please log in again", {
        variant: "error",
      });
      setLoading(false);
    }
  };


  return (
    <>
      <Button
        color="info"
        component={Link}
        to="/users"
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      <Typography variant="h1">Create a User</Typography>
      <Grid container spacing={5}>
        <Grid item sm={12} md={6} xs={12}>
          <Card>
            <CardHeader title="User details" />
            <StyledCardContent>
              <TextField
                variant="standard"
                name="title"
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
              {/* Username here - based off email but editable*/}
              <br/>
              {/* Cohort here - single select*/}
              <br />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="DD/MM/YYYY"
                  value={startDate}
                  onChange={(e: Dayjs | null) => setStartDate(e)}
                  renderInput={(params) => (
                    <TextField variant="standard" {...params} />
                  )}
                />
                {/* Add option to base from cohort */}
              </LocalizationProvider>

              <br />

              <FormControl>
                <InputLabel variant="standard" id="role-label">
                  Role
                </InputLabel>
                <Select
                  variant="standard"
                  multiple
                  labelId="role-label"
                  value={roles}
                  label="Role"
                  onChange={(e) => {
                    let value = e.target.value;
                    setRoles(typeof value === "string" ? value.split(',') : value)
                  }
                  }
                  // Set default to USER, remove 0,1,2?
                >
                  {Object.keys(UserRoles).map((item) => (
                    <MenuItem key={item} value={item}>
                      {item}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

            </StyledCardContent>
          </Card>
        </Grid>

        <Grid item md={12} xs={12}>
          <Button
            color="primary"
            variant="contained"
            onClick={submit}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={18} /> : <Check />}
          >
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  )
}

export default CreateUser;