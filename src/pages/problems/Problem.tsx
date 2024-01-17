import styled from "@emotion/styled";
import { Edit } from "@mui/icons-material";
import {
  Typography,
  Fab,
  Divider,
  Grid,
  Card,
  CardHeader,
  CardContent,
  List,
  Chip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/global/EmptyState";
import Loading from "../../components/global/Loading";
// import DeleteProblem from "../../components/problem/DeleteProblem";
import DifficultyChip from "../../components/problem/DifficultyChip";

import Tags from "../../components/problem/Tags";
import TestCases from "../../components/problem/test-case/TestCases";
import CodeEditorContainer from "../../components/editor/CodeEditorContainer";
import { IProblem } from "../../interfaces/problemSet";

import authService from "../../services/authService";
import ProblemService from "../../services/problemService";
import DeleteProblem from "../../components/problem/DeleteProblem";
import { renderHTML } from "../../components/global/Rendering";
import BackArrow from "../../components/global/BackArrow";

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

const Problem = () => {
  const [problem, setProblem] = useState<IProblem | undefined>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (!problem && id) {
        setError("");
        setLoading(true);
        ProblemService.getById(token, id)
          .then((result) => {
            setProblem(result);
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

  if (loading) return <Loading />;
  if (error || !problem) return <EmptyState message={error} />;
  return (
    <>
      <BackArrow />
      <ChipWrapper>
        <DifficultyChip label={problem.difficulty || ""} />
        <Divider orientation="vertical" flexItem />
        <Tags tags={problem.tags} />
      </ChipWrapper>
      <TitleWrapper>
        <Typography variant="h1">{problem.title}</Typography>
        <TitleActionWrapper>
          <Fab
            color="primary"
            aria-label="Edit problem set"
            component={Link}
            to={`/problems/edit/${problem.id}`}
          >
            <Edit />
          </Fab>

          {problem.id && <DeleteProblem id={problem.id} />}
        </TitleActionWrapper>
      </TitleWrapper>

      <Typography variant="subtitle1">
      <div dangerouslySetInnerHTML={renderHTML(problem.description)} />
        </Typography>
      <br />
      <br />
      <Grid container spacing={5}>
        <Grid item md={6} sm={12} xs={12}>
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
                <Divider />
                <StyledChip label="Private" color="warning" />
                {problem.testSuite?.privateCases?.map((item, index) => {
                  return (
                    <TestCases
                      functionName={problem.title || ""}
                      key={`${index}-${item.id}`}
                      testCase={item}
                    />
                  );
                })}
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item md={6} sm={12} xs={12}>
          <CodeEditorContainer startCode={problem.startCode} readOnly />
        </Grid>
      </Grid>
    </>
  );
};

export default Problem;
