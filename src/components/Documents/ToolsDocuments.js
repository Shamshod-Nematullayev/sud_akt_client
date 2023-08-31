import React, { useEffect, useState } from "react";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  MenuItem,
  Select,
  Stack,
  TextareaAutosize,
  TextField,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import { Link } from "react-router-dom";
import api from "../../utils/axios";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { Label } from "@mui/icons-material";

function ToolsDocuments({
  handleChecked,
  fetchData,
  checked,
  setChecked,
  rows,
}) {
  // -----------States -------------------//
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [values, setValues] = useState({
    doc_type: "dalolatnoma",
    inspector: "fuqoro",
  });
  const [inspectors, setInspectors] = useState([]);
  const [excelFile, setExcelFile] = useState(null);

  // -----------Handlers -----------------//
  async function handleCreateSubmit(e) {
    e.preventDefault();
    let excelData;
    if (values.doc_type == "xatlov") {
      excelData = await handleChangeExcel();
    }
    setOpen(false);
  }

  async function handleChangeExcel(e) {
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const workSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[workSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        blankrows: false,
        raw: true,
      });

      setExcelFile(null);
      return data;
    }
  }

  async function handleEditSubmit(e) {
    e.preventDefault();
  }

  function handleChange(e) {
    setValues({ ...values, [e.target.name]: e.target.value });
  }

  function handleClose() {
    setOpen(false);
  }

  async function getInspectors() {
    const { data } = await api.get("/api/inspectors");
    if (!data.ok) {
      return toast.error(data.message);
    }
    setInspectors(data.inspectors);
  }
  useEffect(() => {
    getInspectors();
  }, [open]);

  return (
    <ul>
      <div className="accordion actions-panel">
        <Dialog open={open}>
          <form onSubmit={(e) => handleCreateSubmit(e)}>
            <DialogTitle sx={{ minWidth: 300, textAlign: "center" }}>
              Yangi xujjat yaratish
            </DialogTitle>
            <DialogContent>
              <DialogContentText className="my-2" sx={{ textAlign: "center" }}>
                Qiymatlarni kiriting{" "}
                {values.doc_type == "xatlov" ? (
                  <span
                    className="text-success"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      const link = document.createElement("a");
                      link.download = `example.xlsx`;
                      link.href = "/examples/import_incoming_document.xlsx";
                      link.click();
                    }}
                  >
                    Excel namuna
                  </span>
                ) : (
                  ""
                )}
              </DialogContentText>
              <Stack direction={"column"}>
                <Stack direction={"row"}>
                  <Select
                    value={values.doc_type}
                    name="doc_type"
                    sx={{ textAlign: "center" }}
                    onChange={handleChange}
                  >
                    <MenuItem value={"dalolatnoma"}>Dalolatnoma</MenuItem>
                    <MenuItem value={"game_over"}>O'lim guvohnomasi</MenuItem>
                    <MenuItem value={"xatlov"}>Xatlov</MenuItem>
                  </Select>
                  {values.doc_type !== "xatlov" ? (
                    <TextField
                      type="number"
                      name="abonent"
                      label="hisob raqam"
                      value={values.abonent}
                      onChange={handleChange}
                    />
                  ) : (
                    <TextField
                      type={"file"}
                      name="abonents"
                      sx={{ borderStyle: "dashed" }}
                      onChange={(e) => {
                        const fileTypes = [
                          "application/vnd.ms-excel",
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
                        ];
                        const selectedFile = e.target.files[0];
                        if (
                          selectedFile &&
                          fileTypes.includes(selectedFile.type)
                        ) {
                          let reader = new FileReader();
                          reader.readAsArrayBuffer(selectedFile);
                          reader.onload = (e) => {
                            setExcelFile(e.target.result);
                          };
                        } else {
                          toast.error("Faqat excel file kiriting");
                          return false;
                        }
                      }}
                      inputProps={{
                        accept:
                          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel",
                      }}
                    />
                  )}
                </Stack>
                <Select
                  className="my-3"
                  name="inspector"
                  value={values.inspector}
                  onChange={handleChange}
                >
                  <MenuItem value={"fuqoro"}>Kim orqali</MenuItem>
                  {inspectors.map((inspector) => (
                    <MenuItem value={inspector.id} key={inspector._id}>
                      {inspector.name}
                    </MenuItem>
                  ))}
                </Select>
                Xujjat fayli
                <TextField type="file" className="my-2" />
                <TextareaAutosize placeholder="Izoh uchun"></TextareaAutosize>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Chiqish</Button>
              <Button type="submit">Saqlash</Button>
            </DialogActions>
          </form>
        </Dialog>
        <Dialog open={openEdit}>
          <form onSubmit={(e) => handleEditSubmit(e)}>
            <DialogTitle>Yangi pachka yaratish</DialogTitle>
            <DialogContent>
              <DialogContentText>Qiymatlarni kiriting</DialogContentText>
              <input
                type="text"
                className="form-control my-2"
                name="name"
                onChange={(e) => handleChange(e)}
                placeholder="Pachka nomi"
                value={values.name}
              />
              <textarea
                type="text"
                className="form-control"
                name="description"
                placeholder="Pachka tavsifi"
                value={values.description}
                onChange={(e) => handleChange(e)}
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOpenEdit(false)}>Chiqish</Button>
              <Button type="submit">Saqlash</Button>
            </DialogActions>
          </form>
        </Dialog>
        <Button
          color="success"
          variant="contained"
          data-bs-toggle=""
          data-bs-target=""
          onClick={() => setOpen(true)}
        >
          <AddIcon /> Yaratish
        </Button>
        <Button
          color="warning"
          variant="contained"
          data-bs-toggle=""
          data-bs-target=""
          onClick={() => {
            setOpen(false);
            setOpenEdit(true);
          }}
        >
          <EditIcon /> Tahrirlash
        </Button>{" "}
        <Button
          color="primary"
          variant="contained"
          data-bs-toggle=""
          data-bs-target=""
          onClick={handleChecked}
        >
          <Link
            to={`/aktlar/${checked}`}
            style={{ color: "#fff", textDecoration: "none" }}
          >
            <NavigateNextIcon /> O'tish
          </Link>
        </Button>
      </div>
    </ul>
    // Excel file import ogohlantirilganlar
    // ZIP file orqali import ogohlantirish xatlari
    // Tanlash orqali ogohlantirilganlarni belgilash
    // ZIP fayl orqali kelgan ogohlantirish fayli ma'lumotlari google driveda saqlanadi
  );
}

export default ToolsDocuments;
