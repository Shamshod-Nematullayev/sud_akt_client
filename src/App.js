import React, { Component } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import { Provider, useSelector } from "react-redux";
import { store } from "./app/store";
import Bildirgilar from "./pages/Bildirgilar";
import Pachkalar from "./pages/Pachkalar";
import Documents from "./pages/Documents";
import AppRoutes from "./components/Routers";

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    // Log the error to an error reporting service
    console.error("Error Boundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

function App() {
  const darkTheme = createTheme({
    palette: { mode: "light" },
  });
  return (
    <Provider store={store}>
      <BrowserRouter className="App">
        <ThemeProvider theme={darkTheme}>
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
          <ToastContainer autoClose="3000" theme="light" position="top-right" />
        </ThemeProvider>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
