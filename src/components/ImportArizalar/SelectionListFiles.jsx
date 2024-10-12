import { IconButton, List, ListItemButton, ListItemText } from "@mui/material";
import React, { useEffect, useState } from "react";
import arizalarArxivFileStore from "../../store/arizalarArxivFileStore";
import DeleteIcon from "@mui/icons-material/Delete";

export default function SelectionListFiles() {
  const { pdfFiles, setCurrentPdf, deleteOneFile, setArizaData, setNdsItems } =
    arizalarArxivFileStore();
  const [selectedNav, setSelectedNav] = useState(null);

  // event handlers
  const handleSelectNav = (url) => {
    setNdsItems([]);
    setCurrentPdf(pdfFiles.filter((file) => file.url === url)[0]);
    setSelectedNav(url);
  };
  const handleDeleteIconClick = (file) => {
    deleteOneFile(file.name);
  };
  useEffect(() => {
    setArizaData({});
    const updatedPdfFiles = arizalarArxivFileStore.getState().pdfFiles;
    if (pdfFiles.length > 1) handleSelectNav(updatedPdfFiles[0].url);
  }, pdfFiles);
  return (
    <List
      component="nav"
      aria-label="files"
      sx={{ height: "100%", overflow: "scroll" }}
    >
      {pdfFiles.map((file) => (
        <div style={{ display: "flex" }}>
          <IconButton color="error" onClick={() => handleDeleteIconClick(file)}>
            <DeleteIcon />
          </IconButton>
          <ListItemButton
            key={file.url}
            selected={selectedNav === file.url}
            onClick={() => handleSelectNav(file.url)}
          >
            <ListItemText primary={file.name} />
          </ListItemButton>
        </div>
      ))}
    </List>
  );
}
