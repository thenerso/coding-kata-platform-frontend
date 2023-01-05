import { Delete } from "@mui/icons-material";
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Fab,
} from "@mui/material";
import { useContext, useState } from "react";

import authService from "../../services/authService";
import problemSetServices from "../../services/problemSetService";
import { useSnackbar } from "notistack";
import { useNavigate } from "react-router-dom";
import { AppContext, IAppContext } from "../../context/AppContext";

interface IDeleteProblemSetProps {
  id: number;
}

const DeleteProblemSet = ({ id }: IDeleteProblemSetProps) => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();

  const submit = () => {
    const token = authService.getAccessToken();
    if (token) {
      if (id) {
        setLoading(true);
        problemSetServices
          .delete(token, id.toString())
          .then((result) => {
            enqueueSnackbar(`ProblemSet deleted`, {
              variant: "success",
            });
            setOpen(false);
            setLoading(false);
            navigate("/problem-sets");
          })
          .catch((err) => {
            enqueueSnackbar(err.message, {
              variant: "error",
            });
            setLoading(false);
            setOpen(false);
          });
      }
    } else {
      enqueueSnackbar(`Authentication error, please log in again`, {
        variant: "error",
      });
      setLoading(false);
    }
  };

  return (
    <>
      <Fab
        color="error"
        aria-label="Delete problem Set"
        onClick={() => setOpen(true)}
      >
        <Delete />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="delete-popup"
        aria-describedby="popup for deleting a problem Set"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this ProblemSet will also delete{" "}
            <strong>all of it's problems</strong>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="primary"
            onClick={submit}
            autoFocus
            disabled={loading}
            endIcon={loading ? <CircularProgress size={18} /> : <></>}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteProblemSet;
