"use client";

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Video, 
  User, 
  Play,
  Plus,
  X,
  Loader2,
  LogOut
} from "lucide-react";
import { useVideo } from "@/hooks/useVideo";
import { Ivideo } from "@/models/video.model";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import FileUpload from "@/components/FileUpload";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

// Utility for cleaner class management
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();
  const { videos, getAllVideos, upLoadVideo, loading } = useVideo();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  useEffect(() => {
    getAllVideos();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans selection:bg-white/10">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 glass border-b border-white/5">
        <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.location.reload()}>
          <div className="bg-primary text-background p-1.5 rounded-xl shadow-[0_0_20px_rgba(255,255,255,0.15)] group-hover:scale-105 transition-transform">
            <Play size={22} fill="currentColor" />
          </div>
          <span className="text-2xl font-black tracking-tighter hidden sm:block">VIDEOSTAR</span>
        </div>

        <div className="flex-1 max-w-xl px-8 hidden md:block">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-on-variant group-focus-within:text-primary transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Search cinematic moments..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-surface border border-white/5 rounded-2xl py-2.5 pl-12 pr-4 focus:outline-none focus:border-white/20 focus:bg-surface-hover transition-all placeholder:text-on-variant/40 text-sm"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => {
              if (!session) {
                router.push("/auth/login");
              } else {
                setIsCreateModalOpen(true);
              }
            }}
            className="flex items-center gap-2 bg-primary text-background px-6 py-2.5 rounded-full font-bold hover:opacity-90 transition-all transform active:scale-95 shadow-xl text-sm"
          >
            <Plus size={18} />
            <span>Create</span>
          </button>
          
          {session ? (
            <div className="flex items-center gap-3 pl-2 border-l border-white/10">
               <button 
                 title="Sign Out"
                 onClick={() => signOut()}
                 className="p-2 rounded-full hover:bg-surface transition-all text-on-variant hover:text-primary"
               >
                 <LogOut size={20} />
               </button>
               <div className="w-10 h-10 rounded-full bg-surface border border-white/5 flex items-center justify-center overflow-hidden">
                {session?.user?.image ? (
                  <img src={session.user.image} alt="User" className="w-full h-full object-cover" />
                ) : (
                  <User size={20} className="text-on-variant" />
                )}
              </div>
            </div>
          ) : (
            <button 
              onClick={() => router.push("/auth/login")}
              className="px-4 py-2 rounded-full text-sm font-bold text-on-variant hover:text-primary transition-colors"
            >
              Sign In
            </button>
          )}
        </div>
      </nav>

      <div className="flex-1 flex flex-col">
        {/* Main Content */}
        <main className="flex-1 overflow-y-auto px-6 py-8">
          <div className="max-w-[1600px] mx-auto">
            {loading && videos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
                <Loader2 className="animate-spin text-primary/20" size={48} />
                <p className="text-on-variant/40 font-medium tracking-wide">CURATING YOUR FEED...</p>
              </div>
            ) : filteredVideos.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-[60vh] gap-6 text-center">
                <div className="p-8 bg-surface rounded-full border border-white/5">
                  <Video size={48} className="text-white/10" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2 tracking-tight">No videos found</h3>
                  <p className="text-on-variant/40 max-w-sm mx-auto">
                    {searchQuery ? `No results for "${searchQuery}". Try a different search.` : "Be the first to share a cinematic journey with the community."}
                  </p>
                </div>
                {!searchQuery && (
                  <button 
                    onClick={() => {
                      if (!session) router.push("/auth/login");
                      else setIsCreateModalOpen(true);
                    }}
                    className="bg-primary text-background px-8 py-3 rounded-full font-bold hover:scale-105 transition-transform"
                  >
                    Upload First Video
                  </button>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-x-8 gap-y-12">
                {filteredVideos.map((video) => (
                  <VideoCard key={String(video._id)} video={video} />
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
      
      {/* Create Video Modal */}
      {isCreateModalOpen && (
        <CreateVideoModal onClose={() => setIsCreateModalOpen(false)} onUploadSuccess={() => {
          setIsCreateModalOpen(false);
          getAllVideos();
        }} />
      )}

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
        
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-8 overflow-y-auto">
          {!videoData.videoUrl ? (
            <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/5 rounded-3xl p-16 hover:border-white/10 transition-all group bg-surface/50">
              <div className="p-5 bg-white/5 rounded-2xl mb-6 group-hover:bg-white/10 transition-all group-hover:scale-110">
                <Plus size={40} className="text-primary/40" />
              </div>
              <p className="text-on-variant/60 mb-6 font-medium">Select a cinematic file to upload</p>
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
            <div className="relative aspect-video rounded-2xl overflow-hidden border border-white/5 bg-surface group">
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                <Play size={64} fill="white" className="drop-shadow-2xl" />
              </div>
              <img src={videoData.thumbnailUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"} alt="Thumbnail" className="w-full h-full object-cover transition-transform group-hover:scale-105" />
              <button 
                type="button"
                onClick={() => setVideoData(prev => ({ ...prev, videoUrl: "" }))}
                className="absolute top-4 right-4 p-2 bg-black/60 hover:bg-destructive rounded-full transition-all z-20"
              >
                <X size={20} />
              </button>
            </div>
          )}

          <div className="flex flex-col gap-5">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-variant/40 ml-1">Title</label>
              <input 
                type="text" 
                placeholder="The Cinematic Epoch"
                required
                value={videoData.title}
                onChange={(e) => setVideoData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full bg-surface border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-white/20 transition-all font-semibold"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-on-variant/40 ml-1">Description</label>
              <textarea 
                placeholder="Describe the journey..."
                rows={4}
                value={videoData.description}
                onChange={(e) => setVideoData(prev => ({ ...prev, description: e.target.value }))}
                className="w-full bg-surface border border-white/5 rounded-2xl px-5 py-4 focus:outline-none focus:border-white/20 transition-all resize-none"
              />
            </div>
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

// Removed SidebarItem and MobileNavItem components

function VideoCard({ video }: { video: Ivideo }) {
  return (
    <div className="group cursor-pointer flex flex-col gap-5">
      <div className="relative aspect-video rounded-3xl overflow-hidden bg-surface shadow-2xl border border-white/5">
        <img 
          src={video.thumbnailUrl || "https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&q=80&w=800"} 
          alt={video.title} 
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-500" />
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500">
           <div className="p-4 bg-primary text-background rounded-full shadow-2xl translate-y-4 group-hover:translate-y-0 transition-all duration-500">
             <Play size={24} fill="currentColor" />
           </div>
        </div>
        {/* Simple duration badge mock */}
        <div className="absolute bottom-4 right-4 bg-black/60 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold tracking-widest text-white/90">
          12:45
        </div>
      </div>
      
      <div className="flex gap-4 px-2">
        <div className="shrink-0 pt-1">
          <div className="w-12 h-12 rounded-2xl bg-surface-hover flex items-center justify-center border border-white/5 overflow-hidden group-hover:border-white/20 transition-all">
            <User size={24} className="text-on-variant/40 group-hover:text-primary transition-colors" />
          </div>
        </div>
        <div className="flex flex-col flex-1 overflow-hidden">
          <h3 className="text-base font-bold line-clamp-2 leading-tight tracking-tight group-hover:text-primary transition-colors duration-300">
            {video.title}
          </h3>
          <div className="flex flex-col mt-2 gap-1">
            <span className="text-xs font-medium text-on-variant/60 hover:text-primary transition-colors uppercase tracking-widest">
              Director {(String(video._id)).slice(-4)}
            </span>
            <div className="flex items-center gap-2 text-[11px] text-on-variant/30 font-bold uppercase tracking-widest">
              <span>2.4M Views</span>
              <span className="w-1 h-1 rounded-full bg-white/10" />
              <span>{new Date(video.createdAt!).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
