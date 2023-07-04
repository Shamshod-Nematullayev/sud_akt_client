import React, { useState } from "react";
// import { useDispatch } from "react-redux";
import { Button, FormControl, TextField } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import SearchIcon from "@mui/icons-material/Search";
import CachedIcon from "@mui/icons-material/Cached";

export default function ToolsBildirgilar({
  handleChecked,
  fetchData,
  handleSearch,
}) {
  const [text, setText] = useState("");
  // const dispatch = useDispatch();
  return (
    <ul>
      <div className="accordion actions-panel d-flex justify-center">
        <TextField
          id="outlined-search"
          label="Litsavoy"
          type="search"
          onChange={(e) => setText(e.target.value)}
          sx={
            {
              // height: 15,
            }
          }
        ></TextField>
        {/* <Button color="secondary" variant="contained">
          <img src={ExcelSvg} style={{ height: 25 }} /> Excelga
        </Button> */}
        <Button onClick={() => handleSearch(text)}>
          <SearchIcon />
        </Button>
        <Button variant="contained" onClick={fetchData}>
          <CachedIcon />
        </Button>
      </div>
    </ul>
    // Excel file import ogohlantirilganlar
    // ZIP file orqali import ogohlantirish xatlari
    // Tanlash orqali ogohlantirilganlarni belgilash
    // ZIP fayl orqali kelgan ogohlantirish fayli ma'lumotlari google driveda saqlanadi
  );
}
