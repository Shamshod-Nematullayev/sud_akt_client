import { IconButton, List, ListItem } from "@mui/material";
import React from "react";
import useDvayniklarStore from "../../store/dvayniklarStore";
import DeleteIcon from "@mui/icons-material/Delete";

export default function OutputPanel() {
  const { items, setItems } = useDvayniklarStore();

  //   handler
  const handleDeleteButtonClick = (index) => {
    setItems(items.filter((item, i) => i !== index));
  };
  return (
    <div style={{ width: 300, border: "1px solid #ccc", minHeight: 500 }}>
      <List>
        {items.map((item, index) => (
          <ListItem key={index}>
            {item.haqiqiy.licshet}-{item.ikkilamchi.licshet}
            <IconButton onClick={() => handleDeleteButtonClick(index)}>
              <DeleteIcon style={{ color: "red" }} />
            </IconButton>
          </ListItem>
        ))}
      </List>
    </div>
  );
}
