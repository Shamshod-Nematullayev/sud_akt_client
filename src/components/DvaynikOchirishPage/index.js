import { Backdrop, CircularProgress, Paper } from "@mui/material";
import React from "react";
import useDvayniklarStore from "../../store/dvayniklarStore";
import useLoaderStore from "../../store/loadingStore";
import SideBar from "../SideBar";
import CreateAktPanel from "./CreateAktPanel";
import InputPanel from "./InputPanel";
import MiddlePanel from "./MiddlePanel";
import OutputPanel from "./OutputPanel";

export default function DvaynikOchirishPage() {
  const { isLoading } = useLoaderStore();

  return (
    <div className="admin-page">
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SideBar active="qulayliklar" />
      <Paper
        className="container"
        sx={{ display: "flex", justifyContent: "space-between" }}
      >
        <InputPanel />
        <div>
          <MiddlePanel />
          <CreateAktPanel />
        </div>
        <OutputPanel />
      </Paper>
    </div>
  );
}
