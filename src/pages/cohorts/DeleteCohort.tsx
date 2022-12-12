import { Delete } from "@mui/icons-material";
import {
  Button,
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

import styled from "@emotion/styled";

interface IDeleteCohortProps {
  id: number;
}

const DeleteCohort = ({ id }: IDeleteCohortProps) => {
  const [open, setOpen] = useState(false);

  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

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
          <Button onClick={() => setOpen(false)} autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default DeleteCohort;
