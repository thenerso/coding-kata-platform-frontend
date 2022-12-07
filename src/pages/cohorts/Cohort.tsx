import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/global/Loading";
import authService from "../../services/authService";
import CohortServices from "../../services/cohortService";
import { ICohort } from "./ListCohorts";

const Cohort = () => {
  const [cohort, setCohort] = useState<ICohort>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  console.log(id);

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (!cohort && id) {
        setError("");
        setLoading(true);
        CohortServices.getById(token, id)
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
      <p>
        Cohort {id} {cohort.name}
      </p>
    </>
  );
};

export default Cohort;
