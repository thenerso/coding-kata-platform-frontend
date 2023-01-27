import { Add } from "@mui/icons-material";
import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Fab,
} from "@mui/material";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import styled from "@emotion/styled";

import authService from "../../services/authService";
import ProblemService from "../../services/problemService";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";
import DifficultyChip from "../../components/problem/DifficultyChip";
import Tags from "../../components/problem/Tags";
import { IProblem } from "../../interfaces/problemSet";

/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const ListProblems = () => {
  const [problems, setProblems] = useState<IProblem[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const tableFields = ["ID", "Title", "Difficulty", "Tags"];

  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (problems.length === 0) {
        setError("");
        setLoading(true);
        ProblemService
          .getAll(token)
          .then((result) => {
            setProblems(result);
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
  }, [problems.length]);

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;

  return (
    <>
      <TitleWrapper>
        <Typography variant="h1">Problems</Typography>
        <Fab
          color="primary"
          aria-label="Add a Problem"
          component={Link}
          to="/problems/new"
        >
          <Add />
        </Fab>
      </TitleWrapper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Problems table">
          <TableHead>
            <TableRow>
              {tableFields.map((cell, index) => (
                <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {problems.length === 0 ? (
              <TableRow>
                <TableCell>No Problems added yet</TableCell>
              </TableRow>
            ) : (
              problems.map((row) => (
                <TableRow
                  key={`${row.id}-${row.title}`}
                  hover
                  onClick={() => navigate(`/problems/${row.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    <DifficultyChip label={row.difficulty || ""} />
                  </TableCell>
                  <TableCell>
                    <Tags tags={row.tags} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ListProblems;
