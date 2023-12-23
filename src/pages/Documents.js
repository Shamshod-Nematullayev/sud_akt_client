import { Backdrop, CircularProgress } from "@mui/material";
import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import API from "../utils/APIRouters";
import fileDownload from "js-file-download";
import ToolsDocuments from "../components/Documents/ToolsDocuments";

export default function Documents() {
  const [rows, setRows] = useState((prevState = [], props) => {
    return prevState;
  });
  const [datas, setDatas] = useState([]);
  const [showBackdrop, setShowBackrop] = useState(true);
  const [checked, setChecked] = useState("");

  const onLoadFile = (file_id, file_name) => {
    axios
      .get(API.fetchTelegramLoadFile + file_id, { responseType: "blob" })
      .then((res) => {
        console.log(res.data);
        let ex = "";
        if (res.data.type == "image/jpeg") {
          ex = "jpg";
        } else if (res.data.type == "application/pdf") {
          ex = "pdf";
        }
        fileDownload(res.data, file_name ? file_name : "review." + ex);
      });
  };

  const columns = [
    { field: "id", headerName: "№", width: 50 },
    { field: "name", headerName: "Xujjat turi" },
    { field: "createdAt", headerName: "Yaratilish sanasi", width: 150 },
    { field: "inspector", headerName: "Nazoratchi", width: 150 },
    { field: "abonent", headerName: "Kod", width: 150 },
    { field: "doc_num", headerName: "Xujjat raqami", width: 150 },
    {
      field: "file",
      headerName: "file",
      renderCell: (params) => {
        return (
          <a
            onClick={() => onLoadFile(params.row.file_id, params.row.file_name)}
          >
            {params.row.file_name}
          </a>
        );
      },
    },
  ];
  const fetchData = async () => {
    setShowBackrop(true);
    const respond = await axios.get(API.documents);
    let data = respond.data.documents.map((data, i) => {
      return {
        id: i + 1,
        name: data.doc_type,
        createdAt: data.date,
        inspector: data.inspector,
        _id: data._id,
        abonent: data.abonent,
        abonents: data.abonents,
        doc_num: data.doc_num,
        file_id: data.file_id,
        file_name: data.file_name,
      };
    });
    setShowBackrop(false);
    setDatas(data);
    setRows(data);
  };
  useEffect(() => {
    fetchData();
  }, []);

  // Qidirish funksiyasi
  const handleSearch = (text) => {
    setRows(
      datas.filter((data) => {
        let found = false;
        data.abonents.forEach((abonent) => {
          if (abonent.Litsavoy_kod?.includes(text)) found = true;
          if (abonent.Dvaynik_kod?.includes(text)) found = true;
        });
        if (String(data.abonent).includes(text)) found = true;
        return found;
      })
    );
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

      <SideBar active="documents" />
      <div className="container">
        <div className="table-container">
          {/* MODAL WINDOWS */}

          {/* Tool action buttons */}
          <ToolsDocuments
            rows={rows}
            checked={checked}
            setChecked={setChecked}
            fetchData={fetchData}
            handleSearch={handleSearch}
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
