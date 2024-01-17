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
  ListSubheader,
  TableContainer,
  Typography,
} from "@mui/material";
import { IUser } from "../interfaces/user";
import authService from "../services/authService";
import UserService from "../services/userService";
import { useEffect, useState } from "react";
import EmptyState from "../components/global/EmptyState";
import Loading from "../components/global/Loading";
import solutionService from "../services/solutionService";
import { ISolutionDTO } from "../interfaces/solutions";
import { IJWTUser } from "../interfaces/network";
import { ListItemIcon } from "@material-ui/core";
import {
  ArrowForward,
  ArrowRight,
  Description,
  Groups,
} from "@mui/icons-material";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import SolutionsChart from "../components/SolutionsChart";
import FilterTable, { ITableFields } from "../components/global/FilterTable";
import { ICohortDTO } from "../interfaces/cohort";
import cohortService from "../services/cohortService";
import SuccessChip from "../components/problem/SuccessChip";

const StyledCardActions = styled(CardActions)`
  justify-content: flex-end;
`;

const AdminDashboard = () => {
  // const { cohorts } = useContext(AppContext) as IAppContext;
  const [cohorts, setCohorts] = useState<ICohortDTO[]>([]);
  const [user, setUser] = useState<IJWTUser>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [solutions, setSolutions] = useState<ISolutionDTO[]>([]);

  const [globalBoard, setGlobalBoard] = useState<IUser[]>();

  const leaderboardTableFields: ITableFields[] = [
    { label: "Rank", field: "id", type: "index" },
    { label: "User", field: "username", type: "string" },
    { label: "Score", field: "score", type: "string" },
    { label: "Cohort", field: "cohort.name", type: "string" },
  ];

  useEffect(() => {
    const user = authService.getUser();
    const token = authService.getAccessToken();
    if (!token) {
      setError("Authentication error, please log in again");
      setLoading(false);
      return;
    }
    if (!user || !user.userId) {
      setError("Authentication error, please log in again");
      setLoading(false);
      return;
    }
    setUser(user);
    setError("");
    setLoading(true);

    solutionService
      .getAll(token, (updatedSolutions: ISolutionDTO[]) => {
        // Update the component's state for each page retrieved
        setSolutions(updatedSolutions);
        setLoading(false);
      })
      .then(() => {
        console.log("Finished fetching all solutions");
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
        setLoading(false);
      });

    cohortService.getPageContent(token).then((recentCohorts) => {
      setCohorts(recentCohorts);
    });
  }, []);

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;
  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h1">Hi, {user?.sub} 👋🏻</Typography>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="📊 Submissions by Week" />
            <CardContent>
              <SolutionsChart
                solutions={solutions}
                granularity="week"
                maxPoints={10}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title="👨‍🎓 Recent Cohorts" />
            <TableContainer sx={{ height: 350 }}>
              <List>
                {cohorts.length === 0 ? (
                  <ListItem>
                    <ListItemText>No Cohorts added yet</ListItemText>
                  </ListItem>
                ) : (
                  cohorts
                    .sort(
                      (a, b) =>
                        new Date(b.startDate).getTime() -
                        new Date(a.startDate).getTime()
                    )
                    .slice(0, 4)
                    .map((cohort) => {
                      return (
                        <ListItem key={cohort.id}>
                          <ListItemButton
                            component={Link}
                            to={`/cohorts/${cohort.id}`}
                          >
                            <ListItemIcon>
                              <Groups />
                            </ListItemIcon>
                            <ListItemText
                              primary={`${cohort.name} - ${
                                cohort.numberOfMembers
                              } member${cohort.numberOfMembers > 1 ? "s" : ""}`}
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
          {solutions && solutions.length > 0 && (
            <Card>
              <CardHeader title="📋 Recent Submissions" />
              <TableContainer sx={{ height: 350 }}>
                <List>
                  <ListItem>
                    <Grid container spacing={2}>
                      <Grid item xs={1}>
                        {" "}
                        {/* Icon placeholder column */}
                      </Grid>
                      <Grid item xs={3}>
                        <ListSubheader>Problem</ListSubheader>
                      </Grid>
                      <Grid item xs={2}>
                        <ListSubheader>Submitted By</ListSubheader>
                      </Grid>
                      <Grid item xs={3}>
                        <ListSubheader>Date</ListSubheader>
                      </Grid>
                      <Grid item xs={2}>
                        <ListSubheader>Correctness</ListSubheader>
                      </Grid>
                      <Grid item xs={1}>
                        {" "}
                        {/* Action placeholder column */}
                      </Grid>
                    </Grid>
                  </ListItem>

                  {solutions.length === 0 ? (
                    <ListItem>
                      <ListItemText>No Submissions added yet</ListItemText>
                    </ListItem>
                  ) : (
                    solutions
                      .sort(
                        (a, b) =>
                          new Date(b.submissionDate).getTime() -
                          new Date(a.submissionDate).getTime()
                      )
                      .slice(0, 4)
                      .map((submission: ISolutionDTO) => {
                        return (
                          <ListItem key={submission.id} divider>
                            <ListItemButton
                              component={Link}
                              to={`/solutions/${submission.id}`}
                            >
                              <Grid container spacing={2}>
                                <Grid item xs={1}>
                                  <ListItemIcon>
                                    <Description />
                                  </ListItemIcon>
                                </Grid>
                                <Grid item xs={3}>
                                  <ListItemText
                                    primary={`${submission.title} (${submission.difficulty})`}
                                  ></ListItemText>
                                </Grid>
                                <Grid item xs={2}>
                                  <ListItemText
                                    primary={submission.username}
                                  ></ListItemText>
                                </Grid>
                                <Grid item xs={3}>
                                  <ListItemText
                                    primary={dayjs(
                                      submission.submissionDate
                                    ).fromNow()}
                                  ></ListItemText>
                                </Grid>
                                <Grid item xs={2}>
                                  <SuccessChip
                                    label={`${submission.correctness}%`}
                                    score={submission.correctness}
                                  />
                                </Grid>
                                <Grid item xs={1}>
                                  <ListItemSecondaryAction>
                                    <ArrowRight />
                                  </ListItemSecondaryAction>
                                </Grid>
                              </Grid>
                            </ListItemButton>
                          </ListItem>
                        );
                      })
                  )}
                </List>
              </TableContainer>
              <StyledCardActions>
                <Button
                  endIcon={<ArrowForward />}
                  component={Link}
                  to="/solutions"
                >
                  All Submissions
                </Button>
              </StyledCardActions>
            </Card>
          )}
        </Grid>

        <Grid item xs={12}>
          {globalBoard && globalBoard.length > 0 && (
            <FilterTable
              fields={leaderboardTableFields}
              rows={globalBoard || []}
              highlightId={user?.userId}
              title={"🏆 Global Leaderboard"}
            />
          )}
        </Grid>
      </Grid>
    </Container>
  );
};
export default AdminDashboard;
