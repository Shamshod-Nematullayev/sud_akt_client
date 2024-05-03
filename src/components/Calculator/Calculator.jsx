import {
  Button,
  IconButton,
  Modal,
  Paper,
  Switch,
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
                <Switch />
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
                  style={{ padding: "0px" }}
                />
              </div>
            </div>
            <TextField
              placeholder="Лицавой"
              type="number"
              inputProps={{ inputMode: "numeric" }}
              fullWidth
            />
            <div className="file-input-container">
              <input type="file" id="fileInput" class="file-input" />
              <label
                for="fileInput"
                class="custom-file-button"
                style={{ width: "160px" }}
              >
                Choose File
              </label>
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
            TOTAL: <copy>{total}</copy>
          </Typography>
        </Paper>
      </div>
    </div>
  );
}
