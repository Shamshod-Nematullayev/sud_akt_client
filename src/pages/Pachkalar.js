import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import API from "../utils/APIRouters";
import ToolsPachkalar from "../components/Pachkalar/PachkalarTools";

export default function Pachkalar() {
  const [rows, setRows] = useState((prevState = [], props) => {
    return prevState;
  });
  const [showBackdrop, setShowBackrop] = useState(true);
  const [checked, setChecked] = useState("");

  const columns = [
    { field: "id", headerName: "№", width: 50 },
    { field: "name", headerName: "Pachka nomi" },
    { field: "createdAt", headerName: "Yaratilish sanasi", width: 150 },
    {
      field: "description",
      headerName: "Tavsif",
    },
    {
      field: "sended_sud",
      headerName: "Sudga yuborilishi",
      width: "200",
      renderCell: (params) => {},
    },
    {
      field: "elemnts_count",
      headerName: "Aktlar soni",
      width: "100",
    },
  ];
  const fetchData = async () => {
    setShowBackrop(true);
    const respond = await axios.get(API.pachkalar);
    let m = respond.data.pachkalar.map((data, i) => {
      console.log(data);
      return {
        id: i + 1,
        name: data.name,
        createdAt: data.createdAt,
        description: data.description,
        sended_sud: data.sended_sud,
        _id: data._id,
        elemnts_count: data.elements.length,
      };
    });
    setShowBackrop(false);
    setRows(m);
    console.log("ishladi");
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="admin-page">
      {/* Yuklanmoqda loaderni ko'rsatish */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>

      <SideBar active="aktlar" />
      <div className="container">
        <div className="table-container">
          {/* MODAL WINDOWS */}

          {/* Tool action buttons */}
          <ToolsPachkalar
            rows={rows}
            checked={checked}
            setChecked={setChecked}
            fetchData={fetchData}
          />

          {/* Data Table */}
          <DataGrid
            className="data-table card"
            columns={columns}
            rows={rows}
            style={{ height: "89vh" }}
            onRowClick={(e) => setChecked(e.row._id)}
          ></DataGrid>
        </div>
      </div>
    </div>
  );
}
