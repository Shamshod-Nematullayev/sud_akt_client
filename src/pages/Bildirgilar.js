import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import API from "../utils/APIRouters";
import { toast } from "react-toastify";
import FileDownloadIcon from "@mui/icons-material/FileDownload";
import ShowModal from "../components/Bildirgilar/ShowModal";
import ToolsBildirgilar from "../components/Bildirgilar/ToolsBildirgilar";
import { Backdrop, CircularProgress, colors } from "@mui/material";
import fileDownload from "js-file-download";

function Bildirgilar() {
  const [datas, setDatas] = useState([]);
  const [rows, setRows] = useState((prevState = [], props) => {
    return prevState;
  });
  const [checked, setChecked] = useState([]);
  const [showBackdrop, setShowBackrop] = useState(true);

  const columns = [
    { field: "id", headerName: "№", width: 50 },
    { field: "fish", headerName: "Nazoratchi", width: 300 },
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
      field: "actions",
      headerName: "Harakatlar",
      width: 150,
      renderCell: (params) => {
        return (
          <div key={params.row.id} className="d-flex">
            <a onClick={(e) => onDownload(params.row.file_id, e)}>
              <FileDownloadIcon className="mx-2" sx={{ color: "#0d6efd" }} />
            </a>
            <ShowModal details={params.row} />
          </div>
        );
      },
    },
  ];

  const fetchData = async () => {
    setShowBackrop(true);
    const respond = await axios.get(API.bildirgilar);
    let m = respond.data.bildirgilar.map((data, i) => {
      return {
        id: data.doc_num,
        kod: data.kod,
        fish: data.inspector.name,
        // mahalla: data.mahallalar[0].name,
        date: `${data.date.year}/${data.date.month}/${data.date.day}`,
        actions: [data.file_link, data._id],
        abonents: data.abonents,
        file_id: data.file_id,
        _id: data._id,
      };
    });
    setShowBackrop(false);
    setDatas(m);
    console.log("ishladi");
  };

  function onDownload(file_id, e) {
    e.preventDefault();
    axios
      .get(API.fetchTelegramLoadFile + file_id, { responseType: "blob" })
      .then((res) => {
        console.log(res.data);
        let ex = "";
        if (res.data.type == "image/jpeg") {
          ex = "jpg";
        } else if (res.data.type == "application/pdf") {
          ex = "pdf";
        } else {
          ex = "pdf";
        }
        fileDownload(res.data, "review." + ex);
      });
  }
  useEffect(() => {
    fetchData();
  }, []);
  useEffect(() => {
    setRows(datas);
  }, [datas]);

  const handleSearch = (text) => {
    setRows(
      datas.filter((data) => {
        let found = false;
        data.abonents.forEach((kod) => {
          if (kod.includes(text)) found = true;
        });
        return found;
      })
    );
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
      <SideBar active="bildirgilar" />
      <div className="container">
        <div className="table-container">
          {/* MODAL WINDOWS */}

          {/* Tool action buttons */}
          <ToolsBildirgilar
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

export default Bildirgilar;
