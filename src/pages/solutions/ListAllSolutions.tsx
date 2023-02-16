import {
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import styled from "@emotion/styled";

import authService from "../../services/authService";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";
import DifficultyChip from "../../components/problem/DifficultyChip";
import { ISolution } from "../../interfaces/solutions";
import solutionService from "../../services/solutionService";
import SuccessChip from "../../components/problem/SuccessChip";

/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const ListAllSolutions = () => {
  const [solutions, setSolutions] = useState<ISolution[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const tableFields = [
    "ID",
    "Problem",
    "Difficulty",
    "Language",
    "User",
    "Submission Date",
    "Correctness",
  ];

  const navigate = useNavigate();

  useEffect(() => {
    console.log("trying to load solutions...");
    const token = authService.getAccessToken();

    if (token) {
      if (solutions.length === 0) {
        setError("");
        setLoading(true);
        solutionService
          .getAll(token)
          .then((result) => {
            setSolutions(result);
            setLoading(false);
          })
          .catch((err) => {
            console.log("Error getting solutions", err);
            setError("Error fetching data");
            setLoading(false);
          });
      }
    } else {
      setError("Authentication error, please log in again");
      setLoading(false);
    }
  }, [solutions.length]);

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;

  return (
    <>
      <TitleWrapper>
        <Typography variant="h1">Solutions</Typography>
      </TitleWrapper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Solutions table">
          <TableHead>
            <TableRow>
              {tableFields.map((cell, index) => (
                <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {solutions.length === 0 ? (
              <TableRow>
                <TableCell>No Solutions added yet</TableCell>
              </TableRow>
            ) : (
              solutions.map((row) => (
                <TableRow
                  key={`${row.id}-${row.problem?.title}`}
                  hover
                  onClick={() => navigate(`/solutions/${row.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.problem?.title}</TableCell>
                  <TableCell>
                    <DifficultyChip label={row.problem?.difficulty || ""} />
                  </TableCell>
                  <TableCell>{row.lang}</TableCell>
                  <TableCell>{row.user?.username}</TableCell>
                  <TableCell>{row.submissionDate}</TableCell>
                  <TableCell>
                    <SuccessChip
                      score={row.correctness}
                      label={row.correctness.toString() + "%"}
                    />
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

export default ListAllSolutions;
