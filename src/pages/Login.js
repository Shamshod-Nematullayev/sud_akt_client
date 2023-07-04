import React, { useState } from "react";
import { loginAPI } from "../utils/APIRouters";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

function Login() {
  const [values, setValues] = useState({
    login: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };
  const handleValidate = () => {
    if (!values.login) {
      toast.error("Siz login kiritmadingiz");
      return false;
    } else if (!values.password) {
      toast.error("Siz parol kiritmadingiz");
      return false;
    } else if (values.login.length < 3) {
      toast.error("Login eng kamida 3 ta belgidan iborat bo'ladi");
      return false;
    }
    return true;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!handleValidate()) {
      return;
    }
    const { data } = await axios.post(loginAPI, {
      ...values,
    });
    if (!data.ok) {
      return toast.error(data.message);
    } else {
      localStorage.setItem("user_data", JSON.stringify(data.user));
      navigate("/dashboard");
    }
  };
  return (
    <div className="container" id="login-page">
      <form onSubmit={(e) => handleSubmit(e)}>
        <div className="card p-3">
          <h2 className="heading">Hush kelibsiz</h2>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput1" className="form-label">
              Login
            </label>
            <input
              type="text"
              className="form-control"
              id="exampleFormControlInput1"
              name="login"
              placeholder="Login"
              onChange={(e) => handleChange(e)}
            />
          </div>
          <div className="mb-3">
            <label htmlFor="exampleFormControlInput2" className="form-label">
              Parol
            </label>
            <input
              type="password"
              className="form-control"
              id="exampleFormControlInput2"
              name="password"
              placeholder="Password"
              onChange={(e) => handleChange(e)}
            />
            <button className="btn btn-primary mt-3" type="submit">
              Kirish
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default Login;
