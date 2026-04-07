import { authOptions } from "@/lib/auth";
import { connectToDatabase } from "@/lib/db";
import videoModel, { Ivideo } from "@/models/video.model";
import { getServerSession } from "next-auth";
import {  NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    await connectToDatabase();
    const videos = await videoModel.find({}).sort({ createdAt: -1 }).lean();


if(!videos || videos.length === 0) {
return NextResponse.json({message: "No videos found", videos: []}, {status: 200})
}


return NextResponse.json({message: "Videos fetched successfully", videos}, {status: 200})

  } catch (error) {
    console.error("Error fetching videos:", error);
    return NextResponse.json({message: "Error fetching videos"}, {status: 500})
  }
}


export async function POST(request:NextRequest){
    try {
     const session = await getServerSession(authOptions);


     if(!session){
return NextResponse.json({message:"Unauthorized"}, {status: 401})
     }


    await connectToDatabase();
    
    
    const body:Ivideo = await request.json()



if(
!body.title || !body.description || !body.videoUrl || !body.thumbnailUrl
){
    return NextResponse.json({message: "Invalid video data"}, {status: 400})
}


const videoData:Ivideo = {
    ...body,
controls: body?.controls ?? true,
transformation: {
height:1920,
width:1080,quality: body?.transformation?.quality ?? 100,
}
}


const newVideo = await videoModel.create(videoData)


return NextResponse.json({message: "Video uploaded successfully", video: newVideo}, {status: 201})
    } catch (error) {
        console.error("Error uploading video:", error);
        return NextResponse.json({message: "Fail to upload video"}, {status: 500})
    }
}


