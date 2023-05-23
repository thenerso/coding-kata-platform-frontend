import {
  Mail,
  Class,
  SportsEsports,
  LockClock,
  Lock,
  ArrowBack,
} from "@mui/icons-material";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
  Grid,
} from "@mui/material";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';


import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/global/EmptyState";
import Loading from "../../components/global/Loading";
import { IUser } from "../../interfaces/user";
import authService from "../../services/authService";
import userService from "../../services/userService";
import FilterTable, { ITableFields } from "../../components/global/FilterTable";

dayjs.extend(relativeTime);

const UserInfo = ({title = "User Info"}) => {
  const [user, setUser] = useState<IUser>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  const token = authService.getAccessToken();

  useEffect(() => {
    if (token) {
      if (!user && id) {
        setError("");
        setLoading(true);
        userService
          .getById(token, id)
          .then((result) => {
            setUser(result);
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
  }, [user, id, token]);

  const solutionTableFields: ITableFields[] = [
    { label: "ID", field: "id", type: "string" },
    { label: "Problem", field: "problem.title", type: "string" },
    { label: "Difficulty", field: "problem.difficulty", type: "difficulty" },
    { label: "Language", field: "lang", type: "string" },
    { label: "Submission Date", field: "submissionDate", type: "date" },
    { label: "Correctness", field: "correctness", type: "success" },
  ];

  if (loading) return <Loading />;
  if (error || !user) return <EmptyState message={error} />;
  return (
    <>
      <Button
        color="info"
        component={Link}
        to="/users"
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      <Typography variant="h1">{title}</Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={4}>
          <Card>
            <CardHeader title={user.username} subheader={user.email} />

            <CardContent>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <Lock />
                  </ListItemIcon>
                  <ListItemText
                    primary={user.roles?.toString()}
                    secondary="Role"
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <Mail />
                  </ListItemIcon>
                  <ListItemText primary={user.email} secondary="Email" />
                </ListItem>
                {user.cohort && (
                  <ListItem>
                    <ListItemIcon>
                      <Class />
                    </ListItemIcon>
                    <ListItemText
                      primary={user.cohort?.name}
                      secondary="Cohort"
                    />
                  </ListItem>
                )}

                <ListItem>
                  <ListItemIcon>
                    <SportsEsports />
                  </ListItemIcon>
                  <ListItemText primary={user.score} secondary="Score" />
                </ListItem>

                <ListItem>
                  <ListItemIcon>
                    <LockClock />
                  </ListItemIcon>
                  <ListItemText
                    primary={dayjs(user.joinDate).fromNow()}
                    secondary="Joined"
                  />
                </ListItem>
              </List>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Card>
            <FilterTable
              title="Submitted Solutions"
              rows={user.solutions}
              fields={solutionTableFields}
              viewLink='/solutions/'
            />
          </Card>
        </Grid>
      </Grid>
    </>
  );
};

export default UserInfo;
