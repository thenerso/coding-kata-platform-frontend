import styled from "@emotion/styled";
import { Add } from "@mui/icons-material";
import { Typography, Fab, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import FilterTable, { ITableFields } from "../../components/global/FilterTable";
import { AppContext, IAppContext } from "../../context/AppContext";

// Injected styles
const TitleWrapper = styled("div")`
display: flex;
justify-content: space-between;
`;

const ListUsers = () => {
  const { members } = useContext(AppContext) as IAppContext;

  // const tableFields = ["ID", "Cohort", "Username", "Score"];

  const tableFields: ITableFields[] = [
    { label: "ID", field: "id", type: "string" },
    { label: "Cohort", field: "cohort.name", type: "string" },
    { label: "Username", field: "username", type: "string" },
    { label: "Start Date", field: "startDate", type: "date" },
    { label: "Score", field: "score", type: "string" },
  ];

  const navigate = useNavigate();

  return (
    <FilterTable
      title="Users"
      viewLink={"/users/"}
      rows={members}
      fields={tableFields}
      createLink={`/users/new`}
    />
  );
};

export default ListUsers;
