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

import { IProblemSet } from "../../interfaces/problemSet";
import authService from "../../services/authService";
import problemSetServices from "../../services/problemSetService";
import Loading from "../../components/global/Loading";
import EmptyState from "../../components/global/EmptyState";
import DifficultyChip from "../../components/problem/DifficultyChip";

/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const ListProblemSets = () => {
  const [problemSets, setProblemSets] = useState<IProblemSet[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const tableFields = ["ID", "Title", "Difficulty", "# Problems"];

  const navigate = useNavigate();

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

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;

  return (
    <>
      <TitleWrapper>
        <Typography variant="h1">Problem Sets</Typography>
        <Fab
          color="primary"
          aria-label="Add a Problem Set"
          component={Link}
          to="/problem-sets/new"
        >
          <Add />
        </Fab>
      </TitleWrapper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="Proble Sets table">
          <TableHead>
            <TableRow>
              {tableFields.map((cell, index) => (
                <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {problemSets.length === 0 ? (
              <TableRow>
                <TableCell>No Problem Sets added yet</TableCell>
              </TableRow>
            ) : (
              problemSets.map((row) => (
                <TableRow
                  key={`${row.id}-${row.title}`}
                  hover
                  onClick={() => navigate(`/problem-sets/${row.id}`)}
                  style={{ cursor: "pointer" }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>
                    <DifficultyChip label={row.difficulty || ""} />
                  </TableCell>
                  <TableCell>{row.problems?.length}</TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ListProblemSets;
