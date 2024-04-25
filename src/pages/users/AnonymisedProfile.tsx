import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
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
  List,
  ListItem,
  Divider,
  Chip,
  ListItemIcon,
  ListItemText,
  Avatar,
} from "@mui/material";
import SchoolIcon from "@mui/icons-material/School";
import WorkIcon from "@mui/icons-material/Work";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";
import DownloadIcon from "@mui/icons-material/Download";
import BackArrow from "../../components/global/BackArrow";
import EmptyState from "../../components/global/EmptyState";

const AnonymisedProfile: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [resume, setResume] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = authService.getAccessToken();

    const fetchData = async () => {
      setLoading(true);
      try {
        const resumeFile = await userProfileService.getResume(token || "", id || "");
        setResume(URL.createObjectURL(resumeFile));
      } catch (error: any) {
        setLoading(false);
      }
      try {
        const userProfileData = await userProfileService.getById(token || "", id || "");
        setUserProfile(userProfileData);

        setLoading(false);
      } catch (error: any) {
        setError("Error fetching user profile: " + error);
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (error) return <EmptyState message={error} />;
  if (!userProfile) {
    return <Loading />;
  }
  if (!loading && !userProfile) return <EmptyState message="User profile not found" />;
  if (loading) return <Loading />;
  if (!resume) return <EmptyState message="Profile incomplete, resume missing." />;

  const {
    bio,
    education = [],
    workExperience = [],
    preferredLocations = [],
    preferredRoles = [],
  } = userProfile;

  return (
    <Box p={3}>
      {/* <BackArrow /> */}
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
          <Box display="flex" justifyContent="center" pt={2}>
              <Avatar
                sx={{ width: 150, height: 150, fontSize: "3rem" }}
                src={""}
                alt="No headshot provided"
              />
            </Box>
            <CardContent>
              <Typography variant="h5" gutterBottom align="center">
                [Anonymous] User Bio
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
            </Box>
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
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
                    {education.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText>{item}</ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>
                    <ListItemIcon>
                      <WorkIcon />
                    </ListItemIcon>
                    Work Experience
                  </Typography>
                  <Divider />
                  <List>
                    {workExperience.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText>{item}</ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid item xs={12} md={6}>
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
                    {preferredLocations.map((item, index) => (
                      <ListItem key={index}>
                        <ListItemText>{item}</ListItemText>
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>
            <Grid item xs={12} md={6}>
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
                    {preferredRoles.map((item, index) => (
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

export default AnonymisedProfile;
