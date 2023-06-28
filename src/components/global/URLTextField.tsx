import React, { useState } from "react";
import TextField from "@mui/material/TextField";

interface URLTextFieldProps {
  label: string;
  value: string;
  onChange: any;
  onKeyDown?: (e: React.KeyboardEvent) => void;
}

const URLTextField: React.FC<URLTextFieldProps> = ({
  label,
  value,
  onChange,
  onKeyDown,
}) => {
  const [error, setError] = useState("");

  const handleURLChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    const pattern = new RegExp(
      "^(https?:\\/\\/)?" + // protocol
        "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|" + // domain name and extension
        "((\\d{1,3}\\.){3}\\d{1,3}))" + // OR ip (v4) address
        "(\\:\\d+)?" + // port
        "(\\/[-a-z\\d%_.~+]*)*" + // path
        "(\\?[;&amp;a-z\\d%_.~+=-]*)?" + // query string
        "(\\#[-a-z\\d_]*)?$",
      "i"
    ); // fragment locator
    onChange(value);
    if (!!pattern.test(value)) {
      setError(""); // clear the error if the URL is valid
      onChange(value);
    } else {
      setError("Invalid URL");
    }
  };

  return (
    <TextField
      sx={{ width: "100%" }}
      variant="standard"
      label={label}
      value={value}
      onChange={handleURLChange}
      onKeyDown={onKeyDown}
      error={Boolean(error)}
      helperText={error}
    />
  );
};

export default URLTextField;
