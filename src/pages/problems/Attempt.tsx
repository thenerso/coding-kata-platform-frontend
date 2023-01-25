import styled from "@emotion/styled";
import {
  ArrowBack,
  Edit,
  PlayArrow,
  PlayArrowOutlined,
  PlayCircle,
} from "@mui/icons-material";
import {
  Chip,
  Button,
  Divider,
  Typography,
  Fab,
  Grid,
  Card,
  CardContent,
  CardHeader,
  List,
} from "@mui/material";
import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import CodeEditorContainer from "../../components/editor/CodeEditorContainer";
import { languagePlaceholders } from "../../components/editor/EditorVariables";
import EmptyState from "../../components/global/EmptyState";
import Loading from "../../components/global/Loading";
import DeleteProblem from "../../components/problem/DeleteProblem";
import DifficultyChip from "../../components/problem/DifficultyChip";
import Tags from "../../components/problem/Tags";
import TestCases from "../../components/problem/test-case/TestCases";
import { IProblem, StartCode } from "../../interfaces/problemSet";
import authService from "../../services/authService";
import ProblemService from "../../services/problemService";

/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const TitleActionWrapper = styled("div")`
  a {
    margin: 0 5px;
  }
`;

const StyledChip = styled(Chip)`
  margin: 10px 0;
`;

const ChipWrapper = styled("div")`
  display: flex;
  align-items: center;
  div {
    margin: 0 10px;
  }
  margin: 15px 0;
`;

const ControlsWrapper = styled("div")`
  margin-top: 10px;
  display: flex;
  justify-content: flex-end;
`;

const Attempt = () => {
  const [problem, setProblem] = useState<IProblem>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const [compiling, setCompiling] = useState<boolean>(false);

  const [startCode, setStartCode] = useState({
    js: languagePlaceholders.javascript,
    py: languagePlaceholders.python,
    java: languagePlaceholders.java,
  });

  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (!problem && id) {
        setError("");
        setLoading(true);
        ProblemService.getById(token, id)
          .then((result) => {
            setProblem(result);
            setStartCode(result.startCode);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error getting problem sets", err);
            setError("Error fetching data");
            setLoading(false);
          });
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, [problem, id]);

  const compile = () => {};

  if (loading) return <Loading />;
  if (error || !problem) return <EmptyState message={error} />;
  return (
    <>
      <Button
        color="info"
        onClick={() => navigate(-1)}
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      <Grid container spacing={5} alignItems="center">
        <Grid item md={5}>
          <Card>
            <CardContent>
              <ChipWrapper>
                <DifficultyChip label={problem.difficulty || ""} />
                <Divider orientation="vertical" flexItem />
                <Tags tags={problem.tags} />
              </ChipWrapper>

              <Typography variant="h1">{problem.title}</Typography>

              <Typography variant="subtitle1">{problem.description}</Typography>
            </CardContent>
          </Card>
          <br />
          <Card>
            <CardHeader title="Test Cases" />
            <CardContent>
              <List>
                <StyledChip label="Public" color="success" />
                {problem.testSuite?.publicCases?.map((item, index) => {
                  return (
                    <TestCases
                      key={`${index}-${item.id}`}
                      functionName={problem.title || ""}
                      testCase={item}
                    />
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={7}>
          {/* <TitleActionWrapper>
            <Fab color="warning" aria-label="Attempt Problem">
              <PlayArrow />
            </Fab>
          </TitleActionWrapper> */}
          <CodeEditorContainer
            startCode={startCode}
            setStartCode={setStartCode}
          />
          <ControlsWrapper>
            <Button variant="contained" endIcon={<PlayCircle />}>
              Attempt
            </Button>
          </ControlsWrapper>
        </Grid>
      </Grid>
    </>
  );
};

export default Attempt;
