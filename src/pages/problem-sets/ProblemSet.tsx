import styled from "@emotion/styled";
import { ArrowBack, Edit } from "@mui/icons-material";
import { Button, Typography, Fab, Divider, Chip, Box } from "@mui/material";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Members from "../../components/cohort/member/Members";
import EmptyState from "../../components/global/EmptyState";
import Loading from "../../components/global/Loading";
import DeleteProblemSet from "../../components/problem/DeleteProblemSet";
import DifficultyChip from "../../components/problem/DifficultyChip";
import Problems from "../../components/problem/Problems";
import { IProblemSet } from "../../interfaces/problemSet";
import authService from "../../services/authService";
import problemSetServices from "../../services/problemSetService";

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

const ChipWrapper = styled("div")`
  display: flex;
  align-items: center;
  div {
    margin: 0 10px;
  }
  margin-bottom: 10px;
`;

const ProblemSet = () => {
  const [problemSet, setProblemSet] = useState<IProblemSet>();
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const { id } = useParams();

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (!problemSet && id) {
        setError("");
        setLoading(true);
        problemSetServices
          .getById(token, id)
          .then((result) => {
            setProblemSet(result);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error getting problem sets", err);
            setError("Error fetching data");
            setLoading(false);
          });
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, [problemSet, id]);

  if (loading) return <Loading />;
  if (error || !problemSet) return <EmptyState message={error} />;
  return (
    <>
      <Button
        color="info"
        component={Link}
        to="/problem-sets"
        startIcon={<ArrowBack />}
      >
        Back
      </Button>
      <TitleWrapper>
        <Typography variant="h1">{problemSet.title}</Typography>
        <TitleActionWrapper>
          <Fab
            color="primary"
            aria-label="Edit problem set"
            component={Link}
            to={`/problem-sets/edit/${problemSet.id}`}
          >
            <Edit />
          </Fab>

          {problemSet.id && <DeleteProblemSet id={problemSet.id} />}
        </TitleActionWrapper>
      </TitleWrapper>
      <ChipWrapper>
        <DifficultyChip label={problemSet.difficulty || ""} />
        <Divider orientation="vertical" flexItem />
        {problemSet.tags?.map((tag, i) => (
          <Chip label={tag} key={`${i}-${tag}`} />
        ))}
      </ChipWrapper>
      <Typography variant="subtitle1">{problemSet.description}</Typography>

      <br />
      <Problems problems={problemSet.problems} />
    </>
  );
};

export default ProblemSet;
