import {
  Button,
  IconButton,
  Modal,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { GridDeleteIcon } from "@mui/x-data-grid";

import React, { useEffect } from "react";
import { useState } from "react";
import SideBar from "../SideBar";
import DeleteIcon from "@mui/icons-material/Delete";

export default function AddressToConvert() {
  const [licshet, setLicshet] = useState("");

  useEffect(() => {}, []);

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
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div style={{ display: "flex", alignItems: "center" }}>
              <TextField
                label="Лицавой"
                type="number"
                style={{ width: 70 }}
                value={licshet}
                onChange={(e) => setLicshet(e.target.value)}
              ></TextField>
              <Button variant="contained" color="info">
                Chop etish
              </Button>
            </div>
          </div>
        </Paper>
      </div>
    </div>
  );
}
