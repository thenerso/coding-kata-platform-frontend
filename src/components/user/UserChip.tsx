import { Face } from "@mui/icons-material";
import { Chip } from "@mui/material";
import { IUser } from "../../interfaces/user";

interface IUserChip {
  label: string;
}
const UserChip = ({ label }: IUserChip) => {

  return <Chip variant = "outlined" icon={<Face />} label={label} />;
};

export default UserChip;
