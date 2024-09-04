import React, { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import "../assets/createDalolatnoma.css";
import SideBar from "../components/SideBar";
import { toast } from "react-toastify";
import axios from "axios";
import API from "../utils/APIRouters";
import {
  TextField,
  Button,
  Backdrop,
  CircularProgress,
  TextareaAutosize,
  Select,
  MenuItem,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { createGlobalStyle } from "styled-components";
import { useEffect } from "react";
import Document from "../components/CreateDalolatnoma/Document";

// Importlar

const SpecialPageStyle = createGlobalStyle`
  @page {
    size: A4;
    margin: 15mm 15mm 15mm 25mm;
  }
`;

const CreateDalolatnoma = () => {
  const componentRef = useRef();
  const date = new Date();
  const [abonentData, setAbonentData] = useState({});
  const [abonentData2, setAbonentData2] = useState({});
  const [asoslantiruvchi, setAsoslantiruvchi] = useState("");
  const [licshet, setLicshet] = useState("");
  const [mahalla, setMahalla] = useState("");
  const [mahalla2, setMahalla2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aniqlanganYashovchiSoni, setAniqlanganYashovchiSoni] = useState(0);
  const [ikkilamchiKod, setIkkilamchiKod] = useState("");
  const [documentType, setDocumentType] = useState("odam_soni"); // odam_soni, dvaynik, viza
  const [printButtonDisabled, setPrintButtonDisabled] = useState(true);
  const [registerButtonDisabled, setRegisterButtonDisabled] = useState(false);
  const [allInputDisabled, setAllInputDisabled] = useState(false);
  const [arizaData, setArizaData] = useState({});
  const [aktSummasi, setAktSummasi] = useState(0);

  async function createNewAriza() {
    if (!(await getAbonentData(licshet))) return;

    switch (documentType) {
      case "odam_soni":
        try {
          const respond = await axios.post(`${API.host}/api/arizalar/create`, {
            sana: Date.now(),
            document_type: "odam_soni",
            licshet: licshet,
            comment: asoslantiruvchi,
            aktSummasi: aktSummasi,
            current_prescribed_cnt: abonentData.prescribed_cnt,
            next_prescribed_cnt: aniqlanganYashovchiSoni,
          });

          if (!respond.data.ok) {
            return toast.error(respond.data.message);
          }

          setArizaData(respond.data.ariza);
          setRegisterButtonDisabled(true);
          setAllInputDisabled(true);
          setPrintButtonDisabled(false);
        } catch (error) {
          toast.error("Xatolik yuz berdi, iltimos qayta urinib ko'ring");
          setPrintButtonDisabled(false);
        }
        break;

      case "dvaynik":
        try {
          const respond = await axios.post(`${API.host}/api/arizalar/create`, {
            asosiy_licshet: licshet,
            ikkilamchi_licshet: ikkilamchiKod,
            sana: Date.now(),
            document_type: "dvaynik",
            licshet: licshet,
            comment: asoslantiruvchi,
            aktSummasi: aktSummasi,
          });

          if (!respond.data.ok) {
            return toast.error(respond.data.message);
          }

          setArizaData(respond.data.ariza);
          setRegisterButtonDisabled(true);
          setAllInputDisabled(true);
          setPrintButtonDisabled(false);
        } catch (error) {
          toast.error("Xatolik yuz berdi, iltimos qayta urinib ko'ring");
          setPrintButtonDisabled(false);
        }
        break;

      case "viza":
        try {
          if (aktSummasi === 0) {
            setPrintButtonDisabled(false);
            return toast.error(`Akt summasi ko'rsatilmagan!`);
          }
          const respond = await axios.post(`${API.host}/api/arizalar/create`, {
            sana: Date.now(),
            document_type: "viza",
            licshet: licshet,
            comment: asoslantiruvchi,
            aktSummasi: aktSummasi,
          });
          if (!respond.data.ok) {
            return toast.error(respond.data.message);
          }
          setArizaData(respond.data.ariza);
          setRegisterButtonDisabled(true);
          setAllInputDisabled(true);
          setPrintButtonDisabled(false);
        } catch (e) {
          toast.error("Xatolik yuz berdi, iltimos qayta urinib ko'ring");
          setPrintButtonDisabled(false);
        }
        break;

      default:
        toast.error("Noma'lum xujjat turi tanlangan");
    }
  }

  useEffect(() => {
    setPrintButtonDisabled(true);
  }, [documentType]);

  async function getAbonentData(licshet) {
    try {
      setIsLoading(true);
      let respond2;
      if (!licshet) {
        setIsLoading(false);
        toast.error(`Kod o'rni bo'sh`);
        return false;
      }
      const respond = await axios.get(
        `${API.host}/api/billing/get-abonent-data-by-licshet/${licshet}`
      );
      if (!respond.data.ok) {
        setIsLoading(false);
        toast.error(respond.data.message);
        return false;
      }
      const mfy_data = await axios.get(
        `${API.host}/api/billing/get-mfy-by-id/${respond.data.abonentData.mahallas_id}`
      );
      setAbonentData(respond.data.abonentData);
      setMahalla(mfy_data.data.data);
      if (documentType === "dvaynik") {
        if (!ikkilamchiKod) {
          setIsLoading(false);
          toast.error(`Ikkilamchi kod o'rni bo'sh`);
          return false;
        }
        respond2 = await axios.get(
          `${API.host}/api/billing/get-abonent-dxj-by-licshet/${ikkilamchiKod}`
        );
        if (!respond2.data.ok) {
          setIsLoading(false);
          toast.error(respond.data.message);
          return false;
        }
        setAbonentData2(respond2.data.abonentData);

        if (
          respond.data.abonentData.mahallas_id !==
          respond2.data.abonentData.mahallas_id
        ) {
          const mfy_data = await axios.get(
            `${API.host}/api/billing/get-mfy-by-id/${respond.data.abonentData.mahallas_id}`
          );
          setMahalla2(mfy_data.data.data);
        }
      }
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error(error);
      toast.error("Error occured to connect server");
    }
  }

  function handleClearButtonClick() {
    setLicshet("");
    setIkkilamchiKod("");
    setAniqlanganYashovchiSoni("");
    setAsoslantiruvchi("");
    setAbonentData({});
    setAbonentData2({});
    setMahalla("");
    setMahalla2("");
    setAllInputDisabled(false);
    setPrintButtonDisabled(true);
    setRegisterButtonDisabled(false);
    setArizaData({});
    setAktSummasi(0);
  }

  return (
    <div className="admin-page">
      <SpecialPageStyle />
      {/* Yuklanmoqda loader */}
      <SideBar active="qulayliklar" />
      <div
        className="container"
        style={{ display: "flex", position: "relative" }}
      >
        <Backdrop
          sx={{
            position: "absolute",
            color: "#fff",
            zIndex: (theme) => theme.zIndex.drawer + 1,
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
          }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <div
          id="filter"
          style={{ padding: "10px 20px", margin: "0 25px", background: "#fff" }}
        >
          <Select
            defaultValue="odam_soni"
            fullWidth
            style={{ margin: "10px 0" }}
            disabled={allInputDisabled}
            value={documentType}
            onChange={(e) => setDocumentType(e.target.value)}
          >
            <MenuItem value="odam_soni">Одам сони</MenuItem>
            <MenuItem value="dvaynik">Двайник</MenuItem>
            <MenuItem value="viza">Виза</MenuItem>
          </Select>
          <div style={{ display: "flex", position: "relative", width: 200 }}>
            <TextField
              label="Shaxsiy hisob raqami"
              type="text"
              placeholder="105120...."
              fullWidth
              disabled={allInputDisabled}
              value={licshet}
              onChange={(e) => setLicshet(e.target.value)}
            />
            <Button
              variant="contained"
              style={{
                position: "absolute",
                height: "100%",
                left: "-40%",
              }}
              disabled={allInputDisabled}
              onClick={() => getAbonentData(licshet)}
            >
              <CachedIcon />
            </Button>
          </div>
          {documentType === "odam_soni" ? (
            <TextField
              label="Yashov soni"
              type="text"
              placeholder="0"
              style={{ margin: "5px 0" }}
              fullWidth
              disabled={allInputDisabled}
              value={aniqlanganYashovchiSoni}
              onChange={(e) => setAniqlanganYashovchiSoni(e.target.value)}
            />
          ) : (
            ""
          )}
          {documentType === "dvaynik" ? (
            <TextField
              label="Ikkilamchi kod"
              type="text"
              placeholder="0"
              style={{ margin: "5px 0" }}
              fullWidth
              disabled={allInputDisabled}
              value={ikkilamchiKod}
              onChange={(e) => setIkkilamchiKod(e.target.value)}
            />
          ) : (
            ""
          )}
          <div>
            <TextField
              label="Akt summasi"
              type="text"
              placeholder="0"
              style={{ margin: "5px 0" }}
              fullWidth
              disabled={allInputDisabled}
              value={aktSummasi}
              onChange={(e) => setAktSummasi(e.target.value)}
            />
          </div>
          <TextareaAutosize
            placeholder="Asoslantiruvchi"
            type="text"
            style={{ margin: "5px 0" }}
            cols={24}
            fullWidth
            disabled={allInputDisabled}
            value={asoslantiruvchi}
            onChange={(e) => setAsoslantiruvchi(e.target.value)}
          />
          <div style={{ display: "flex" }}>
            <ReactToPrint
              content={() => componentRef.current}
              trigger={() => (
                <Button disabled={printButtonDisabled} variant="contained">
                  Chop etish
                </Button>
              )}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={handleClearButtonClick}
            >
              Clear
            </Button>
          </div>
          <Button
            style={{ margin: "5px 0" }}
            variant="outlined"
            color="success"
            fullWidth
            onClick={createNewAriza}
            disabled={registerButtonDisabled}
          >
            Ro'yxatga olish
          </Button>
        </div>
        <Document
          props={{
            date,
            abonentData,
            abonentData2,
            asoslantiruvchi,
            licshet,
            mahalla,
            mahalla2,
            aniqlanganYashovchiSoni,
            ikkilamchiKod,
            documentType,
            arizaData,
            componentRef,
          }}
        />
      </div>

      {/* <PrintComponent ref={componentRef} /> */}
    </div>
  );
};

export default CreateDalolatnoma;
