import { Box, CardMedia, Typography } from "@mui/material";
import { useState } from "react";

export const HeadshotInput = ({
  headshot,
  onChange,
}: {
  headshot: File | null;
  onChange: (newFile: File | null) => void;
}) => {
  const [headshotUrl, setHeadshotUrl] = useState(
    headshot ? URL.createObjectURL(headshot) : null
  );

  const onHeadshotClick = () => {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;
      if (file) {
        setHeadshotUrl(URL.createObjectURL(file));
        onChange(file);
      }
    };
    fileInput.click();
  };

  return (
    <Box sx={{ cursor: "pointer" }} onClick={onHeadshotClick}>
      {headshot ? (
        <CardMedia component="img" image={headshotUrl ? headshotUrl : ''} />
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 150,
            width: 150,
            backgroundColor: "grey",
          }}
        >
          <Typography variant="body1" align="center">
            Click to upload headshot
          </Typography>
        </Box>
      )}
    </Box>
  );
};
