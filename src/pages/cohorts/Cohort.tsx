import { Add, ArrowBack, Edit } from "@mui/icons-material";
import { Button, Fab, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/global/Loading";
import { ICohort } from "../../interfaces/cohort";
import authService from "../../services/authService";
import cohortServices from "../../services/cohortService";
import Members from "./member/Members";
import styled from "@emotion/styled";

/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const Cohort = () => {
  const [cohort, setCohort] = useState<ICohort>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  // const navigate = useNavigate();

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
        <Fab
          color="primary"
          aria-label="Edit cohort"
          component={Link}
          to={`/cohorts/edit/${cohort.id}`}
        >
          <Edit />
        </Fab>
      </TitleWrapper>
      <Typography variant="caption">{cohort.startDate}</Typography>

      <br />
      <Members members={cohort.members} displayScore={true} />
    </>
  );
};

export default Cohort;
