"use client";

import React, { useState, useEffect } from "react";
import { 
  Menu, 
  Search, 
  Mic, 
  Video, 
  Bell, 
  User, 
  Home, 
  PlaySquare, 
  Clock, 
  ThumbsUp, 
  ChevronDown, 
  Compass, 
  Library,
  History,
  MoreVertical,
  ChevronRight,
  MonitorPlay,
  Play,
  Plus,
  X,
  Loader2
} from "lucide-react";
import { useVideo } from "@/hooks/useVideo";
import { Ivideo } from "@/models/video.model";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import FileUpload from "@/components/FileUpload";
import { useSession } from "next-auth/react";

// Utility for cleaner class management
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const { videos, getAllVideos, upLoadVideo, loading } = useVideo();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-white/20">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-4 py-2 bg-background/95 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center gap-4">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="p-2 rounded-full hover:bg-surface transition-colors focus:bg-surface"
          >
            <Menu size={24} />
          </button>
          <div className="flex items-center gap-1 cursor-pointer" onClick={() => window.location.reload()}>
            <div className="bg-white text-black p-1 rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.3)]">
              <Play size={20} fill="black" />
            </div>
            <span className="text-xl font-bold tracking-tight hidden sm:block">VideoStar</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl px-4 hidden md:flex items-center gap-4">
          <div className="flex w-full">
            <div className="relative flex-1">
              <input 
                type="text" 
                placeholder="Search" 
                className="w-full bg-surface border border-white/10 rounded-l-full py-2 px-4 focus:outline-none focus:border-white/30 transition-all placeholder:text-foreground/40"
              />
            </div>
            <button className="bg-surface border border-l-0 border-white/10 rounded-r-full px-5 hover:bg-surface-hover transition-colors">
              <Search size={20} className="text-foreground/60" />
            </button>
          </div>
          <button className="p-2 rounded-full bg-surface hover:bg-surface-hover transition-colors shrink-0">
            <Mic size={20} />
          </button>
        </div>

        <div className="flex items-center gap-2 sm:gap-4">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="flex items-center gap-2 bg-white text-black px-4 py-2 rounded-full font-bold hover:bg-white/90 transition-all transform active:scale-95 shadow-lg"
          >
            <Plus size={20} />
            <span className="hidden sm:inline">Create</span>
          </button>
          <button className="p-2 rounded-full hover:bg-surface transition-all hidden sm:block">
            <Video size={24} />
          </button>
          <button className="p-2 rounded-full hover:bg-surface transition-all hidden sm:block">
            <Bell size={24} />
          </button>
          <button className="p-1 sm:p-2 rounded-full hover:bg-surface transition-all">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-white/20 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden">
              {session?.user?.image ? (
                <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
              ) : (
                <User size={20} />
              )}
            </div>
          </button>
        </div>
      </nav>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside 
          className={cn(
            "fixed inset-y-0 left-0 z-40 w-64 bg-background transition-transform duration-300 ease-in-out lg:relative lg:translate-x-0 p-3 flex flex-col gap-2 border-r border-white/5",
            !isSidebarOpen && "lg:w-20 -translate-x-full lg:translate-x-0"
          )}
        >
          <div className="flex flex-col gap-1 mt-14 lg:mt-0">
            <SidebarItem icon={<Home size={22} />} label="Home" active isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={<Compass size={22} />} label="Explore" isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={<PlaySquare size={22} />} label="Subscriptions" isSidebarOpen={isSidebarOpen} />
          </div>

          <div className="h-px bg-white/5 my-3" />

          <div className="flex flex-col gap-1">
            <SidebarItem icon={<Library size={22} />} label="Library" isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={<History size={22} />} label="History" isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={<Clock size={22} />} label="Watch later" isSidebarOpen={isSidebarOpen} />
            <SidebarItem icon={<ThumbsUp size={22} />} label="Liked videos" isSidebarOpen={isSidebarOpen} />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-[#0a0a0a]">
          {/* Categories bar */}
          <div className="sticky top-0 z-30 flex items-center gap-3 p-4 bg-[#0a0a0a]/80 backdrop-blur-sm overflow-x-auto no-scrollbar scroll-smooth">
            {["All", "Cinema", "Directing", "Sound Design", "Color Grading", "Action", "Drama", "History", "Geometry", "Minimalism"].map((cat, i) => (
              <button 
                key={cat} 
                className={cn(
                  "px-4 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all",
                  i === 0 ? "bg-white text-black" : "bg-surface hover:bg-surface-hover text-foreground/80"
                )}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="px-4 pb-4">
            {/* Video Grid */}
            {loading && videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64 gap-4">
                <Loader2 className="animate-spin text-white/40" size={48} />
                <p className="text-foreground/40 font-medium">Loading your feed...</p>
              </div>
            ) : videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-96 gap-6 text-center">
                <div className="p-6 bg-surface rounded-full">
                  <Video size={48} className="text-white/20" />
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">No videos yet</h3>
                  <p className="text-foreground/40 max-w-sm">Be the first to upload a video and start the community!</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="bg-white text-black px-6 py-2.5 rounded-full font-bold hover:scale-105 transition-transform"
                >
                  Upload First Video
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-5 gap-y-8 mt-4">
                {videos.map((video) => (
                  <VideoCard key={String(video._id)} video={video} />
                ))}
              </div>
            )}
          </div>

          <div className="h-20" />
        </main>
      </div>
      
      {/* Create Video Modal */}
      {isCreateModalOpen && (
        <CreateVideoModal onClose={() => setIsCreateModalOpen(false)} onUploadSuccess={() => {
          setIsCreateModalOpen(false);
          getAllVideos();
        }} />
      )}

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-md border-t border-white/5 flex items-center justify-around py-2 px-1">
        <MobileNavItem icon={<Home size={20} />} label="Home" active />
        <MobileNavItem icon={<Compass size={20} />} label="Explore" />
        <MobileNavItem icon={<MonitorPlay size={20} />} label="Library" />
        <MobileNavItem icon={<History size={20} />} label="History" />
      </div>
    </div>
  );
}

