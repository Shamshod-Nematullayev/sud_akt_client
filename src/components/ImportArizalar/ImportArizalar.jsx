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
import MiddlePanel from "./MiddlePanel";
import useDvayniklarStore from "../../store/dvayniklarStore";
import InputPanel from "./InputPanel";

const APIs = require("../../utils/APIRouters");

export default function ImportArizalar() {
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
    pdfFiles,
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
        const formData = new FormData();
        formData.append("file", currentPdf.pdfBlob, currentPdf.name);

        const res = await axios.post(
          APIs.scan_ariza_qr,
          {
            file: currentPdf.pdfBlob,
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
          setArizaNumberDisabled(false);
          return toast.error(response.result);
        }
        if (response.result.split("_")[0] !== "ariza") {
          setIsLoading(false);
          setArizaNumberDisabled(false);
          return toast.error("Noma'lum QR kod");
        }
        let ariza = (
          await axios.get(APIs.get_ariza_by_id + response.result.split("_")[1])
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
        setIsLoading(false);
        await setArizaDataHandler(ariza);
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

  async function setArizaDataHandler(ariza) {
    setArizaData(ariza);
    const diffMonth = counterDiffMonth(new Date(ariza.sana));
    switch (ariza.document_type) {
      case "viza":
        set_prescribed_cnt("");
        setYashovchiInputDisable(true);
        setAmount(ariza.aktSummasi);
        setAktSummasiInputDisabled(false);
        setLicshet(ariza.licshet);
        setArizaNumberDisabled(true);
        setArizaNumber(ariza.document_number);
        setComment("Pasport vizalari: " + ariza.comment);
        setCreateAktButtonDisabled(false);
        await handleRefreshFromBilling();
        setIsLoading(false);
        break;
      case "death":
        if (ariza.next_prescribed_cnt != ariza.current_prescribed_cnt) {
          set_prescribed_cnt(ariza.next_prescribed_cnt);
          setYashovchiInputDisable(false);
        } else setYashovchiInputDisable(true);

        if (isNaN(ariza.aktSummasi)) ariza.aktSummasi = 0;
        setAmount(
          ariza.aktSummasi +
            (ariza.next_prescribed_cnt - ariza.current_prescribed_cnt) *
              4625 *
              diffMonth
        );
        console.log(
          ariza.aktSummasi,
          ariza.next_prescribed_cnt,
          ariza.current_prescribed_cnt,
          diffMonth
        );
        let b =
          ariza.aktSummasi +
          (ariza.next_prescribed_cnt - ariza.current_prescribed_cnt) *
            4625 *
            diffMonth;
        if (b != 0) {
          setAktSummasiInputDisabled(false);
        } else setAktSummasiInputDisabled(true);
        setLicshet(ariza.licshet);
        setArizaNumberDisabled(true);
        setArizaNumber(ariza.document_number);
        setComment("O'lim guvohnomasi: " + ariza.comment);
        setCreateAktButtonDisabled(false);
        await handleRefreshFromBilling(ariza.licshet);
        break;
      case "odam_soni":
        if (ariza.next_prescribed_cnt != ariza.current_prescribed_cnt) {
          set_prescribed_cnt(ariza.next_prescribed_cnt);
          setYashovchiInputDisable(false);
        } else setYashovchiInputDisable(true);
        setAmount(
          ariza.aktSummasi +
            (ariza.next_prescribed_cnt - ariza.current_prescribed_cnt) *
              4625 *
              diffMonth
        );
        let a =
          ariza.aktSummasi +
          (ariza.next_prescribed_cnt - ariza.current_prescribed_cnt) *
            4625 *
            diffMonth;
        if (a == 0) {
          setAktSummasiInputDisabled(true);
        } else setAktSummasiInputDisabled(false);
        setLicshet(ariza.licshet);
        setArizaNumberDisabled(true);
        setArizaNumber(ariza.document_number);
        setComment("MFY dalolatnomasi: " + ariza.comment);
        setCreateAktButtonDisabled(false);
        await handleRefreshFromBilling(ariza.licshet);
        break;
      case "dvaynik":
        const result = await axios.get(APIs.getDXJ + ariza.asosiy_licshet);
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
        const result2 = await axios.get(APIs.getDXJ + ariza.ikkilamchi_licshet);
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
        break;
    }
  }
  const counterDiffMonth = function (initialDate) {
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = currentDate.getMonth();
    const initialYear = initialDate.getFullYear();
    const initialMonth = initialDate.getMonth();
    return (currentYear - initialYear) * 12 - (currentMonth - initialMonth);
  };

  // handler functions
  const handleRefreshFromBilling = async (licsh) => {
    setIsLoading(true);
    if (licshet == "" && !licsh) {
      return toast.error("Hisob raqami bo'sh");
    }
    let kod = licsh || licshet;
    const result = await axios.get(APIs.getDXJ + kod);
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
    setIsLoading(false);
  };

  const parseToPdfBlob = async (data) => {
    if (data.pdfBlob.size / (1024 * 1024) > 10) {
      toast.error(`Fayl 10Mb-dan ko'p bo'lishi mumkin emas.`);
      return false;
    }
    return currentPdf;
  };

  const handleCreateAktButtonClick = async (e) => {
    if (!currentPdf.name) {
      return toast.error(`Fayl tanlanmagan`);
    }
    const fileBlob = (await parseToPdfBlob(currentPdf)).pdfBlob;
    if (!fileBlob) return;
    setCreateAktButtonDisabled(true);
    const result = await axios.post(
      createFullAkt,
      {
        file: fileBlob,
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
    if (result.data.ok) {
      set_prescribed_cnt("");
      setAmount("");
      setLicshet("");
      deleteOneFile(currentPdf.name);
      const res2 = await axios.get(getNextIncomingDocNum);
      setAktNumber(res2.data.value);
    } else {
      toast.error(result.data.message);
    }
    setCreateAktButtonDisabled(false);
  };
  const handleArizaRefreshButtonClick = async (event) => {
    setIsLoading(true);
    const res = await axios.get(
      APIs.get_ariza_by_document_number + arizaNumber
    );

    if (!res.data.ok) {
      setIsLoading(false);
      toast.error(res.data.message);
      return false;
    }
    setArizaDataHandler(res.data.ariza);
    setIsLoading(false);
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
      {arizaData.document_type !== "dvaynik" ? (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: "250px",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              margin: "15px 0 0 0",
            }}
          >
            <IconButton
              variant="contained"
              onClick={() => handleArizaRefreshButtonClick()}
              disabled={refreshButtonDisabled}
              style={{
                height: "55px",
                width: "50px",
              }}
            >
              <CachedIcon />
            </IconButton>
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
              onClick={() => handleRefreshFromBilling()}
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
      ) : (
        <InputPanel
          handleCancelButtonClick={handleCancelButtonClick}
          createAktButtonDisabled={createAktButtonDisabled}
        />
      )}
      {arizaData.document_type !== "dvaynik" ? (
        <div>
          <List>
            <ListItem>FIO: {abonentData.fio}</ListItem>

            <ListItem>ARIZA status: {arizaData.status}</ListItem>
            <ListItem>KOD: {arizaData.licshet}</ListItem>
            <ListItem>
              AKT summa: {arizaData.aktSummasi}
              {counterDiffMonth(new Date(arizaData.sana)) ? (
                <span className="red">
                  +{" "}
                  {(arizaData.next_prescribed_cnt -
                    arizaData.current_prescribed_cnt) *
                    4625 *
                    counterDiffMonth(new Date(arizaData.sana))}
                </span>
              ) : null}
            </ListItem>
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
      ) : (
        <MiddlePanel />
      )}
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
