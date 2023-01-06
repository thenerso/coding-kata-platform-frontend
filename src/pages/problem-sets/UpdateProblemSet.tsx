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

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import authService from "../../services/authService";
import problemSetServices from "../../services/problemSetService";

import { Difficulty, IProblem, IProblemSet } from "../../interfaces/problemSet";
import styled from "@emotion/styled";

import { useSnackbar } from "notistack";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const UpdateProblemSet = () => {
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("EASY");
  const [tags, setTags] = useState<string[]>([]);
  const [problems, setProblems] = useState<IProblem[]>([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (id) {
        setError("");
        setLoading(true);
        problemSetServices
          .getById(token, id)
          .then((result) => {
            setTitle(result.title);
            setDescription(result.description);
            setDifficulty(result.difficulty);
            setTags(result.tags);

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
          id: parseInt(id as string),
          title,
          description,
          tags,
          difficulty,
          problems,
        };
        setLoading(true);
        try {
          await problemSetServices.update(token, body);

          enqueueSnackbar(`Problem Set updated`, {
            variant: "success",
          });

          navigate(`/problem-sets/${id}`);
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

  const updateTags = (event: any) => {
    setTags([...tags, event.target.value]);
  };

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;
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
      <Typography variant="h1">Update a Problem Set</Typography>
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
  );
};

export default UpdateProblemSet;
