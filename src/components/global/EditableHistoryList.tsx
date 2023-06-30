// EditableHistoryList.tsx
import { FC, useState } from "react";
import { TextField, List, ListItem, IconButton, Box } from "@mui/material";
import { DatePicker } from "@mui/lab";
import { Delete } from "@mui/icons-material";
import StyledButton from "./StyledButton";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { Dayjs } from "dayjs";

interface EditableHistoryListProps {
  label: string;
  items: string[];
  onAddItem: (newItem: string) => void;
  onDeleteItem: (index: number) => void;
}

const EditableHistoryList: FC<EditableHistoryListProps> = ({
  label,
  items,
  onAddItem,
  onDeleteItem,
}) => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [startDate, setStartDate] = useState<Dayjs | null>(null);
  const [endDate, setEndDate] = useState<Dayjs | null>(null);

  const handleAdd = () => {
    if (!title || !location || !startDate || !endDate || endDate <= startDate)
      return;
    const newItem = `${title} @ ${location} (${startDate
      .toISOString()
      .substring(0, 10)} to ${endDate.toISOString().substring(0, 10)})`;
    onAddItem(newItem);
    setTitle("");
    setLocation("");
    setStartDate(null);
    setEndDate(null);
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
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <TextField
        variant="standard"
        label={label}
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      <TextField
        variant="standard"
        label="Location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
      />
      
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <DesktopDatePicker
            label="Start Date"
            inputFormat="DD/MM/YYYY"
            value={startDate}
            onChange={(e: Dayjs | null) => setStartDate(e)}
            renderInput={(params) => (
              <TextField variant="standard" {...params} onKeyDown={handleAdd} />
            )}
          />
          <DesktopDatePicker
            label="End Date"
            inputFormat="DD/MM/YYYY"
            value={endDate}
            onChange={(e: Dayjs | null) => setEndDate(e)}
            renderInput={(params) => (
              <TextField variant="standard" {...params} onKeyDown={handleAdd} />
            )}
          />
        </LocalizationProvider>
      
        <DatePicker
          label="End Date"
          value={endDate}
          onChange={(newValue: any) => setEndDate(newValue)}
          renderInput={(params: any) => <TextField {...params} />}
        />
      </Box>
      <StyledButton variant="contained" color="primary" onClick={handleAdd}>
        Add
      </StyledButton>
     
    </div>
  );
};

export default EditableHistoryList;
