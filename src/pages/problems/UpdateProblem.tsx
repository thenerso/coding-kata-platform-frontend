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
  List,
} from "@mui/material";

import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import authService from "../../services/authService";

import styled from "@emotion/styled";

import { useSnackbar } from "notistack";
import { Case, Difficulty, IProblem, Put } from "../../interfaces/problemSet";
import CreateTestCase from "../../components/problem/test-case/CreateTestCase";
import TestCases from "../../components/problem/test-case/TestCases";
import ProblemService from "../../services/problemService";
import CodeEditorContainer from "../../components/editor/CodeEditorContainer";
import { languagePlaceholders } from "../../components/editor/EditorVariables";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";

const StyledChip = styled(Chip)`
  margin: 10px 0;
`;

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const UpdateProblem = () => {
  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");
  const [difficulty, setDifficulty] = useState<string>("EASY");
  const [tags, setTags] = useState<string[]>([]);
  const [publicCases, setPublicCases] = useState<Case[]>([]);
  const [privateCases, setPrivateCases] = useState<Case[]>([]);

  const [existingTestCase, setExistingTestCase] = useState<Case | null>(null);

  const [startCode, setStartCode] = useState({
    js: languagePlaceholders.javascript,
    py: languagePlaceholders.python,
    java: languagePlaceholders.java,
  });

  const [loading, setLoading] = useState(true);
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
        ProblemService.getById(token, id)
          .then((result) => {
            // result.

            setTitle(result.title || "");
            setDescription(result.description || "");
            setDifficulty(result.difficulty || "");
            setTags(result.tags || []);
            setPublicCases(result.testSuite?.publicCases || []);
            setPrivateCases(result.testSuite?.privateCases || []);
            setStartCode(result.startCode);

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
        const body: IProblem = {
          id: parseInt(id || "0"),
          title,
          description,
          tags,
          difficulty,
          testSuite: { publicCases, privateCases },
          startCode,
        };
        setLoading(true);
        try {
          const response = await ProblemService.update(token, body);

          enqueueSnackbar(`Problem updated`, {
            variant: "success",
          });

          navigate(`/problems/${response?.id}`);
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

  const addTestCase = (isPublic: boolean, inputs: Put[], output: Put) => {
    if (isPublic) {
      setPublicCases([...publicCases, { inputs: inputs, output }]);
    } else {
      setPrivateCases([...privateCases, { inputs: inputs, output }]);
    }
  };

  const updateExistingTestCase = (testCase: Case) => {
    const newTestCases = testCase.isPublic
      ? [...publicCases]
      : [...privateCases];

    if (testCase.isPublic !== existingTestCase?.isPublic) {
      let oldTestCases = existingTestCase?.isPublic
        ? [...publicCases]
        : [...privateCases];
      oldTestCases.splice(testCase.id || 0, 1);

      existingTestCase?.isPublic
        ? setPublicCases(oldTestCases)
        : setPrivateCases(oldTestCases);

      newTestCases.push({ inputs: testCase.inputs, output: testCase.output });
    } else {
      newTestCases[testCase.id || 0] = {
        inputs: testCase.inputs,
        output: testCase.output,
      };
    }

    testCase.isPublic
      ? setPublicCases(newTestCases)
      : setPrivateCases(newTestCases);
    setExistingTestCase(null);
  };

  const testCaseAction = (isPublic: boolean, action: string, index: number) => {
    if (action === "edit") {
      const testCaseToEdit = {
        ...(isPublic ? publicCases[index] : privateCases[index]),
        isPublic,
        id: index,
      };

      setExistingTestCase(testCaseToEdit);
    } else {
      let newTestCases = [...(isPublic ? publicCases : privateCases)];
      newTestCases.splice(index, 1);
      isPublic ? setPublicCases(newTestCases) : setPrivateCases(newTestCases);
    }
  };

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;
  return (
    <>
      <Button
        color="info"
        component={Link}
        to="/problems"
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      <Typography variant="h1">Update Problem</Typography>
      <Grid container spacing={5}>
        <Grid item sm={12} md={6} xs={12}>
          <Card>
            <CardHeader title="Problem details" />
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
                multiline
                rows={3}
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
                  Difficulty
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
          <Card>
            <StyledCardContent>
              <CreateTestCase
                functionName={title || "functionName"}
                existingTestCase={existingTestCase}
                setExistingTestCase={setExistingTestCase}
                updateExistingTestCase={updateExistingTestCase}
                setTestCase={addTestCase}
              />

              <List>
                <StyledChip label="Public" color="success" />
                {publicCases.length === 0 ? (
                  <Typography variant="body1" align="center">
                    No public cases
                  </Typography>
                ) : (
                  publicCases.map((item, index) => {
                    return (
                      <TestCases
                        key={`${index}-${item.output.value}`}
                        functionName={title || "functionName"}
                        testCase={item}
                        isPublic
                        testCaseAction={testCaseAction}
                        index={index}
                      />
                    );
                  })
                )}
                <StyledChip label="Private" color="error" />

                {privateCases.length === 0 ? (
                  <Typography variant="body1" align="center">
                    No private cases
                  </Typography>
                ) : (
                  privateCases.map((item, index) => {
                    return (
                      <TestCases
                        key={`${index}-${item.output.value}`}
                        functionName={title || "functionName"}
                        testCase={item}
                        testCaseAction={testCaseAction}
                        index={index}
                      />
                    );
                  })
                )}
              </List>
            </StyledCardContent>
          </Card>
        </Grid>
        <Grid item md={12} sm={12} xs={12}>
          <CodeEditorContainer
            startCode={startCode}
            setStartCode={setStartCode}
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
            Save
          </Button>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateProblem;
