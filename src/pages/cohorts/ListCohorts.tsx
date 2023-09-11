import { useEffect, useState } from "react";
import FilterTable, { ITableFields } from "../../components/global/FilterTable";
import { ICohort } from "../../interfaces/cohort";
import cohortService from "../../services/cohortService";
import authService from "../../services/authService";

const ListCohorts = () => {
  const [cohorts, setCohorts] = useState<ICohort[]>([]);

  useEffect(() => {
    const token = authService.getAccessToken() || "";
    cohortService.getAll(token, (cohorts: ICohort[]) => {
      setCohorts(cohorts);
    });
  }, []);

  const tableFields: ITableFields[] = [
    { label: "ID", field: "id", type: "string" },
    { label: "Name", field: "name", type: "string" },
    { label: "Start Date", field: "startDate", type: "date" },
    { label: "# Members", field: "members", type: "count" },
  ];

  return (
    <FilterTable
      title="👨‍🎓 Cohorts"
      viewLink={"/cohorts/"}
      rows={cohorts}
      fields={tableFields}
      createLink={`/cohorts/new`}
    />
  );
};

export default ListCohorts;
