import styled from "@emotion/styled";
import { PlayCircle } from "@mui/icons-material";
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
  const [compileError, setCompileError] = useState<string>("");

  const [startCode, setStartCode] = useState<StartCode>({
    js: languagePlaceholders.javascript,
    py: languagePlaceholders.python,
    java: languagePlaceholders.java,
  });

  const [tabValue, setTabValue] = useState<number>(0);

  const [activeLanguage, setActiveLanguage] = useState<string>("js");

  const { id } = useParams();
  const navigate = useNavigate();
  const { enqueueSnackbar } = useSnackbar();

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

        setEvalResponse(response);
        setTabValue(1);
        const compileError = evalResponse?.testResultsWithLogs.find(
          (result) => result.compileResult.errors !== ""
        );
        if (compileError) {
          enqueueSnackbar(`Compiled with errors`, {
            variant: "error",
          });
          setCompileError(compileError.compileResult.errors);
        }
        // else {
        // enqueueSnackbar(`Code Compiled`, {
        //   variant: "success",
        // });
        // }

        // navigate(`/problems/${response?.id}`);
        console.log("response!");
        console.log(response);
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

  // const codeEditorValue = () => {
  //   if (evalResponse?.testResultsWithLogs[0].compileResult.errors !== "") {
  //     return evalResponse?.testResultsWithLogs[0].compileResult.errors || "";
  //   }
  //   return evalResponse?.testResultsWithLogs[0].compileResult.output || "";
  // };

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
              variant="contained"
              endIcon={
                compiling ? <CircularProgress size={18} /> : <PlayCircle />
              }
              onClick={compile}
              disabled={compiling}
            >
              Attempt
            </Button>
          </ControlsWrapper>
        </Grid>
      </Grid>
    </>
  );
};

export default Attempt;
