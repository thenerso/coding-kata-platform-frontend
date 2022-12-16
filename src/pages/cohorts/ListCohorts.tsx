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
import { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import EmptyState from "../../components/global/EmptyState";
import Loading from "../../components/global/Loading";
import authService from "../../services/authService";
import cohortServices from "../../services/cohortService";
import styled from "@emotion/styled";
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

const ListCohorts = () => {
  const { cohorts } = useContext(AppContext) as IAppContext;

  const tableFields = ["ID", "Name", "Start Date", "# Members"];

  const navigate = useNavigate();

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
                <TableCell>
                  {dayjs(row.startDate).format("MMM D, YYYY")}
                </TableCell>
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
