import React, { useState } from "react";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import ImportArizalar from "../components/ImportArizalar/ImportArizalar";
import SideBar from "../components/SideBar";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import MainFileInput from "../components/ImportArizalar/MainFileInput";
import arizalarArxivFileStore from "../store/arizalarArxivFileStore";
import { toast } from "react-toastify";
import JSZip from "jszip";
import { Paper } from "@mui/material";
import SelectionListFiles from "../components/ImportArizalar/SelectionListFiles";
import useLoaderStore from "../store/loadingStore";

export default function ImportArizalarPage() {
  const { isLoading } = useLoaderStore();
  const [showModal, setShowModal] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const { file, setData, currentPdf, pdfFiles, setPdfFiles } =
    arizalarArxivFileStore();

  const extractPdfFilesFromZip = async (zip) => {
    const filesPromises = Object.values(zip.files)
      .filter((file) => file.name.toLowerCase().endsWith(".pdf"))
      .map(async (file) => {
        const arrayBuffer = await file.async("arraybuffer");
        const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });
        const url = URL.createObjectURL(pdfBlob);
        return { pdfBlob, name: file.name, url };
      });

    return await Promise.all(filesPromises);
  };
  const processPdfFile = async (file) => {
    const arrayBuffer = await file.arrayBuffer();
    const pdfBlob = new Blob([arrayBuffer], { type: "application/pdf" });
    const url = URL.createObjectURL(pdfBlob);
    return { pdfBlob, name: file.name, url };
  };

  // handle functions
  const handleSubmit = async (event) => {
    event.preventDefault(); // Agar formdan foydalanayotgan bo'lsangiz, bu qo'shilsin

    if (!selectedFile) {
      return toast.error("File not selected");
    }

    if (selectedFile.type === "application/pdf") {
      setShowModal(false);
      setData(selectedFile);
      const pdfFile = await processPdfFile(selectedFile);
      setPdfFiles([pdfFile]);
      return;
    }
    const zip = await JSZip.loadAsync(selectedFile);
    setShowModal(false);
    setData(selectedFile);
    const pdfFiles = await extractPdfFilesFromZip(zip);
    setPdfFiles(pdfFiles);
  };

  return (
    <div className="admin-page">
      {/* Arxivlangan faylni yuklab olish uchun modal oyna */}
      <Dialog
        open={pdfFiles.length > 0 ? false : true}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{"IMPORT"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Bu yerga Xadsen tizimiga ro'yxatdan o'tkazilgan arizalarning PDF
            filelaridan iborat bo'lgan ZIP arxiv fayli yoki 1 dona PDF fayli
            yuklanishi kerak {file ? file.name : ""}
          </DialogContentText>
          <MainFileInput
            selectedFile={selectedFile}
            setSelectedFile={setSelectedFile}
          />
        </DialogContent>
        <DialogActions>
          <Link to="/qulayliklar">
            <Button variant="outlined" color="error">
              Chiqish
            </Button>
          </Link>
          <Button onClick={handleSubmit} variant="outlined" color="success">
            yuklash
          </Button>
        </DialogActions>
      </Dialog>
      {/* Yuklanmoqda loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SideBar active="qulayliklar" />
      <div className="container">
        <Paper
          sx={{
            position: "absolute",
            right: 0,
            width: "30%",
            height: "40%",
          }}
        >
          <SelectionListFiles />
        </Paper>
        <iframe
          src={currentPdf.url}
          width="30%"
          height="60%"
          title={currentPdf.name}
          style={{ position: "absolute", right: 0, top: "40%" }}
        ></iframe>
        <ImportArizalar />
      </div>
    </div>
  );
}
