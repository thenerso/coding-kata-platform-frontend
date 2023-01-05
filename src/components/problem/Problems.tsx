import { Delete, Edit } from "@mui/icons-material";
import {
  Typography,
  TableContainer,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  IconButton,
  Chip,
} from "@mui/material";
import dayjs from "dayjs";
import { IProblem } from "../../interfaces/problemSet";
import DifficultyChip from "./DifficultyChip";

interface IProblemProps {
  problems: IProblem[];
  //   displayScore: boolean;
  //   displayEmptyCell?: boolean;
  //   setProblemEditIndex?: (index: number) => void;
  //   deleteProblem?: (index: number) => void;
}

const Problems = ({
  problems,
}: //   displayScore,
//   displayEmptyCell = false,
//   setProblemEditIndex,
//   deleteProblem,
IProblemProps) => {
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
                  //   index={index}
                  //   setProblemEditIndex={setProblemEditIndex}
                  //   deleteProblem={deleteProblem}
                  //   displayScore={displayScore}
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
  //   index: number;
  //   displayScore: boolean;
  //   setProblemEditIndex?: (index: number) => void;
  //   deleteProblem?: (index: number) => void;
}

const RenderTableRow = ({
  row,
}: //   index,
//   displayScore,
//   setProblemEditIndex,
//   deleteProblem,
IRenderTableRowProps) => {
  return (
    <TableRow>
      <TableCell>{row.title}</TableCell>
      <TableCell>
        <DifficultyChip label={row.difficulty || ""} />
      </TableCell>

      <TableCell>
        {row.tags?.map((tag, i) => (
          <Chip label={tag} key={`${i}-${tag}`} />
        ))}
      </TableCell>
      {/* {setProblemEditIndex && deleteProblem && (
        <>
          <TableCell>
            <IconButton onClick={() => setProblemEditIndex(index)}>
              <Edit />
            </IconButton>

            <IconButton onClick={() => deleteProblem(index)}>
              <Delete />
            </IconButton>
          </TableCell>
        </>
      )} */}
    </TableRow>
  );
};

export default Problems;
