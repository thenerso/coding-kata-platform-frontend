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
import EmptyState from "../../components/EmptyState";
import Loading from "../../components/global/Loading";
import { ICohort } from "../../interfaces/cohort";
import authService from "../../services/authService";
import cohortServices from "../../services/cohortService";
import styled from "@emotion/styled";

/**
 * Injected styles
 *
 */
const TitleWrapper = styled("div")`
  display: flex;
  justify-content: space-between;
`;

const ListCohorts = () => {
  const [cohorts, setCohorts] = useState<ICohort[]>([]);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const tableFields = ["ID", "Name", "Start Date", "# Members"];

  const navigate = useNavigate();

  useEffect(() => {
    const token = authService.getAccessToken();

    if (token) {
      if (cohorts.length === 0) {
        setError("");
        setLoading(true);
        cohortServices
          .getAll(token)
          .then((result) => {
            setCohorts(result);
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
  }, [cohorts.length]);

  if (loading) return <Loading />;
  if (error) return <EmptyState message={error} />;
  return (
    <>
      <TitleWrapper>
        <Typography variant="h1">Cohorts</Typography>
        <Fab
          color="primary"
          aria-label="Add a cohort"
          component={Link}
          to="/cohorts/new"
        >
          <Add />
        </Fab>
      </TitleWrapper>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead>
            <TableRow>
              {tableFields.map((cell, index) => (
                <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {cohorts.map((row) => (
              <TableRow
                key={`${row.id}-${row.name}`}
                hover
                onClick={() => navigate(`/cohorts/${row.id}`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.name}</TableCell>
                <TableCell>{row.startDate}</TableCell>
                <TableCell>{row.members.length}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ListCohorts;
