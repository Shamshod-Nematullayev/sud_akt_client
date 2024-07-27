import {
  Backdrop,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import axios from "axios";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { toast } from "react-toastify";
import SideBar from "../components/SideBar";
import API from "../utils/APIRouters";
import DeleteIcon from "@mui/icons-material/Delete";
import { Print } from "@mui/icons-material";
import ReactToPrint from "react-to-print";

export default function AbarotkaChiqorish() {
  const componentRef = useRef();
  const [showModal, setShowModal] = useState(false);
  const [mahallalar, setMahallalar] = useState([]);
  const [abonents, setAbonents] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const date = new Date();
  useEffect(() => {
    async function fetchData() {
      const respond = await axios.get(
        `${API.host}/api/billing/get-all-active-mfy`
      );
      setMahallalar(respond.data.data);
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
              if (!respond.data.ok) {
                return toast.error(respond.data.message);
              }
              setShowModal(false);
              async function fetchData() {
                const respond3 = await axios.get(
                  `${API.host}/api/billing/get-all-active-mfy`
                );
                setMahallalar(respond3.data.data);
              }
              fetchData();
              return toast.success(respond.data.message);
            }}
            variant="outlined"
            color="error"
          >
            O'chirish
          </Button>
        </DialogActions>
      </Dialog>
      <ReactToPrint
        trigger={() => (
          <Button
            color="success"
            variant="contained"
            style={{ position: "fixed", right: 30, bottom: 50 }}
            onClick={async () => {}}
          >
            Chop etish
          </Button>
        )}
        content={() => componentRef.current}
      />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div className="container" style={{ display: "flex" }}>
        <ul
          style={{
            width: 280,
            background: "#fff",
            padding: "5px 10px",
            height: "100vh",
            overflow: "scroll",
          }}
        >
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
                key={mfy.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  fontSize: "25px",
                }}
              >
                <div>
                  {mfy.printed ? (
                    <DeleteIcon
                      style={{ color: "red" }}
                      onClick={async () => {
                        const respond = await axios.get(
                          `${API.host}/api/billing/abarotka-berilmadi/${mfy.id}`
                        );
                        if (!respond.data.ok) {
                          return toast.error(respond.data.message);
                        }
                        async function fetchData() {
                          const respond3 = await axios.get(
                            `${API.host}/api/billing/get-all-active-mfy`
                          );
                          setMahallalar(respond3.data.data);
                        }
                        fetchData();
                      }}
                    />
                  ) : (
                    <Print
                      style={{ color: "blue" }}
                      onClick={async () => {
                        setIsLoading(true);
                        const respond = await axios.get(
                          `${API.host}/api/billing/get-abonents-by-mfy-id/${mfy.id}`
                        );
                        if (!respond.data.ok) {
                          setIsLoading(false);
                          return toast.error(respond.data.message);
                        }
                        setAbonents(
                          respond.data.data.sort((a, b) =>
                            a.fio.localeCompare(b.fio)
                          )
                        );
                        const respond2 = await axios.get(
                          `${API.host}/api/billing/abarotka-berildi/${mfy.id}`
                        );
                        if (!respond2.data.ok) {
                          setIsLoading(false);
                          return toast.error(respond2.data.message);
                        }
                        async function fetchData() {
                          const respond3 = await axios.get(
                            `${API.host}/api/billing/get-all-active-mfy`
                          );
                          setMahallalar(respond3.data.data);
                          setIsLoading(false);
                        }
                        fetchData();
                      }}
                    ></Print>
                  )}

                  {mfy.name}
                </div>
              </li>
            );
          })}
        </ul>
        <div ref={componentRef}>
          <table>
            <tr>
              <td colSpan={7}>
                <i>Oliy Ong</i>
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: 22 }} colSpan={7}>
                Сана: {date.getDate()}.{date.getMonth() + 1}.
                {date.getFullYear()}
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: 22 }} colSpan={7}>
                Самарканд вилояти / Каттақўрғон туман / "ANVARJON BIZNES INVEST"
                MCHJ
              </td>
            </tr>
            <tr>
              <td style={{ fontSize: 22 }} colSpan={7}>
                Махалла: {abonents[0]?.mahalla_name}
              </td>
            </tr>
            {/* Asosiy abonentlar ma'lumotlari yoziladigan joy */}
            <tr className="abonent_rows" style={{ border: "1px solid black" }}>
              <th>№</th>
              <th>Лицавой</th>
              <th>ФИО</th>
              <th style={{ width: 100 }}>Кўча</th>
              <th>Я/с</th>
              <th>Қарздор</th>
              <th colSpan={2}>Охирги тўлов</th>
              <th>ЭТК</th>
            </tr>
            {abonents.map((abonent, i) => (
              <tr
                className="abonent_rows"
                style={{ border: "1px solid black" }}
                key={abonent.id}
              >
                <td style={{ textAlign: "center" }}>{i + 1}</td>
                <td>{abonent.licshet}</td>
                <td>
                  {abonent.fio.length < 30
                    ? abonent.fio
                    : abonent.fio.slice(0, 30) + ".."}
                </td>
                <td>{abonent.streets_name}</td>
                <td style={{ textAlign: "center" }}>
                  {abonent.prescribed_cnt}
                </td>
                <td style={{ textAlign: "right" }}>
                  {Math.floor(Number(abonent.saldo_k)).toLocaleString()}
                </td>
                <td style={{ textAlign: "right" }}>
                  {abonent.last_pay_amount}
                </td>
                <td>{abonent.last_pay_date?.split(" ")[0]}</td>
                <td>{abonent.energy_licshet}</td>
              </tr>
            ))}
          </table>
        </div>
      </div>
    </div>
  );
}
