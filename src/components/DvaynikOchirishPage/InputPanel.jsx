import { Button, Switch, TextField } from "@mui/material";
import React, { useEffect, useState } from "react";
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
  const [file, setFile] = useState(null);
  const [aktNumberDisabled, setAktNumberDisabled] = useState(false);
  const [aktNumber, setAktNumber] = useState(0);

  useEffect(() => {
    console.log(file);
  }, [haqiqiyRaqam]);
  // handle functions
  const handleAddButtonClick = async (event) => {
    if (isEmptyObject(abonent1Data) || isEmptyObject(abonent2Data)) {
      toast.error("Abonent ma'lumotlari bo'sh");
      return false;
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
      setIsLoading(false);
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

  const handleChangeFileInput = (event) => {
    setFile(event.target.files[0]);
  };
  const handleCreateAktButtonClick = async (event) => {
    console.log(file);
    if (!file) {
      toast.error("Akt qilish uchun fayl kiritilmadi!");
      return false;
    }
    let i = 0;

    const abonents = items.map((item) => ({
      Litsavoy_kod: item.haqiqiy.licshet,
      Dvaynik_kod: item.ikkilamchi.licshet,
    }));
    if (aktNumberDisabled) {
      const respons = await axios.post(
        APIs.documents + "create",
        {
          doc_type: "dvaynik_dalolatnomasi",
          file,
          comment: "",
          abonents,
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (respons.data.ok) {
        toast.success(respons.data.message);
        const res4 = await axios.get(APIs.getNextIncomingDocNum);
        setAktNumber(res4.data.value);
      } else {
        toast.error(respons.data.message);
      }
    }
    async function loop() {
      if (i === items.length) {
        return toast.success("Barcha aktlar bazaga kiritib bo'lindii");
      }
      const res = await axios.post(
        APIs.createDvaynikAkt,
        {
          file: file,
          akt_number: aktNumber,
          ...items[i],
        },
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      if (!res.data.ok) {
        toast.error(res.data.message);
        return false;
      }
      i++;
      loop();
    }
    loop();
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
      <div style={{ display: "flex", margin: "10px 0" }}>
        <Switch
          onChange={async (e) => {
            if (e.target.checked) {
              setAktNumberDisabled(true);
              const res = await axios.get(APIs.getNextIncomingDocNum);
              setAktNumber(res.data.value);
            } else {
              setAktNumber("");
              setAktNumberDisabled(false);
            }
          }}
        />
        <TextField
          label={aktNumberDisabled ? "Auto akt №" : "akt №"}
          disabled={aktNumberDisabled}
          type="number"
          value={aktNumber}
          onChange={(e) => setAktNumber(e.target.value)}
        />
      </div>
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "40px",
          padding: "5px",
        }}
      >
        <input
          type="file"
          id="file-input"
          onChange={handleChangeFileInput}
          style={{ display: "none" }}
          accept=".pdf"
        />
        <label
          htmlFor="file-input"
          style={{
            cursor: "pointer",
            background: "#2196f3",
            width: "100%",
            height: "100%",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "#fff",
            fontSize: "16px",
            fontWeight: "bold",
          }}
        >
          {file ? file.name : "Choose PDF file"}
        </label>
      </div>
      <Button
        onClick={handleCreateAktButtonClick}
        variant="contained"
        color="primary"
        fullWidth
      >
        Akt qilish
      </Button>
    </div>
  );
}
