import { toast } from "react-toastify";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  List,
  ListItem,
  Paper,
  Switch,
  TextareaAutosize,
  TextField,
} from "@mui/material";

import React, { useEffect, useState } from "react";
import CachedIcon from "@mui/icons-material/Cached";
import DeleteIcon from "@mui/icons-material/Delete";
import axios from "axios";
import { getNextIncomingDocNum, createFullAkt } from "../../utils/APIRouters";
import arizalarArxivFileStore from "../../store/arizalarArxivFileStore";
import useLoaderStore from "../../store/loadingStore";
import DataTable from "../Calculator/DataTable";
import { hisoblandiJadval } from "../../utils/constants";

const APIs = require("../../utils/APIRouters");

export default function ImportArizalar() {
  const { setIsLoading } = useLoaderStore();
  const [arizaNumberDisabled, setArizaNumberDisabled] = useState(false);
  const [arizaNumber, setArizaNumber] = useState("");
  const [aktNumberDisabled, setAktNumberDisabled] = useState(false);
  const [aktNumber, setAktNumber] = useState("");
  const [createAktButtonDisabled, setCreateAktButtonDisabled] = useState(false);
  const [comment, setComment] = useState("MFY dalolatnomasi");
  const [licshet, setLicshet] = useState("");
  const [refreshButtonDisabled, setRefreshButtonDisabled] = useState(false);
  const [prescribed_cnt, set_prescribed_cnt] = useState("");
  const [amount, setAmount] = useState("");
  const [yashovchiInputDisable, setYashovchiInputDisable] = useState(false);
  const [aktSummasiInputDisabled, setAktSummasiInputDisabled] = useState(false);
  const [ndsSummaInputDisabled, setNdsSummaInputDisabled] = useState(true);
  const [rows, setRows] = useState([]);
  const [abonentData, setAbonentData] = useState({});
  const [
    arizaNumberControlSwitchDisabled,
    setArizaNumberControlSwitchDisabled,
  ] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [modalTextAreaValue, setModalTextAreaValue] = useState("");
  const [ndsInput1Value, setNdsInput1Value] = useState(4);
  const [ndsInput2Value, setNdsInput2Value] = useState(8);

  const {
    currentPdf,
    zipFiles,
    arizaData,
    setArizaData,
    deleteOneFile,
    ndsSumma,
    setNdsSumma,
    ndsItems,
    setNdsItems,
  } = arizalarArxivFileStore();

  function isEmpty(obj) {
    for (const prop in obj) {
      if (Object.hasOwn(obj, prop)) {
        return false;
      }
    }

    return true;
  }
  useEffect(() => {
    if (isEmpty(arizaData)) return setCreateAktButtonDisabled(true);
    if (
      arizaData.status === "tasdiqlangan" ||
      arizaData.status === "bekor qilindi"
    )
      return setCreateAktButtonDisabled(true);
    setCreateAktButtonDisabled(false);
  }, [arizaData]);
  useEffect(() => {
    async function fetchData() {
      if (!isEmpty(currentPdf)) {
        setIsLoading(true);
        zipFiles[currentPdf.name]
          .async("arraybuffer")
          .then(async (arrayBuffer) => {
            const pdfBlob = new Blob([arrayBuffer], {
              type: "application/pdf",
            });
            const res = await axios.post(
              APIs.scan_ariza_qr,
              {
                file: pdfBlob,
              },
              {
                headers: {
                  "Content-Type": "multipart/form-data",
                },
              }
            );
            const response = res.data;
            if (!response.ok) {
              setIsLoading(false);
              return toast.error(response.message);
            }
            if (response.result.split("_")[0] !== "ariza") {
              return toast.error("Noma'lum QR kod");
            }
            let ariza = (
              await axios.get(
                APIs.get_ariza_by_id + response.result.split("_")[1]
              )
            ).data;
            if (!ariza.ok) {
              setIsLoading(false);
              return toast.error(ariza.message);
            }
            ariza = ariza.ariza;
            if (ariza.document_number != response.result.split("_")[2]) {
              setIsLoading(false);
              return toast.error(
                "QR koddagi va bazadagi ariza raqamlari o'zaro mos emas"
              );
            }
            await handleRefreshFromBilling();
            setIsLoading(false);
            setArizaDataHandler(ariza);
          });
      }
    }
    fetchData();
  }, [currentPdf]);

  useEffect(() => {
    let summ = 0;
    ndsItems.forEach((item) => {
      summ += item.summ;
    });
    setNdsSumma(summ);
  }, [ndsItems]);

  function setArizaDataHandler(ariza) {
    setArizaData(ariza);
    switch (ariza.document_type) {
      case "viza":
        set_prescribed_cnt("");
        setYashovchiInputDisable(true);
        setAktSummasiInputDisabled(false);
        setAmount(ariza.aktSummasi);
        setLicshet(ariza.licshet);
        setArizaNumberDisabled(true);
        setArizaNumber(ariza.document_number);
        setComment("Pasport vizalari: " + ariza.comment);
        setCreateAktButtonDisabled(false);
        break;
    }
  }

  // handler functions
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

  const parseToPdfBlob = async (data) => {
    return data.async("arraybuffer").then(async (arrayBuffer) => {
      const pdfBlob = new Blob([arrayBuffer], {
        type: "application/pdf",
      });
      return pdfBlob;
    });
  };

  const handleCreateAktButtonClick = async (e) => {
    if (!zipFiles[currentPdf.name]) {
      return toast.error(`Fayl tanlanmagan`);
    }
    setCreateAktButtonDisabled(true);
    await axios.post(
      createFullAkt,
      {
        file: await parseToPdfBlob(zipFiles[currentPdf.name]),
        autoAktNumber: aktNumberDisabled,
        akt_number: aktNumber,
        comment,
        licshet,
        prescribed_cnt,
        yashovchilarUzgartirish: !yashovchiInputDisable,
        qaytaHisobBuladi: !aktSummasiInputDisabled,
        amount,
        nds_summ: ndsSumma,
        ariza: arizaData,
        ariza_id: arizaData._id,
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
    deleteOneFile(currentPdf.name);
    const res2 = await axios.get(getNextIncomingDocNum);
    setAktNumber(res2.data.value);
    setCreateAktButtonDisabled(false);
  };

  const handleCancelButtonClick = (event) => {
    setShowModal(true);
  };
  const handleContunieButtonClickOnModal = async (event) => {
    const res = (
      await axios.post(APIs.cancel_ariza_by_id, {
        _id: arizaData,
        canceling_description: modalTextAreaValue,
      })
    ).data;
    if (!res.ok) {
      return toast.error(res.message);
    }
    setShowModal(false);
    setArizaData({});
    deleteOneFile(currentPdf.name);
  };

  const handleAddButtonClick = (event) => {
    const qaytaHisob = ({
      fromMoon,
      fromYear,
      toMoon,
      toYear,
      yashovchilar,
    }) => {
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
            if (davr.nds) summ += davr.nds * yashovchilar;
          }
        }
      }
      return summ;
    };
    setNdsItems([
      ...ndsItems,
      {
        dan: ndsInput1Value,
        gacha: ndsInput2Value,
        summ: qaytaHisob({
          fromMoon: ndsInput1Value,
          toMoon: ndsInput2Value,
          fromYear: 2024,
          toYear: 2024,
          yashovchilar: 1,
        }),
      },
    ]);
  };

  const handleDeleteNds = (index) => {
    setNdsItems(ndsItems.filter((ndsItem, i) => i !== index));
  };

  return (
    <Paper
      sx={{
        width: "70%",
        height: "100%",
        display: "flex",
        justifyContent: "left",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          width: "250px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <Switch
            defaultChecked={false}
            checked={arizaNumberDisabled}
            disabled={arizaNumberControlSwitchDisabled}
            onChange={async (e) => {
              if (e.target.checked) {
                setArizaNumberDisabled(true);
              } else {
                setArizaNumber("");
                setArizaNumberDisabled(false);
              }
            }}
          />
          <TextField
            placeholder="Ariza №"
            label="Ariza №"
            type="number"
            inputProps={{ inputMode: "numeric" }}
            disabled={arizaNumberDisabled}
            value={arizaNumber}
            onChange={(e) => setArizaNumber(e.target.value)}
            style={{
              width: "80%",
            }}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <Switch
            defaultChecked={false}
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
          <TextField
            placeholder="AKT №"
            label="AKT №"
            type="number"
            inputProps={{ inputMode: "numeric" }}
            disabled={aktNumberDisabled}
            value={aktNumber}
            onChange={(e) => setAktNumber(e.target.value)}
            style={{
              width: "80%",
            }}
          />
        </div>

        <div style={{ display: "flex" }}>
          <Button
            variant="contained"
            onClick={handleRefreshFromBilling}
            disabled={refreshButtonDisabled}
            style={{
              height: "55px",
              width: "50px",
            }}
          >
            <CachedIcon />
          </Button>
          <TextField
            placeholder="Лицавой"
            type="number"
            disabled={createAktButtonDisabled}
            inputProps={{ inputMode: "numeric" }}
            fullWidth
            value={licshet}
            onChange={(e) => setLicshet(e.target.value)}
          />
        </div>
        <div className="file-input-container">
          <input
            type="file"
            id="fileInput"
            className="file-input"
            disabled={true}
          />
          <label
            htmlFor="fileInput"
            className="custom-file-button"
            style={{ width: "100%", textAlign: "center" }}
          >
            {currentPdf.name ? currentPdf.name : "Selected File"}
          </label>
        </div>
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <Switch
            defaultChecked={true}
            checked={!yashovchiInputDisable}
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
          <TextField
            placeholder="Yashovchi soni"
            label="Yashovchi soni"
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
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          <Switch
            checked={!aktSummasiInputDisabled}
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
          <TextField
            placeholder="Akt summasi"
            label="Akt summasi"
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
        <div style={{ display: "flex", alignItems: "center", marginTop: 10 }}>
          {/* <Switch
            checked={!ndsSummaInputDisabled}
            onChange={async (e) => {
              if (e.target.checked) {
                setNdsSummaInputDisabled(false);
                setAmount(0);
              } else {
                setAmount("");
                setNdsSummaInputDisabled(true);
              }
            }}
          /> */}
          <TextField
            label="nds summasi"
            type="number"
            disabled={ndsSummaInputDisabled}
            inputProps={{ inputMode: "numeric" }}
            value={ndsSumma}
            style={{
              width: "100%",
            }}
          />
        </div>
        <TextareaAutosize
          placeholder="Izoh"
          disabled={createAktButtonDisabled}
          onFocus={(event) => {
            event.target.setSelectionRange(0, event.target.value.length);
          }}
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        ></TextareaAutosize>
        <div style={{ display: "flex", margin: "5px 0" }}>
          <Button
            variant="contained"
            color="error"
            onClick={handleCancelButtonClick}
            disabled={createAktButtonDisabled}
          >
            Bekor qilish
          </Button>{" "}
          <Button
            variant="contained"
            color="primary"
            disabled={createAktButtonDisabled}
            onClick={handleCreateAktButtonClick}
          >
            AKT qilish
          </Button>
        </div>
        <div style={{ height: 530, width: 800 }}>
          <DataTable rows={rows} />
        </div>
      </div>
      <div>
        <List>
          <ListItem>FIO: {abonentData.fio}</ListItem>

          <ListItem>ARIZA status: {arizaData.status}</ListItem>
          <ListItem>KOD: {arizaData.licshet}</ListItem>
          <ListItem>AKT summa: {arizaData.aktSummasi}</ListItem>
        </List>
        <div style={{ margin: "0 10px" }}>
          <p>
            <b>NDS hisoblash</b>
          </p>
          <div style={{ display: "flex" }}>
            <TextField
              label="dan"
              type="number"
              value={ndsInput1Value}
              onChange={(e) => setNdsInput1Value(e.target.value)}
              InputProps={{ inputProps: { min: 4, max: 8 } }}
            />
            <TextField
              label="gacha"
              type="number"
              value={ndsInput2Value}
              onChange={(e) => setNdsInput2Value(e.target.value)}
              InputProps={{ inputProps: { min: 4, max: 8 } }}
            />
            <Button
              variant="contained"
              color="success"
              onClick={handleAddButtonClick}
            >
              Add
            </Button>
          </div>
          <List>
            {ndsItems.map((item, i) => (
              <ListItem sx={{ height: 25 }}>
                0{item.dan}-0{item.gacha}: {item.summ} so'm{" "}
                <IconButton onClick={() => handleDeleteNds(i)}>
                  <DeleteIcon />
                </IconButton>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
      <Dialog
        open={showModal}
        aria-labelledby="dialog-title"
        aria-describedby="dialog-description"
      >
        <DialogTitle id="dialog-title">Arizani bekor qilish</DialogTitle>
        <DialogContent>
          <DialogContentText id="dialog-content">
            Nima sababdan ariza bekor qilinmoqda?
          </DialogContentText>
          <TextareaAutosize
            placeholder="Asos"
            onFocus={(event) => {
              event.target.setSelectionRange(0, event.target.value.length);
            }}
            cols={50}
            value={modalTextAreaValue}
            onChange={(e) => setModalTextAreaValue(e.target.value)}
          ></TextareaAutosize>
        </DialogContent>
        <DialogActions>
          <Button
            variant="outlined"
            color="secondary"
            onClick={() => setShowModal(false)}
          >
            Bekor qilish
          </Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleContunieButtonClickOnModal}
          >
            Davom etish
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
