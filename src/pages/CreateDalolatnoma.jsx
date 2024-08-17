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
  Select,
  MenuItem,
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
  const [abonentData2, setAbonentData2] = useState({});
  const [asoslantiruvchi, setAsoslantiruvchi] = useState("");
  const [licshet, setLicshet] = useState("");
  const [mahalla, setMahalla] = useState("");
  const [mahalla2, setMahalla2] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aniqlanganYashovchiSoni, setAniqlanganYashovchiSoni] = useState(0);
  const [ikkilamchiKod, setIkkilamchiKod] = useState("");
  const [documentType, setDocumentType] = useState("odam_soni"); // odam_soni, dvaynik, viza
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
      let respond2;
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
      if (documentType == "dvaynik") {
        respond2 = await axios.get(
          `${API.host}/api/billing/get-abonent-dxj-by-licshet/${ikkilamchiKod}`
        );

        if (
          respond.data.abonentData.mahallas_id !=
          respond2.data.abonentData.mahallas_id
        ) {
          const mfy_data = await axios.get(
            `${API.host}/api/billing/get-mfy-by-id/${respond.data.abonentData.mahallas_id}`
          );
          setAbonentData2(respond2.data.abonentData);
          setMahalla2(mfy_data.data.data);
        }
      }
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
          <Select
            defaultValue="odam_soni"
            value={documentType}
            fullWidth
            style={{ margin: "10px 0" }}
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
          {documentType == "odam_soni" ? (
            <TextField
              label="Yashov soni"
              type="text"
              placeholder="0"
              style={{ margin: "5px 0" }}
              fullWidth
              value={aniqlanganYashovchiSoni}
              onChange={(e) => setAniqlanganYashovchiSoni(e.target.value)}
            />
          ) : (
            <TextField
              label="Ikkilamchi kod"
              type="text"
              placeholder="0"
              style={{ margin: "5px 0" }}
              fullWidth
              value={ikkilamchiKod}
              onChange={(e) => setIkkilamchiKod(e.target.value)}
            />
          )}
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
        {documentType === "odam_soni" ? (
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
              Жами {aniqlanganYashovchiSoni} (
              {raqamlar[aniqlanganYashovchiSoni]}) нафар шахc 20__ йилнинг “___”
              _______ ойидан буён бирга истиқомат қилиши аниқланди.
            </p>
            <p>
              Юқоридагиларга ва асослантирувчи ҳужжатларга мувофиқ,{" "}
              {date.getFullYear()} йилнинг {oylar[date.getMonth()]} ойида
              ҳисобга олишнинг ягона электрон тизимида мазкур абонент
              тўғрисидаги маълумотларга тегишли ўзгартиришлар киритиш ҳамда
              тўловларни қайта ҳисоб-китоб қилишни мақсадга мувофиқ деб
              ҳисоблаймиз.
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
            {asoslantiruvchi.length < 70 ? (
              <p>
                _______________________________________________________________
              </p>
            ) : (
              ""
            )}

            <p>
              *) асослантирувчи ҳужжатлар (доимий ёки вақтинча прописка
              қилинганлигини тасдиғи, ФҲДЁнинг туғилганликни қайд этиш
              тўғрисидаги ва бошқа маълумотлар) мавжуд бўлса уларнинг нусхалари
              илова қилинади.
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
              <div style={{ width: 200 }}>
                {mahalla.biriktirilganNazoratchi?.inspector_name}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: 300 }}>Абонент:</div>
              <div>___________</div>
              <div style={{ width: 200 }}>{abonentData.fio}</div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div style={{ width: 300 }}>{mahalla.name} МФЙ раиси:</div>
              <div>___________</div>
              <div style={{ width: 200 }}>{`${
                mahalla.mfy_rais_name?.split(" ")[1][0]
              }. ${mahalla.mfy_rais_name?.split(" ")[0]}`}</div>
            </div>
            <br />
            <br />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <div></div>
              <div
                style={{
                  width: 300,
                  textAlign: "justify",
                  fontWeight: "bold",
                  textIndent: "40px",
                }}
              >
                Каттақўрғон туман “Анваржон бизнес инвест” МЧЖ рахбари
                А.А.Садриддиновга. Каттақўрғон туман {mahalla.name} МФЙ да
                яшовчи фукаро {abonentData.fio} томонидан
              </div>
            </div>
            <br />
            <h1
              style={{
                textAlign: "center",
                margin: "auto 0 0 0",
                fontSize: "24px",
              }}
            >
              АРИЗА
            </h1>
            <br />
            <p
              style={{
                fontWeight: "bold",
                lineHeight: "40px",
                textIndent: "40px",
              }}
            >
              Шуни ёзиб маълум қиламанки менинг {abonentData.licshet} хисоб
              рақамим онлайн базага нотўғри хисоб китоб қилингани сабабли
              далолатнома тақдим киляпман. Ушбу далолатномам асосида қайта хисоб
              китоб қилиб беришингизни сурайман.
            </p>
            <p style={{ fontWeight: "bold", textAlign: "center" }}>
              "{date.getDate()}" {oylar[date.getMonth()]} {date.getFullYear()}{" "}
              йил _______ {abonentData.fio}
            </p>
          </div>
        ) : documentType == "dvaynik" ? (
          "Dvaynik dalolatnoma va ariza"
        ) : (
          <div id="print" ref={componentRef}>
            <p style={{ textAlign: "center" }}>
              <b>ДАЛОЛАТНОМА</b>
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
              Биз қуйидаги имзо чекувчилар, Самарқанд вилояти, Каттакургон
              тумани, {mahalla.name} МФЙ раиси{" "}
              {`${mahalla.mfy_rais_name?.split(" ")[1][0]}. ${
                mahalla.mfy_rais_name?.split(" ")[0]
              }`}{" "}
              , “АНВАРЖОН БИЗНЕС ИНВЕСТ” МЧЖ Каттақўрғон туман аҳоли назоратчиси{" "}
              {mahalla.biriktirilganNazoratchi?.inspector_name}, Абонентлар
              билан ишлаш бўлими бошлиғи Ш.Неъматуллаев мазкур далолатномани шу
              ҳақида туздик. МФЙ рўйхатини ўрганиш натижасида куйидаги абонент
            </p>
            <table border={1} style={{ borderCollapse: "collapse" }}>
              <tr>
                <th>Хакикий хисоб ракам</th>
                <th>Абонент И.Ф.Ш</th>
                <th>Икиламчи хисоб ракам</th>
                <th>Абонент И.Ф.Ш</th>
              </tr>
              <tr>
                <td>{abonentData.licshet}</td>
                <td>{abonentData.fio}</td>
                <td>{abonentData2.licshet}</td>
                <td>{abonentData2.fio}</td>
              </tr>
            </table>
          </div>
        )}
      </div>

      {/* <PrintComponent ref={componentRef} /> */}
    </div>
  );
};

export default CreateDalolatnoma;
