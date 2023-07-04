import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import Aktlar from "./pages/Aktlar";
import Ogohlantirish from "./pages/Ogohlantirish";
import Forma1 from "./pages/Forma1";
import Dalolatnomalar from "./pages/Dalolatnomalar";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
import { Provider } from "react-redux";
import { store } from "./app/store";
import Bildirgilar from "./pages/Bildirgilar";
import Pachkalar from "./pages/Pachkalar";

function App() {
  const darkTheme = createTheme({
    palette: { mode: "light" },
  });
  return (
    <Provider store={store}>
      <BrowserRouter className="App">
        <ThemeProvider theme={darkTheme}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Dashboard />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/aktlar/" element={<Aktlar />} />
            <Route path="/aktlar/:pachka_id" element={<Aktlar />} />
            <Route path="/ogohlantirish_xatlar" element={<Ogohlantirish />} />
            <Route path="/forma_bir" element={<Forma1 />} />
            <Route path="/dalolatnomalar" element={<Dalolatnomalar />} />
            <Route path="/bildirgilar" element={<Bildirgilar />} />
            <Route path="/pachkalar" element={<Pachkalar />} />
          </Routes>
          <ToastContainer autoClose="3000" theme="light" position="top-right" />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
