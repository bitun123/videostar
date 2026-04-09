import { Ivideo } from "@/models/video.model";
import { create } from "zustand";


type VideoStore = {
  videoData: Ivideo;
  setVideoData: (data: Partial<Ivideo>) => void;
};



export const useVideoStore = create<VideoStore>((set) => ({
  videoData: {
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    controls: true,
    transformation: {
      width: null as unknown as number,
      height: null as unknown as number,
      quality: null as unknown as number,
    },
  },
  setVideoData: (data) =>
    set((state) => ({ videoData: { ...state.videoData, ...data } })),
}));