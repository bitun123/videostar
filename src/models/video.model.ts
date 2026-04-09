import mongoose from "mongoose";

export const VIDEO_DIMENSIONAL = {
  WIDTH: 1080,
  HEIGHT: 1920,
} as const;

export interface Ivideo {
  _id?: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl?: string;
  controls: boolean;
  transformation?: {
    width: number;
    height: number;
    quality?: number;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

const videoSchema = new mongoose.Schema<Ivideo>(
  {
    title: {
      type: String,
      required: [true, "Title is required"],
    },
    description: {
      type: String,
      required: [true, "Description is required"],
    },
    videoUrl: {
      type: String,
      required: [true, "Video URL is required"],
    },
    thumbnailUrl: {
      type: String,
      
    },
    controls: {
      type: Boolean,
      default: false,
    },
    transformation: {
      height: {
        type: Number,
        default: VIDEO_DIMENSIONAL.HEIGHT,
      },
      width: {
        type: Number,
        default: VIDEO_DIMENSIONAL.WIDTH,
      },
      quality: {
        type: Number,
        min: 1,
        max: 100,
        default: 80,
      },
    },
  },
  {
    timestamps: true,
  },
);

const videoModel =
  mongoose.models?.video || mongoose.model<Ivideo>("video", videoSchema);

export default videoModel;
