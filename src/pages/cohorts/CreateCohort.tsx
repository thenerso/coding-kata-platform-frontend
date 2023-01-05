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

import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import cohortServices from "../../services/cohortService";
import Members from "../../components/cohort/member/Members";
import { ICohort } from "../../interfaces/cohort";
import { IUser } from "../../interfaces/user";
import styled from "@emotion/styled";
import EditMember from "../../components/cohort/member/UpdateMember";
import CreateMemberWrapper from "../../components/cohort/member/CreateMemberWrapper";
import { useSnackbar } from "notistack";
import { AppContext, IAppContext } from "../../context/AppContext";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const CreateCohort = () => {
  const { cohorts, setNewCohorts } = useContext(AppContext) as IAppContext;

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());

  const [members, setMembers] = useState<IUser[]>([]);
  const [memberEditIndex, setMemberEditIndex] = useState(-1);

  const [nameError, setNameError] = useState("");

  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleValidation = () => {
    let passed = true;

    if (name === "") {
      setNameError("Name cannot be blank");
      passed = false;
    } else setNameError("");

    if (cohorts.findIndex((cohort) => cohort.name === name) !== -1) {
      setNameError(`A cohort with the name ${name} already exists`);
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
        setLoading(true);
        try {
          const response = await cohortServices.create(token, body);

          enqueueSnackbar(`Cohort created`, {
            variant: "success",
          });

          setNewCohorts([...cohorts, response as ICohort]);
          navigate(`/cohorts/${response?.id}`);
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

  const deleteMember = (memberIndex: number) => {
    setMembers(members.filter((member, index) => index !== memberIndex));
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
        <Grid item sm={12} md={6} xs={12}>
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
        <Grid item sm={12} md={6} xs={12}>
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
        <Grid item md={12} xs={12}>
          <Members
            members={members}
            displayScore={false}
            displayEmptyCell={true}
            setMemberEditIndex={setMemberEditIndex}
            deleteMember={deleteMember}
          />
        </Grid>

        <Grid item md={12} xs={12}>
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
