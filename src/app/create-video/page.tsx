"use client";

import FileUpload from "@/components/FileUpload";
import { useVideo } from "@/hooks/useVideo";
import { Ivideo } from "@/models/video.model";
import { useState } from "react";
export default function HomePage() {
  const [progress, setProgress] = useState(0);
  const [videoTitle, settitle] = useState("");
  const [videoDescription, setdescription] = useState("");
  const [videoFileUrl, setfileUrl] = useState("");
  const [videoWidth, setwidth] = useState(0);
  const [videoHeight, setheight] = useState(0);

  const { loading, upLoadVideo } = useVideo();

  const videoData: Ivideo = {
    title: videoTitle,
    description: videoDescription,
    videoUrl: videoFileUrl,
    thumbnailUrl: "",
    controls: true,
    transformation: {
      width: videoWidth,
      height: videoHeight,
      quality: 80,
    },
  };

  const handleUploadSuccess = (res: any) => {
    const { url, height, width, duration } = res;
    setfileUrl(url);
    setheight(height);
    setwidth(width);
  };

  const handleProgress = (value: number) => {
    setProgress(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await upLoadVideo(videoData);
      alert("Video uploaded successfully!");
    } catch (error) {
      console.error("Error uploading video:", error);
      alert("Failed to upload video. Please try again.");
    }
  };

  return (
    <div className="p-5 w-full  min-h-screen flex flex-col items-center justify-center bg-white">
      <div className="w-full max-w-md p-5 border rounded-lg shadow-md bg-gray-400">
        <FileUpload
          fileTypes="Video"
          onUploadSuccess={handleUploadSuccess}
          onProgress={handleProgress}
        />
        <form onSubmit={handleSubmit} className="flex flex-col gap-4 mt-4">
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={videoTitle}
            onChange={(e) => settitle(e.target.value)}
          />
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={videoDescription}
            onChange={(e) => setdescription(e.target.value)}
            className="px-2 py-2 border-none rounded bg-gray-600 text-white outline-none "
          />

          <button type="submit">Upload Video</button>
        </form>

        <p>Progress: {progress}%</p>
      </div>
    </div>
  );
}
