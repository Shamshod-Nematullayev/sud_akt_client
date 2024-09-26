import React, { useState } from "react";
import { Box, Typography, Paper } from "@mui/material";
import { styled } from "@mui/system";

const FileInput = styled("input")({
  display: "none",
});

const DropZone = styled(({ isValidFile, isDragging, ...otherProps }) => (
  <Paper {...otherProps} />
))(({ theme, isDragging, isValidFile }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  width: "100%",
  height: "200px",
  border: `2px dashed ${
    isDragging
      ? isValidFile
        ? theme.palette.primary.main
        : theme.palette.error.main
      : theme.palette.grey[500]
  }`,
  backgroundColor: isDragging
    ? isValidFile
      ? theme.palette.action.hover
      : theme.palette.error.light
    : theme.palette.background.default,
  transition: "background-color 0.3s, border-color 0.3s",
  cursor: "pointer",
  textAlign: "center",
}));

const MainFileInput = ({ selectedFile, setSelectedFile }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isValidFile, setIsValidFile] = useState(true);

  const handleDragOver = (event) => {
    event.preventDefault();
    const file =
      event.dataTransfer.items[0]?.getAsFile() || event.dataTransfer.files[0];
    if (file) {
      setIsValidFile(file.name.endsWith(".zip"));
    }
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.name.endsWith(".zip")) {
        setSelectedFile(file);
        setIsValidFile(true);
      } else {
        setIsValidFile(false);
      }
    }
  };

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  return (
    <Box width="100%">
      <FileInput
        type="file"
        id="file-upload"
        accept=".zip"
        onChange={handleFileSelect}
      />
      <label htmlFor="file-upload" style={{ width: "100%" }}>
        <DropZone
          isDragging={isDragging}
          isValidFile={isValidFile} // Holatni DropZone ga yuborish
          onDragOver={handleDragOver}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          component="div"
        >
          <Typography variant="h6" noWrap>
            {selectedFile
              ? selectedFile.name
              : "Drag & Drop your file here, or click to select"}
          </Typography>
        </DropZone>
      </label>
    </Box>
  );
};

export default MainFileInput;
