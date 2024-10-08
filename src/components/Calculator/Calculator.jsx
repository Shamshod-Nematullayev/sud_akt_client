import {
  Button,
  Paper,
  Switch,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";

import React, { useEffect } from "react";
import { useState } from "react";
import SideBar from "../SideBar";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteIcon from "@mui/icons-material/Delete";
import "./style.css";
import axios from "axios";
import { getNextIncomingDocNum, createFullAkt } from "../../utils/APIRouters";
import { toast } from "react-toastify";
import DataTable from "./DataTable";
import InputCalculator from "./InputCalculator";
import { hisoblandiJadval } from "../../utils/constants";
const APIs = require("../../utils/APIRouters");

export default function Calculator() {
  const [currentTotal, setCurrentTotal] = useState(0);
  const [currentNds, setCurrentNds] = useState(0);
  const [ndsTotal, setNdsTotal] = useState(0);
  const [fromMoon, setFromMoon] = useState(1);
  const [fromYear, setFromYear] = useState(2019);
  const [toMoon, setToMoon] = useState(2);
  const [toYear, setToYear] = useState(2024);
  const [yashovchilar, setYashovchilar] = useState(1);
  const [countes, setCountes] = useState([]);
  const [total, setTotal] = useState([]);
  const [aktNumberDisabled, setAktNumberDisabled] = useState(false);
  const [aktNumber, setAktNumber] = useState(0);
  const [aktFile, setAktFile] = useState(null);
  const [fileInputLabel, setFileInputLabel] = useState("Choose File");
  const [createAktButtonDisabled, setCreateAktButtonDisabled] = useState(false);
  const [comment, setComment] = useState("MFY dalolatnomasi");
  const [licshet, setLicshet] = useState("");
  const [prescribed_cnt, set_prescribed_cnt] = useState("");
  const [amount, setAmount] = useState("");
  const [yashovchiInputDisable, setYashovchiInputDisable] = useState(false);
  const [aktSummasiInputDisabled, setAktSummasiInputDisabled] = useState(false);
  const [rows, setRows] = useState([]);
  const [abonentData, setAbonentData] = useState({});

  const handleAddClick = () => {
    setCountes([
      ...countes,
      {
        name: `${fromMoon}.${fromYear}-${toMoon}.${toYear}`,
        summ: currentTotal,
        nds: currentNds,
      },
    ]);
  };

  const qaytaHisob = ({ fromMoon, fromYear, toMoon, toYear, yashovchilar }) => {
    let summ = 0;
    let nds = 0;
    for (let i = 0; i < hisoblandiJadval.length; i++) {
      const davr = hisoblandiJadval[i];

      if (
        (davr.year == fromYear && davr.month >= fromMoon) ||
        davr.year > fromYear
      ) {
        if (
          davr.year < toYear ||
          (davr.year == toYear && davr.month <= toMoon)
        ) {
          if (davr.nds) {
            nds += davr.nds * yashovchilar;
          }
          summ += davr.hisoblandi * yashovchilar;
        }
      }
    }
    setCurrentNds(nds);
    setCurrentTotal(summ);
  };
  useEffect(() => {
    let total = 0;
    let nds = 0;
    countes.forEach((count) => {
      total += count.summ;
      nds += count.nds;
    });
    setTotal(total);
    setNdsTotal(nds);
  }, [countes]);

  const handleRefreshFromBilling = async () => {
    if (licshet == "") {
      return toast.error("Hisob raqami bo'sh");
    }
    const result = await axios.get(APIs.getDXJ + licshet);
    if (result.data.ok) {
      const data = result.data.rows.map((data, i) => {
        return {
          id: i + 1,
          period: data.period,
          prescribed_cnt: data.prescribed_cnt,
          saldo_n: Math.floor(data.saldo_n),
          nachis: Math.floor(data.nachis),
          saldo_k: Math.floor(data.saldo_k),
          akt: Math.floor(data.akt),
          income: Math.floor(
            Number(data.postup_kvit) +
              Number(data.postup_munis) +
              Number(data.postup_plat) +
              Number(data.postup_rp)
          ),
        };
      });
      setRows(data);
      setAbonentData({
        mahalla_name: result.data.abonentData.mahalla_name,
        fio: result.data.abonentData.fio,
      });
    } else {
      toast.error(result.data.message);
    }
  };
  const handleKeyDown = async (event) => {
    if (event.key === "Enter") {
      if (licshet == "") {
        return toast.error("Hisob raqami bo'sh");
      }
      const result = await axios.get(APIs.getDXJ + licshet);
      if (result.data.ok) {
        const data = result.data.rows.map((data, i) => {
          return {
            id: i + 1,
            period: data.period,
            prescribed_cnt: data.prescribed_cnt,
            saldo_n: Math.floor(data.saldo_n),
            nachis: Math.floor(data.nachis),
            saldo_k: Math.floor(data.saldo_k),
            akt: Math.floor(data.akt),
            income: Math.floor(
              Number(data.postup_kvit) +
                Number(data.postup_munis) +
                Number(data.postup_plat) +
                Number(data.postup_rp)
            ),
          };
        });
        setRows(data);
        setAbonentData({
          mahalla_name: result.data.abonentData.mahalla_name,
          fio: result.data.abonentData.fio,
        });
      } else {
        toast.error(result.data.message);
      }
    }
  };

  return (
    <div className="admin-page">
      {/* Yuklanmoqda loader */}
      <SideBar active="qulayliklar" />

      <div className="container" style={{ margin: "10px 100px" }}>
        <Paper
          style={{
            height: "80%",
            marginTop: "25px",
            width: "1600px",
            padding: "35px 80px",
            position: "relative",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Month"
                type="number"
                InputProps={{ inputProps: { min: 1, max: 12 } }}
                style={{ width: 70 }}
                value={fromMoon}
                onChange={(e) => setFromMoon(e.target.value)}
              ></TextField>
              <TextField
                label="Year"
                type="number"
                InputProps={{ inputProps: { min: 2019, max: 2024 } }}
                style={{ width: 90 }}
                value={fromYear}
                onChange={(e) => setFromYear(e.target.value)}
              ></TextField>
              Dan
              <TextField
                label="Month"
                type="number"
                defaultValue={2}
                InputProps={{ inputProps: { min: 1, max: 12 } }}
                style={{ width: 70 }}
                value={toMoon}
                onChange={(e) => setToMoon(e.target.value)}
              ></TextField>
              <TextField
                label="Year"
                type="number"
                InputProps={{ inputProps: { min: 2019, max: 2024 } }}
                style={{ width: 90 }}
                value={toYear}
                onChange={(e) => setToYear(e.target.value)}
              ></TextField>
              Gacha
              <TextField
                label="Yashovchi"
                type="number"
                defaultValue={1}
                InputProps={{ inputProps: { min: 1 } }}
                style={{ width: 90 }}
                value={yashovchilar}
                onChange={(e) => {
                  setYashovchilar(e.target.value);
                  qaytaHisob({
                    fromMoon,
                    fromYear,
                    toMoon,
                    toYear,
                    yashovchilar: Number(e.target.value),
                  });
                }}
              ></TextField>
              <Button
                variant="contained"
                color="success"
                onClick={handleAddClick}
              >
                Add
              </Button>
              <span style={{ fontSize: "20px", marginLeft: 25 }}>
                {currentTotal}
              </span>
            </div>
            <ul style={{ width: 400, position: "absolute", right: "10px" }}>
              {countes.map((count, i) => {
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
          <div style={{ display: "flex" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                width: "160px",
                marginTop: "80px",
              }}
            >
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  Auto-akt №
                  <Switch
                    onChange={async (e) => {
                      if (e.target.checked) {
                        setAktNumberDisabled(true);
                        const res = await axios.get(getNextIncomingDocNum);
                        setAktNumber(res.data.value);
                      } else {
                        setAktNumber("");
                        setAktNumberDisabled(false);
                      }
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 2,
                  }}
                >
                  _______
                  <TextField
                    id="akt_number_text_field"
                    fullWidth
                    placeholder="№"
                    disabled={aktNumberDisabled}
                    type="number"
                    value={aktNumber}
                    onChange={(e) => setAktNumber(e.target.value)}
                    style={{ padding: "0px" }}
                  />
                </div>
              </div>
              <div style={{ display: "flex", position: "relative" }}>
                <TextField
                  placeholder="Лицавой"
                  type="number"
                  disabled={createAktButtonDisabled}
                  inputProps={{ inputMode: "numeric" }}
                  fullWidth
                  value={licshet}
                  onChange={(e) => setLicshet(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button
                  variant="contained"
                  onClick={handleRefreshFromBilling}
                  style={{
                    position: "absolute",
                    height: "100%",
                    left: "-40%",
                  }}
                >
                  <CachedIcon />
                </Button>
              </div>
              <div className="file-input-container">
                <input
                  type="file"
                  id="fileInput"
                  className="file-input"
                  disabled={createAktButtonDisabled}
                  onChange={(e) => {
                    setAktFile(e.target.files[0]);
                    setFileInputLabel(e.target.files[0].name);
                  }}
                />
                <label
                  htmlFor="fileInput"
                  className="custom-file-button"
                  style={{ width: "160px" }}
                >
                  {fileInputLabel}
                </label>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Switch
                    defaultChecked={true}
                    onChange={async (e) => {
                      if (e.target.checked) {
                        setYashovchiInputDisable(false);
                        set_prescribed_cnt(0);
                      } else {
                        set_prescribed_cnt("");
                        setYashovchiInputDisable(true);
                      }
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 2,
                  }}
                >
                  <TextField
                    placeholder="Yashovchi soni"
                    type="number"
                    inputProps={{ inputMode: "numeric" }}
                    disabled={yashovchiInputDisable}
                    value={prescribed_cnt}
                    onChange={(e) => set_prescribed_cnt(e.target.value)}
                    style={{
                      width: "80%",
                    }}
                  />
                </div>
              </div>
              <div style={{ display: "flex" }}>
                <div style={{ display: "flex", flexDirection: "column" }}>
                  <Switch
                    defaultChecked={true}
                    onChange={async (e) => {
                      if (e.target.checked) {
                        setAktSummasiInputDisabled(false);
                        setAmount(0);
                      } else {
                        setAmount("");
                        setAktSummasiInputDisabled(true);
                      }
                    }}
                  />
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    marginTop: 2,
                  }}
                >
                  <TextField
                    placeholder="Akt summasi"
                    type="number"
                    disabled={aktSummasiInputDisabled}
                    inputProps={{ inputMode: "numeric" }}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    style={{
                      width: "100%",
                    }}
                  />
                </div>
              </div>
              <TextareaAutosize
                placeholder="Izoh"
                disabled={createAktButtonDisabled}
                onFocus={(event) => {
                  event.target.setSelectionRange(0, event.target.value.length);
                }}
                onChange={(e) => setComment(e.target.value)}
                defaultValue={comment}
              ></TextareaAutosize>
              <Button
                variant="contained"
                color="primary"
                disabled={createAktButtonDisabled}
                onClick={async (e) => {
                  if (!aktFile) {
                    return toast.error(`Fayl tanlanmagan`);
                  }
                  setCreateAktButtonDisabled(true);
                  const res = await axios.post(
                    createFullAkt,
                    {
                      file: aktFile,
                      autoAktNumber: aktNumberDisabled,
                      akt_number: aktNumber,
                      comment,
                      licshet,
                      prescribed_cnt,
                      yashovchilarUzgartirish: !yashovchiInputDisable,
                      qaytaHisobBuladi: !aktSummasiInputDisabled,
                      amount,
                      nds_summ: ndsTotal,
                    },
                    {
                      headers: {
                        "Content-Type": "multipart/form-data",
                      },
                    }
                  );
                  await handleRefreshFromBilling();
                  set_prescribed_cnt("");
                  setAmount("");
                  setLicshet("");
                  // setAktFile(null);
                  // setFileInputLabel("Choose file");
                  const res2 = await axios.get(getNextIncomingDocNum);
                  setAktNumber(res2.data.value);
                  setCountes([]);
                  setCreateAktButtonDisabled(false);
                }}
              >
                AKT qilish
              </Button>
              <br />
              <br />
              <div>MFY: {abonentData.mahalla_name}</div>
              <div>FIO: {abonentData.fio}</div>
            </div>
            <div style={{ margin: "40px 60px", height: 550 }}>
              <DataTable rows={rows} />
            </div>
            <div
              style={{
                height: 600,
                flexDirection: "column",
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
              }}
            >
              <div>
                <InputCalculator />
                <InputCalculator />
              </div>
            </div>
          </div>

          <Typography
            style={{
              position: "absolute",
              bottom: 15,
              right: 200,
              fontSize: 32,
            }}
          >
            TOTAL: <b>{total}</b> NDS: {ndsTotal}
          </Typography>
        </Paper>
      </div>
    </div>
  );
}
