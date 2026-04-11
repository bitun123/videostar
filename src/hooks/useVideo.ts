import { apiClient } from "@/lib/api-client";
import { Ivideo } from "@/models/video.model";
import { useAuthStore } from "@/store/authStore";
import { useVideoStore } from "@/store/videoStore";

export const useVideo = () => {
  const { loading, setLoading } = useAuthStore();
  const { videoData, videos, setVideoData, setVideos } = useVideoStore();

  const upLoadVideo = async (videoData: Ivideo) => {
    try {
      setLoading(true);
      const response = await apiClient.createVideo(videoData);
      // After upload, we might want to refresh the list or just add the new video
      await getAllVideos(); 
      return response;
    } catch (error) {
      console.error("Error uploading video:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };


  const getAllVideos = async () => {
    try {
      setLoading(true);
      const response = await apiClient.getVideos();
      setVideos(response.videos);
    } catch (error) {
      console.error("Error fetching videos:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return {
    videoData,
    videos,
    loading,
    upLoadVideo,
    getAllVideos,
  };
};
