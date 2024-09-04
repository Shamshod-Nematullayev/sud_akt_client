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

export default function ImportArizalarPage() {
  const [showBackdrop, setShowBackdrop] = useState(false);
  const [showModal, setShowModal] = useState(true);
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
            filelaridan iborat bo'lgan RAR arxiv fayli yuklanishi kerak
          </DialogContentText>
          <MainFileInput />
        </DialogContent>
        <DialogActions>
          <Link to="/qulayliklar">
            <Button variant="outlined" color="error">
              Chiqish
            </Button>
          </Link>
          <Button onClick={"to do"} variant="outlined" color="success">
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
        <ImportArizalar />
      </div>
    </div>
  );
}
