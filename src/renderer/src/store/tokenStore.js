import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


const tokenStore = (set, get) => ({
    menuOpen: false,
    tokenList:["cab1ec413818b81a883dcced83dd4c60"],
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



const useTokenStore = create(
    persist(tokenStore, {
      name: "token",
      storage: createJSONStorage(() => localStorage),
      // except [] in list
      partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['menuOpen'].includes(key))
        ),
    
    })
  );



export default useTokenStore;