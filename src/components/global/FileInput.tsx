// FileInput.tsx
import { ChangeEvent, FC } from "react";
import { Button } from "@mui/material";
// import { IFile } from "../../interfaces/file";

interface FileInputProps {
  label: string;
  file: File | null;
  onChange: (newFile: File | null) => void;
}

const FileInput: FC<FileInputProps> = ({ label, file, onChange }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files ? e.target.files[0] : null;
    onChange(newFile);
  };

  return (
    <Button sx={{width: '100%'}} variant="outlined">
      <input
        type="file"
        onChange={handleFileChange}
        accept=".pdf, .jpg, .jpeg, .png"
      />
      {file ? file.name : `Upload ${label}`}
    </Button>
  );
};

export default FileInput;
