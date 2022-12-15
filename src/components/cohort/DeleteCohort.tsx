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
import { useState } from "react";

import authService from "../../services/authService";
import cohortServices from "../../services/cohortService";
import { useSnackbar } from "notistack";

interface IDeleteCohortProps {
  id: number;
}

const DeleteCohort = ({ id }: IDeleteCohortProps) => {
  const [open, setOpen] = useState(false);

  const [loading, setLoading] = useState<boolean>(false);

  const { enqueueSnackbar } = useSnackbar();

  const submit = () => {
    const token = authService.getAccessToken();
    if (token) {
      if (id) {
        setLoading(true);
        cohortServices
          .delete(token, id.toString())
          .then((result) => {
            enqueueSnackbar(`Cohort deleted`, {
              variant: "success",
            });
            setOpen(false);
            setLoading(false);
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
        aria-label="Delete cohort"
        onClick={() => setOpen(true)}
      >
        <Delete />
      </Fab>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="delete-popup"
        aria-describedby="popup for deleting a cohort"
      >
        <DialogTitle id="alert-dialog-title">{"Are you sure?"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Deleting this Cohort will also delete{" "}
            <strong>all of it's members</strong>
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

export default DeleteCohort;
