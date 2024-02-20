import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import authService from "../../services/authService";

import styled from "@emotion/styled";

import dayjs, { Dayjs } from "dayjs";
import { Check } from "@mui/icons-material";
import {
  Button,
  Typography,
  Link as MUILink,
  Grid,
  CardHeader,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  CardContent,
  Checkbox,
  ListItemText,
  FormGroup,
  FormControlLabel,
  Box,
} from "@mui/material";
import { useSnackbar } from "notistack";
// import { LocalizationProvider, DesktopDatePicker } from "@mui/x-date-pickers";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { ICohort, ICohortDTO } from "../../interfaces/cohort";
import { UserRoles } from "../../routing/routes";
import userService from "../../services/userService";
import userProfileService from "../../services/userProfileService"; // Assuming you have a userProfileService

import { IUserProfile, IUser } from "../../interfaces/user";
// import { IFile } from "../../interfaces/file";
import FileInput from "../../components/global/FileInput";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";
import { HeadshotInput } from "../../components/user/HeadshotInput";
import StyledCard from "../../components/global/StyledCard";
import URLTextField from "../../components/global/URLTextField";
import EditableHistoryList from "../../components/global/EditableHistoryList";
import cohortService from "../../services/cohortService";
import BackArrow from "../../components/global/BackArrow";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const UpdateUser = () => {
  const [cohorts, setCohorts] = useState<ICohortDTO[]>([]);
  // const [customStartDate, setCustomStartDate] = useState(true);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");

  const [startDate, setStartDate] = useState<Dayjs | null>(dayjs());
  const [cohort, setCohort] = useState<ICohort | ICohortDTO | null>(null);
  const [username, setUsername] = useState("");
  const [roles, setRoles] = useState<string[]>([UserRoles[UserRoles.USER]]);

  // UserProfile states
  const [fullName, setFullName] = useState("");
  const [githubLink, setGithubLink] = useState("");
  const [bio, setBio] = useState("");
  const [headshot, setHeadshot] = useState<string | null>(null);
  const [resume, setResume] = useState<string | null>(null);
  const [education, setEducation] = useState<string[]>([]);
  const [workExperience, setWorkExperience] = useState<string[]>([]);

  const [preferredLocations, setPreferredLocations] = useState<string[]>(["UK Wide"]);
  const locationOptions = ["London", "Edinburgh", "Glasgow", "Liverpool", "Manchester", "Birmingham", "Belfast", "Bristol", "Leeds", "Oxford", "Cardiff"]; // default to UK Wide

  const [preferredRoles, setPreferredRoles] = useState<string[]>(["All"]);
  const roleOptions = [
    "Front End",
    "Back End",
    "DevOps",
    "Data Analysis",
  ];

  const [headshotImage, setHeadshotImage] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);

  const [hasProfile, setHasProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [available, setAvailable] = useState(true);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const { id } = useParams();

  const isAdmin = authService.getUser()?.roles?.includes("ADMIN");

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (id) {
        setError("");
        setLoading(true);

        // const userPromise = userService.getById(token, id);
        // const userProfilePromise = userProfileService.getById(token, id);
        cohortService.getPageContent(token).then((recentCohorts) => {
          setCohorts(recentCohorts);
        });

        userService
          .getById(token, id)
          .then((userResult) => {
            setCohort(userResult?.cohort || null);
            setEmail(userResult?.email || "");
            setUsername(userResult?.username || "");
            setRoles(userResult?.roles || []);
            setStartDate(
              userResult?.joinDate ? dayjs(userResult.joinDate) : null
            );

            userProfileService
              .getById(token, id)
              .then((userProfileResult) => {
                setHasProfile(true);
                setFullName(userProfileResult?.fullName || "");
                setBio(userProfileResult?.bio || "");
                setHeadshot(userProfileResult?.headshot || null);
                setResume(userProfileResult?.resume || null);
                setEducation(userProfileResult?.education || []);
                setWorkExperience(userProfileResult?.workExperience || []);
                // filter out disallowed values
                const validRoles = (userProfileResult?.preferredRoles || []).filter(role => roleOptions.includes(role));
                setPreferredRoles(validRoles);
                // filter out disallowed values
                const validLocations = (userProfileResult?.preferredLocations || []).filter(location => locationOptions.includes(location));
                updateLocations(validLocations);
                setGithubLink(userProfileResult?.githubLink || "");
                setAvailable(userProfileResult?.available || false);
              })
              .catch((err) => {
                console.log("Error fetching user profile", err);
              })
              .finally(() => setLoading(false));
          })
          .catch((err) => {
            console.log("Error fetching user", err);
            setError("Error fetching data");
            setLoading(false);
          });

        loadHeadshot(token, id);
        loadResume(token, id);
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
    console.log(authService.getUser());
  }, [id]);

  const loadHeadshot = async (token: string, id: string) => {
    const blob: File = await userProfileService.getHeadshot(token, id);
    setHeadshotImage(blob);
  };

  const loadResume = async (token: string, id: string) => {
    const blob: File = await userProfileService.getResume(token, id);
    setResumeFile(blob);
  };

  const handleHeadshotChange = (newFile: File | null) => {
    setHeadshotImage(newFile ? newFile : null);
  };

  const handleResumeChange = (newFile: File | null) => {
    setResumeFile(newFile ? newFile : null);
  };

  const handleAddEducation = (newEducation: string) => {
    setEducation((prevEducation) => [...prevEducation, newEducation]);
  };

  const handleDeleteEducation = (index: number) => {
    setEducation((prevEducation) =>
      prevEducation.filter((_, i) => i !== index)
    );
  };

  const handleAddWorkHistory = (newWorkHistory: string) => {
    setWorkExperience((prevWorkHistory) => [
      ...prevWorkHistory,
      newWorkHistory,
    ]);
  };

  const handleDeleteWorkHistory = (index: number) => {
    setWorkExperience((prevWorkHistory) =>
      prevWorkHistory.filter((_, i) => i !== index)
    );
  };

  const handleGithubLinkChange = (value: string) => {
    setGithubLink(value);
  };

  const updateRoles = (roles: string[]) => {
    if(!roles || roles.length === 0) {
      setPreferredRoles(["All"]);
    } else {
      if(roles.includes("All")) roles.splice(roles.indexOf("All"), 1);
      setPreferredRoles(roles);
    }
  };

  const updateLocations = (locations: string[]) => {
    if(!locations || locations.length === 0) {
      setPreferredLocations(["UK Wide"]);
    } else {
      if(locations.includes("UK Wide")) locations.splice(locations.indexOf("UK Wide"), 1);
      setPreferredLocations(locations);
    }
  };

  // Handle change in preferredLocations
  const handleLocationChange = (event: any) => {
    updateLocations(event.target.value);
  };

  // Handle change in preferredRoles
  const handleRoleChange = (event: any) => {
    // const {
    //   target: { value },
    // } = event;
    // if (value.includes("All")) {
    //   setPreferredRoles(["All"]);
    // } else {
    //   setPreferredRoles(
    //     // On autofill we get a stringified value.
    //     typeof value === "string"
    //       ? value.split(",")
    //       : value.filter((v: any) => v !== "All")
    //   );
    // }
    updateRoles(event.target.value);
  };

  const handleValidation = () => {
    let passed = true;

    if (email === "") {
      setEmailError("Email cannot be blank");
      return false;
    }

    if (!email.includes("@") || !email.includes(".")) {
      setEmailError("Not a valid email");
      return false;
    }

    setEmailError("");
    return passed;
  };

  const submit = async () => {
    const token = authService.getAccessToken();

    if (token) {
      if (handleValidation()) {
        //setUsername(email.split("@")[0]);

        const userBody: IUser = {
          id: parseInt(id || "0"),
          username,
          email,
          roles,
          cohort,
        };

        const userProfileBody: IUserProfile = {
          // Assuming id refers to UserProfile's id
          id: parseInt(id || "0"),
          fullName,
          bio,
          headshot,
          resume,
          education,
          workExperience,
          preferredLocations,
          preferredRoles,
          githubLink,
          user: userBody,
          available,
        };

        console.log(userProfileBody);
        setLoading(true);
        try {
          const updateUserPromise = userService.update(token, userBody);
          let updateUserProfilePromise;
          if (hasProfile)
            updateUserProfilePromise = userProfileService.update(
              token,
              id || "",
              userProfileBody
            );
          else
            updateUserProfilePromise = userProfileService.create(
              token,
              userProfileBody,
              id || ""
            );

          let allPromises = [updateUserPromise, updateUserProfilePromise];
          if (resumeFile)
            allPromises.push(
              userProfileService.uploadResume(token, id || "", resumeFile)
            );
          if (headshotImage)
            allPromises.push(
              userProfileService.uploadHeadshot(token, id || "", headshotImage)
            );
          console.log(allPromises);
          await Promise.all(allPromises);

          enqueueSnackbar(`User updated`, {
            variant: "success",
          });

          navigate(`/users/${id}`);
        } catch (err: any) {
          enqueueSnackbar(err.message, {
            variant: "error",
          });

          setLoading(false);
        }
      } else {
        enqueueSnackbar("Error please try again", {
          variant: "error",
        });
        setLoading(false);
      }
    } else {
      enqueueSnackbar("Authentication error, please log in again", {
        variant: "error",
      });
      setLoading(false);
    }
  };

  const userOwned = () => {
    if (!authService.getUser()) return false;
    return authService.getUser()?.userId?.toString() === id;
  };
  const canAccess = () => {
    const permission = userOwned() || isAdmin;
    //if(!permission) setError("Permission denied");
    return permission;
  };

  if (loading) return <Loading />;
  if (!canAccess()) return <EmptyState message={"Permission denied"} />;
  if (error) return <EmptyState message={error} />;
  return (
    <>
    {/* <Box p={3}> */}
      <BackArrow />
      <Typography variant="h1">Update User</Typography>
    {/* </Box> */}
      <Grid container spacing={3}>
        {/* left col */}
        <Grid item sm={12} md={8} xs={12}>
          <Grid container sm={12} md={12} xs={12} spacing={3}>
            <Grid item md={12} xs={12} sm={12}>
              <StyledCard>
                <CardHeader title="📝 User Profile" />
                <StyledCardContent>
                  <Grid container spacing={5}>
                    <Grid item md={3} xs={12} sm={12}>
                      <Box
                        display={"flex"}
                        justifyContent={"center"}
                        alignItems={"center"}
                      >
                        <HeadshotInput
                          headshot={headshotImage ? headshotImage : null}
                          onChange={handleHeadshotChange}
                        />
                      </Box>
                    </Grid>
                    <Grid item md={9} xs={12} sm={12}>
                      <TextField
                        sx={{ width: "100%" }}
                        variant="standard"
                        label="Full Name"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                      />
                      <br />
                      <br />
                      <URLTextField
                        label="Github Link"
                        value={githubLink}
                        onChange={handleGithubLinkChange}
                        onKeyDown={(e) => e.key === "Enter" && submit()}
                      />
                      <br />
                      <br />
                      <TextField
                        multiline
                        sx={{ width: "100%", minHeight: "5em" }}
                        variant="standard"
                        label="Bio (Max 500 Chars)"
                        value={bio}
                        onChange={(e) => {
                          const val = e.target.value;
                          setBio(
                            val.substring(
                              0,
                              val.length > 500 ? 500 : val.length
                            )
                          );
                        }}
                        inputProps={{ maxLength: 500 }}
                        // onKeyDown={(e) => e.key === "Enter" && submit()}
                      />
                      {resumeFile && (
                        <>
                          <br /> <br />
                          <Typography variant="body1">
                            <MUILink
                              href={URL.createObjectURL(resumeFile)}
                              download={resumeFile.name}
                            >
                              Download Resume.pdf
                            </MUILink>
                          </Typography>
                        </>
                      )}
                      <FileInput
                        label="Resume (PDF)"
                        file={resume ? new File([], resume) : null}
                        onChange={handleResumeChange}
                        accept=".pdf"
                      />
                    </Grid>
                  </Grid>
                </StyledCardContent>
              </StyledCard>
            </Grid>
            <Grid item md={12} xs={12} sm={12}>
              <StyledCard>
                <StyledCardContent>
                  <CardHeader title="🎓 Education & Skills" icon />
                  <EditableHistoryList
                    label="Course Title"
                    items={education}
                    onAddItem={handleAddEducation}
                    onDeleteItem={handleDeleteEducation}
                  />
                </StyledCardContent>
              </StyledCard>
            </Grid>
            <Grid item md={12} xs={12} sm={12}>
              <StyledCard>
                <StyledCardContent>
                  <CardHeader title="💻 Work Experience" />
                  <EditableHistoryList
                    label="Job Title"
                    items={workExperience}
                    onAddItem={handleAddWorkHistory}
                    onDeleteItem={handleDeleteWorkHistory}
                  />
                </StyledCardContent>
              </StyledCard>
            </Grid>

            {/* left sub col */}
            <Grid item md={6} xs={12} sm={12}>
              <Grid container md={12} xs={12} sm={12}>
                <Grid item md={12} xs={12} sm={12}>
                  <StyledCard>
                    <StyledCardContent>
                      <CardHeader title="💼 Roles of Interest" />
                      {/* <EditableList
                        label="Roles"
                        items={preferredRoles}
                        onAddItem={handleAddJobRole}
                        onDeleteItem={handleDeleteJobRole}
                      /> */}
                      <FormControl fullWidth>
                        {/* <InputLabel id="preferred-roles-label">
                          Preferred Roles
                        </InputLabel> */}
                        <Select
                          labelId="preferred-roles-label"
                          id="preferred-roles"
                          multiple
                          value={preferredRoles}
                          onChange={handleRoleChange}
                          renderValue={(selected) => selected.join(", ")}
                        >
                          {roleOptions.map((role) => (
                            <MenuItem key={role} value={role}>
                              <Checkbox
                                checked={preferredRoles.indexOf(role) > -1}
                              />
                              <ListItemText primary={role} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              </Grid>
            </Grid>
            {/* right sub col */}
            <Grid item md={6} xs={12} sm={12}>
              <Grid container md={12} xs={12} sm={12}>
                <Grid item md={12} xs={12} sm={12}>
                  {/* <StyledCard>
                    <StyledCardContent>
                      <CardHeader title="🗺 Preferred Locations" />
                      <EditableList
                        label="Locations"
                        items={preferredLocations}
                        onAddItem={handleAddLocation}
                        onDeleteItem={handleDeleteLocation}
                      />
                    </StyledCardContent>
                  </StyledCard> */}
                  <StyledCard>
                    <StyledCardContent>
                      <CardHeader title="🗺 Preferred Locations" />
                      <FormControl fullWidth>
                        {/* <InputLabel id="preferred-locations-label">
                          Preferred Locations
                        </InputLabel> */}
                        <Select
                          labelId="preferred-locations-label"
                          id="preferred-locations"
                          multiple
                          value={preferredLocations}
                          onChange={handleLocationChange}
                          renderValue={(selected) => selected.join(", ")}
                        >
                          {locationOptions.map((location) => (
                            <MenuItem key={location} value={location}>
                              <Checkbox
                                checked={
                                  preferredLocations.indexOf(location) > -1
                                }
                              />
                              <ListItemText primary={location} />
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    </StyledCardContent>
                  </StyledCard>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Grid>

        {/* right col */}
        <Grid item sm={12} md={4} xs={12}>
          <Grid container sm={12} md={12} xs={12}>
            {/* Basic Credentials */}
            <Grid item sm={12} md={12} xs={12}>
              <StyledCard>
                <CardHeader title="🔐 Basic Credentials" />
                <StyledCardContent>
                  <TextField
                    variant="standard"
                    name="title"
                    label="Email"
                    autoFocus={true}
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                    error={emailError !== ""}
                    helperText={emailError}
                  />
                  <TextField
                    variant="standard"
                    name="title"
                    label="Username"
                    margin="normal"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && submit()}
                  />
                  <br />
                  {isAdmin && (
                    <FormControl variant="standard">
                      <InputLabel id="cohort-label">Cohort</InputLabel>
                      <Select
                        variant="standard"
                        labelId="cohort-label"
                        value={cohort?.name}
                        label="Cohort"
                        onChange={
                          (e) =>
                            setCohort(
                              cohorts.filter(
                                (cohort) => cohort.name === e.target.value
                              )[0]
                            )
                          // setCohort(e.target.value)
                        }
                      >
                        {cohorts.map((cohort) => (
                          <MenuItem value={cohort.name} key={cohort.id}>
                            {cohort.name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  )}
                  <br />

                  <FormGroup>
                    <FormControlLabel
                      control={<Checkbox checked={available} />}
                      onChange={() => setAvailable(!available)}
                      value={available}
                      label="Available for Hire (Uncheck when placed)"
                    />
                  </FormGroup>

                  {isAdmin && (
                    <FormControl>
                      <InputLabel variant="standard" id="role-label">
                        Role
                      </InputLabel>
                      <Select
                        variant="standard"
                        multiple
                        labelId="role-label"
                        value={roles}
                        label="Role"
                        renderValue={(selected) => {
                          //  console.log(selected);
                          return selected.join(", ");
                        }}
                        onChange={(e) => {
                          let value = e.target.value;
                          console.log(value);
                          setRoles(
                            typeof value === "string" ? value.split(",") : value
                          );
                        }}
                      >
                        {Object.keys(UserRoles)
                          .filter((key) => Number(key) > 0)
                          .map((item) => (
                            <MenuItem
                              key={item}
                              value={UserRoles[Number(item)]}
                            >
                              <Checkbox
                                checked={
                                  roles.indexOf(UserRoles[Number(item)]) > -1
                                }
                              />
                              <ListItemText primary={UserRoles[Number(item)]} />
                            </MenuItem>
                          ))}
                      </Select>
                    </FormControl>
                  )}
                </StyledCardContent>
              </StyledCard>
            </Grid>
          </Grid>
        </Grid>
        <Grid item md={12} xs={12} sm={12}>
          <Box display="flex" justifyContent="flex-end">
            <Button
              color="primary"
              variant="contained"
              size="large"
              onClick={submit}
              disabled={loading}
              endIcon={loading ? <CircularProgress size={18} /> : <Check />}
            >
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default UpdateUser;