function CreateVideoModal({ onClose, onUploadSuccess }: { onClose: () => void, onUploadSuccess: () => void }) {
  const { upLoadVideo, loading: uploading } = useVideo();
  const [videoData, setVideoData] = useState({
    title: "",
    description: "",
    videoUrl: "",
    thumbnailUrl: "",
    videoWidth: 1080,
    videoHeight: 1920
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoData.videoUrl || !videoData.title) return;
    
    try {
      await upLoadVideo({
        title: videoData.title,
        description: videoData.description,
        videoUrl: videoData.videoUrl,
        thumbnailUrl: videoData.thumbnailUrl,
        controls: true,
        transformation: {
          width: videoData.videoWidth,
          height: videoData.videoHeight,
          quality: 80
        }
      });
      onUploadSuccess();
    } catch (error) {
      alert("Error uploading video. Please try again.");
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-surface w-full max-w-xl rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-6 border-b border-white/5">
          <h2 className="text-xl font-bold">Upload Video</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-6 overflow-y-auto">
          {!videoData.videoUrl ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-2xl p-12 hover:border-white/20 transition-all group bg-background/40">
              <div className="p-4 bg-white/5 rounded-full mb-4 group-hover:bg-white/10 transition-colors">
                <Plus size={32} className="text-white/40" />
              </div>
              <p className="text-foreground/60 mb-4">Select video file to upload</p>
              <FileUpload 
                fileTypes="Video" 
                onUploadSuccess={(res) => {
                  setVideoData(prev => ({ 
                    ...prev, 
                    videoUrl: res.url,
                    videoWidth: res.width,
                    videoHeight: res.height,
                    thumbnailUrl: res.thumbnailUrl || "" 
                  }));
                }} 
              />
            </div>
          ) : (
            <div className="relative aspect-video rounded-xl overflow-hidden border border-white/10 bg-black">
              <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                <Play size={48} fill="white" />
              </div>
              <img src={videoData.thumbnailUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"} alt="Thumbnail" className="w-full h-full object-cover opacity-60" />
              <button 
                type="button"
                onClick={() => setVideoData(prev => ({ ...prev, videoUrl: "" }))}
                className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500 rounded-full transition-all"
              >
                <X size={16} />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-4">
            <input 
              type="text" 
              placeholder="Give your video a title"
              required
              value={videoData.title}
              onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
              className="bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-all font-medium"
            />
            <textarea 
              placeholder="Tell viewers about your video"
              rows={4}
              value={videoData.description}
              onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
              className="bg-background border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-white/30 transition-all resize-none"
            />
          </div>

          <button 
            type="submit" 
            disabled={uploading || !videoData.videoUrl}
            className="bg-white text-black py-3 rounded-full font-bold hover:bg-white/90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {uploading ? (
              <>
                <Loader2 className="animate-spin" size={20} />
                <span>Publishing...</span>
              </>
            ) : (
              "Publish Video"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

function SidebarItem({ icon, label, active = false, isSidebarOpen }: { icon: React.ReactNode, label: string, active?: boolean, isSidebarOpen: boolean }) {
  return (
    <button 
      className={cn(
        "flex items-center gap-5 px-3 py-2.5 rounded-xl transition-all w-full group",
        active ? "bg-surface font-bold text-white shadow-lg" : "hover:bg-surface text-foreground/70 antialiased",
        !isSidebarOpen && "lg:px-2 lg:justify-center"
      )}
    >
      <div className={cn(
        "transition-transform",
        active ? "text-white" : "text-foreground/60 group-hover:text-foreground"
      )}>
        {icon}
      </div>
      {isSidebarOpen && <span className="text-sm tracking-wide">{label}</span>}
    </button>
  );
}

function MobileNavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={cn(
      "flex flex-col items-center gap-1 flex-1 transition-all",
      active ? "text-white scale-110" : "text-foreground/40"
    )}>
      {icon}
      <span className="text-[10px] font-medium tracking-tight uppercase">{label}</span>
    </button>
  );
}

function VideoCard({ video }: { video: Ivideo }) {
  return (
    <div className="group cursor-pointer flex flex-col gap-3">
      <div className="relative aspect-video rounded-2xl overflow-hidden bg-surface shadow-lg border border-white/5">
        <img 
          src={video.thumbnailUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
           <div className="p-3 bg-white text-black rounded-full shadow-2xl scale-75 group-hover:scale-100 transition-transform">
             <Play size={20} fill="black" />
           </div>
        </div>
      </div>
      
      <div className="flex gap-3 px-1">
        <div className="shrink-0 pt-0.5 transform transition-transform group-hover:scale-110">
          <div className="w-9 h-9 rounded-full bg-surface-hover flex items-center justify-center border border-white/10 overflow-hidden">
            <User size={18} className="text-white/40" />
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <h3 className="text-sm font-bold line-clamp-2 leading-snug tracking-tight group-hover:text-foreground transition-colors">
            {video.title}
          </h3>
          <div className="flex flex-col mt-1.5 gap-0.5">
            <span className="text-xs text-foreground/50 hover:text-foreground/80 transition-colors">
              User {(String(video._id)).slice(-4)}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-foreground/40 font-medium">
              <span>{new Date(video.createdAt!).toLocaleDateString()}</span>
            </div>
          </div>
        </div>
        <button className="p-1 h-fit text-foreground/0 group-hover:text-foreground/40 hover:text-foreground transition-all">
          <MoreVertical size={18} />
        </button>
      </div>
    </div>
  );
}
