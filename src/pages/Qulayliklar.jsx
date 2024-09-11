import { Button, Paper } from "@mui/material";
import React from "react";
import { Link } from "react-router-dom";
import SideBar from "../components/SideBar";
import arizalarArxivFileStore from "../store/arizalarArxivFileStore";

export default function Qulayliklar() {
  const arizalarArxivFile = arizalarArxivFileStore();
  console.log(arizalarArxivFile.file);
  return (
    <div className="admin-page">
      {/* Yuklanmoqda loader */}
      <SideBar active="qulayliklar" />

      <div className="container">
        <div className="buttonsPanel">
          <Link to="/dvayniklarUchirish">
            <Button
              color="error"
              variant="contained"
              data-bs-toggle=""
              data-bs-target=""
            >
              Ikkilamchilarni o'chirish
            </Button>
          </Link>
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
