import { create } from "zustand";

const useDvayniklarStore = create((set) => ({
  haqiqiyRaqam: "",
  setHaqiqiyRaqam: (haqiqiyRaqam) => set({ haqiqiyRaqam }),
  ikkilamchiRaqam: "",
  setIkkilamchiRaqam: (ikkilamchiRaqam) => set({ ikkilamchiRaqam }),
  abonent1Data: {},
  setAbonent1Data: (abonent1Data) => set({ abonent1Data }),
  abonent2Data: {},
  setAbonent2Data: (abonent2Data) => set({ abonent2Data }),
  items: [],
  setItems: (items) => set({ items }),
}));

export default useDvayniklarStore;
