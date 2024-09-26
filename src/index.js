import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";

import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

// PDF.js worker fayli manzili (yuklab olgandan keyin o'rnatilgan manzil)
GlobalWorkerOptions.workerSrc = "/pdf.worker.min.js";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <>
    <App />
  </>
);
