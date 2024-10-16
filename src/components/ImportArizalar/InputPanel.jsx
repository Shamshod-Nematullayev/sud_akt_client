import { Button, Switch, TextField } from "@mui/material";
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import useDvayniklarStore from "../../store/dvayniklarStore";
import useLoaderStore from "../../store/loadingStore";
import arizalarArxivFileStore from "../../store/arizalarArxivFileStore";
const APIs = require("../../utils/APIRouters");

export default function InputPanel({
  handleCancelButtonClick,
  createAktButtonDisabled,
}) {
  const { setIsLoading } = useLoaderStore();
  const { abonent1Data, abonent2Data } = useDvayniklarStore();
  const { currentPdf, deleteOneFile, arizaData } = arizalarArxivFileStore();
  const [aktNumberDisabled, setAktNumberDisabled] = useState(false);
  const [aktNumber, setAktNumber] = useState(0);

  // handle functions

  const handleCreateAktButtonClick = async (event) => {
    setIsLoading(true);
    const abonents = [
      {
        Litsavoy_kod: abonent1Data.licshet,
        Dvaynik_kod: abonent2Data.licshet,
      },
    ];
    const fileBlob = (await parseToPdfBlob(currentPdf)).pdfBlob;
    if (!fileBlob) return;
    if (aktNumberDisabled) {
      const respons = await axios.post(
        APIs.documents + "create",
        {
          doc_type: "dvaynik_dalolatnomasi",
          file: fileBlob,
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
        return setIsLoading(false);
      }
    }
    const res = await axios.post(
      APIs.createDvaynikAkt,
      {
        file: fileBlob,
        akt_number: aktNumber,
        haqiqiy: abonent1Data,
        ikkilamchi: abonent2Data,
        ariza_id: arizaData._id,
      },
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    if (!res.data.ok) {
      toast.error(res.data.message);
      setIsLoading(false);
      return false;
    }
    setIsLoading(false);
    deleteOneFile(currentPdf.name);
    toast.success(`Muvaffaqqiyatli kiritildi`);
    return true;
  };
  const parseToPdfBlob = async (data) => {
    if (data.pdfBlob.size / (1024 * 1024) > 10) {
      toast.error(`Fayl 10Mb-dan ko'p bo'lishi mumkin emas.`);
      return false;
    }
    return data;
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
      <TextField
        label="Haqiqiy hisob raqami"
        type="number"
        value={abonent1Data.licshet}
        style={{ margin: "10px 0" }}
        fullWidth
        InputLabelProps={{ shrink: true }}
        disabled
      />
      <TextField
        label="Ikkilamchi hisob raqami"
        type="number"
        value={abonent2Data.licshet}
        style={{ margin: "10px 0" }}
        fullWidth
        InputLabelProps={{ shrink: true }}
        disabled
      />

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
          style={{ display: "none" }}
          disabled
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
          {currentPdf.name ? currentPdf.name : "Choose PDF file"}
        </label>
      </div>
      <Button
        onClick={handleCreateAktButtonClick}
        variant="contained"
        color="primary"
        disabled={createAktButtonDisabled}
        fullWidth
      >
        Akt qilish
      </Button>
      <Button
        variant="contained"
        color="error"
        onClick={handleCancelButtonClick}
        disabled={createAktButtonDisabled}
        fullWidth
      >
        Bekor qilish
      </Button>
    </div>
  );
}
