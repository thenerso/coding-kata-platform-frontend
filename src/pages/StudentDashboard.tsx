import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  List,
  ListItem,
  ListItemText,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { IUser, IUserProgress } from "../interfaces/user";
import authService from "../services/authService";
import UserService from "../services/userService";
import { useEffect, useState } from "react";
import EmptyState from "../components/global/EmptyState";
import Loading from "../components/global/Loading";
import { useNavigate } from "react-router-dom";
import DifficultyChip from "../components/problem/DifficultyChip";
import { IProblem } from "../interfaces/problemSet";
import ProblemService from "../services/problemService";
import BorderLinearProgress from "../components/global/BorderLinearProgress";
import CohortLeaderoard from "../components/user/Leaderboard";
import { Link } from "react-router-dom";
import SuccessChip from "../components/problem/SuccessChip";

const StudentDashboard = () => {
  const [user, setUser] = useState<IUser>();
  const [userProgress, setUserProgress] = useState<IUserProgress>({
    username: "",
    problemsSolved: 0,
    totalProblems: 0,
    score: 0,
  });
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [nextProblem, setNextProblem] = useState<IProblem>();
  const [cohortBoard, setCohortBoard] = useState<IUser[]>();

  const navigate = useNavigate();

  const solutionTablelFields = [
    "Problem",
    "Difficulty",
    "Language",
    "Submission Date",
    "Status",
  ];

  const progressPercentage = () => {
    const prog = Math.round(
      (userProgress.problemsSolved / userProgress.totalProblems) * 100
    );
    return prog;
  };

  useEffect(() => {
    const user = authService.getUser();
    const token = authService.getAccessToken();
    if (token) {
      if (user && user.userId) {
        setError("");
        setLoading(true);
        UserService.getUserProgress(token, user.userId.toString())
          .then((result) => {
            setUserProgress(result);
          })
          .catch((err) => {
            console.log("Error getting progress ", err);
            setError("Error fetching progress data");
          });

        UserService.getById(token, user.userId.toString())
          .then((result) => {
            setUser(result);
            setLoading(false);
            if (result?.cohort) {
              UserService.getCohortLeaderoard(
                token,
                result?.cohort?.id.toString()
              ).then((res) => {
                setCohortBoard(res);
              });
            }
          })
          .catch((err) => {
            console.log("Error getting cohorts", err);
            setError("Error fetching data");
            setLoading(false);
          });

        ProblemService.getNextForUser(token, user.userId.toString())
          .then((result) => {
            setNextProblem(result);
          })
          .catch((err) => {
            console.log("Error getting next problem for user", err);
            setError("Error fetching data");
            setLoading(false);
          });
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, []);

  if (loading) return <Loading />;
  if (error !== "" || !user) return <EmptyState message={error} />;
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h1">Hi {user.username} 👋🏻</Typography>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title={`Your Progress (Score: ${user.score})`} />
            <CardContent>
              <BorderLinearProgress
                variant="determinate"
                value={progressPercentage()}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardHeader title="Previously Submitted Solutions" />
            <CardContent>
              <TableContainer sx={{ height: 240 }}>
                <Table sx={{ minWidth: 650 }} aria-label="Solutions table">
                  <TableHead>
                    <TableRow>
                      {solutionTablelFields.map((cell, index) => (
                        <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.solutions?.map((solution) => (
                      <TableRow
                        key={solution.id}
                        hover
                        onClick={() => navigate(`/solutions/${solution.id}`)}
                        style={{ cursor: "pointer" }}
                      >
                        <TableCell>{solution.problem.title}</TableCell>
                        <TableCell>
                          {" "}
                          <DifficultyChip
                            label={solution.problem.difficulty || ""}
                          />
                        </TableCell>
                        <TableCell>{solution.lang}</TableCell>
                        <TableCell>{solution.submissionDate}</TableCell>
                        <TableCell>
                          <SuccessChip
                            score={solution.correctness}
                            label={`${solution.correctness}%`}
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Grid container>
                <Grid item xs={9}>
                  <Typography variant="h6">Suggested Task</Typography>
                </Grid>
                <Grid item xs={3}>
                  <DifficultyChip
                    label={
                      nextProblem?.difficulty ? nextProblem.difficulty : ""
                    }
                  />
                </Grid>
              </Grid>
              <TableContainer sx={{ height: 272 }}>
                <List>
                  <ListItem>
                    <ListItemText
                      primary={nextProblem?.title}
                      secondary={nextProblem?.description}
                    />
                  </ListItem>
                  <ListItem>
                    <Button
                      variant="contained"
                      component={Link}
                      to={`/problems/attempt/${nextProblem?.id}`}
                    >
                      Attempt
                    </Button>
                  </ListItem>
                </List>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="Cohort Leaderboard" />
            <CardContent>
              <CohortLeaderoard
                leaderboard={cohortBoard}
                userId={user.id || 0}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default StudentDashboard;
