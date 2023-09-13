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
        console.log("Finished fetching all solutions");
      })
      .catch((err) => {
        console.log("Error getting solutions", err);
        setError("Error fetching data");
      });
    }
  }, []);

  const tableFields: ITableFields[] = [
    // { label: "ID", field: "id", type: "string" },
    { label: "Full Name", field: "fullName", type: "string" },
    { label: "Roles of Interest", field: "preferredRoles", type: "tags" },
    { label: "Available Locations", field: "preferredLocations", type: "tags" },
    // { label: "Education", field: "education", type: "tags" },
    // { label: "Start Date", field: "user.startDate", type: "date" },
    // { label: "Kata Score", field: "user.score", type: "string" }
  ];

  // const navigate = useNavigate();

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
