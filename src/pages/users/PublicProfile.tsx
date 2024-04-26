import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { IUserProfile } from "../../interfaces/user";
import userProfileService from "../../services/userProfileService";
import authService from "../../services/authService";
import Loading from "../../components/global/Loading";
import {
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Avatar,
  List,
  ListItem,
  Divider,
  Chip,
  ListItemIcon,
  ListItemText,
  Button,
  Fab,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import GitHubIcon from "@mui/icons-material/GitHub";
import DownloadIcon from "@mui/icons-material/Download";
import BackArrow from "../../components/global/BackArrow";
import EmptyState from "../../components/global/EmptyState";
import { ArrowForward, Edit, WorkHistory } from "@mui/icons-material";
import { TitleActionWrapper, TitleWrapper } from "./UserInfo";

const PublicProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [resume, setResume] = useState<string | null>(null);
  const [headshot, setHeadshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = authService.getAccessToken();

    const fetchData = async () => {
      setLoading(true);
      try {
        const resumeFile = await userProfileService.getResume(
          token || "",
          id || ""
        );
        setResume(URL.createObjectURL(resumeFile));

        const headshotFile = await userProfileService.getHeadshot(
          token || "",
          id || ""
        );
        setHeadshot(URL.createObjectURL(headshotFile));
      } catch (error: any) {
        setLoading(false);
      }
      try {
        const userProfileData = await userProfileService.getById(
          token || "",
          id || ""
        );
        setUserProfile(userProfileData);

        setLoading(false);
      } catch (error: any) {
        setError("Error fetching user profile: " + error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const isAdmin = authService.getUser()?.roles?.includes("ADMIN");
  const userOwned = () => {
    if (!authService.getUser()) return false;
    console.log(
      `user: ${authService.getUser()?.userId}, provided id: ${id?.toString()}`
    );
    console.log(authService.getUser()?.userId === id?.toString());
    return authService.getUser()?.userId?.toString() === id;
  };
  const canAccess = () => {
    const permission = userOwned() || isAdmin;
    //if(!permission) setError("Permission denied");
    return permission;
  };

  if (!canAccess()) return <EmptyState message={"Permission denied"} />;
  if (error) return <EmptyState message={error} />;
  if (!loading && !userProfile)
    return <EmptyState message="User profile not found" />;
  if (!userProfile) {
    return <Loading />;
  }
  if (loading) return <Loading />;
  // if (!resume || !headshot)
  //   return (
  //     <>
  //       <Box p={3}>
  //         <BackArrow />
  //       </Box>
  //       <div>Profile incomplete, resume and/or headshot missing.</div>
  //     </>
  //   );

  const {
    fullName,
    bio,
    education,
    workExperience,
    preferredLocations,
    preferredRoles,
    githubLink,
  } = userProfile;

  return (
    <Box p={3}>
      <Box display={"flex"} justifyContent={"space-between"}>
        <BackArrow />
        <Button
          color="info"
          component={Link}
          to={"/candidates/anonymised/" + id}
          endIcon={<ArrowForward />}
          target="_blank"
        >
          View Anonymous Version (New Tab)
        </Button>
      </Box>
      {isAdmin && (
        <TitleWrapper>
          <Typography variant="h1">Profile</Typography>
          <TitleActionWrapper>
            <Fab
              color="primary"
              aria-label="Edit User Profile"
              component={Link}
              to={`/users/edit/${id}`}
            >
              <Edit />
            </Fab>
          </TitleActionWrapper>
        </TitleWrapper>
      )}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <Box display="flex" justifyContent="center" pt={2}>
              <Avatar
                sx={{ width: 150, height: 150, fontSize: "3rem" }}
                src={headshot || ""}
                alt="No headshot provided"
              />
            </Box>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                {fullName}
              </Typography>
              <Typography variant="body1" color="textSecondary" align="center">
                {bio}
              </Typography>
            </CardContent>
            <Box display="flex" justifyContent="space-around" p={2}>
              {resume ? (
                <Chip
                  label="Download Resume"
                  clickable
                  component="a"
                  href={resume}
                  download
                  variant="outlined"
                  icon={<DownloadIcon />}
                />
              ) : <Chip
              label="No resume provided"
              variant="outlined"
              icon={<DownloadIcon />}
              color="error"
            />}
              {githubLink && (
                <Chip
                  label="Github"
                  clickable
                  component="a"
                  href={githubLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outlined"
                  icon={<GitHubIcon />}
                />
              )}
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container xs={12} md={12} sm={12} spacing={3}>
            <Grid item xs={12} md={12} sm={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ListItemIcon>
                      <SchoolIcon />
                    </ListItemIcon>
                    Education
                  </Typography>
                  <Divider />
                  <List>
                    {education &&
                      education.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText>{item}</ListItemText>
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={12} sm={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ListItemIcon>
                      <WorkHistory />
                    </ListItemIcon>
                    Work Experience
                  </Typography>
                  <Divider />
                  <List>
                    {workExperience &&
                      workExperience.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText>{item}</ListItemText>
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6} sm={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ListItemIcon>
                      <LocationOnIcon />
                    </ListItemIcon>
                    Preferred Locations
                  </Typography>
                  <Divider />
                  <List>
                    {preferredLocations &&
                      preferredLocations.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText>{item}</ListItemText>
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6} sm={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ListItemIcon>
                      <WorkOutlineIcon />
                    </ListItemIcon>
                    Preferred Roles
                  </Typography>
                  <Divider />
                  <List>
                    {preferredRoles &&
                      preferredRoles.map((item, index) => (
                        <ListItem key={index}>
                          <ListItemText>{item}</ListItemText>
                        </ListItem>
                      ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
};

export default PublicProfile;
