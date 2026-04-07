import { Ivideo } from "@/models/video.model";

export type videotypeData = Omit<Ivideo, "_id" | "createdAt" | "updatedAt">;

type FetchOption = {
  method?: "GET" | "POST" | "PUT" | "DELETE";
  body?: any;
  headers?: Record<string, string>;
};

class APIClient {
  private async fetch<T>(
    endpoint: string,
    options: FetchOption = {},
  ): Promise<T> {
    const { method = "GET", body, headers = {} } = options;
    const defaultHeaders = {
      "Content-Type": "application/json",
      ...headers,
    };

    const response = await fetch(`/api${endpoint}`, {
      method,
      headers: defaultHeaders,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      throw new Error(
        (await response.text()) || "An error occurred while fetching data",
      );
    }

    return response.json();
  }

  async getVideos() {
    return this.fetch("/videos");
  }

  async createVideo(videoData: videotypeData) {
    return this.fetch("/videos", {
      method: "POST",
      body: videoData,
    });
  }
}

export const apiClient = new APIClient();
