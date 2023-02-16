import styled from "@emotion/styled";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { orange } from "@mui/material/colors";
import { IUser } from "../../interfaces/user";

// const useStyles = makeStyles(() => ({
//   activeRow: {
//     backgroundColor: orange[100],
//     // color: theme.palette.primary.light
//   },
//   headText: {
//     fontWeight: "bold",
//   },
// }));

type IStyledRowProps = {
  isActive: boolean;
};

const StyledRow = styled(TableRow)`
  background-color: ${(props: IStyledRowProps) =>
    props.isActive ? orange[100] : "inherit"};
`;

const leaderboardFields = ["Rank", "User", "Score"];

const CohortLeaderoard = ({
  leaderboard,
  userId,
}: {
  leaderboard: IUser[] | undefined;
  userId: number;
}) => {
  /* const classes = useStyles(); */
  return (
    <>
      <Table sx={{ minWidth: 650 }} aria-label="Solutions table">
        <TableHead>
          <TableRow>
            {leaderboardFields.map((cell, index) => (
              <TableCell key={`${index}-${cell}`}>{cell}</TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {leaderboard?.map((u: IUser, index: number) => (
            <StyledRow key={index} isActive={u.id === userId}>
              <TableCell>{index + 1}</TableCell>
              <TableCell>{u.username}</TableCell>
              <TableCell>{u.score}</TableCell>
            </StyledRow>
          ))}
        </TableBody>
      </Table>
    </>
  );
};

export default CohortLeaderoard;
