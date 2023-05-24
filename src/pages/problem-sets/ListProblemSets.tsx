import { useEffect, useState } from "react";

import { IProblemSet } from "../../interfaces/problemSet";
import authService from "../../services/authService";
import problemSetServices from "../../services/problemSetService";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";

import FilterTable, { ITableFields } from "../../components/global/FilterTable";

const ListProblemSets = () => {
  const [problemSets, setProblemSets] = useState<IProblemSet[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (problemSets.length === 0) {
        setError("");
        setLoading(true);
        problemSetServices
          .getAll(token)
          .then((result) => {
            setProblemSets(result);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error getting problems", err);
            setError("Error fetching data");
            setLoading(false);
          });
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, [problemSets.length]);

  const tableFields: ITableFields[] = [
    { label: "ID", field: "id", type: "string" },
    { label: "Title", field: "title", type: "string" },
    { label: "Difficulty", field: "difficulty", type: "difficulty" },
    { label: "# Problems", field: "problems", type: "count" },
    { label: "Tags", field: "tags", type: "tags" },
  ];

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;

  return (
    <FilterTable
      title="📁 Problem Sets"
      rows={problemSets}
      fields={tableFields}
      createLink={`/problem-sets/new`}
      viewLink={`/problem-sets/`}
    />
  );
};

export default ListProblemSets;
