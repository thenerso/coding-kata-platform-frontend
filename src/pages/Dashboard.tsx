import {
  Button,
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  LinearProgress,
  List,
  ListItem,
  ListItemIcon,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { IUser } from "../interfaces/user";
import authService from "../services/authService";
import UserService from "../services/userService";
import { useEffect, useState } from "react";
import EmptyState from "../components/global/EmptyState";
import Loading from "../components/global/Loading";
import { ListItemText } from "@material-ui/core";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import DifficultyChip from "../components/problem/DifficultyChip";
import SuccessChip from "../components/problem/SuccessChip";
import { IProblem } from "../interfaces/problemSet";
import ProblemService from "../services/problemService";
import BorderLinearProgress from "../components/global/BorderLinearProgress";
import CohortLeaderoard from "../components/cohort/Leaderboard";
/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const Dashboard = () => {
  const [user, setUser] = useState<IUser>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [nextProblem, setNextProblem] = useState<IProblem>();
  const [cohortBoard, setCohortBoard] = useState<IUser[]>();
  const [globalBoard, setGlobalBoard] = useState<IUser[]>();
  const navigate = useNavigate();

  const solutionTablelFields = [
    "Problem",
    "Difficulty",
    "Language",
    "Submission Date",
    "Status",
  ];

  useEffect(() => {
    const user = authService.getUser();
    const token = authService.getAccessToken();
    if (token) {
      if (user && user.userId) {
        setError("");
        setLoading(true);
        UserService.getById(token, user.userId.toString())
          .then((result) => {
            console.log(result);
            setUser(result);
            setLoading(false);
            UserService.getCohortLeaderoard(
              token,
              result?.cohort?.id.toString()
            ).then((res) => {
              setCohortBoard(res);
              console.log(res);
            });
            // .catch((err) => {
            //   console.log("Error getting leaderboard", err);
            //   setError("Error fetching leaderboard data");
            // });
          })
          .catch((err) => {
            console.log("Error getting cohorts", err);
            setError("Error fetching data");
            setLoading(false);
          });

        UserService.getGlobalLeaderboard(token)
          .then((res) => {
            setGlobalBoard(res);
            console.log("global board: ", res);
          })
          .catch((err) => {
            console.log("Error getting global leaderboard", err);
            setError("Error fetching global leaderboard data");
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
          {/* <Card>
            <CardContent> */}
          <Typography variant="h4">
            {user.username.toUpperCase()}'s Dashboard
          </Typography>
          {/* </CardContent>
          </Card> */}
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Total Progress (Score: {user.score})
              </Typography>
              <BorderLinearProgress variant="determinate" value={50} />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardContent>
              <Typography variant="h6">
                Previously Submitted Solutions
              </Typography>
              {/* <TableContainer> */}
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
                          label={solution.correct ? "Correct" : "Incorrect"}
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardContent>
              <Typography variant="h6">Next Recommended Task</Typography>
              <List>
                <ListItem>
                  <ListItemText
                    primary={nextProblem?.title}
                    secondary={nextProblem?.description}
                  />
                </ListItem>
                <ListItem>
                  <Button variant="contained">Attempt</Button>
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <CohortLeaderoard
                title="Global Leaderboard"
                leaderboard={globalBoard}
                user={user}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardContent>
              <CohortLeaderoard
                title="Cohort Leaderboard"
                leaderboard={cohortBoard}
                user={user}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default Dashboard;
