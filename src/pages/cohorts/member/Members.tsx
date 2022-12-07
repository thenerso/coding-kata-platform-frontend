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
import { IUser } from "../../../interfaces/user";

interface IMemberProps {
  members: IUser[];
  displayScore: boolean;
}

const Members = ({ members, displayScore }: IMemberProps) => {
  const tableFields = ["ID", "Name", "Email", "Start Date"];
  if (displayScore) tableFields.push("Score");
  // const navigate = useNavigate();

  return (
    <div>
      <Typography variant="h2">Members</Typography>

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
            {members.length === 0 ? (
              <TableRow>
                <TableCell>No members added yet</TableCell>
              </TableRow>
            ) : (
              members.map((row) => (
                <TableRow
                  key={`${row.id}-${row.username}`}
                  // hover
                  // onClick={() => navigate(`/users/${row.id}`)}
                  // style={{ cursor: "pointer" }}
                >
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.username}</TableCell>
                  <TableCell>{row.email}</TableCell>
                  <TableCell>{row.joinDate}</TableCell>
                  {displayScore && <TableCell>{row.score}</TableCell>}
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};
export default Members;
