import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import API from "../utils/APIRouters";
import { toast } from "react-toastify";
import ImportAktModal from "../components/Aktlar/ImportAktModal";
import CreateAktModal from "../components/Aktlar/CreateAktModal";
import DeleteAlertModal from "../components/Aktlar/DeleteAlertModal";
import Tools from "../components/Aktlar/Tools";
import { hide } from "../app/reducers/showHideSlice";
import { useDispatch } from "react-redux";
import { Backdrop, CircularProgress } from "@mui/material";
import { useParams } from "react-router-dom";

function Aktlar() {
  const { pachka_id } = useParams();
  const [rows, setRows] = useState((prevState = [], props) => {
    return prevState;
  });
  const [checked, setChecked] = useState([]);
  const [showBackdrop, setShowBackrop] = useState(true);

  const dispatch = useDispatch();

  const columns = [
    { field: "id", headerName: "№", width: 50 },
    { field: "kod", headerName: "Litsavoy", width: 150 },
    { field: "fish", headerName: "F. I. O.", width: 250 },
    {
      field: "bildirish_xati",
      headerName: "Bildirgi",
      width: 70,
      renderCell: (params) => {
        return params.row.bildirish_xati.raqami ? (
          <a href={params.row.bildirish_xati.link}>
            {params.row.bildirish_xati.raqami}
          </a>
        ) : (
          "Yo'q"
        );
      },
    },
    {
      field: "ogohlantirish_xati",
      headerName: "Ogohlantirish",
      width: 100,
      renderCell: (params) => {
        return params.row.ogohlantirish_xati ? (
          <span className="text-success text-bold">Ogohlantirildi</span>
        ) : (
          <span className="text-danger">Yo'q</span>
        );
      },
    },
    {
      field: "forma1",
      headerName: "Forma 1",
      width: 150,
      renderCell: (params) => {
        return params.row.forma1.topildi ? (
          <span className="text-success text-bold">Aniqlandi</span>
        ) : (
          <span className="text-danger">Yo'q</span>
        );
      },
    },
    { field: "dalolatnoma", headerName: "Dalolatnoma", width: 150 },
    { field: "status", headerName: "Holati", width: 100 },
    { field: "qarzdorlik", headerName: "Qarzdorlik", width: 80 },
    { field: "step_1", headerName: "Qadam 1" },
    { field: "step_2", headerName: "Qadam 2" },
    { field: "step_3", headerName: "Qadam 3" },
    { field: "step_4", headerName: "Qadam 4" },
    { field: "step_5", headerName: "Qadam 5" },
  ];
  const fetchData = async () => {
    setShowBackrop(true);
    const respond = await axios.get(
      !pachka_id ? API.sudAkts : API.pachkalar + pachka_id
    );
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
        status: data.status,
        qarzdorlik: data.qarzdorlik,
      };
    });
    setShowBackrop(false);
    setRows(m);
    console.log("ishladi");
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

  const fetchDelete = async () => {
    for (let i = 0; i < checked.length; i++) {
      const _id = checked[i];

      const respond = await axios.delete(`${API.sudAkts}/${_id}`);
      if (respond.data.message) {
        toast.done(respond.data.message);
      }
    }
    fetchData();
    dispatch(hide());
  };

  const fetchSudBuyrugiChiqorilgan = async () => {
    checked.forEach(async (_id) => {
      await axios
        .put(`${API.sudAkts}/${_id}`, {
          sud_buyrugi: {
            chiqdi: true,
            date: Date.now(),
          },
          status: "BUYRUQ CHIQQAN",
        })
        .then((respond) => {
          console.log(respond.data);
          if (respond.data.ok) {
            toast.done("Yangilandi");
          } else {
            toast.error(respond.data.message);
          }
          fetchData();
        });
    });
  };

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
          <CreateAktModal getDatas={fetchData} pachka_id={pachka_id} />
          <ImportAktModal getDatas={fetchData} pachka_id={pachka_id} />
          <DeleteAlertModal fetchDelete={fetchDelete} getDatas={fetchData} />

          {/* Tool action buttons */}
          <Tools
            fetchData={fetchData}
            fetchSudBuyrugiChiqorilgan={fetchSudBuyrugiChiqorilgan}
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
