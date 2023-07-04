import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import fileDownload from "js-file-download";
import API from "../utils/APIRouters";
import { toast } from "react-toastify";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ToolsForma1 from "../components/Forma1/ToolsForma1";
import { Backdrop, CircularProgress, Typography } from "@mui/material";

export default function Forma1() {
  const [datas, setDatas] = useState([]);
  const [rows, setRows] = useState((prevState = [], props) => {
    return prevState;
  });
  const [checked, setChecked] = useState([]);
  const [showBackdrop, setShowBackrop] = useState(true);

  const columns = [
    { field: "id", headerName: "№", width: 50 },
    { field: "kod", headerName: "Litsavoy", width: 300 },
    // { field: "fish", headerName: "F. I. O.", width: 150 },
    {
      field: "mahalla",
      headerName: "Mahallala",
      width: 200,
      renderCell: (params) => {
        return params.row.mahallalar;
      },
    },
    { field: "date", headerName: "Sana", width: 150 },
    {
      field: "status",
      headerName: "Holati",
      width: 150,
      renderCell: (params) => {
        if (params.row.status === "TASDIQLANDI") {
          return <Typography className="text-success">TASDIQLANDI</Typography>;
        } else if (params.row.status === "YANGI") {
          return <Typography className="text-warning">YANGI</Typography>;
        }
      },
    },
    {
      field: "actions",
      headerName: "Harakatlar",
      width: 150,
      renderCell: (params) => {
        return (
          <div key={params.row.id} className="d-flex">
            <a
              onClick={(e) => {
                console.log(params);
                onLoadFile(params.row.file_id);
              }}
            >
              <FileDownloadIcon className="mx-2" />
            </a>
            {/* <ShowModal details={params.row} /> */}
          </div>
        );
      },
    },
  ];
  const fetchData = async () => {
    setShowBackrop(true);
    const respond = await axios.get(API.forma1lar);
    let counter = 0;
    let maped = respond.data.forma1lar.map((data, i) => {
      if (data.confirm === "TASDIQLANDI" || data.confirm === "YANGI") {
        counter++;
        return {
          id: counter,
          _id: data._id,
          file_link: data.file_link,
          file_id: data.photo_file_id,
          kod: data.kod,
          date: data.createdAt,
          status: data.confirm,
          actions: [data.file_link, data._id],
        };
      }
    });
    let filter = maped.filter((a) => {
      if (a) return true;
    });
    console.log({ filter });
    setDatas(filter);
    setShowBackrop(false);
  };
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setRows(datas);
  }, [datas]);

  const handleSearch = (text) => {
    setRows(
      datas.filter((data) => {
        console.log(data.kod);
        if (data.kod.toString().includes(text)) return true;
      })
    );
  };

  const onLoadFile = (file_id) => {
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
        fileDownload(res.data, "review." + ex);
      });
  };

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
        await axios.put(`${API.bildirgilar}/${id}`, {
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
      <SideBar active="forma1" />
      <div className="container">
        <div className="table-container">
          {/* MODAL WINDOWS */}

          {/* Tool action buttons */}
          <ToolsForma1
            handleSearch={handleSearch}
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
            // onRowSelectionModelChange={handleSelect}
            style={{ height: "89vh" }}
          ></DataGrid>
        </div>
      </div>
    </div>
  );
}
