import {
  Mail,
  Class,
  SportsEsports,
  LockClock,
  Lock,
  Edit,
  ArrowForward,
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
  styled,
  Fab,
  Box,
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
import DeleteUser from "../../components/user/DeleteUser";
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

dayjs.extend(relativeTime);

const UserInfo = ({title = "User Info", userId = null}: {title?: string, userId?: string | null} ) => {
  const [user, setUser] = useState<IUser>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { paramId } = useParams();
  const token = authService.getAccessToken();
  const id = userId || paramId;
  console.log("user id: " + id, "param id: " + paramId);


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
  }, [id, user, token]);

  const solutionTableFields: ITableFields[] = [
    { label: "ID", field: "id", type: "string" },
    { label: "Problem", field: "problem.title", type: "string" },
    { label: "Difficulty", field: "problem.difficulty", type: "difficulty" },
    { label: "Language", field: "lang", type: "string" },
    { label: "Submission Date", field: "submissionDate", type: "date" },
    { label: "Correctness", field: "correctness", type: "success" },
  ];

  // const isAdmin = authService.getUser()?.roles?.includes("ADMIN");

  if (loading) return <Loading />;
  if (error || !user) return <EmptyState message={error} />;
  return (
    <>
    <Box display={"flex"} justifyContent={"space-between"}>
      {/* <Button
        color="info"
        component={Link}
        to={isAdmin ? "/users" : "/dashboard"}
        startIcon={<ArrowBack />}
      >
        Back
      </Button> */}
      <BackArrow />
      <Button
        color="info"
        component={Link}
        to={"/candidates/" + id}
        endIcon={<ArrowForward />}
      >
        View Public Profile
      </Button>
    </Box>
      <TitleWrapper>
        <Typography variant="h1">{title}</Typography>
        <TitleActionWrapper>
          <Fab
            color="primary"
            aria-label="Edit User Profile"
            component={Link}
            to={`/users/edit/${user.id}`}
          >
            <Edit />
          </Fab>

          {user.id && authService?.getUser()?.roles?.includes("ADMIN") && <DeleteUser id={user.id} />}
        </TitleActionWrapper>
      </TitleWrapper>
      <Typography variant="caption">
        {dayjs(user.startDate).format("MMM D, YYYY")}
      </Typography>
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
                    primary={user.roles ? user.roles[0] : ''}
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
                    primary={dayjs(user.joinDate).format("DD-MM-YYYY")}
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
