import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


const stabilityStore = (set, get) => ({
    menuOpen: false,
    tokenList:[],
    addToken:(token) => {
      set((state) => ({
        tokenList: [...state.tokenList, token]
      }))
    },
    removeToken:(token) => {
      set((state) => ({
        tokenList: state.tokenList.filter(t => t != token)
      }));
    },
    setMenuOpen: (status) => {
        set(()=>({
            menuOpen: status
        }))
    }
});



const useStabilityStore = create(
    persist(stabilityStore, {
      name: "stabilitytoken",
      storage: createJSONStorage(() => localStorage),
      // except [] in list
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['menuOpen'].includes(key))
        ),
    
    })
  );



export default useStabilityStore;