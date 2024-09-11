import React from "react";
import useDvayniklarStore from "../../store/dvayniklarStore";
import { createGlobalStyle } from "styled-components";
import { List, ListItem } from "@mui/material";

const SpecialPageStyle = createGlobalStyle`
  .special-page {
    display: flex;
    width: 600px;
    border: 1px solid #ccc;
    height: 50%;
  }

  h3 {
    text-align: center;
  }
  .li{
    font-size: 20px;
  }
  .red{
    color: red;
  }
  .green{
    color: green;
  }
`;

export default function MiddlePanel() {
  const { abonent1Data, abonent2Data } = useDvayniklarStore();
  return (
    <>
      <SpecialPageStyle />
      <div className="special-page">
        <div style={{ width: "50%", border: "1px solid #ccc", height: "100%" }}>
          <h3>Haqiqiy hisob raqam</h3>
          <List>
            <ListItem className="li">TUSHUM: {abonent1Data.tushum}</ListItem>
            <ListItem className="li">
              QARZ:{" "}
              <span
                className={Number(abonent1Data.saldo_k) > 0 ? "green" : "red"}
              >
                {abonent1Data.saldo_k}
              </span>
            </ListItem>
            <ListItem className="li">
              KOD:{" "}
              <span style={{ color: "blue" }}>
                {" " + abonent1Data.licshet}
              </span>
            </ListItem>
            <ListItem className="li">FIO: {abonent1Data.fio}</ListItem>
          </List>
        </div>
        <div style={{ width: "50%", border: "1px solid #ccc", height: "100%" }}>
          <h3>Ikkilamchi hisob raqam</h3>
          <List>
            <ListItem className="li">TUSHUM: {abonent2Data.tushum}</ListItem>
            <ListItem className="li">
              QARZ:{" "}
              <span
                className={Number(abonent2Data.saldo_k) > 0 ? "green" : "red"}
              >
                {abonent2Data.saldo_k}
              </span>
            </ListItem>
            <ListItem className="li">
              KOD:{" "}
              <span style={{ color: "blue" }}>
                {" " + abonent2Data.licshet}
              </span>
            </ListItem>
            <ListItem className="li">FIO: {abonent2Data.fio}</ListItem>
          </List>
        </div>
      </div>
    </>
  );
}
