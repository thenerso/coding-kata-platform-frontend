import { Chip } from "@mui/material";

interface ISuccessChip {
  label: string;
}
const SuccessChip = ({ label }: ISuccessChip) => {
//   switch (label) {
//     case "Pass":
//       return <Chip variant = "outlined" label={label} color="warning" />;

//     case "Incorrect":
//       return <Chip label={label} color="error" />;

//     default:
//       return <Chip label={label} color="success" />;
//   }

  return <Chip variant = "outlined" label={label} color={label === "Pass" ? 
  "warning" : label === "Incorrect" ? "error" : "success"} />;
};

export default SuccessChip;
