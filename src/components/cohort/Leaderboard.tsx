import { Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material"
import { IUser } from "../../interfaces/user";
import { makeStyles } from '@material-ui/core/styles';
import {teal} from "@mui/material/colors";
import { orange } from "@material-ui/core/colors";

const useStyles = makeStyles((theme) => ({
  activeRow: {
    backgroundColor: orange[100],
    // color: theme.palette.primary.light
  },
  headText: {
    fontWeight: 'bold',
  }
}));

const leaderboardFields = ["Rank", "User",  "Score"];

const CohortLeaderoard = ({title, leaderboard, user}: {title: string, leaderboard: IUser[] | undefined, user: IUser})=> {
    const classes = useStyles();
    return (
        <>
        <Typography variant="h6">{title}</Typography>
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
                    <TableRow className={u.id === user.id ? classes.activeRow : '' }>
                      <TableCell>{index+1}</TableCell>
                      <TableCell>{u.username}</TableCell>
                      <TableCell>{u.score}</TableCell>
                    </TableRow>
                  ))}
          </TableBody>
          </Table>
        </>
    )
}

export default CohortLeaderoard;