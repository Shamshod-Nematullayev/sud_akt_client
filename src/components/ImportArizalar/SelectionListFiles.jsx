import { List, ListItemButton, ListItemText } from "@mui/material";
import React, { useState } from "react";
import arizalarArxivFileStore from "../../store/arizalarArxivFileStore";

export default function SelectionListFiles() {
  const { pdfFiles } = arizalarArxivFileStore();
  const [selectedNav, setSelectedNav] = useState(null);

  // event handlers
  const handleSelectNav = (id) => {
    setSelectedNav(id);
  };
  return (
    <List
      component="nav"
      aria-label="files"
      sx={{ height: "100%", overflow: "scroll" }}
    >
      {pdfFiles.map((file) => (
        <ListItemButton
          key={file.url}
          selected={selectedNav === file.url}
          onClick={() => handleSelectNav(file.url)}
        >
          <ListItemText primary={file.name} />
        </ListItemButton>
      ))}
    </List>
  );
}
