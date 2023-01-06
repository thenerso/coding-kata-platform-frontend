import { ArrowBack, Edit } from "@mui/icons-material";
import { Button, Fab, Typography } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/global/EmptyState";
import { ICohort } from "../../interfaces/cohort";
import Members from "../../components/cohort/member/Members";
import styled from "@emotion/styled";
import DeleteCohort from "../../components/cohort/DeleteCohort";
import dayjs from "dayjs";
import { AppContext, IAppContext } from "../../context/AppContext";

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
  const { cohorts } = useContext(AppContext) as IAppContext;

  const [cohort, setCohort] = useState<ICohort>();
  const [error, setError] = useState<string>("");

  const { id } = useParams();

  useEffect(() => {
    const cohort = cohorts.find(
      (cohort) => cohort.id === parseInt(id as string)
    );
    if (cohort) {
      setCohort(cohort);
    } else {
      setError("Could not find cohort");
    }
  }, [cohorts, id]);

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
      <Members members={cohort.members} displayScore={true} />
    </>
  );
};

export default Cohort;
