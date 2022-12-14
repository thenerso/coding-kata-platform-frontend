import {
  Button,
  CardActions,
  CardContent,
  CircularProgress,
  TextField,
} from "@mui/material";
import { useState } from "react";
import { IUser } from "../../../interfaces/user";
import { useSnackbar } from "notistack";
import { ICreateBulkMember } from "./CreateMemberWrapper";
import styled from "@emotion/styled";
import { Check } from "@mui/icons-material";

const StyledCardContent = styled(CardContent)`
  display: flex;
  flex-direction: column;
`;

const CreateBulkMember = ({
  members,
  setMembers,
  startDate,
}: ICreateBulkMember) => {
  const [values, setValues] = useState("");
  const [loading, setLoading] = useState(false);

  const { enqueueSnackbar } = useSnackbar();

  const submit = () => {
    if (values === "") {
      enqueueSnackbar(`Please enter at least one email`, {
        variant: "error",
      });
      return;
    }
    setLoading(true);
    let newMembers: IUser[] = [];
    const emails = values.split("\n");
    emails.forEach((email) => {
      if (email === "") return;
      if (!email.includes("@") || !email.includes(".")) {
        enqueueSnackbar(`${email} is not a valid email`, {
          variant: "error",
        });
      }
      const existingMemberIndex = members.findIndex(
        (member) => member.email === email
      );
      const newMemberIndex = newMembers.findIndex(
        (member) => member.email === email
      );
      if (existingMemberIndex !== -1 || newMemberIndex !== -1) {
        enqueueSnackbar(`Member with ${email} already exists`, {
          variant: "error",
        });
        return;
      }
      const newMember = {
        username: email.split("@")[0],
        email: email,
        joinDate: startDate?.format("YYYY-MM-DD"),
      };
      newMembers.push(newMember);
    });

    setMembers([...members, ...newMembers]);
    setLoading(false);
    setValues("");
  };

  return (
    <>
      <StyledCardContent>
        <TextField
          id="outlined-multiline-flexible"
          label="Multiline"
          variant="standard"
          autoFocus={true}
          minRows={11}
          multiline
          placeholder="Paste in emails directly from excel / Google sheets here (without seperators or commas)"
          maxRows={11}
          value={values}
          onChange={(e) => setValues(e.target.value)}
        />
      </StyledCardContent>
      <CardActions>
        <Button
          color="primary"
          variant="contained"
          onClick={submit}
          disabled={loading}
          endIcon={loading ? <CircularProgress size={18} /> : <Check />}
        >
          Add
        </Button>
      </CardActions>
    </>
  );
};

export default CreateBulkMember;
