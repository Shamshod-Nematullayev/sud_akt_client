import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import * as XLSX from "xlsx";
import { sudAkts } from "../../utils/APIRouters";

function ImportAktModal({ getDatas, pachka_id }) {
  const [excelFile, setExcelFile] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (excelFile !== null) {
      const workbook = XLSX.read(excelFile, { type: "buffer" });
      const workSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[workSheetName];
      const data = XLSX.utils.sheet_to_json(worksheet, {
        blankrows: false,
        raw: true,
      });

      data.forEach(async (akt) => {
        const respond = await axios.post(sudAkts, {
          kod: akt.KOD,
          bildirish_xati_raqami: akt.DOC,
          fish: akt.FISH,
          qarzdorlik: akt.QARZ,
          pachka_id,
        });
        if (respond.data.ok) {
          getDatas();
        } else {
          toast.error(respond.data.message);
        }
      });
      setExcelFile(null);
      document.getElementById("import-akt-btn-close").click();
    }
  };
  const fileTypes = [
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  const handleChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && fileTypes.includes(selectedFile.type)) {
      let reader = new FileReader();
      reader.readAsArrayBuffer(selectedFile);
      reader.onload = (e) => {
        setExcelFile(e.target.result);
      };
    } else {
      toast.error("Faqat excel file kiriting");
      return false;
    }
  };
  const onDownload = () => {
    const link = document.createElement("a");
    link.download = `example.xlsx`;
    link.href = "/examples/file.xlsx";
    link.click();
  };
  return (
    <div className="modal fade" id="importAktsModal" aria-hidden={true}>
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5">Aktlarni import qilish</h1>
              <button
                type="button"
                className="btn-close"
                id="import-akt-btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <p>
                Agar fayl strukturasi qanday bo'lishini bilmasangiz{" "}
                <a className="text-primary" onClick={onDownload}>
                  ushbu faylni
                </a>{" "}
                yuklab olishingiz mumkin
              </p>
              <input
                type="file"
                accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                className="form-control"
                onChange={(e) => handleChange(e)}
              />
            </div>
            <div className="modal-footer">
              <button type="submit" className="btn btn-primary">
                Saqlash
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

export default ImportAktModal;
