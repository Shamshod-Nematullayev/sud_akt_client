import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import API, { sudAkts } from "../utils/APIRouters";
import { toast } from "react-toastify";
import ToolsOgohlantirish from "../components/Ogohlantirish/ToolsOgohlantirish";
import { Backdrop, CircularProgress } from "@mui/material";

function Aktlar() {
  const [rows, setRows] = useState((prevState = [], props) => {
    return prevState;
  });
  const [checked, setChecked] = useState([]);
  const [page, setPage] = useState(0);
  const [pageSize, setPageSize] = useState(50);
  const [totalRows, setTotalRows] = useState(0);
  const [sortModel, setSortModel] = useState({});
  const [showBackdrop, setShowBackrop] = useState(true);

  const columns = [
    { field: "id", headerName: "№", width: 50 },
    { field: "licshet", headerName: "licshet", width: 150 },
    { field: "receiver", headerName: "F. I. O.", sortable: false, width: 300 },
    {
      field: "isSent",
      headerName: "yuborildi",
      width: 100,
      renderCell: (params) => (params.row.isSent ? "🟢" : "🟥"),
    },
    { field: "warning_amount", headerName: "Qarzdorlik", width: 100 },
    {
      field: "isSavedBilling",
      headerName: "billingda",
      width: 150,
      renderCell: (params) => (params.row.isSavedBilling ? "🟢" : "🟥"),
    },
    {
      field: "actions",
      headerName: "Harakatlar",
      width: 200,
      sortable: false,
      filterable: false,
      renderCell: (params) => <div style={{ display: "flex" }}>Delete</div>,
    },
  ];
  const fetchData = async (page, pageSize, sortModel) => {
    setShowBackrop(true);
    try {
      const respond = await axios.get(`${API.sudAkts}hybrid-mails`, {
        params: {
          page: page + 1, // DataGrid uses 0-indexing, but your server expects 1-indexing
          limit: pageSize,
          sortField: sortModel.field,
          sortDirection: sortModel.sort,
        },
      });
      let data = respond.data.rows.map((data, i) => {
        const startIndex = page * pageSize;
        return {
          id: startIndex + i + 1,
          _id: data._id,
          licshet: data.licshet,
          isSent: data.isSent,
          receiver: data.receiver,
          isSavedBilling: data.isSavedBilling,
          sentOn: data.sentOn,
          warning_amount: data.warning_amount,
          sud_process_id_billing: data.sud_process_id_billing,
        };
      });
      setTotalRows(respond.data.total); // Update total rows for pagination
      setRows(data);
    } catch (error) {
      toast.error("Failed to fetch data");
      console.error(error);
    } finally {
      setShowBackrop(false);
    }
  };
  useEffect(() => {
    fetchData(page, pageSize, sortModel);
  }, [page, pageSize]);

  const handleSelect = (selectionModel) => {
    const selectedIds = selectionModel
      .map((id) => {
        const selectedRow = rows.find((row) => row.id === id);
        return selectedRow ? selectedRow._id : null; // Check if row exists and return _id
      })
      .filter(Boolean); // Remove nulls

    setChecked(selectedIds);
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
            page={page}
            pageSize={pageSize}
            sortModel={sortModel}
          />

          {/* Data Table */}
          <DataGrid
            className="data-table card"
            columns={columns}
            rows={rows}
            pageSize={pageSize} // Add more options if needed
            checkboxSelection
            pagination
            paginationMode="server" // Server-side pagination
            onPaginationModelChange={(newPaginationModel) => {
              setPage(newPaginationModel.page);
              setPageSize(newPaginationModel.pageSize);
            }}
            onSortModelChange={(newSortModel) => {
              setSortModel(newSortModel[0]);
              fetchData(0, pageSize, newSortModel[0] || {});
            }}
            rowCount={totalRows} // Set total row count (ideally from the server)
            onRowSelectionModelChange={handleSelect}
            style={{ height: "89vh" }}
          />
        </div>
      </div>
    </div>
  );
}

export default Aktlar;
