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
  TableContainer,
  Typography,
} from "@mui/material";
import { IUser } from "../interfaces/user";
import authService from "../services/authService";
import UserService from "../services/userService";
import { useContext, useEffect, useState } from "react";
import EmptyState from "../components/global/EmptyState";
import Loading from "../components/global/Loading";
import solutionService from "../services/solutionService";
import { ISolution } from "../interfaces/solutions";
import { IJWTUser } from "../interfaces/network";
import { ListItemIcon } from "@material-ui/core";
import { ArrowForward, ArrowRight, Groups } from "@mui/icons-material";
import { AppContext, IAppContext } from "../context/AppContext";
import dayjs from "dayjs";
import styled from "@emotion/styled";
import { Link } from "react-router-dom";
import SolutionsChart from "../components/SolutionsChart";
import FilterTable, { ITableFields } from "../components/global/FilterTable";

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

  const solutionTableFields: ITableFields[] = [
    // { label: "ID", field: "id", type: "string" },
    { label: "User", field: "user.username", type: "string" },
    { label: "Problem", field: "problem.title", type: "string" },
    { label: "Difficulty", field: "problem.difficulty", type: "difficulty" },
    { label: "Language", field: "lang", type: "string" },
    { label: "Submission Date", field: "submissionDate", type: "date" },
    { label: "Correctness", field: "correctness", type: "success" },
  ];

  const leaderboardTableFields: ITableFields[] = [
    { label: "Rank", field: "id", type: "index" },
    { label: "User", field: "username", type: "string" },
    { label: "Score", field: "score", type: "string" },
    { label: "Cohort", field: "cohort.name", type: "string" },
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
          .getAll(
            token, 
            (updatedSolutions: ISolution[]) => {
              // Update the component's state for each page retrieved
              setLoading(false);
              setSolutions(updatedSolutions);
            }
          )
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
        <Grid item xs={12} md={8}>
          <Card>
            <CardHeader title="📊 Solutions by Week" />
            <CardContent>
              <SolutionsChart solutions={solutions} granularity="week" maxPoints={10}/>
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
                  cohorts.sort((a, b)=> new  Date(b.startDate).getTime() - new Date(a.startDate).getTime()).slice(0, 4).map((cohort) => {
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
          <FilterTable
            rows={solutions}
            viewLink={"/solutions/"}
            fields={solutionTableFields}
            title={"✏️ Recent Student Submissions"}
            defaultOrder="desc"
            defaultOrderBy="submissionDate"
          />
        </Grid>

        <Grid item xs={12}>
          <FilterTable
            fields={leaderboardTableFields}
            rows={globalBoard}
            highlightId={user?.userId}
            title={"🏆 Global Leaderboard"}
          />
        </Grid>
      </Grid>
    </Container>
  );
};
export default AdminDashboard;
