import React from "react";
// import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import ImportModalOgohlantirish from "./ImportExcelModal";
import UploadFilesModal from "./UploadFilesModal.ogohlantirish";
import CachedIcon from "@mui/icons-material/Cached";

function ToolsOgohlantirish({
  handleChecked,
  fetchData,
  page,
  pageSize,
  sortModel,
}) {
  // const dispatch = useDispatch();
  return (
    <ul>
      <div className="accordion actions-panel">
        <Button
          color="success"
          variant="contained"
          data-bs-toggle=""
          data-bs-target=""
          onClick={handleChecked}
        >
          <CheckCircleOutlineIcon /> Ogohlantirilgan
        </Button>
        <ImportModalOgohlantirish
          fetchData={() => fetchData(page, pageSize, sortModel)}
        />
        <UploadFilesModal />
        <Button
          variant="contained"
          onClick={() => fetchData(page, pageSize, sortModel)}
        >
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

export default ToolsOgohlantirish;
