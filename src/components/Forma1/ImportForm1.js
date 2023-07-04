import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { toast } from "react-toastify";
import axios from "axios";
import { forma1lar, forma1larImport } from "../../utils/APIRouters";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export default function ImportForm1({ fetchData }) {
  const [open, setOpen] = React.useState(false);
  const [excelFile, setExcelFile] = React.useState(null);
  const [prefix, setKod] = React.useState("");

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
      forma1larImport,
      { file: excelFile, type: "forma1" },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!res.data.ok) {
      toast.error(res.data.message);
    } else {
      toast.success(res.data.message);
    }
  };
  const onDownload = () => {
    const link = document.createElement("a");
    link.download = `example.zip`;
    link.href = "./examples/importForma1.zip";
    link.click();
  };

  return (
    <>
      <Button
        color="warning"
        variant="contained"
        data-bs-toggle=""
        data-bs-target=""
        onClick={handleClickOpen}
      >
        <CloudUploadIcon />
        {"  "} Import
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <form onSubmit={(e) => handleSubmit(e)} encType="mutipart/form-data">
          <DialogTitle>Xujjatlarni import qilish</DialogTitle>
          <DialogContent>
            Forma 1 xujjatlarini{" "}
            <a href="" onClick={onDownload}>
              na'munada
            </a>
            gidek zip fayl ko'rinishida yuboring. Agar prefix kiritsangiz
            fayllar nomidan prefixni o'chishiib tashlash kerak bo'ladi
            <input
              type="number"
              placeholder="Prefix (105120 yoki 105070)"
              name="prefix"
              className="form-control my-2"
              value={prefix}
              onChange={(e) => {
                setKod(e.target.value);
              }}
            />
            <input
              type="file"
              className="form-control"
              accept=".zip"
              onChange={(e) => {
                setExcelFile(e.target.files[0]);
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
