import { useEffect, useState } from "react";

import authService from "../../services/authService";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";
import { ISolution } from "../../interfaces/solutions";
import solutionService from "../../services/solutionService";
import FilterTable, { ITableFields } from "../../components/global/FilterTable";

const ListAllSolutions = () => {
  const [solutions, setSolutions] = useState<ISolution[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (solutions.length === 0) {
        setError("");
        setLoading(true);
        solutionService
          .getAll(
            token, 
            (updatedSolutions: ISolution[]) => {
              // Update the component's state for each page retrieved
              setSolutions(updatedSolutions);
              setLoading(false);
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
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, [solutions.length]);

  const tableFields: ITableFields[] = [
    { label: "ID", field: "id", type: "string" },
    { label: "User", field: "user.username", type: "string" },
    { label: "Problem", field: "problem.title", type: "string" },
    { label: "Difficulty", field: "problem.difficulty", type: "difficulty" },
    { label: "Language", field: "lang", type: "string" },
    { label: "Submission Date", field: "submissionDate", type: "date" },
    { label: "Correctness", field: "correctness", type: "success" },
  ];

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;

  return (
    <FilterTable
      title="✏️ Solutions"
      rows={solutions}
      fields={tableFields}
      viewLink={`/solutions/`}
      defaultOrder="desc"
      defaultOrderBy="submissionDate"
    />
  );
};

export default ListAllSolutions;
