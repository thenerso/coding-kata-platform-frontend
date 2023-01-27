import { Mail, Class, SportsEsports, LockClock, Lock } from "@mui/icons-material";
import {
  Typography,
  Card,
  CardHeader,
  CardContent,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { error } from "console";
import dayjs from "dayjs";
import { setDefaultResultOrder } from "dns";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../../components/global/EmptyState";
import Loading from "../../components/global/Loading";
import { IUser } from "../../interfaces/user";
import authService from "../../services/authService";
import problemSetServices from "../../services/problemSetService";
import userService from "../../services/userService";

const User = () => {
  const [user, setUser] = useState<IUser>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  const token = authService.getAccessToken();

  useEffect(() => {
    // async function fetchUser() {
    //   try {
    //     if (token && id) {
    //       const result = await userService.getById(token, id);
    //       setUser(result);
    //       setLoading(false);
    //     }
    //   } catch (err) {
    //     console.log("Error getting user", err);
    //     setError("Error fetching data");
    //     setLoading(false);
    //   }
    // }
    if (token) {
      if (!user && id) {
        setError("");
        setLoading(true);
        // fetchUser();
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
  }, [user, id]);

  if (loading) return <Loading />;
  if (error || !user) return <EmptyState message={error} />;
  return (
    <>
      <Typography variant="h1">User Info</Typography>

      <Card>
        <CardHeader title={user.username} subheader={user.email} />

        <CardContent>
          <List>
            <ListItem>
              <ListItemIcon>
                <Lock />
              </ListItemIcon>
              <ListItemText primary={user.roles} secondary="Role" />
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
                <ListItemText primary={user.cohort?.name} secondary="Cohort" />
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
    </>
  );
};

export default User;
