import { Button, TextField } from "@mui/material";
import React from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useDvayniklarStore from "../../store/dvayniklarStore";
import useLoaderStore from "../../store/loadingStore";
import isEmptyObject from "../../helper/isEmptyObject";
const APIs = require("../../utils/APIRouters");

export default function InputPanel() {
  const { setIsLoading } = useLoaderStore();
  const {
    haqiqiyRaqam,
    setHaqiqiyRaqam,
    ikkilamchiRaqam,
    setIkkilamchiRaqam,
    abonent1Data,
    abonent2Data,
    setAbonent1Data,
    setAbonent2Data,
    items,
    setItems,
  } = useDvayniklarStore();

  // handle functions
  const handleAddButtonClick = async (event) => {
    if (isEmptyObject(abonent1Data) || isEmptyObject(abonent2Data)) {
      if (!(await handleRefreshButtonClick())) {
        return false;
      }
    }
    if (
      items.some((item) => item.ikkilamchi.licshet === abonent2Data.licshet)
    ) {
      toast.error("Bu ikkilamchi raqam oldinroq kiritildi");
      return false;
    }

    setItems([{ haqiqiy: abonent1Data, ikkilamchi: abonent2Data }, ...items]);
  };

  const handleRefreshButtonClick = async (event) => {
    setIsLoading(true);
    if (haqiqiyRaqam == "" || ikkilamchiRaqam == "") {
      setIsLoading(false);
      toast.error("Hisob raqami bo'sh");
      return false;
    }
    const result = await axios.get(APIs.getDXJ + haqiqiyRaqam);
    if (result.data.ok) {
      let jamiSumm = 0;
      result.data.rows.forEach((row) => {
        jamiSumm +=
          Number(row.postup_kvit) +
          Number(row.postup_munis) +
          Number(row.postup_plat) +
          Number(row.postup_rp);
      });
      setAbonent1Data({ ...result.data.abonentData, tushum: jamiSumm });
    } else {
      toast.error(result.data.message);
      return false;
    }
    const result2 = await axios.get(APIs.getDXJ + ikkilamchiRaqam);
    if (result2.data.ok) {
      setIsLoading(false);
      let jamiSumm = 0;
      result2.data.rows.forEach((row) => {
        jamiSumm +=
          Number(row.postup_kvit) +
          Number(row.postup_munis) +
          Number(row.postup_plat) +
          Number(row.postup_rp);
      });
      setAbonent2Data({ ...result2.data.abonentData, tushum: jamiSumm });
      return true;
    } else {
      setIsLoading(false);
      toast.error(result2.data.message);
      return false;
    }
  };
  return (
    <div
      style={{
        width: 350,
        border: "1px solid #ccc",
        minHeight: 500,
        padding: "5px 10px",
      }}
    >
      <div style={{ display: "flex" }}>
        <TextField
          label="Haqiqiy hisob raqami"
          type="number"
          value={haqiqiyRaqam}
          onChange={(event) => setHaqiqiyRaqam(event.target.value)}
        />
        <TextField
          label="Ikkilamchi hisob raqam"
          type="number"
          value={ikkilamchiRaqam}
          onChange={(event) => setIkkilamchiRaqam(event.target.value)}
        />
      </div>
      <div style={{ display: "flex", margin: "5px 0" }}>
        <Button
          variant="contained"
          color="primary"
          onClick={handleRefreshButtonClick}
          style={{ width: "40%" }}
        >
          Yangilash
        </Button>
        <Button
          variant="contained"
          color="success"
          onClick={handleAddButtonClick}
          style={{ width: "60%" }}
        >
          Qo'shish
        </Button>
      </div>
    </div>
  );
}
