import {
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
} from "@mui/material";

import { useNavigate } from "react-router-dom";
import { IProblem } from "../../interfaces/problemSet";
import DifficultyChip from "./DifficultyChip";

interface IProblemProps {
  problems: IProblem[];
}

const ProblemsTable = ({ problems }: IProblemProps) => {
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
}

const RenderTableRow = ({ row }: IRenderTableRowProps) => {
  const navigate = useNavigate();

  return (
    <TableRow
      hover
      onClick={() => navigate(`/problems/${row.id}`)}
      style={{ cursor: "pointer" }}
    >
      <TableCell>{row.title}</TableCell>
      <TableCell>
        <DifficultyChip label={row.difficulty || ""} />
      </TableCell>

      <TableCell>
        {row.tags?.map((tag, i) => (
          <Chip label={tag} key={`${i}-${tag}`} />
        ))}
      </TableCell>
    </TableRow>
  );
};

export default ProblemsTable;
