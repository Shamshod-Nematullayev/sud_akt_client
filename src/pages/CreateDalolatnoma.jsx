import React, { useRef } from "react";
import ReactToPrint from "react-to-print";
import "../assets/createDalolatnoma.css";

const PrintComponent = React.forwardRef((props, ref) => (
  <div ref={ref}>
    <div className="container" ref={ref}>
      <div
        className="header"
        style={{
          fontFamily:
            "'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif",
          fontWeight: 900,
        }}
      >
        Абонентлар бўйича ўзгаришлар тўғрисидаги маълумотларга киритилмаган ва
        улар ҳақида Санитар тозалаш марказига тақдим этилмаган янги абонентлар
        ёки бирга истиқомат қилувчи шахслар сонини аниқлаш
        <br /> ДАЛОЛАТНОМАСИ
      </div>

      <div className="content">
        <br />
        <div
          className="navbar"
          style={{
            display: "flex",
            width: "95%",
            justifyContent: "space-between",
          }}
        >
          <p style={{ fontSize: "16px" }}>“___” __________ 2024 йил.</p>
          <p style={{ fontSize: "16px" }}>Катакўрғон тумани</p>
        </div>
        <label>
          <b>Қуйидаги манзил бўйича:</b>
        </label>
        <label>
          МФЙ номи:
          ___________________________________________________________________
        </label>
        <label>
          Манзил:
          ___________________________________________________________________
        </label>
        <label>Шахсий ҳисоб рақами: ________________</label>
        <label>
          <b>
            Абонент: ________________________________________________________
          </b>
        </label>
        <br />
        <p style={{ fontSize: "16px" }}>
          Жами ____ нафар шахc 20__ йилнинг “___” _______ ойидан буён бирга
          истиқомат қилиши аниқланди.
        </p>
        <p style={{ fontSize: "16px" }}>
          Юқоридагиларга ва асослантирувчи ҳужжатларга мувофиқ, 20____ йилнинг
          _______ ойида ҳисобга олишнинг ягона электрон тизимида мазкур абонент
          тўғрисидаги маълумотларга тегишли ўзгартиришлар киритиш ҳамда
          тўловларни қайта ҳисоб-китоб қилишни мақсадга мувофиқ деб ҳисоблаймиз.
        </p>
        <label>Асосслантирувчи хужжатлар*:</label>
        <label>
          _________________________________________________________________
          <br />
          _________________________________________________________________
          <br />
          _________________________________________________________________
          <br />
        </label>
        <br />
        <p style={{ fontSize: "16px" }}>
          *) асослантирувчи ҳужжатлар (доимий ёки вақтинча прописка
          қилинганлигини тасдиғи, ФҲДЁнинг туғилганликни қайд этиш тўғрисидаги
          ва бошқа маълумотлар) мавжуд бўлса уларнинг нусхалари илова қилинади.
        </p>
      </div>

      <table>
        <tbody>
          <tr>
            <td>
              <div>“АНВАРЖОН БИЗНЕС ИНВЕСТ” МЧЖ</div>
            </td>

            <td>
              <div>
                <small
                  style={{
                    fontSize: "10px",
                    padding: "0px 12px",
                    borderTop: "1px solid rgb(0, 0, 0)",
                  }}
                >
                  (имзо)
                </small>
              </div>
            </td>
            <td>
              <div>А. А. Садирдинов</div>
            </td>
          </tr>

          <tr style={{ position: "relative", top: "10px" }}>
            <td>
              <div>Абонентлар билан ишлаш бўлими ходими</div>
              <div style={{ position: "relative", left: "70%" }}>
                <small
                  style={{
                    fontSize: "10px",
                    padding: "0px 12px",
                    borderTop: "1px solid rgb(0, 0, 0)",
                  }}
                >
                  (имзо)
                </small>
              </div>
            </td>
            <td>
              <div>Ш. Ф. Нематуллаев</div>
              <div style={{ position: "relative", left: "11%" }}></div>
            </td>
          </tr>

          <tr style={{ position: "relative", top: "20px" }}>
            <td>
              <div>Ахоли Назоратчиси</div>
              <div style={{ position: "relative", left: "70%" }}>
                <small
                  style={{
                    fontSize: "10px",
                    padding: "0px 12px",
                    borderTop: "1px solid rgb(0, 0, 0)",
                  }}
                >
                  (имзо)
                </small>
              </div>
            </td>
            <td>
              <div style={{ position: "relative" }}>
                <small>___________________________</small>
              </div>
            </td>
          </tr>
          <br />
          <tr style={{ position: "relative", top: "10px" }}>
            <td>
              <div className="underline">_________________МФЙ раиси</div>
              <div style={{ position: "relative", left: "70%" }}>
                <small
                  style={{
                    fontSize: "10px",
                    padding: "0px 12px",
                    borderTop: "1px solid rgb(0, 0, 0)",
                  }}
                >
                  (имзо)
                </small>
              </div>
            </td>
            <td>Қ.Исломов</td>
          </tr>
          <tr style={{ position: "relative", top: "10px" }}>
            <td>
              <div className="underline">Абонент</div>
              <div style={{ position: "relative", left: "70%" }}>
                <small
                  style={{
                    fontSize: "10px",
                    padding: "0px 12px",
                    borderTop: "1px solid rgb(0, 0, 0)",
                  }}
                >
                  (имзо)
                </small>
              </div>
            </td>
            <td>
              <div>А.Худайбердиев</div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
));

const CreateDalolatnoma = () => {
  const componentRef = useRef();

  return (
    <div>
      <ReactToPrint
        trigger={() => <button>Print this out!</button>}
        content={() => componentRef.current}
      />
      <PrintComponent ref={componentRef} />
    </div>
  );
};

export default CreateDalolatnoma;
