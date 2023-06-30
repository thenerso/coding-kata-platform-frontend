// EditableList.tsx
import { FC, useState } from "react";
import { TextField, List, ListItem, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";
import StyledButton from "./StyledButton";

interface EditableListProps {
  label: string;
  items: string[];
  onAddItem: (newItem: string) => void;
  onDeleteItem: (index: number) => void;
}

const EditableList: FC<EditableListProps> = ({
  label,
  items,
  onAddItem,
  onDeleteItem,
}) => {
  const [newItem, setNewItem] = useState("");

  const handleAdd = () => {
    if (!newItem) return;
    onAddItem(newItem);
    setNewItem("");
  };

  const handleDelete = (index: number) => {
    onDeleteItem(index);
  };

  return (
    <div>
      <List>
        {items.map((item, index) => (
          <ListItem sx={{ width: "100%" }} key={index}>
            {item}
            <IconButton edge="end" onClick={() => handleDelete(index)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
      <TextField
        variant="standard"
        label={label}
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        fullWidth={true}
      />
      <StyledButton variant="outlined" color="primary" onClick={handleAdd}>
        Add
      </StyledButton>
    </div>
  );
};

export default EditableList;
