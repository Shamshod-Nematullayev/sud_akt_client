import React from "react";
import { useDispatch } from "react-redux";
import { show } from "../../app/reducers/showHideSlice";
import ExcelSvg from "../../assets/excel.svg";
import { Button } from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import SendIcon from "@mui/icons-material/Send";
import DoneOutlineIcon from "@mui/icons-material/DoneOutline";
import axios from "axios";
import API from "../../utils/APIRouters";

function Tools({ fetchData, fetchSudBuyrugiChiqorilgan }) {
  function handleSudBuyrugiChiqorilgan() {
    axios.put(API.sudAkts, {});
  }
  const dispatch = useDispatch();
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
              onClick={() => dispatch(show())}
            >
              O'chirish
            </div>
          </div>
        </div>
        <button className="btn btn-secondary excel-btn">
          <img src={ExcelSvg} style={{ height: 25 }} /> Excelga
        </button>
        <Button variant="contained" onClick={fetchData}>
          <CachedIcon />
        </Button>
        <Button variant="contained" onClick={fetchData}>
          Sudga yuborish <SendIcon />
        </Button>
        <Button variant="contained" onClick={fetchSudBuyrugiChiqorilgan}>
          Sud buyrug'i chiqorilgan <DoneOutlineIcon />
        </Button>
      </div>
    </ul>
  );
}

export default Tools;
