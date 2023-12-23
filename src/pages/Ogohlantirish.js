import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import { sudAkts } from "../utils/APIRouters";
import { toast } from "react-toastify";
import ToolsOgohlantirish from "../components/Ogohlantirish/ToolsOgohlantirish";
import { Backdrop, CircularProgress } from "@mui/material";

function Aktlar() {
  const [rows, setRows] = useState((prevState = [], props) => {
    return prevState;
  });
  const [checked, setChecked] = useState([]);
  const [showBackdrop, setShowBackrop] = useState(true);

  const columns = [
    { field: "id", headerName: "№", width: 50 },
    { field: "kod", headerName: "Litsavoy", width: 150 },
    { field: "fish", headerName: "F. I. O.", width: 150 },
    {
      field: "ogohlantirish_xati",
      headerName: "Ogohlantirish",
      width: 150,
      renderCell: (params) => {
        return params.row.ogohlantirish_xati ? (
          <span className="text-success text-bold">Ogohlantirildi</span>
        ) : (
          <span className="text-danger">Yo'q</span>
        );
      },
    },
  ];
  const fetchData = async () => {
    setShowBackrop(true);
    const respond = await axios.get(sudAkts);
    let m = respond.data.aktlar.map((data, i) => {
      return {
        id: i + 1,
        kod: data.kod,
        fish: data.fish,
        bildirish_xati: data.bildirish_xat,
        ogohlantirish_xati: data.ogohlantirish_xati,
        forma1: data.forma_bir,
        dalolatnoma: data.solishtirma_dalolatnoma,
        _id: data._id,
      };
    });
    setRows(m);
    setShowBackrop(false);
  };
  useEffect(() => {
    fetchData();
  }, []);

  const handleSelect = (e) => {
    const arr = [];
    e.forEach((tr) => {
      arr.push(rows[tr - 1]._id);
    });
    setChecked(arr);
  };

  const handleChecked = () => {
    try {
      checked.forEach(async (id) => {
        await axios.put(`${sudAkts}/${id}`, {
          ogohlantirish_xati: true,
        });
      });
      toast.success("Yangilandi");
      fetchData();
      fetchData();
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="admin-page">
      {/* Yuklanmoqda loader */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={showBackdrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <SideBar active="ogohlantirish_xatlar" />
      <div className="container">
        <div className="table-container">
          {/* MODAL WINDOWS */}

          {/* Tool action buttons */}
          <ToolsOgohlantirish
            handleChecked={handleChecked}
            fetchData={fetchData}
          />

          {/* Data Table */}
          <DataGrid
            className="data-table card"
            columns={columns}
            rows={rows}
            pageSize={10}
            rowsPerPageOptions={[5]}
            checkboxSelection
            onRowSelectionModelChange={handleSelect}
            style={{ height: "89vh" }}
          ></DataGrid>
        </div>
      </div>
    </div>
  );
}

export default Aktlar;
