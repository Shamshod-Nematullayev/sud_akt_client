import { Button, Modal } from "@mui/material";
import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";

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
          <Link to="/calculator">
            <Button color="secondary" variant="contained">
              Kalkulyator
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
