import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  List,
  ListItem,
  ListItemSecondaryAction,
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
import dayjs from "dayjs";

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
        <Grid item md={8} xs={12}>
          <Card>
            <CardHeader title="✏️ Previously Submitted Solutions" />
            <CardContent>
              <TableContainer sx={{ minHeight: 302 }}>
                <Table aria-label="Solutions table">
                  <TableHead>
                    <TableRow>
                      {user.solutions?.length === 0 ? (
                        <TableCell></TableCell>
                      ) : (
                        solutionTablelFields.map((cell, index) => (
                          <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
                        ))
                      )}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {user.solutions?.length === 0 ? (
                      <TableRow>
                        <TableCell sx={{ textAlign: "center" }}>
                          Your solutions will appear here!
                        </TableCell>
                      </TableRow>
                    ) : (
                      user.solutions?.map((solution) => (
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
                          <TableCell>
                            {dayjs(solution.submissionDate).fromNow()}
                          </TableCell>
                          <TableCell>
                            <SuccessChip
                              score={solution.correctness}
                              label={`${solution.correctness}%`}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
        <Grid container item rowSpacing={3} xs={12} md={4} direction="row">
          <Grid item xs={12}>
            <Card>
              <CardHeader title={`📈 Progress (Score: ${user.score})`} />
              <CardContent>
                <BorderLinearProgress
                  variant="determinate"
                  value={progressPercentage()}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12}>
            <Card sx={{ minHeight: "100%" }}>
              <CardContent>
                <Typography variant="h6">🤔 Suggested Task</Typography>
                <>
                  <List>
                    {nextProblem ? (
                      <>
                        <ListItem>
                          <ListItemSecondaryAction>
                            <DifficultyChip
                              label={
                                nextProblem?.difficulty
                                  ? nextProblem.difficulty
                                  : ""
                              }
                            />
                          </ListItemSecondaryAction>
                        </ListItem>
                        <ListItem>
                          <ListItemText
                            primary={<code>{nextProblem?.title}</code>}
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
                      </>
                    ) : (
                      <ListItem>
                        <ListItemText>
                          No more suggested tasks 🎉 <br /> please check again
                          later
                        </ListItemText>
                      </ListItem>
                    )}
                  </List>
                </>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardHeader title="🏆 Cohort Leaderboard" />
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
