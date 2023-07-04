import axios from "axios";
import React, { useState } from "react";
import { toast } from "react-toastify";
import { sudAkts } from "./../../utils/APIRouters";

function CreateAktModal({ getDatas, pachka_id }) {
  const [values, setValues] = useState({
    kod: "",
    fish: "",
    bildirish_xati_raqami: "",
    qarzdorlik: "",
  });

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleClear = () => {
    setValues({ kod: "", fish: "", bildirish_xati_raqami: "", qarzdorlik: "" });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (handleValidate()) {
      const respond = await axios.post(sudAkts, {
        ...values,
        pachka_id,
      });
      if (respond.data.ok) {
        getDatas();
      } else {
        toast.error(respond.data.message);
      }
      handleClear();
    }
  };

  const handleValidate = () => {
    const { kod, bildirish_xati_raqami, fish } = values;
    if (!kod || kod < 105070000000) {
      toast.error("Litsavoy kod noto'g'ri kiritildi");
      return false;
    } else if (!fish || fish.length < 3) {
      toast.error("F. I. O. noto'g'ri kiritildi");
      return false;
    } else if (!bildirish_xati_raqami) {
      toast.error("Bildirish xati raqami kiritilmadi");
      return false;
    }
    return true;
  };
  return (
    <form onSubmit={(e) => handleSubmit(e)}>
      <div
        className="modal fade"
        id="exampleModal"
        tabIndex="-1"
        aria-labelledby="exampleModalLabel"
        aria-hidden="true"
      >
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="exampleModalLabel">
                Yangi akt yaratish
              </h1>
              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <div className="modal-body">
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  Litsavoy kod
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="105120500123"
                  name="kod"
                  value={values.kod}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput1"
                  className="form-label"
                >
                  F. I. O.
                </label>
                <input
                  type="text"
                  className="form-control"
                  id="exampleFormControlInput1"
                  placeholder="Shamshod Ne'matullayev"
                  name="fish"
                  value={values.fish}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="mb-3">
                <label htmlFor="qarzdorlikInput" className="form-label">
                  Qarzdorlik
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="qarzdorlikInput"
                  placeholder="Qarzdorlik"
                  name="qarzdorlik"
                  value={values.qarzdorlik}
                  onChange={(e) => handleChange(e)}
                />
              </div>
              <div className="mb-3">
                <label
                  htmlFor="exampleFormControlInput2"
                  className="form-label"
                >
                  Bildirgi raqami
                </label>
                <input
                  type="number"
                  className="form-control"
                  id="exampleFormControlInput2"
                  placeholder="Bildirish xati raqami"
                  name="bildirish_xati_raqami"
                  min="1"
                  value={values.bildirish_xati_raqami}
                  onChange={(e) => handleChange(e)}
                />
              </div>
            </div>
            <div className="modal-footer">
              <button
                type="button"
                className="btn btn-secondary"
                data-bs-dismiss="modal"
              >
                Close
              </button>
              <button
                type="button"
                className="btn btn-danger"
                onClick={handleClear}
              >
                Clear
              </button>
              <button type="submit" className="btn btn-primary">
                Saqlash
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

export default CreateAktModal;
