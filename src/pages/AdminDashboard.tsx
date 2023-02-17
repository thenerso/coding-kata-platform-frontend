import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Container,
  Grid,
  List,
  ListItem,
  ListItemButton,
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
import { IUser } from "../interfaces/user";
import authService from "../services/authService";
import UserService from "../services/userService";
import { useContext, useEffect, useState } from "react";
import EmptyState from "../components/global/EmptyState";
import Loading from "../components/global/Loading";
import { useNavigate } from "react-router-dom";
import DifficultyChip from "../components/problem/DifficultyChip";
import SuccessChip from "../components/problem/SuccessChip";
import CohortLeaderoard from "../components/user/Leaderboard";
import solutionService from "../services/solutionService";
import { ISolution } from "../interfaces/solutions";
import { IJWTUser } from "../interfaces/network";
import { ListItemIcon } from "@material-ui/core";
import { ArrowForward, ArrowRight, Groups } from "@mui/icons-material";
import { AppContext, IAppContext } from "../context/AppContext";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";

const StyledCardActions = styled(CardActions)`
  justify-content: flex-end;
`;

const AdminDashboard = () => {
  const { cohorts } = useContext(AppContext) as IAppContext;

  const [user, setUser] = useState<IJWTUser>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [solutions, setSolutions] = useState<ISolution[]>([]);

  const [globalBoard, setGlobalBoard] = useState<IUser[]>();
  const navigate = useNavigate();

  const solutionTablelFields = [
    "ID",
    "Problem",
    "Difficulty",
    "Language",
    "User",
    "Submission Date",
    "Correctness",
  ];

  useEffect(() => {
    const user = authService.getUser();
    const token = authService.getAccessToken();
    if (token) {
      if (user && user.userId) {
        setUser(user);
        setError("");
        setLoading(true);
        solutionService
          .getAll(token)
          .then((result) => {
            setSolutions(result);
          })
          .catch((err) => {
            console.log("Error getting solutions", err);
            setError("Error fetching data");
          });

        UserService.getGlobalLeaderboard(token)
          .then((res) => {
            setGlobalBoard(res);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error getting global leaderboard", err);
            setError("Error fetching global leaderboard data");
          });
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, []);

  if (loading) return <Loading />;
  if (error !== "") return <EmptyState message={error} />;
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h1">Hi, {user?.sub} 👋🏻</Typography>
        </Grid>
        <Grid item xs={8}>
          <Card>
            <CardHeader title="✏️ Recent Student Submissions" />
            <CardContent>
              <TableContainer sx={{ height: 308 }}>
                <Table sx={{ minWidth: 650 }} aria-label="Solutions table">
                  <TableHead>
                    <TableRow>
                      {solutionTablelFields.map((cell, index) => (
                        <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {solutions.length === 0 ? (
                      <TableRow>
                        <TableCell>No Solutions added yet</TableCell>
                      </TableRow>
                    ) : (
                      solutions.slice(0, 5).map((row) => (
                        <TableRow
                          key={`${row.id}-${row.problem?.title}`}
                          hover
                          onClick={() => navigate(`/solutions/${row.id}`)}
                          style={{ cursor: "pointer" }}
                        >
                          <TableCell>{row.id}</TableCell>
                          <TableCell>{row.problem?.title}</TableCell>
                          <TableCell>
                            <DifficultyChip
                              label={row.problem?.difficulty || ""}
                            />
                          </TableCell>
                          <TableCell>{row.lang}</TableCell>
                          <TableCell>{row.user?.username}</TableCell>
                          <TableCell>
                            {dayjs(row.submissionDate).fromNow()}
                          </TableCell>
                          <TableCell>
                            <SuccessChip
                              score={row.correctness}
                              label={row.correctness.toString() + "%"}
                            />
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
            <StyledCardActions>
              <Button
                endIcon={<ArrowForward />}
                component={Link}
                to="/solutions"
              >
                All Solutions
              </Button>
            </StyledCardActions>
          </Card>
        </Grid>
        <Grid item xs={4}>
          <Card>
            <CardHeader title="👨‍🎓 Recent Cohorts" />
            <TableContainer sx={{ height: 340 }}>
              <List>
                {cohorts.length === 0 ? (
                  <ListItem>
                    <ListItemText>No Cohorts added yet</ListItemText>
                  </ListItem>
                ) : (
                  cohorts.slice(0, 4).map((cohort) => {
                    return (
                      <ListItem>
                        <ListItemButton>
                          <ListItemIcon>
                            <Groups />
                          </ListItemIcon>
                          <ListItemText
                            primary={`${cohort.name} - ${
                              cohort.members.length
                            } member${cohort.members.length > 1 ? "s" : ""}`}
                            secondary={`Started ${dayjs(
                              cohort.startDate
                            ).fromNow()}`}
                          ></ListItemText>

                          <ListItemSecondaryAction>
                            <ArrowRight />
                          </ListItemSecondaryAction>
                        </ListItemButton>
                      </ListItem>
                    );
                  })
                )}
              </List>
            </TableContainer>
            <StyledCardActions>
              <Button endIcon={<ArrowForward />} component={Link} to="/cohorts">
                All Cohorts
              </Button>
            </StyledCardActions>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card>
            <CardHeader title="🏆 Global Leaderboard" />
            <CardContent>
              <TableContainer sx={{ height: 500 }}>
                <CohortLeaderoard
                  leaderboard={globalBoard}
                  userId={user?.userId || 0}
                />
              </TableContainer>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};
export default AdminDashboard;
