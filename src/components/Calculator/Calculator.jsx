import {
  Button,
  IconButton,
  Modal,
  Paper,
  Switch,
  TextareaAutosize,
  TextField,
  Typography,
} from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";

import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import SideBar from "../SideBar";
import DeleteIcon from "@mui/icons-material/Delete";
import { Label } from "@mui/icons-material";
import "./style.css";
import axios from "axios";
import { getNextIncomingDocNum, createFullAkt } from "../../utils/APIRouters";
import { toast } from "react-toastify";

export default function Calculator() {
  const hisoblandiJadval = [
    { month: 1, year: 2019, hisoblandi: 2000 },
    { month: 2, year: 2019, hisoblandi: 2500 },
    { month: 3, year: 2019, hisoblandi: 2500 },
    { month: 4, year: 2019, hisoblandi: 2500 },
    { month: 5, year: 2019, hisoblandi: 2500 },
    { month: 6, year: 2019, hisoblandi: 2500 },
    { month: 7, year: 2019, hisoblandi: 2500 },
    { month: 8, year: 2019, hisoblandi: 2500 },
    { month: 9, year: 2019, hisoblandi: 2500 },
    { month: 10, year: 2019, hisoblandi: 2500 },
    { month: 11, year: 2019, hisoblandi: 2500 },
    { month: 12, year: 2019, hisoblandi: 2500 },
    { month: 1, year: 2020, hisoblandi: 2500 },
    { month: 2, year: 2020, hisoblandi: 2500 },
    { month: 3, year: 2020, hisoblandi: 2500 },
    { month: 4, year: 2020, hisoblandi: 2500 },
    { month: 5, year: 2020, hisoblandi: 2500 },
    { month: 6, year: 2020, hisoblandi: 2500 },
    { month: 7, year: 2020, hisoblandi: 2500 },
    { month: 8, year: 2020, hisoblandi: 2500 },
    { month: 9, year: 2020, hisoblandi: 2500 },
    { month: 10, year: 2020, hisoblandi: 2500 },
    { month: 11, year: 2020, hisoblandi: 2500 },
    { month: 12, year: 2020, hisoblandi: 2500 },
    { month: 1, year: 2021, hisoblandi: 2500 },
    { month: 2, year: 2021, hisoblandi: 2500 },
    { month: 3, year: 2021, hisoblandi: 2500 },
    { month: 4, year: 2021, hisoblandi: 2500 },
    { month: 5, year: 2021, hisoblandi: 2500 },
    { month: 6, year: 2021, hisoblandi: 2500 },
    { month: 7, year: 2021, hisoblandi: 2500 },
    { month: 8, year: 2021, hisoblandi: 2500 },
    { month: 9, year: 2021, hisoblandi: 2500 },
    { month: 10, year: 2021, hisoblandi: 2500 },
    { month: 11, year: 2021, hisoblandi: 2500 },
    { month: 12, year: 2021, hisoblandi: 2900 },
    { month: 1, year: 2022, hisoblandi: 2900 },
    { month: 2, year: 2022, hisoblandi: 2900 },
    { month: 3, year: 2022, hisoblandi: 2900 },
    { month: 4, year: 2022, hisoblandi: 2900 },
    { month: 5, year: 2022, hisoblandi: 2900 },
    { month: 6, year: 2022, hisoblandi: 2900 },
    { month: 7, year: 2022, hisoblandi: 2900 },
    { month: 8, year: 2022, hisoblandi: 2900 },
    { month: 9, year: 2022, hisoblandi: 2900 },
    { month: 10, year: 2022, hisoblandi: 2900 },
    { month: 11, year: 2022, hisoblandi: 2900 },
    { month: 12, year: 2022, hisoblandi: 2900 },
    { month: 1, year: 2023, hisoblandi: 2900 },
    { month: 2, year: 2023, hisoblandi: 2900 },
    { month: 3, year: 2023, hisoblandi: 2900 },
    { month: 4, year: 2023, hisoblandi: 2900 },
    { month: 5, year: 2023, hisoblandi: 2900 },
    { month: 6, year: 2023, hisoblandi: 2900 },
    { month: 7, year: 2023, hisoblandi: 2900 },
    { month: 8, year: 2023, hisoblandi: 2900 },
    { month: 9, year: 2023, hisoblandi: 2900 },
    { month: 10, year: 2023, hisoblandi: 2900 },
    { month: 11, year: 2023, hisoblandi: 2900 },
    { month: 12, year: 2023, hisoblandi: 4129 },
    { month: 1, year: 2024, hisoblandi: 4129 },
    { month: 2, year: 2024, hisoblandi: 4129 },
    { month: 3, year: 2024, hisoblandi: 4129 },
    { month: 4, year: 2024, hisoblandi: 4625 },
  ];
  const [currentTotal, setCurrentTotal] = useState(0);
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

  const handleAddClick = () => {
    setCountes([
      ...countes,
      {
        name: `${fromMoon}.${fromYear}-${toMoon}.${toYear}`,
        summ: currentTotal,
      },
    ]);
  };
  const qaytaHisob = ({ fromMoon, fromYear, toMoon, toYear, yashovchilar }) => {
    let summ = 0;
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
          summ += davr.hisoblandi * yashovchilar;
        }
      }
    }
    setCurrentTotal(summ);
  };
  useEffect(() => {
    let total = 0;
    countes.forEach((count) => {
      total += count.summ;
    });
    setTotal(total);
  }, [countes]);

  return (
    <div className="admin-page">
      {/* Yuklanmoqda loader */}
      <SideBar active="qulayliklar" />

      <div className="container">
        <Paper
          style={{
            height: "80%",
            marginTop: "25px",
            padding: 15,
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
            <ul style={{ width: 400 }}>
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
            <TextField
              placeholder="Лицавой"
              type="number"
              disabled={createAktButtonDisabled}
              inputProps={{ inputMode: "numeric" }}
              fullWidth
              value={licshet}
              onChange={(e) => setLicshet(e.target.value)}
            />
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
                  },
                  {
                    headers: {
                      "Content-Type": "multipart/form-data",
                    },
                  }
                );
                set_prescribed_cnt("");
                setAmount("");
                setLicshet("");
                setAktFile(null);
                setFileInputLabel("Choose file");
                const res2 = await axios.get(getNextIncomingDocNum);
                setAktNumber(res2.data.value);
                setCreateAktButtonDisabled(false);
              }}
            >
              AKT qilish
            </Button>
          </div>
          <Typography
            style={{
              position: "absolute",
              bottom: 15,
              right: 200,
              fontSize: 32,
            }}
          >
            TOTAL: <b>{total}</b>
          </Typography>
        </Paper>
      </div>
    </div>
  );
}
