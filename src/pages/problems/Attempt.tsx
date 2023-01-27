import styled from "@emotion/styled";
import { NavigateNext, PlayCircle } from "@mui/icons-material";
import { Button, Grid, CircularProgress } from "@mui/material";
import { useSnackbar } from "notistack";
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import CodeEditorContainer from "../../components/editor/CodeEditorContainer";
import {
  languageOptions,
  languagePlaceholders,
} from "../../components/editor/EditorVariables";
import EmptyState from "../../components/global/EmptyState";
import Loading from "../../components/global/Loading";
import AttemptDetailsWrapper from "../../components/problem/attempt/AttemptDetailsWrapper";
import { IEvalResponse, IEvaluate } from "../../interfaces/eval";
import { IProblem, StartCode } from "../../interfaces/problemSet";
import authService from "../../services/authService";
import EvalService from "../../services/evalService";
import ProblemService from "../../services/problemService";

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
  const [evalResponse, setEvalResponse] = useState<IEvalResponse | null>();

  const [startCode, setStartCode] = useState<StartCode>({
    js: languagePlaceholders.javascript,
    py: languagePlaceholders.python,
    java: languagePlaceholders.java,
  });

  const [tabValue, setTabValue] = useState<number>(0);

  const [activeLanguage, setActiveLanguage] = useState<string>("javascript");
  const [nextProblem, setNextProblem] = useState<number>(-1);

  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    console.log("update!");
    const token = authService.getAccessToken();

    const fetchProblem = () => {
      setError("");
      setLoading(true);
      ProblemService.getById(token || "", id || "")
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
    };

    if (token) {
      if (!problem) fetchProblem();
      if (problem?.id?.toString() !== id) {
        fetchProblem();
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, [problem, id]);

  const compile = async () => {
    const user = authService.getUser();
    const token = authService.getAccessToken();

    if (user && token) {
      const body: IEvaluate = {
        userId: user.userId?.toString() || "",
        problemId: problem?.id?.toString() || "0",
        code: startCode[languageOptions[activeLanguage]],
        lang: languageOptions[activeLanguage],
      };
      setCompiling(true);
      try {
        const response = await EvalService.evaluate(body, token);
        const evalResponse: IEvalResponse = response as IEvalResponse;

        setEvalResponse(response);
        setTabValue(1);

        const compileError = evalResponse.testResultsWithLogs.find(
          (result) => !result.compileResult.compiled
        );

        if (compileError) {
          enqueueSnackbar(`Compiled with errors`, {
            variant: "error",
          });
        } else if (evalResponse.successful) {
          enqueueSnackbar(`Solution successful`, {
            variant: "success",
          });
          getNextProblemForUser(token, user.userId || 0);
        } else {
          enqueueSnackbar(`Some test cases failed`, {
            variant: "warning",
          });
        }

        setCompiling(false);
      } catch (err: any) {
        enqueueSnackbar(err.message, {
          variant: "error",
        });

        setCompiling(false);
      }
    } else {
      enqueueSnackbar("Authentication error, please log in again", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const getNextProblemForUser = (token: string, userId: number) => {
    ProblemService.getNextForUser(token, userId.toString())
      .then((result) => {
        setNextProblem(result.id);
      })
      .catch((err) => {
        console.log("Error getting next problem for user", err);
      });
  };

  const navigateToNextProblem = () => {
    if (!nextProblem) {
      navigate("/");
    } else {
      setLoading(true);
      setActiveLanguage("javascript");
      setTabValue(0);
      navigate(`/problems/attempt/${nextProblem}`);
      setNextProblem(-1);
    }
  };

  if (loading) return <Loading />;
  if (error || !problem) return <EmptyState message={error} />;
  return (
    <>
      <Grid container spacing={5} alignItems="start" alignSelf="center">
        <AttemptDetailsWrapper
          problem={problem}
          evalResponse={evalResponse}
          value={tabValue}
          setValue={setTabValue}
        />

        <Grid item md={7}>
          <CodeEditorContainer
            startCode={startCode}
            setStartCode={setStartCode}
            setActiveLanguage={setActiveLanguage}
          />
          <ControlsWrapper>
            <Button
              variant={nextProblem !== -1 ? "outlined" : "contained"}
              endIcon={
                compiling ? <CircularProgress size={18} /> : <PlayCircle />
              }
              onClick={compile}
              disabled={compiling}
            >
              Attempt
            </Button>
            {nextProblem !== -1 && (
              <Button
                style={{ marginLeft: 10 }}
                color="secondary"
                variant="contained"
                endIcon={<NavigateNext />}
                onClick={navigateToNextProblem}
                disabled={compiling}
              >
                {nextProblem ? "Continue" : "Home"}
              </Button>
            )}
          </ControlsWrapper>
        </Grid>
      </Grid>
    </>
  );
};

export default Attempt;
