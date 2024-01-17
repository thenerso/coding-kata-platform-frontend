import styled from "@emotion/styled";
import { AccessTime, Code, Person } from "@mui/icons-material";
import {
  Typography,
  Divider,
  Grid,
  Card,
  CardHeader,
  List,
  ListItemIcon,
  ListItem,
  ListItemText,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../../components/global/EmptyState";
import Loading from "../../components/global/Loading";
import DifficultyChip from "../../components/problem/DifficultyChip";

import authService from "../../services/authService";
import { ISolutionDTO } from "../../interfaces/solutions";
import solutionService from "../../services/solutionService";
import dayjs from "dayjs";
import PreviewCodeEditorContainer from "../../components/editor/PreviewCodeEditorContainer";
import BackArrow from "../../components/global/BackArrow";

/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const ChipWrapper = styled("div")`
  display: flex;
  align-items: center;
  div {
    margin: 0 10px;
  }
  margin: 15px 0;
`;

const StyledListItemText = styled(ListItemText)`
  display: flex;
  flex-direction: column-reverse;
`;

const Solution = () => {
  const [solution, setSolution] = useState<ISolutionDTO | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (!solution && id) {
        setError("");
        setLoading(true);
        solutionService
          .getById(token, id)
          .then((result) => {
            setSolution(result);
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
  }, [solution, id]);

  if (loading) return <Loading />;
  if (error || !solution) return <EmptyState message={error} />;
  return (
    <>
      <BackArrow />
      <ChipWrapper>
        <DifficultyChip label={solution.difficulty || ""} />
        <Divider orientation="vertical" flexItem />
        {/* <Tags tags={solution.problem?.tags} /> */}
      </ChipWrapper>
      <TitleWrapper>
        <Typography variant="h1">
          Solution for <code>'{solution.title}'</code> ({solution.correctness}%)
        </Typography>
      </TitleWrapper>

      <Typography variant="subtitle1">{solution.description}</Typography>

      <br />
      <Grid container spacing={5}>
        <Grid container spacing={2} item xs={12} md={3}>
          <Grid item xs={12} md={12}>
            <Card>
              <CardHeader title="Submission Details" />
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Person />
                  </ListItemIcon>
                  <StyledListItemText
                    primary={solution.username}
                    secondary="Username"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Code />
                  </ListItemIcon>
                  <StyledListItemText
                    primary={solution.lang}
                    secondary="Language"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <AccessTime />
                  </ListItemIcon>
                  <StyledListItemText
                    primary={dayjs(solution.submissionDate).fromNow()}
                    secondary="Submitted"
                  />
                </ListItem>
              </List>
            </Card>
          </Grid>
          <Grid item xs={12}>
            {/* <Card>
              <CardHeader title="Test Cases" />
              <CardContent>
                <List>
                  <StyledChip label="Public" color="success" />
                  {solution.problem?.testSuite?.publicCases?.map(
                    (item, index) => {
                      return (
                        <TestCases
                          key={`${index}-${item.id}`}
                          testCase={item}
                          functionName={
                            solution.problem.title || "functionName"
                          }
                        />
                      );
                    }
                  )}
                  <Divider />

                  <StyledChip label="Private" color="warning" />
                  {solution.problem?.testSuite?.privateCases?.map(
                    (item, index) => {
                      return (
                        <TestCases
                          key={`${index}-${item.id}`}
                          testCase={item}
                          functionName={
                            solution.problem.title || "functionName"
                          }
                        />
                      );
                    }
                  )}
                </List>
              </CardContent>
            </Card> */}
          </Grid>
        </Grid>
        <Grid item md={9} sm={12} xs={12}>
          <PreviewCodeEditorContainer
            code={solution.code}
            inputLanguage={solution.lang}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default Solution;
