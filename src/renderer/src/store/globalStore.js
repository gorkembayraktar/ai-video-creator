import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";


import { StorySplitType } from "../../../define/store";


const globalStore = (set, get) => ({
  elevenlabsOpen: false,
  updateElevenlabsOpen: (value) => {
    set(()=>({
      elevenlabsOpen: value
  }));
  },
  elevenlabsTokenOpen: false,
  updateElevenlabsTokenOpen: (value) => {
    set(()=>({
      elevenlabsTokenOpen: value
  }));
  },
  stability:50,
  updateStability: (value) => {
    set(()=>({
      stability: value
    }))
  },
  similarity:50,
  updateSimilarity: (value) => {
    set(()=>({
      similarity: value
    }))
  },
  style:50,
  updateStyle: (value) => {
    set(()=>({
      style: value
    }))
  },
  speakerBoost: true,
  speakerBoostToggle: () => {
    set((state)=>({
      speakerBoost: !state.speakerBoost
    }))
  },
  updateSetting: (similarity_boost, stability, style, use_speaker_boost) => {
    set((state)=>({
      style: style,
      stability: stability,
      similarity: similarity_boost,
      speakerBoost:  use_speaker_boost
    }))
  },
  activeStep: 0,
  updateActiveStep: (callback) => {
    set(callback);
  },
  selectModel: "",
  updateSelectModel: (model) => {
    set((state)=>({
      selectModel:  model
    }))
  },
  selectVoice: "",
  updateSelectVoice: (voice) => {
    set((state)=>({
      selectVoice:  voice
    }))
  },

  story: "",
  storyList: () => {
    const story = get().story;
    const type = get().storySplitType;
    if(type == StorySplitType.DOT){
      return story.trim().split('.').map(i => i.trim()).filter(i => i.length >= 1);
    }

    return story.trim().split('\n').map(i => i.trim()).filter(i => i.length >= 1);
  },
  storySplitType: StorySplitType.DOT,
  updateStorySplitType: (type) => {
    // update
    set(()=>({
      storySplitType:  type
    }))
  },
  backdropTask: false,
  updateBackdropTask: (value) => {
      set(()=>({
        backdropTask: value
      }))
  },
  backdropMessage: "",
  updateBackdropMessage: (value) => {
      set(()=>({
        backdropMessage: value
      }))
  },
  explorer:{
    open:false,
    src: ''
  },
  updateExplorer:(data) => {
    set((state)=>({
        explorer:{
          ...state.explorer,
          ...data
        }
    }));
  },
  nextSection: false, 
  sentenceAndImage: [],
  backgroundVolume: 50,
  backgroundFile: null,
  updateStory: (story) => {
    set(()=>({
        story: story
    }));
  },
  updateNextSection: (next) => {
    set(()=>({
        nextSection: next
    }));
  },
  updateBackgroundVolume: (volume) => {
    set(()=>({
      backgroundVolume: volume
    }));
  },
  updateSentenceAndImage: (id, src) => {
    // update sentene and images
    const si = get().sentenceAndImage;
    si[id] = src;

    set(()=>({
      sentenceAndImage: si
    }));
  },
  findSentenceAndImage: (id) => {
    const si = get().sentenceAndImage;
    if(si[id])
        return si[id];

    return null;
  },
  updateBackgroundFile: (data) => {
    set(() => ({
      backgroundFile: data
    }))
  }
});

const useGlobalStore = create(
    persist(globalStore, {
      name: "global",
      storage: createJSONStorage(() => localStorage),
       // except [] in list
       partialize: (state) =>
        Object.fromEntries(
          Object.entries(state).filter(([key]) => !['explorer', 'backdropTask', 'backdropMessage', 'activeStep', 'nextSection'].includes(key))
        ),
    })
  );



export default useGlobalStore;