import { Chip } from "@mui/material";

interface ISuccessChip {
  label: string;
  score: number;
}
const SuccessChip = ({ label, score }: ISuccessChip) => {
//   switch (label) {
//     case "Pass":
//       return <Chip variant = "outlined" label={label} color="warning" />;

//     case "Incorrect":
//       return <Chip label={label} color="error" />;

//     default:
//       return <Chip label={label} color="success" />;
//   }

  return <Chip variant = "outlined" label={label} color={score <= 50 ? "error" 
  : score <= 80 ? "warning" : "success"} />;
};

export default SuccessChip;
