import { create } from "zustand";

const arizalarArxivFileStore = create((set) => ({
  file: null,
  setData: (fileData) => set({ file: fileData }),
  pdfFiles: [],
  setPdfFiles: (pdfFilesData) => set({ pdfFiles: pdfFilesData }),
}));

export default arizalarArxivFileStore;
