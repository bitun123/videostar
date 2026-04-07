"use client"; // This component must be a client component

import {
  upload,
} from "@imagekit/next";
import axios from "axios";
import {  useState } from "react";

const publickKey = process.env.NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY!;
if(publickKey === undefined) {
  throw new Error(
    "NEXT_PUBLIC_IMAGEKIT_PUBLIC_KEY is not defined in the environment variables.",
  );
}

interface FileUploadProps {
  onUploadSuccess: (response: any) => void;
  onProgress?: (progress: number) => void;
  fileTypes?: "Image" | "Video";
}

const FileUpload = ({
  onUploadSuccess,
  onProgress,
  fileTypes,
}: FileUploadProps) => {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const valiDateFileType = (file: File) => {
    if (fileTypes === "Video") {
      if (!file.type.startsWith("video/")) {
        setError("Invalid file type. Please select a video file.");
      }
    }

    if (file.size > 100 * 1024 * 1024) {
      setError(
        "File size exceeds the 100MB limit. Please select a smaller file.",
      );
    }

    return true;
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !valiDateFileType(file)) return;

    setUploading(true);
    setError(null);

    try {
      const response = await axios.get("/api/imagekit-auth");

      const res = await upload({
        file,
        fileName: file.name,
        publicKey: publickKey,
       signature: response.data.authenticationParameters.signature,
expire: response.data.authenticationParameters.expire,
token: response.data.authenticationParameters.token,
        onProgress: (event) => {
          if (event.lengthComputable && onProgress) {
            const progress = Math.round((event.loaded / event.total) * 100);
            onProgress(progress);
          }
        },
      });

      onUploadSuccess(res);
    } catch (error) {
      console.error("Error uploading file:", error);
    } finally {
      setUploading(false);
    }
  };

  return (
    <>
      <input
        type="file"
        accept={fileTypes === "Video" ? "video/*" : "image/*"}
        onChange={handleFileChange}
      />
      {uploading && <p>Uploading...</p>}
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
};

export default FileUpload;
