import { Button, Modal } from "@mui/material";
import React from "react";
import SideBar from "../components/SideBar";
import YourComponent from "./Test";

export default function Qulayliklar() {
  return (
    <div className="admin-page">
      {/* Yuklanmoqda loader */}
      <SideBar active="qulayliklar" />

      <div className="container">
        <div className="buttonsPanel">
          <Button
            color="error"
            variant="contained"
            data-bs-toggle=""
            data-bs-target=""
          >
            Ikkilamchilarni o'chirish
          </Button>
        </div>
        <YourComponent />
        {/* <Modal open={true}></Modal> */}
      </div>
    </div>
  );
}
