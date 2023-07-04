import * as React from "react";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import DownloadIcon from "@mui/icons-material/Download";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import { Box, FormControl } from "@mui/material";
import axios from "axios";
import { sudAkts } from "../../utils/APIRouters";
import UploadFileIcon from "@mui/icons-material/UploadFile";

export default function UploadFilesModal({ fetchData }) {
  const [open, setOpen] = React.useState(false);
  const [excelFile, setExcelFile] = React.useState(null);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const handleChange = (e) => {
    const fileTypes = [
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ];
    const selectedFile = e.target.files[0];
    if (selectedFile && fileTypes.includes(selectedFile.type)) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => {
        setExcelFile(e.target.result);
      };
    } else {
      toast.error("Faqat excel file kiriting");
      return false;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const workSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[workSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        blankrows: false,
        raw: true,
      });
      try {
        data.forEach(async (elem) => {
          await axios.put(`${sudAkts}/`, {
            KOD: elem.KOD,
            ogohlantirish_xati: true,
          });
        });
        toast.success("Yangilandi");
        fetchData();
        fetchData();
      } catch (error) {
        toast.error(error.message);
      }
    }
  };
  const onDownload = () => {
    const link = document.createElement("a");
    link.download = `example.xlsx`;
    link.href = "./examples/ogohlantirilgan.xlsx";
    link.click();
  };

  return (
    <>
      <Button
        color="error"
        variant="contained"
        data-bs-toggle=""
        data-bs-target=""
        onClick={handleClickOpen}
      >
        <UploadFileIcon /> Ogohlantirish fayllari
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={(e) => handleSubmit(e)}>
          <DialogTitle>Ogohlantirilganlar</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Ogohlantirish xatlarini{" "}
              <a className="text-primary" onClick={onDownload}>
                na'muna
              </a>{" "}
              dagidek zip fayl ko'rinishida yuboring.
            </DialogContentText>
            <input
              type="number"
              placeholder="Prefix"
              className="form-control my-2"
            />
            <input
              type="file"
              accept="application/zip"
              className="form-control"
              onChange={(e) => handleChange(e)}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Chiqish</Button>
            <Button type="submit">Saqlash</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
}
