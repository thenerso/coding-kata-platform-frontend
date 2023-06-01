// EditableList.tsx
import { FC, useState } from "react";
import { Button, TextField, List, ListItem, IconButton } from "@mui/material";
import { Delete } from "@mui/icons-material";

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
    if(!newItem) return;
    onAddItem(newItem);
    setNewItem("");
  };

  const handleDelete = (index: number) => {
    onDeleteItem(index);
  };

  return (
    <div>
      <TextField
        variant="standard"
        label={label}
        value={newItem}
        onChange={(e) => setNewItem(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleAdd}>
        Add
      </Button>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            {item}
            <IconButton edge="end" onClick={() => handleDelete(index)}>
              <Delete />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default EditableList;
