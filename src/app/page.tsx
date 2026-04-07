"use client";

import FileUpload from "@/components/FileUpload";
import { useState } from "react";

export default function HomePage() {
  const [progress, setProgress] = useState(0);

  const handleUploadSuccess = (res: any) => {
    console.log("Upload successful:", res);
  };

  const handleProgress = (value: number) => {
    setProgress(value);
  };

  return (
    <div className="p-5">
      <h1>Upload File</h1>

      <FileUpload
        fileTypes="Video"
        onUploadSuccess={handleUploadSuccess}
        onProgress={handleProgress}
      />

      <p>Progress: {progress}%</p>
    </div>
  );
}
