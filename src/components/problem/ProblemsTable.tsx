import {
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { IProblem } from "../../interfaces/problemSet";
import DifficultyChip from "./DifficultyChip";
import Tags from "./Tags";

interface IProblemProps {
  problems: IProblem[];
  attempt?: boolean;
  canDelete?: boolean;
}

const ProblemsTable = ({ problems, attempt = false, canDelete = false}: IProblemProps) => {
  const tableFields = ["Title", "Difficulty", "Tags"];

  return (
    <div>
      <Typography variant="h2">Problems</Typography>

      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 550 }} aria-label="Problems Table">
          <TableHead>
            <TableRow>
              {problems.length > 0 &&
                tableFields.map((cell, index) => (
                  <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
                ))}
              {problems.length === 0 && <TableCell></TableCell>}
            </TableRow>
          </TableHead>
          <TableBody>
            {problems.length === 0 ? (
              <TableRow>
                <TableCell>No problems added yet</TableCell>
              </TableRow>
            ) : (
              problems.map((row, index) => (
                <RenderTableRow
                  key={`${row.id ? row.id : index}-${row.title}`}
                  row={row}
                  attempt={attempt}
                />
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

interface IRenderTableRowProps {
  row: IProblem;
  attempt: boolean;
}

const RenderTableRow = ({ row, attempt = false }: IRenderTableRowProps) => {
  const navigate = useNavigate();

  return (
    <TableRow
      hover
      onClick={() => navigate(attempt ? `/problems/attempt/${row.id}` : `/problems/${row.id}`)}
      style={{ cursor: "pointer" }}
    >
      <TableCell>{row.title}</TableCell>
      <TableCell>
        <DifficultyChip label={row.difficulty || ""} />
      </TableCell>

      <TableCell>
        <Tags tags={row.tags} />
      </TableCell>
    </TableRow>
  );
};

export default ProblemsTable;
