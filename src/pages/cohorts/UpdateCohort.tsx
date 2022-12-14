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

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import authService from "../../services/authService";
import cohortServices from "../../services/cohortService";
import Members from "./member/Members";
import { ICohort } from "../../interfaces/cohort";
import { IUser } from "../../interfaces/user";
import CreateMember from "./member/CreateSingleMember";
import styled from "@emotion/styled";

import UpdateMember from "./member/UpdateMember";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const UpdateCohort = () => {
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());

  const [members, setMembers] = useState<IUser[]>([]);
  const [memberEditIndex, setMemberEditIndex] = useState(-1);

  const [nameError, setNameError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (id) {
        setError("");
        setLoading(true);
        cohortServices
          .getById(token, id)
          .then((result) => {
            setName(result.name);
            setStartDate(dayjs(result.startDate));
            setMembers(result.members);

            setLoading(false);
          })
          .catch((err) => {
            console.log("Error getting cohorts", err);
            setError("Error fetching data");
            setLoading(false);
          });
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, [id]);

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

    if (token && id) {
      if (handleValidation()) {
        const body: ICohort = {
          id: parseInt(id),
          name,
          startDate: dayjs(startDate).format("YYYY-MM-DD"),
          members,
        };
        setError("");
        setLoading(true);
        try {
          await cohortServices.update(token, body);

          // if (response?.id) {
          navigate(`/cohorts/${id}`);
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
      <Typography variant="h1">Update Cohort</Typography>
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
            <CreateMember
              members={members}
              setMembers={setMembers}
              startDate={startDate}
            />
          ) : (
            <UpdateMember
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
          <Button
            color="primary"
            variant="contained"
            onClick={submit}
            disabled={loading}
            endIcon={loading ? <CircularProgress size={18} /> : <Check />}
          >
            Update
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateCohort;
