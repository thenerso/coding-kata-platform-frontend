import { ArrowBack, Edit } from "@mui/icons-material";
import { Button, Fab, Typography } from "@mui/material";
import {useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/global/EmptyState";
import { ICohort } from "../../interfaces/cohort";
// import Members from "../../components/cohort/member/Members";
import styled from "@emotion/styled";
import DeleteCohort from "../../components/cohort/DeleteCohort";
import dayjs from "dayjs";
import FilterTable, { ITableFields } from "../../components/global/FilterTable";
import cohortService from "../../services/cohortService";
import authService from "../../services/authService";

/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const TitleActionWrapper = styled("div")`
  a {
    margin: 0 5px;
  }
`;

const Cohort = () => {

  const [cohort, setCohort] = useState<ICohort>();
  const [error, setError] = useState<string>("");

  const { id } = useParams();

  useEffect(() => {
    const token = authService.getAccessToken();
    if(!token) {
      setError("Authentication failed. Please log in again");
      return;
    }
    cohortService.getById(token, id || "").then((cohort)=> setCohort(cohort));
  }, []);

  const tableFields: ITableFields[] = [
    { label: "ID", field: "id", type: "index" },
    { label: "Username", field: "username", type: "string" },
    { label: "Email", field: "email", type: "string" },
    // { label: "Cohort", field: "cohort.name", type: "string" },
    { label: "Start Date", field: "startDate", type: "date" },
    { label: "Score", field: "score", type: "string" },
  ];

  if (error || !cohort) return <EmptyState message={error} />;
  return (
    <>
      <Button
        color="info"
        component={Link}
        to="/cohorts"
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      <TitleWrapper>
        <Typography variant="h1">{cohort.name}</Typography>
        <TitleActionWrapper>
          <Fab
            color="primary"
            aria-label="Edit cohort"
            component={Link}
            to={`/cohorts/edit/${cohort.id}`}
          >
            <Edit />
          </Fab>

          {cohort.id && <DeleteCohort id={cohort.id} />}
        </TitleActionWrapper>
      </TitleWrapper>
      <Typography variant="caption">
        {dayjs(cohort.startDate).format("MMM D, YYYY")}
      </Typography>

      <br />
      <FilterTable
      title="Cohort Members"
      viewLink={"/users/"}
      rows={cohort.members}
      fields={tableFields}
    />
    </>
  );
};

export default Cohort;
