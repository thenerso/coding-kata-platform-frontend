import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/global/Loading";
import { ICohort } from "../../interfaces/cohort";
import authService from "../../services/authService";
import cohortServices from "../../services/cohortService";

export interface Member {
  id: number;
  username: string;
  email: string;
  roles: string[];
  score: number;
  joinDate: Date;
  solutions: any[];
  completedProblems: any[];
}

const ListCohorts = () => {
  const [cohorts, setCohorts] = useState<ICohort[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (cohorts.length === 0) {
        setError("");
        setLoading(true);
        cohortServices
          .getAll(token)
          .then((result) => {
            setCohorts(result);
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
  }, [cohorts.length]);

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;
  return (
    <>
      <h2>Cohorts</h2>
      <Link to="/cohorts/new">Create</Link>
      {cohorts.map((cohort) => {
        return (
          <div key={cohort.name}>
            <Link to={`/cohorts/${cohort.id}`}>
              {cohort.name} - {cohort.members.length} members
            </Link>
            <br />
          </div>
        );
      })}
    </>
  );
};

export default ListCohorts;
