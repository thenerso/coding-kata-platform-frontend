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
  Autocomplete,
  Chip,
  InputLabel,
  MenuItem,
  Select,
  FormControl,
} from "@mui/material";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import authService from "../../services/authService";
import problemSetServices from "../../services/problemSetService";

import { Difficulty, IProblem, IProblemSet } from "../../interfaces/problemSet";
import styled from "@emotion/styled";

import { useSnackbar } from "notistack";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const CreateProblemSet = () => {
  //   const { problemSets, setNewProblemSets } = useContext(
  //     AppContext
  //   ) as IAppContext;

  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("EASY");
  const [tags, setTags] = useState<string[]>([]);
  const [problems, setProblems] = useState<IProblem[]>([]);

  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const handleValidation = () => {
    let passed = true;

    if (title === "") {
      setTitleError("Title cannot be blank");
      passed = false;
    } else setTitleError("");

    if (description === "") {
      setDescriptionError("Description cannot be blank");
      passed = false;
    } else setDescriptionError("");

    return passed;
  };

  const submit = async () => {
    const token = authService.getAccessToken();

    if (token) {
      if (handleValidation()) {
        const body: IProblemSet = {
          title,
          description,
          tags,
          difficulty,
          problems,
        };
        setLoading(true);
        try {
          const response = await problemSetServices.create(token, body);

          enqueueSnackbar(`Problem Set created`, {
            variant: "success",
          });

          navigate(`/problem-sets/${response?.id}`);
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

  //   const updateEditedMember = (newMember: IUser) => {
  //     console.log(newMember.username);

  //     setMembers(
  //       members.map((member, index) => {
  //         if (index === memberEditIndex) {
  //           return newMember;
  //         }
  //         return member;
  //       })
  //     );
  //     setMemberEditIndex(-1);
  //   };

  //   const deleteMember = (memberIndex: number) => {
  //     setMembers(members.filter((member, index) => index !== memberIndex));
  //   };

  const updateTags = (event: any) => {
    setTags([...tags, event.target.value]);
  };

  return (
    <>
      <Button
        color="info"
        component={Link}
        to="/problem-sets"
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      <Typography variant="h1">Create a Problem Set</Typography>
      <Grid container spacing={5}>
        <Grid item sm={12} md={6} xs={12}>
          <Card>
            <CardHeader title="Problem Set details" />
            <StyledCardContent>
              <TextField
                variant="standard"
                name="title"
                label="Title"
                autoFocus={true}
                margin="normal"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                error={titleError !== ""}
                helperText={titleError}
              />
              <br />
              <TextField
                variant="standard"
                name="description"
                label="Description"
                margin="normal"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                error={descriptionError !== ""}
                helperText={descriptionError}
              />

              <br />

              <FormControl>
                <InputLabel variant="standard" id="difficulty-label">
                  Font Size
                </InputLabel>
                <Select
                  variant="standard"
                  labelId="difficulty-label"
                  value={difficulty}
                  label="Difficulty"
                  onChange={(e) => setDifficulty(e.target.value as Difficulty)}
                >
                  {Object.keys(Difficulty).map((item) => (
                    <MenuItem key={item} value={item}>
                      {item.replace("_", " ").toLowerCase()}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>

              <br />

              <Autocomplete
                multiple
                id="problem-tags"
                options={[]}
                defaultValue={[]}
                freeSolo
                value={tags}
                onChange={updateTags}
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip label={option} {...getTagProps({ index })} />
                  ))
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    variant="standard"
                    label="Add tags"
                    placeholder="Tags"
                  />
                )}
              />
            </StyledCardContent>
          </Card>
        </Grid>
        <Grid item sm={12} md={6} xs={12}>
          {/* {memberEditIndex === -1 ? (
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
          )} */}
        </Grid>
        <Grid item md={12} xs={12}>
          {/* <Members
            members={members}
            displayScore={false}
            displayEmptyCell={true}
            setMemberEditIndex={setMemberEditIndex}
            deleteMember={deleteMember}
          /> */}
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

export default CreateProblemSet;
