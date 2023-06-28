import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { IUserProfile } from "../../interfaces/user";
import userProfileService from "../../services/userProfileService";
import authService from "../../services/authService";
import Loading from "../../components/global/Loading";
import { Typography, Box, Grid, Card, CardContent, Avatar, List, ListItem, Divider, Chip, ListItemIcon, ListItemText } from "@mui/material";
import SchoolIcon from '@mui/icons-material/School';
import WorkIcon from '@mui/icons-material/Work';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import GitHubIcon from '@mui/icons-material/GitHub';
import DownloadIcon from '@mui/icons-material/Download';
import EmptyState from "../../components/global/EmptyState";


const PublicProfile: React.FC = () => {
  const { id } = useParams<{id:string}>();
  const [userProfile, setUserProfile] = useState<IUserProfile | null>(null);
  const [resume, setResume] = useState<string | null>(null);
  const [headshot, setHeadshot] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = authService.getAccessToken();

    const fetchData = async () => {
        try {
          const [userProfileData, resumeFile, headshotFile] = await Promise.all([
            userProfileService.getById(token || "", id || ""),
            userProfileService.getResume(token || "", id || ""),
            userProfileService.getHeadshot(token || "", id || ""),
          ]);
        
          setUserProfile(userProfileData);
          setResume(URL.createObjectURL(resumeFile));
          setHeadshot(URL.createObjectURL(headshotFile));
          setLoading(false);
        } catch (error) {
          console.error("Error fetching user profile:", error);
        }
      };
      

    fetchData();
  }, [id]);

  if (loading) {
    return <Loading />;
  }

  if (!userProfile) {
    return <Typography variant="h6">User profile not found</Typography>;
  }

  const {
    fullName,
    bio,
    education,
    workExperience,
    preferredLocations,
    preferredRoles,
    githubLink,
  } = userProfile;

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;
  return (
    <Box p={3}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Card>
            <Box display="flex" justifyContent="center" pt={2}>
              <Avatar
                sx={{ width: 150, height: 150, fontSize: '3rem' }}
                src={headshot || ''}
                alt="Headshot"
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
          </Card>
        </Grid>
        <Grid item xs={12} md={8}>
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
                {education && education.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText>{item}</ListItemText>
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" gutterBottom>
                <ListItemIcon>
                  <WorkIcon />
                </ListItemIcon>
                Work Experience
              </Typography>
              <Divider />
              <List>
                {workExperience && workExperience.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText>{item}</ListItemText>
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" gutterBottom>
                <ListItemIcon>
                  <LocationOnIcon />
                </ListItemIcon>
                Preferred Locations
              </Typography>
              <Divider />
              <List>
                {preferredLocations && preferredLocations.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText>{item}</ListItemText>
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" gutterBottom>
                <ListItemIcon>
                  <WorkOutlineIcon />
                </ListItemIcon>
                Preferred Roles
              </Typography>
              <Divider />
              <List>
                {preferredRoles && preferredRoles.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemText>{item}</ListItemText>
                  </ListItem>
                ))}
              </List>
              <Typography variant="h6" gutterBottom>
                <ListItemIcon>
                  <GitHubIcon />
                </ListItemIcon>
                GitHub Link
              </Typography>
              <Divider />
              <Typography variant="body1">
                <a href={githubLink} target="_blank" rel="noopener noreferrer">
                  {githubLink}
                </a>
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      {resume && (
        <Box mt={3}>
          <Typography variant="h6" gutterBottom>
            <ListItemIcon>
              <DownloadIcon />
            </ListItemIcon>
            Resume
          </Typography>
          <Chip
            label="Download Resume"
            clickable
            component="a"
            href={resume}
            download
            variant="outlined"
          />
        </Box>
      )}
    </Box>
  );
};


export default PublicProfile;
