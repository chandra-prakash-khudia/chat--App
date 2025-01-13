import { create } from "zustand";
// this store is used to store the theme of the chat application and persist it in the local storage of the browser 
export const useThemeStore = create((set) => ({
  theme: localStorage.getItem("chat-theme") || "garden",
  setTheme: (theme) => {
    localStorage.setItem("chat-theme", theme);
    set({ theme });
  },
}));