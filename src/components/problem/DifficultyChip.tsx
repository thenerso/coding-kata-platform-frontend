import { Chip } from "@mui/material";

interface IDifficultyChip {
  label: string;
}
const DifficultyChip = ({ label }: IDifficultyChip) => {
  switch (label) {
    case "MEDIUM":
      return <Chip label={label} color="warning" />;

    case "HARD":
      return <Chip label={label} color="error" />;

    default:
      return <Chip label={label} color="success" />;
  }
  
};

export default DifficultyChip;
