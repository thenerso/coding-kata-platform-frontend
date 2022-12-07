import { Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/global/Loading";
import { ICohort } from "../../interfaces/cohort";
import authService from "../../services/authService";
import cohortServices from "../../services/cohortService";
import Members from "./member/Members";

const Cohort = () => {
  const [cohort, setCohort] = useState<ICohort>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (!cohort && id) {
        setError("");
        setLoading(true);
        cohortServices
          .getById(token, id)
          .then((result) => {
            setCohort(result);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error getting cohorts", err);
            setError("Error fetching data");
            setLoading(false);
          });
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, [cohort, id]);

  if (loading) return <Loading />;
  if (error || !cohort) return <EmptyState message={error} />;
  return (
    <>
      <Typography variant="h1">{cohort.name}</Typography>
      <Typography variant="caption">{cohort.startDate}</Typography>

      <br />
      <Members members={cohort.members} displayScore={true} />
    </>
  );
};

export default Cohort;
