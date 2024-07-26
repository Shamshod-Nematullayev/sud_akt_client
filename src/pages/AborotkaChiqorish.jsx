import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import SideBar from "../components/SideBar";
import API from "../utils/APIRouters";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AbarotkaChiqorish() {
  const [showModal, setShowModal] = useState(false);
  const [mahallalar, setMahallalar] = useState([]);
  useEffect(() => {
    async function fetchData() {
      const respond = await axios.get(
        `${API.host}/api/billing/get-all-active-mfy`
      );
      setMahallalar(respond.data);
    }
    fetchData();
  }, []);
  return (
    <div className="admin-page">
      {/* Yuklanmoqda loader */}
      <SideBar active="qulayliklar" />
      <Dialog
        open={showModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Hammasini tozalash"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Agar o'chirish tugmasini bossangiz barcha mahallalar abarotka
            berilmaganga chiqadi. Siz rostdan ham hamma mahallalarni abarotka
            olmagan qilib belgilamoqchimisiz?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowModal(false)} variant="contained">
            Bekor qilish
          </Button>
          <Button
            onClick={async () => {
              const respond = await axios.get(
                `${API.host}/api/billing/barchasiga-abarotka-berilmadi`
              );
              console.log({ respond });
              if (!respond.data.ok) {
                return toast.error(respond.data.message);
              }
              setShowModal(false);
              return toast.success(respond.data.message);
            }}
            variant="outlined"
            color="error"
          >
            O'chirish
          </Button>
        </DialogActions>
      </Dialog>

      <div className="container">
        <ul style={{ width: 250 }}>
          <li style={{ listStyle: "none" }}>
            <Button
              color="error"
              variant="contained"
              fullWidth
              data-bs-toggle=""
              data-bs-target=""
              onClick={() => setShowModal(true)}
            >
              Reset
            </Button>
          </li>
          {mahallalar.map((mfy) => {
            return (
              <li
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "25px",
                }}
              >
                <div>
                  <DeleteIcon
                    style={{ color: "red" }}
                    onClick={() => {
                      const newArr = [
                        ...countes.slice(0, i),
                        ...countes.slice(i + 1),
                      ];
                      setCountes(newArr);
                    }}
                  />
                  {count.name + ": "}
                </div>
                <div>{count.summ}</div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
