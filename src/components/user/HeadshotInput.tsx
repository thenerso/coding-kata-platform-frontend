import { Box, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import AvatarEditor from 'react-avatar-editor';

export const HeadshotInput = ({
  headshot,
  onChange,
}: {
  headshot: File | null;
  onChange: (newFile: File | null) => void;
}) => {
  const [headshotUrl, setHeadshotUrl] = useState<string | null>(
    headshot ? URL.createObjectURL(headshot) : null
  );
  const editorRef = useRef<any>(null);
  const [cropped, setCropped] = useState<boolean>(true);

  useEffect(() => {
    if (headshot) {
      setHeadshotUrl(URL.createObjectURL(headshot));
    }
  }, [headshot]);

  const onHeadshotClick = () => {
   // if(cropped) return;
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg";
    fileInput.onchange = (e) => {
      const target = e.target as HTMLInputElement;
      const file = target.files ? target.files[0] : null;
      if (file) {
        setCropped(false);
        setHeadshotUrl(URL.createObjectURL(file));
        onChange(file);
      }
    };
    fileInput.click();
  };

  const handleImageResample = () => {
    if (editorRef.current) {
      const canvas = editorRef.current.getImageScaledToCanvas();
      canvas.toBlob((blob: Blob) => {
        const downsizedFile = new File([blob], 'headshot.jpg', { type: 'image/jpeg' });
        onChange(downsizedFile);
      }, 'image/jpeg');
    }
    setCropped(true);
  };

  return (
    <Box sx={{ }} >
      {headshot ? (
        <Box sx={{ position: 'relative', width: 150, height: 150, cursor: "pointer"  }} onClick={()=>{if(cropped) onHeadshotClick()}}>
          <AvatarEditor
            ref={editorRef}
            image={headshotUrl ? headshotUrl : ''}
            width={150}
            height={150}
            border={0}
            color={[255, 255, 255, 0.25]} // Transparent background
            scale={1}
            rotate={0}
            borderRadius={75}
          />
          {!cropped && <Box sx={{ position: 'absolute', bottom: 10, right: 10 }} >
            <button onClick={handleImageResample}>Crop</button>
          </Box>}
        </Box>
      ) : (
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            height: 150,
            width: 150,
            backgroundColor: "grey",
          }} onClick={onHeadshotClick}
        >
          <Typography variant="body1" align="center">
            Click to upload headshot
          </Typography>
        </Box>
      )}
    </Box>
  );
};
