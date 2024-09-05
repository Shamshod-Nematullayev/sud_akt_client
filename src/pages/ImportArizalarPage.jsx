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

export default function ImportArizalarPage() {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showModal, setShowModal] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const { file, setData, pdfFiles, setPdfFiles } = arizalarArxivFileStore();

  // handle functions
  const handleSubmit = async (event) => {
    if (!selectedFile) return toast.error(`file not selected`);

    // setShowBackdrop(true);
    setShowModal(false);
    setData(selectedFile);
    const zip = await JSZip.loadAsync(selectedFile);
    const filesPromises = [];
    console.log(zip);

    for (const property in zip.files) {
      const file = zip.files[property];
      if (file.name.toLowerCase().endsWith(".pdf")) {
        filesPromises.push(
          file.async("arraybuffer").then((arrayBuffer) => {
            const pdfBlob = new Blob([arrayBuffer], {
              type: "application/pdf",
            });
            const url = URL.createObjectURL(pdfBlob);
            return { name: file.name, url };
          })
        );
      }
    }

    const files = await Promise.all(filesPromises);
    setPdfFiles(files);
    console.log({ files });
  };

  return (
    <div className="admin-page">
      {/* Arxivlangan faylni yuklab olish uchun modal oyna */}
      <Dialog
        open={showModal}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">{"IMPORT"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-description">
            Bu yerga Xadsen tizimiga ro'yxatdan o'tkazilgan arizalarning PDF
            filelaridan iborat bo'lgan RAR arxiv fayli yuklanishi kerak{" "}
            {file ? file.name : ""}
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
        open={showBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SideBar active="qulayliklar" />
      <div className="container">
        {pdfFiles.length > 0 && (
          <div>
            {pdfFiles.map((file, index) => (
              <div key={index}>
                <iframe
                  src={file.url}
                  width="30%"
                  height="60%"
                  title={file.name}
                  style={{ position: "absolute", right: 0, top: "40%" }}
                ></iframe>
              </div>
            ))}
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
          </div>
        )}
        <ImportArizalar />
      </div>
    </div>
  );
}
