import { Button } from "@mui/material";
import React from "react";
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
          <Link to="/createDalolatnoma">
            <Button color="info" variant="contained">
              Dalolatnomalar yaratish
            </Button>
          </Link>
          <Link to="/addressToConvert">
            <Button color="info" variant="contained">
              Kanvertga manzil
            </Button>
          </Link>
          <Link to="/abarotkaChiqorish">
            <Button color="secondary" variant="contained">
              Abarotka chiqarish
            </Button>
          </Link>
          <Link to="/arizalarImport">
            <Button color="secondary" variant="contained">
              Arizalar import
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
