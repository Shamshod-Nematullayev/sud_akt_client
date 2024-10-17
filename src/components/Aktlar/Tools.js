import React from "react";
import ExcelSvg from "../../assets/excel.svg";
import { Button } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import { CSVLink } from "react-csv";

function Tools({
  fetchData,
  fetchSudBuyrugiChiqorilgan,
  datas,
  fetchTolovQildi,
}) {
  // data for excel
  const formatData = () => {
    const arr = [];
    datas.forEach((data) => {
      arr.push({
        tr: data.id,
        kod: data.kod,
        fish: data.fish,
        ogohlantirish: data.ogohlantirish_xati,
        forma1: data.forma1?.topildi ? "aniqlandi" : "noaniq",
        _id: data._id,
        status: data.status,
        qarzdorlik: data.qarzdorlik,
      });
    });
    return arr;
  };

  return (
    <ul>
      <div className="accordion actions-panel">
        <div className="accordion-item">
          <h1 className="accordion-header">
            <button
              className="accordion-button collapsed"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#collapseOne"
              aria-expanded="false"
              aria-controls="collapseOne"
              id="collapseOneBtn"
            >
              Harakatlar
            </button>
          </h1>
          <div
            id="collapseOne"
            className="accordion-collapse collapse "
            data-bs-parent="#accordionExample"
          >
            <div
              type="button"
              className="accordion-body text-bg-success"
              data-bs-toggle="modal"
              data-bs-target="#exampleModal"
            >
              Yangi Akt
            </div>
            <div
              className="accordion-body text-bg-warning"
              data-bs-toggle="modal"
              data-bs-target="#importAktsModal"
            >
              Import akts
            </div>
            <div
              className="accordion-body text-bg-danger"
              data-bs-toggle=""
              data-bs-target=""
              onClick={() => {
                // setShowModal(true)
                // bu yerda modal oynani ko'rsatish uchun state dispatcher bo'lishi kerak edi. Bu bo'lim ishga tushishni boshlaganida yana yaratamiz
              }}
            >
              O'chirish
            </div>
          </div>
        </div>
        <button className="btn btn-secondary excel-btn">
          <CSVLink
            data={formatData()}
            style={{ textDecoration: "none", color: "#fff" }}
          >
            <img src={ExcelSvg} style={{ height: 25 }} /> Excelga
          </CSVLink>
        </button>
        <Button variant="contained" onClick={fetchData}>
          <CachedIcon />
        </Button>
        <Button variant="contained" onClick={fetchSudBuyrugiChiqorilgan}>
          Sud buyrug'i chiqorilgan <DoneOutlineIcon />
        </Button>
        <Button variant="contained" onClick={fetchTolovQildi}>
          To'lov qildi <DoneOutlineIcon />
        </Button>
      </div>
    </ul>
  );
}

export default Tools;
