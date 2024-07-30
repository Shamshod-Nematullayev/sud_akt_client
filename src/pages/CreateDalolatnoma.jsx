import React, { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import "../assets/createDalolatnoma.css";
import SideBar from "../components/SideBar";
import { kirillga } from "../helper/lotinKiril";
import { toast } from "react-toastify";
import axios from "axios";
import API from "../utils/APIRouters";
import {
  TextField,
  Button,
  Backdrop,
  CircularProgress,
  TextareaAutosize,
} from "@mui/material";
import CachedIcon from "@mui/icons-material/Cached";
import { createGlobalStyle } from "styled-components";

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
  const [asoslantiruvchi, setAsoslantiruvchi] = useState("");
  const [licshet, setLicshet] = useState("");
  const [mahalla, setMahalla] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aniqlanganYashovchiSoni, setAniqlanganYashovchiSoni] = useState(0);
  const oylar = [
    "Январ",
    "Февраль",
    "Март",
    "Апрель",
    "Май",
    "Июн",
    "Июл",
    "Август",
    "Сентябрь",
    "Октябрь",
    "Ноябрь",
    "Декабр",
  ];
  const raqamlar = [
    "Нол",
    "Бир",
    "Икки",
    "Уч",
    "Тўрт",
    "Беш",
    "Олти",
    "Етти",
    "Саккиз",
    "Тўққиз",
    "Ўн",
    "Ўн бир",
    "Ўн икки",
  ];

  async function getAbonentData(licshet) {
    try {
      setIsLoading(true);
      const respond = await axios.get(
        `${API.host}/api/billing/get-abonent-dxj-by-licshet/${licshet}`
      );
      console.log({ data: respond.data.abonentData });
      if (!respond.data.ok) {
        setIsLoading(false);
        return toast.error(respond.data.message);
      }
      const mfy_data = await axios.get(
        `${API.host}/api/billing/get-mfy-by-id/${respond.data.abonentData.mahallas_id}`
      );
      setAbonentData(respond.data.abonentData);
      setMahalla(mfy_data.data.data);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
      toast.error("Error occured to connect server");
    }
  }

  return (
    <div className="admin-page">
      <SpecialPageStyle />
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      {/* Yuklanmoqda loader */}
      <SideBar active="qulayliklar" />
      <div className="container" style={{ display: "flex" }}>
        <div
          id="filter"
          style={{ padding: "10px 20px", margin: "0 25px", background: "#fff" }}
        >
          <div style={{ display: "flex", position: "relative", width: 200 }}>
            <TextField
              label="Shaxsiy hisob raqami"
              type="text"
              placeholder="105120...."
              fullWidth
              value={licshet}
              onChange={(e) => setLicshet(e.target.value)}
            />
            <Button
              variant="contained"
              onClick={() => getAbonentData(licshet)}
              style={{
                position: "absolute",
                height: "100%",
                left: "-40%",
              }}
            >
              <CachedIcon />
            </Button>
          </div>
          <TextField
            label="Yashov soni"
            type="text"
            placeholder="0"
            style={{ margin: "5px 0" }}
            fullWidth
            value={aniqlanganYashovchiSoni}
            onChange={(e) => setAniqlanganYashovchiSoni(e.target.value)}
          />
          <TextareaAutosize
            placeholder="Asoslantiruvchi"
            type="text"
            style={{ margin: "5px 0" }}
            cols={24}
            fullWidth
            value={asoslantiruvchi}
            onChange={(e) => setAsoslantiruvchi(e.target.value)}
          />

          <div style={{ display: "flex" }}>
            <ReactToPrint
              content={() => componentRef.current}
              trigger={() => <Button variant="contained">Chop etish</Button>}
            />
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                setLicshet("");
                setAniqlanganYashovchiSoni("");
                setAsoslantiruvchi("");
                setAbonentData({});
                setMahalla("");
              }}
            >
              Clear
            </Button>
          </div>
        </div>
        <div id="print" ref={componentRef}>
          <p style={{ textAlign: "center" }}>
            <b>
              Абонентлар бўйича ўзгаришлар тўғрисидаги маълумотларга
              киритилмаган ва улар ҳақида Санитар тозалаш марказига тақдим
              этилмаган янги абонентлар ёки бирга истиқомат қилувчи шахслар
              сонини аниқлаш
            </b>
          </p>
          <p style={{ textAlign: "center" }}>
            <b>ДАЛОЛАТНОМАСИ</b>
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              lineHeight: "50px",
            }}
          >
            <div>
              "{date.getDate()}" {oylar[date.getMonth()]} {date.getFullYear()}{" "}
              йил
            </div>
            <div>Каттақўрғон тумани</div>
          </div>
          <p>
            <b>Қуйидаги манзил бўйича:</b>
          </p>
          <p>МФЙ номи: {abonentData.mahalla_name}</p>
          <p>Манзил: {abonentData.address}</p>
          <p>Шахсий ҳисоб рақами: {abonentData.licshet}</p>
          <p>
            <b>Абонент: {abonentData.fio}</b>
          </p>
          <p>
            Жами {aniqlanganYashovchiSoni} ({raqamlar[aniqlanganYashovchiSoni]})
            нафар шахc 20__ йилнинг “___” _______ ойидан буён бирга истиқомат
            қилиши аниқланди.
          </p>
          <p>
            Юқоридагиларга ва асослантирувчи ҳужжатларга мувофиқ,{" "}
            {date.getFullYear()} йилнинг {oylar[date.getMonth()]} ойида ҳисобга
            олишнинг ягона электрон тизимида мазкур абонент тўғрисидаги
            маълумотларга тегишли ўзгартиришлар киритиш ҳамда тўловларни қайта
            ҳисоб-китоб қилишни мақсадга мувофиқ деб ҳисоблаймиз.
          </p>
          <p>Асослантирувчи ҳужжатлар*:</p>
          <p>{kirillga(asoslantiruvchi)}</p>

          {asoslantiruvchi.length == 0 ? (
            <p>
              _______________________________________________________________
            </p>
          ) : (
            ""
          )}
          {asoslantiruvchi.length < 110 ? (
            <p>
              _______________________________________________________________
            </p>
          ) : (
            ""
          )}
          {asoslantiruvchi.length < 220 ? (
            <p>
              _______________________________________________________________
            </p>
          ) : (
            ""
          )}
          <p>
            *) асослантирувчи ҳужжатлар (доимий ёки вақтинча прописка
            қилинганлигини тасдиғи, ФҲДЁнинг туғилганликни қайд этиш тўғрисидаги
            ва бошқа маълумотлар) мавжуд бўлса уларнинг нусхалари илова
            қилинади.
          </p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: 300 }}>
              "Анваржон бизнес инвест" МЧЖ Каттақўрғон туман филиали рахбари:
            </div>
            <div>___________</div>
            <div style={{ width: 200 }}>А.Садриддинов</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: 300 }}>
              Абонентлар билан ишлаш бўлими ходими:
            </div>
            <div>___________</div>
            <div style={{ width: 200 }}>Ш.Нематуллаев</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: 300 }}>Ахоли назоратчиси:</div>
            <div>___________</div>
            <div style={{ width: 200 }}>_____________________</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: 300 }}>Абонент:</div>
            <div>___________</div>
            <div style={{ width: 200 }}>_____________________</div>
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div style={{ width: 300 }}>{mahalla.name}</div>
            <div>___________</div>
            <div style={{ width: 200 }}>{`${
              mahalla.mfy_rais_name?.split(" ")[1][0]
            }. ${mahalla.mfy_rais_name?.split(" ")[0]}`}</div>
          </div>
        </div>
      </div>

      {/* <PrintComponent ref={componentRef} /> */}
    </div>
  );
};

export default CreateDalolatnoma;
