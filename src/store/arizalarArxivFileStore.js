import { create } from "zustand";

const arizalarArxivFileStore = create((set) => ({
  file: null,
  setData: (fileData) => set({ file: fileData }),
  pdfFiles: [],
  setPdfFiles: (pdfFilesData) => set({ pdfFiles: pdfFilesData }),
  currentPdf: {},
  setCurrentPdf: (pdfData) => set({ currentPdf: pdfData }),
  deleteOneFile: (deletingFileName) =>
    set((state) => ({
      pdfFiles: state.pdfFiles.filter((file) => file.name !== deletingFileName),
    })),
  arizaData: {},
  setArizaData: (data) => set({ arizaData: data }),
  ndsSumma: 0,
  setNdsSumma: (summa) => set({ ndsSumma: summa }),
  ndsItems: [],
  setNdsItems: (items) => set({ ndsItems: items }),
}));

export default arizalarArxivFileStore;
