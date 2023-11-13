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
import Members from "../../components/cohort/member/Members";
import { ICohort } from "../../interfaces/cohort";
import { IUser } from "../../interfaces/user";
import CreateMember from "../../components/cohort/member/CreateSingleMember";
import styled from "@emotion/styled";

import UpdateMember from "../../components/cohort/member/UpdateMember";
import { useSnackbar } from "notistack";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const UpdateCohort = () => {
  const [cohort, setCohort] = useState<ICohort>();

  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());

  const [members, setMembers] = useState<IUser[]>([]);
  const [memberEditIndex, setMemberEditIndex] = useState(-1);

  const [nameError, setNameError] = useState("");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    const token = authService.getAccessToken() || "";

    cohortServices.getById(token, id as string).then((cohort )=> {
      setCohort(cohort);
      if (cohort) {
        setName(cohort.name);
        setStartDate(dayjs(cohort.startDate));
        setMembers(cohort.members);
      } else {
        setError("Could not find cohort");
      }
      setLoading(false);
    });

   
  }, [id]);

  const handleValidation = () => {
    let passed = true;

    if (cohort?.name === "") {
      setNameError("Name cannot be blank");
      passed = false;
    } else setNameError("");


    return passed;
  };

  const submit = async () => {
    const token = authService.getAccessToken();
    if (!cohort) {
      setError("cohort is undefined");
      return;
    }

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

          enqueueSnackbar(`Cohort updated`, {
            variant: "success",
          });
          navigate(`/cohorts/${id}`);
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

  if (loading) return <Loading />;
  //if (error) return <EmptyState message={error} />;
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
        <Grid item md={6} xs={12}>
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
        <Grid item md={6} xs={12}>
          {memberEditIndex === -1 ? (
            <Card>
              <CardHeader title="Add a member" />
              <CreateMember
                members={members}
                setMembers={setMembers}
                startDate={startDate}
              />
            </Card>
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
