import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import axios from "axios";
import { forma1lar } from "../../utils/APIRouters";
import AddIcon from "@mui/icons-material/Add";

export default function CreateForma1({ fetchData }) {
  const [open, setOpen] = React.useState(false);
  const [excelFile, setExcelFile] = React.useState(null);
  const [file_name, setFileName] = React.useState("");
  const [kod, setKod] = React.useState("");

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleSubmit = async (e) => {
    const formData = new FormData();
    formData.append("file", excelFile);
    e.preventDefault();
    const res = await axios.post(
      forma1lar,
      { file: excelFile, kod, file_name, type: "forma1" },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!res.data.ok) {
      toast.error(res.data.message);
    } else {
      handleClose();
      toast.success(res.data.message);
      fetchData();
    }
    // if (excelFile !== null) {
    //   const workbook = XLSX.read(excelFile, { type: "buffer" });
    //   const workSheetName = workbook.SheetNames[0];
    //   const worksheet = workbook.Sheets[workSheetName];
    //   const data = XLSX.utils.sheet_to_json(worksheet, {
    //     blankrows: false,
    //     raw: true,
    //   });
    //   try {
    //     data.forEach(async (elem) => {
    //       await axios.put(`${sudAkts}/`, {
    //         KOD: elem.KOD,
    //         ogohlantirish_xati: true,
    //       });
    //     });
    //     toast.success("Yangilandi");
    //     fetchData();
    //     fetchData();
    //   } catch (error) {
    //     toast.error(error.message);
    //   }
    // }
  };

  return (
    <>
      <Button
        color="success"
        variant="contained"
        data-bs-toggle=""
        data-bs-target=""
        onClick={handleClickOpen}
      >
        <AddIcon /> Yaratish
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={(e) => handleSubmit(e)} encType="mutipart/form-data">
          <DialogTitle>Shaxsiga aniqlik kiritish</DialogTitle>
          <DialogContent>
            <input
              type="number"
              placeholder="Kod"
              maxLength={12}
              name="kod"
              className="form-control my-2"
              value={kod}
              onChange={(e) => {
                setKod(e.target.value);
              }}
            />
            <input
              type="file"
              className="form-control"
              accept="image/png, image/jpeg, .pdf"
              onChange={(e) => {
                setExcelFile(e.target.files[0]);
                setFileName(e.target.files[0].name);
              }}
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
