import styled from "@emotion/styled";
import { Add } from "@mui/icons-material";
import { Typography, Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import dayjs from "dayjs";
import { useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext, IAppContext } from "../../context/AppContext";
import { IUser } from "../../interfaces/user";

// Injected styles
const TitleWrapper = styled("div")`
display: flex;
justify-content: space-between;
`;

const ListUsers = () => {
  const { members } = useContext(AppContext) as IAppContext;
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const tableFields = ["ID", "Cohort", "Username", "Score"];

  const navigate = useNavigate();

  return (
    <>
      <TitleWrapper>
        <Typography variant="h1">Users</Typography>
        <Fab
          color="primary"
          aria-label="Add a cohort"
          component={Link}
          to="/users"
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
            {members.map((row) => (
              <TableRow
                key={`${row.id}-${row.username}`}
                hover
                onClick={() => navigate(`/users/${row.id}`)}
                style={{ cursor: "pointer" }}
              >
                <TableCell>{row.id}</TableCell>
                <TableCell>{row.cohort?.name}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.score}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default ListUsers;
