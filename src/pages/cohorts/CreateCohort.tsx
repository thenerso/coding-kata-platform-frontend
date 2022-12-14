import { ArrowBack, Check } from "@mui/icons-material";
import {
  TextField,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardHeader,
  CardContent,
  Grid,
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
import styled from "@emotion/styled";
import EditMember from "./member/UpdateMember";
import CreateMemberWrapper from "./member/CreateMemberWrapper";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const CreateCohort = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());

  const [members, setMembers] = useState<IUser[]>([]);
  const [memberEditIndex, setMemberEditIndex] = useState(-1);

  const [nameError, setNameError] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleValidation = () => {
    let passed = true;

    if (name === "") {
      setNameError("Name cannot be blank");
      passed = false;
    } else setNameError("");

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

          // if (response?.id) {
          navigate(`/cohorts/${response?.id}`);
          // return;
          // }
          // setError(response.message ? response.message : "Server Error");
          // setLoading(false);
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

  const updateEditedMember = (newMember: IUser) => {
    console.log(newMember.username);

    setMembers(
      members.map((member, index) => {
        if (index === memberEditIndex) {
          return newMember;
        }
        return member;
      })
    );
    setMemberEditIndex(-1);
  };

  return (
    <>
      <Button
        color="info"
        component={Link}
        to="/cohorts"
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      <Typography variant="h1">Create a Cohort</Typography>
      <Grid container spacing={5}>
        <Grid item md={6}>
          <Card>
            <CardHeader title="Cohort details" />
            <StyledCardContent>
              <TextField
                variant="standard"
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
                    <TextField variant="standard" {...params} />
                  )}
                />
              </LocalizationProvider>
            </StyledCardContent>
          </Card>
        </Grid>
        <Grid item md={6}>
          {memberEditIndex === -1 ? (
            <CreateMemberWrapper
              members={members}
              setMembers={setMembers}
              startDate={startDate}
            />
          ) : (
            <EditMember
              members={members}
              memberIndex={memberEditIndex}
              editMember={updateEditedMember}
              startDate={startDate}
              setMemberEditIndex={setMemberEditIndex}
            />
          )}
        </Grid>
        <Grid item md={12}>
          <Members
            members={members}
            displayScore={false}
            displayEmptyCell={true}
            setMemberEditIndex={setMemberEditIndex}
          />
        </Grid>

        <Grid item md={12}>
          <Typography variant="caption" color="error">
            {error}
          </Typography>
          <br />
        </Grid>
        <Grid item md={12}>
          <Button
            color="primary"
            variant="contained"
            onClick={submit}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={18} /> : <Check />}
          >
            Create
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default CreateCohort;
