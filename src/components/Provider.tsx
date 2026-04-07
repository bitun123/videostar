"use client";
import { ImageKitProvider } from "@imagekit/next";
import { SessionProvider } from "next-auth/react";
const imageKitUrl = process.env.NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT!;

if (imageKitUrl === undefined) {
  throw new Error(
    "NEXT_PUBLIC_IMAGEKIT_URL_ENDPOINT is not defined in the environment variables.",
  );
}

 const Provider = ({ children }: { children: React.ReactNode }) => {
  return (
    <SessionProvider refetchInterval={5 * 60}>
      <ImageKitProvider urlEndpoint={imageKitUrl}>{children}</ImageKitProvider>
    </SessionProvider>
  );
};

export default Provider;