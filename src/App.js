import React, { Component } from "react";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "react-toastify/dist/ReactToastify.css";
import { ThemeProvider, createTheme } from "@mui/material";
import { ToastContainer } from "react-toastify";
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
  document.querySelector("html").setAttribute("data-bs-theme", "light");
  return (
    <BrowserRouter className="App">
      <ThemeProvider theme={darkTheme}>
        <ErrorBoundary>
          <AppRoutes />
        </ErrorBoundary>
        <ToastContainer autoClose="3000" theme="light" position="top-right" />
      </ThemeProvider>
    </BrowserRouter>
  );
}

export default App;
