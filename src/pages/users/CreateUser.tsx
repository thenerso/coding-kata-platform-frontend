import { useState, useContext, useEffect} from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";

import styled from "@emotion/styled";

import { IUser } from "../../interfaces/user";
import dayjs, { Dayjs } from "dayjs";
import { ArrowBack, Check } from "@mui/icons-material";
import { Button, Typography, Grid, Card, CardHeader, TextField, FormControl, InputLabel, Select, MenuItem, CircularProgress, CardContent, Checkbox, ListItemText, FormGroup, FormControlLabel } from "@mui/material";
import { useSnackbar } from "notistack";
import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ICohort } from "../../interfaces/cohort";
import { UserRoles } from "../../routing/routes";
import userService from "../../services/userService";
import {AppContext, IAppContext } from "../../context/AppContext";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;


const CreateUser = () => {
  const { cohorts } = useContext(AppContext) as IAppContext;

  const [customStartDate, setCustomStartDate] = useState(true)

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [cohort, setCohort] = useState<ICohort | null>(null);
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState<string[]>([UserRoles[UserRoles.USER]]);

  const [loading, setLoading] = useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    if(cohort !== null) {
      setCustomStartDate(false)
    }
  }, [cohort])

  useEffect(() => {
    setUsername(email.split("@")[0])
  }, [email])

  const handleValidation = () => {
    let passed = true;

    if (email === "") {
      setEmailError("Email cannot be blank");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Not a valid email");
      return false;
    } 

    setEmailError("");
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
      else {
        enqueueSnackbar("Error please try again", {
          variant: "error",
        });
        setLoading(false);
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
              <TextField
                variant="standard"
                name="title"
                label="Username"
                margin="normal"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
              />
              <br/>
              <FormControl variant="standard">
                <InputLabel id="cohort-label">Cohort</InputLabel>
                <Select
                  variant="standard"
                  labelId="cohort-label"
                  value={cohort?.id}
                  label="Cohort"
                  onChange={(e) => setCohort(cohorts.filter(cohort => cohort.id === e.target.value)[0])}
                >
                  {cohorts.map((cohort) => 
                    <MenuItem value={cohort.id}>{cohort.name}</MenuItem>
                  )}
                </Select>
              </FormControl>
              <br />

              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DesktopDatePicker
                  label="Start Date"
                  inputFormat="DD/MM/YYYY"
                  value={customStartDate ?  startDate: cohort?.startDate}
                  onChange={(e: Dayjs | null) => setStartDate(e)}
                  renderInput={(params) => (
                    <TextField variant="standard" {...params} />
                  )}
                  disabled={!customStartDate}
                />
              </LocalizationProvider>
              {cohort ?
                <FormGroup>
                  <FormControlLabel
                    control={<Checkbox checked={!customStartDate}/>}
                    onChange={() => setCustomStartDate(!customStartDate)}
                    value={customStartDate}
                    label="Use same start date as Cohort"
                    />
                </FormGroup> :
                <br/>
              }


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
                  renderValue={(selected) => {
                    console.log(selected)
                    return selected.join(", ")
                  }}
                  onChange={(e) => {
                    let value = e.target.value;
                    console.log(value)
                    setRoles(typeof value === "string" ? value.split(',') : value)
                  }
                  }
                >
                  {Object.keys(UserRoles).filter(key => 
                    Number(key) > 0
                  ).map((item) => (
                    <MenuItem key={item} value={UserRoles[Number(item)]}>
                      <Checkbox checked={roles.indexOf(UserRoles[Number(item)]) > -1} />
                      <ListItemText primary={UserRoles[Number(item)]} />
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