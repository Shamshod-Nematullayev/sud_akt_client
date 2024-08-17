import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Radio,
  RadioGroup,
} from "@mui/material";
import { display } from "@mui/system";
import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import SideBar from "../components/SideBar";
import { host } from "../utils/APIRouters";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import { toast } from "react-toastify";
import AddReactionIcon from "@mui/icons-material/AddReaction";
import axios from "axios";

export default function Nazoratchilar() {
  const [rows, setRows] = useState([]); // State to hold rows data
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator
  const [mahallalar, setMahallalar] = useState([]); // State for loading indicator
  const [activeInspector, setActiveInspector] = useState(false); // State for chosen inspector
  const [activeMFY, setActiveMFY] = useState(false); // State for chosen mfy
  const [openAddModal, setOpenAddModal] = useState(false);
  const [forChoose, setForChoose] = useState([]); // mahalla yoki nazoratchini biriktirayotganda tanlash modali contenti uchun
  const [choosingMethod, setChoosingMethod] = useState(false); // mahalla yoki nazoratchini
  const [radioBtnValue, setRadioBtnValue] = useState(false);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(host + "/api/inspectors"); // Replace with your endpoint
      const data = await response.json();
      const result = [];
      data.rows.forEach((row) => {
        result.push({
          id: row.id,
          name: row.name,
          mfy1: row.biriktirilgan[0],
          mfy2: row.biriktirilgan[1],
          mfy3: row.biriktirilgan[2],
        });
      });
      setRows(result);
      setMahallalar(data.mahallalar);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, []); // Empty dependency array to run only once on component mount

  const handleEdit = (row, field) => {
    console.log("Edit row:", row, "Field:", field);
    // Implement your edit logic here
  };

  const handleDelete = async (mfy_id) => {
    try {
      const { data } = await axios.post(
        host + "/api/inspectors/unset-inspector-to-mfy/" + mfy_id
      );
      if (!data.ok) {
        return toast.error(data.message);
      }
      fetchData(); //
      toast.success(data.message);
    } catch (err) {
      toast.error("Error deleting row:", err.message);
      console.error(err);
    }
  };

  const handleOpenDialog = (type, id) => {
    setChoosingMethod(type);
    if (type === "choosing mfy") {
      setActiveInspector(id);
      setForChoose(
        mahallalar.filter(
          (mfy) =>
            mfy.reja > 0 && mfy.biriktirilganNazoratchi.inspactor_id == null
        )
      );
    } else if (type === "choosing inspector") {
      setActiveMFY(id);
      setForChoose(rows);
    }
    setOpenAddModal(true);
  };

  const handleCloseDialog = () => {
    setOpenAddModal(false);
    setForChoose([]);
    setActiveInspector(false);
    setActiveMFY(false);
    setRadioBtnValue("");
  };

  const columns = [
    { field: "id", headerName: "ID", width: 70 },
    { field: "name", headerName: "Ism", width: 200 },
    {
      field: "mfy1",
      headerName: "Mahalla 1",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {params.row.mfy1 ? (
              <>
                <li>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(params.row.mfy1.mfy_id)}
                  >
                    <EditIcon />
                  </IconButton>
                </li>
                <li>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(params.row.mfy1.mfy_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </li>
              </>
            ) : (
              <li>
                <IconButton
                  color="success"
                  onClick={() => {
                    handleOpenDialog("choosing mfy", params.row.id);
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              </li>
            )}
          </ul>{" "}
          <div>{params.row.mfy1?.mfy_name}</div>
        </div>
      ),
    },
    {
      field: "mfy2",
      headerName: "Mahalla 2",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {params.row.mfy2 ? (
              <>
                <li>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(params.row.mfy2.mfy_id)}
                  >
                    <EditIcon />
                  </IconButton>
                </li>
                <li>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(params.row.mfy2.mfy_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </li>
              </>
            ) : params.row.mfy1 ? (
              <li>
                <IconButton
                  color="success"
                  onClick={() => {
                    handleOpenDialog("choosing mfy", params.row.id);
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              </li>
            ) : (
              ""
            )}
          </ul>{" "}
          <div>{params.row.mfy2?.mfy_name}</div>
        </div>
      ),
    },
    {
      field: "mfy3",
      headerName: "Mahalla 3",
      width: 150,
      renderCell: (params) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {params.row.mfy3 ? (
              <>
                <li>
                  <IconButton
                    color="primary"
                    onClick={() => handleEdit(params.row.mfy3.mfy_id)}
                  >
                    <EditIcon />
                  </IconButton>
                </li>
                <li>
                  <IconButton
                    color="secondary"
                    onClick={() => handleDelete(params.row.mfy3.mfy_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </li>
              </>
            ) : params.row.mfy2 ? (
              <li>
                <IconButton
                  color="success"
                  onClick={() => {
                    handleOpenDialog("choosing mfy", params.row.id);
                  }}
                >
                  <AddCircleIcon />
                </IconButton>
              </li>
            ) : (
              ""
            )}
          </ul>{" "}
          <div>{params.row.mfy3?.mfy_name}</div>
        </div>
      ),
    },
  ];

  return (
    <div className="admin-page">
      <Dialog open={openAddModal} aria-labelledby="chooseAddModal">
        <DialogTitle id="chooseAddModal">
          {"Kerakli elementni tanlang"}
        </DialogTitle>
        <DialogContent>
          <RadioGroup
            id="chooseAddModal"
            value={radioBtnValue}
            onChange={(e) => setRadioBtnValue(e.target.value)}
          >
            {forChoose.map((row) => (
              <FormControlLabel
                key={row.id}
                value={row.id}
                control={<Radio />}
                label={row.name}
              />
            ))}
          </RadioGroup>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog} variant="outlined">
            Bekor qilish
          </Button>
          <Button
            onClick={async () => {
              if (choosingMethod === "choosing mfy") {
                if (!activeInspector || !radioBtnValue)
                  return toast.error(`Majburiy qiymatlar tanlanmagan`);
                const { data } = await axios.post(
                  host +
                    "/api/inspectors/set-inspector-to-mfy/" +
                    radioBtnValue,
                  { inspector_id: activeInspector }
                );
                if (!data.ok) return toast.error(data.message);
                toast.success(data.message);
                handleCloseDialog();
                fetchData();
              } else if (choosingMethod === "choosing inspector") {
                if (!activeMFY || !radioBtnValue)
                  return toast.error(`Majburiy qiymatlar tanlanmagan`);
                const { data } = await axios.post(
                  host + "/api/inspectors/set-inspector-to-mfy/" + activeMFY,
                  { inspector_id: radioBtnValue }
                );
                toast.success(data.message);
                handleCloseDialog();
                fetchData();
              }
            }}
            variant="contained"
            color="primary"
          >
            Biriktirish
          </Button>
        </DialogActions>
      </Dialog>
      {/* Yuklanmoqda loader */}
      <SideBar active="inspectors" />
      <div className="container">
        <h1 style={{ fontSize: "1rem" }}>ЕсоРау тизимидаги Инспекторлар</h1>
        <div style={{ display: "flex" }}>
          <DataGrid
            className="data-table card"
            rows={rows}
            columns={columns}
            style={{ height: "90%" }}
            getRowHeight={() => 120}
          />
          <ul
            className="data-table card"
            style={{ width: 200, listStyleType: "none" }}
          >
            <li style={{ fontWeight: "bold", fontSize: 18 }}>
              Bo'sh mahallalar
            </li>
            {mahallalar
              .filter(
                (mfy) =>
                  mfy.reja > 0 &&
                  mfy.biriktirilganNazoratchi.inspactor_id == null
              )
              .map((mfy) => (
                <li key={mfy.id}>
                  <IconButton
                    color="success"
                    onClick={() => {
                      handleOpenDialog("choosing inspector", mfy.id);
                    }}
                  >
                    <AddReactionIcon />
                  </IconButton>
                  <span>{mfy.name}</span>
                </li>
              ))}
          </ul>
          <ul
            className="data-table card"
            style={{ width: 200, listStyleType: "none" }}
          >
            <li style={{ fontWeight: "bold", fontSize: 18 }}>Biriktirilgan</li>
            {mahallalar
              .filter(
                (mfy) =>
                  mfy.reja > 0 &&
                  mfy.biriktirilganNazoratchi.inspactor_id != null
              )
              .map((mfy) => (
                <li key={mfy.id}>
                  <IconButton
                    color="danger"
                    onClick={() => handleDelete(mfy.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                  <span>{mfy.name}</span>
                </li>
              ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
