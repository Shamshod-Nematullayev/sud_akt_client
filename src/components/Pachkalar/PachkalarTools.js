import React, { useState } from "react";
import API from "../../utils/APIRouters";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import axios from "axios";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";

function ToolsPachkalar({
  handleChecked,
  fetchData,
  checked,
  setChecked,
  rows,
}) {
  // const dispatch = useDispatch();
  const [values, setValues] = useState({
    name: "",
    description: "",
  });
  const [open, setOpen] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleClose = (e) => {
    setOpen(false);
  };
  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    if (values.name === "") {
      return toast.error("Pachka uchun nom kiritilmagan");
    } else if (values.name.length < 3) {
      return toast.error("Pachka uchun tanlangan nom juda qisqa");
    }
    await axios
      .post(API.pachkalar, {
        name: values.name,
        description: values.description,
      })
      .then(({ data }) => {
        if (data.ok) {
          toast.success(data.message);
          fetchData();
        } else {
          toast.error(data.message);
        }
      });
    setValues({
      name: "",
      description: "",
    });
    handleClose();
  };
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (checked === "") {
      return toast.error("Avval elementni tanlang");
    }
    if (values.name === "") {
      return toast.error("Pachka uchun nom kiritilmagan");
    } else if (values.name.length < 3) {
      return toast.error("Pachka uchun tanlangan nom juda qisqa");
    }
    await axios
      .put(API.pachkalar + checked, {
        name: values.name,
        description: values.description,
      })
      .then(({ data }) => {
        if (data.ok) {
          toast.success(data.message);
          fetchData();
          setOpenEdit(false);
        } else {
          toast.error(data.message);
        }
      });
  };
  const handleDelete = async (e) => {
    if (checked === "") {
      return toast.error("Avval elementni tanlang");
    }
    e.preventDefault();
    await axios
      .delete(API.pachkalar + checked)

      .then(({ data }) => {
        if (data.ok) {
          toast.success(data.message);
          fetchData();
          setChecked("");
        } else {
          toast.error(data.message);
        }
      });
  };
  const handleEditButton = () => {
    const pachka = rows.find((row) => checked === row._id);
    setValues({ name: pachka.name, description: pachka.description });
    setOpenEdit(true);
  };
  const sudgaYuborish = async () => {
    await axios.get(API.pachkalar + checked + "/sudgaYuborish/").then((res) => {
      if (res.data.ok) {
        toast.success(res.data.message);
      }
    });
  };
  return (
    <ul>
      <div className="accordion actions-panel">
        <Dialog open={open}>
          <form onSubmit={(e) => handleCreateSubmit(e)}>
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
        <Button variant="contained" onClick={sudgaYuborish}>
          Sudga yuborish <SendIcon />
        </Button>
        <Button
          color="warning"
          variant="contained"
          data-bs-toggle=""
          data-bs-target=""
          onClick={handleEditButton}
        >
          <EditIcon /> Tahrirlash
        </Button>{" "}
        <Button
          color="error"
          variant="contained"
          data-bs-toggle=""
          data-bs-target=""
          onClick={(e) => {
            if (window.confirm(`Haqiqatdan ham o'chirishni hohlaysizmi?`))
              handleDelete(e);
          }}
        >
          <DeleteIcon /> O'chirish
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

export default ToolsPachkalar;
