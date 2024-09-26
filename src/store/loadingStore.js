const { create } = require("zustand");

const useLoaderStore = create((set) => ({
  isLoading: false,
  setIsLoading: (isLoading) => set({ isLoading }),
}));

export default useLoaderStore;
