import { Ivideo } from "@/models/video.model";
import { create } from "zustand";

type VideoStore = {
  videoData: Ivideo;
  videos: Ivideo[];
  setVideoData: (data: Partial<Ivideo>) => void;
  setVideos: (videos: Ivideo[]) => void;
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
  videos: [],
  setVideoData: (data) =>
    set((state) => ({ videoData: { ...state.videoData, ...data } })),
  setVideos: (videos) => set({ videos }),
}));