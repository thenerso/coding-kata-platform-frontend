import { Card, CardContent, CardHeader, Container, Grid, List, ListItem, ListItemIcon, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import styled from "@emotion/styled";
import { IUser } from "../interfaces/user";
import authService from "../services/authService";
import UserService from "../services/userService";
import { useEffect, useState } from "react";
import EmptyState from "../components/global/EmptyState";
import Loading from "../components/global/Loading";
import { Class, LockClock, Mail, SportsEsports } from "@mui/icons-material";
import { ListItemText } from "@material-ui/core";
import dayjs from "dayjs";
import { useNavigate } from "react-router-dom";
import DifficultyChip from "../components/problem/DifficultyChip";
import SuccessChip from "../components/problem/SuccessChip";
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
  const navigate = useNavigate();

  const solutionTablelFields = ["Problem",  "Difficulty", "Language", "Submission Date", "Status"];


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
  }, []);

  if (loading) return <Loading />;
  if (error !== "" || !user) return <EmptyState message={error} />;
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h4">{user.username.toUpperCase()}'s Dashboard</Typography>
              <Typography variant="h6">Score: {user.score}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Submitted Solutions</Typography>
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
                    <TableRow key={solution.id }
                    hover
                    onClick={() => navigate(`/solutions/${solution.id}`)}
                    style={{ cursor: "pointer" }}>
                      <TableCell>{solution.problem.title}</TableCell>
                      <TableCell>  <DifficultyChip label={solution.problem.difficulty || ""} /></TableCell>
                      <TableCell>{solution.lang}</TableCell>
                      <TableCell>{solution.submissionDate}</TableCell>
                      <TableCell><SuccessChip label={solution.correct ? "Correct" : "Incorrect"} /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              {/* </TableContainer> */}
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h5">Next Problem To Try</Typography>
              <List>
                <ListItem>
                  <ListItemText primary={sampleUser.nextProblem.name} secondary={sampleUser.nextProblem.description} />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
const sampleUser = {
  name: "John Doe",
  score: 1000,
  solutions: [
    {
      id: 1,
      problemName: "Problem 1",
      status: "Accepted",
      score: 100,
    },
    {
      id: 2,
      problemName: "Problem 2",
      status: "Rejected",
      score: 80,
    },
    {
      id: 3,
      problemName: "Problem 3",
      status: "Accepted",
      score: 120,
    },
  ],
  nextProblem: {
    name: "Problem 4",
    description: "This is a sample problem that the user can try to solve next."
  }
};
export default Dashboard;
