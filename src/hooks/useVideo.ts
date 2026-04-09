import { apiClient } from "@/lib/api-client";
import { Ivideo } from "@/models/video.model";
import { useAuthStore } from "@/store/authStore";
import { useVideoStore } from "@/store/videoStore";

export const useVideo = () => {
  const { loading, setLoading } = useAuthStore();

  const { videoData, setVideoData } = useVideoStore();

  const upLoadVideo = async (videoData: Ivideo) => {
    try {
      setLoading(true);
      const response = await apiClient.createVideo(videoData);
      setVideoData(response);
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const getAllVideos = async () => {
    try {
      const response = await apiClient.getVideos();
      setVideoData(response.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    videoData,
    loading,
    upLoadVideo,
    getAllVideos,
  };
};
