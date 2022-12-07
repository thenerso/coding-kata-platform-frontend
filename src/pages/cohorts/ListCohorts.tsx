import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/global/Loading";
import authService from "../../services/authService";
import CohortServices from "../../services/cohortService";

export interface ICohort {
  id?: number;
  name: string;
  startDate: string;
  members: Member[];
}

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
        CohortServices.getAll(token)
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
          <>
            <Link key={cohort.name} to={`/cohorts/${cohort.id}`}>
              {cohort.name} - {cohort.members.length} members
            </Link>
            <br />
          </>
        );
      })}
    </>
  );
};

export default ListCohorts;
