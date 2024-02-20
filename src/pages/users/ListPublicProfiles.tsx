import { useEffect, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import FilterTable, { ITableFields } from "../../components/global/FilterTable";
import authService from "../../services/authService";
import { IUserProfile } from "../../interfaces/user";
import userProfileService from "../../services/userProfileService";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";

const ListPublicProfiles = () => {
  const [profiles, setProfiles] = useState<IUserProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      setError("");
      setLoading(true);

      userProfileService
      .getAll(
        token, 
        (updatedProfiles: IUserProfile[]) => {
          // Update the component's state for each page retrieved
          console.log("profiles: ", updatedProfiles);
          setLoading(false);
          setProfiles(updatedProfiles);
        }
      )
      .then(() => {
        console.log("Finished fetching all public ");
      })
      .catch((err) => {
        // console.log("Error getting profiles: ", err);
        setError("Error getting profiles: " + err.message);
      });
    }
  }, []);

  const tableFields: ITableFields[] = [
    { label: "Full Name", field: "fullName", type: "string" },
    { label: "Cohort", field: "user.cohort.name", type: "string"},
    { label: "Roles of Interest", field: "preferredRoles", type: "tags" },
    { label: "Available Locations", field: "preferredLocations", type: "tags" },
    { label: "Education", field: "education", type: "tags" },
  ];

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;
  return (
    <FilterTable
      title="Candidates"
      viewLink={"/candidates/"}
      rows={profiles.filter(profile => profile.available)}
      fields={tableFields}

    />
  );
};

export default ListPublicProfiles;
