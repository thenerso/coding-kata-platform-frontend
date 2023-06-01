// FileInput.tsx
import { ChangeEvent, FC } from "react";
import { Button } from "@mui/material";
// import { IFile } from "../../interfaces/file";

interface FileInputProps {
  label: string;
  file: File | null;
  onChange: (newFile: File | null) => void;
  accept?: string;
}

const FileInput: FC<FileInputProps> = ({ label, file, onChange, accept=".pdf, .jpg, .jpeg, .png" }) => {
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFile = e.target.files ? e.target.files[0] : null;
    onChange(newFile);
  };

  return (
    <Button variant="outlined">
      <input
        type="file"
        onChange={handleFileChange}
        accept={accept}
      />
      {file ? file.name : `Upload ${label}`}
    </Button>
  );
};

export default FileInput;
