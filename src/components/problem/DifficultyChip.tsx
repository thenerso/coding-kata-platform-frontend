import { Chip } from "@mui/material";

interface IDifficultyChip {
  label: string;
  size?: "small" | "medium";
}
const DifficultyChip = ({ label, size = "medium" }: IDifficultyChip) => {
  switch (label) {
    case "MEDIUM":
      return <Chip size={size} label={label} color="warning" />;

    case "HARD":
      return <Chip size={size} label={label} color="error" />;

    default:
      return (
        <Chip size={size} label={label.replace("_", " ")} color="success" />
      );
  }
};

export default DifficultyChip;
