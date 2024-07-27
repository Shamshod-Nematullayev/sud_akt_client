import React, { useRef, useState } from "react";
import ReactToPrint from "react-to-print";
import "../assets/createDalolatnoma.css";
import SideBar from "../components/SideBar";
import { kirillga } from "../helper/lotinKiril";

const CreateDalolatnoma = () => {
  const componentRef = useRef();
  const date = new Date();
  const [abonentData, setAbonentData] = useState({});
  const [asoslantiruvchi, setAsoslantiruvchi] = useState("");
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

  return (
    <div className="admin-page">
      {/* Yuklanmoqda loader */}
      <SideBar active="qulayliklar" />
      <div className="container">
        <div id="print">
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
          {asoslantiruvchi.length < 250 ? (
            <p>
              _______________________________________________________________
            </p>
          ) : (
            ""
          )}
          {asoslantiruvchi.length < 500 ? (
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
        </div>
      </div>

      {/* <PrintComponent ref={componentRef} /> */}
    </div>
  );
};

export default CreateDalolatnoma;
