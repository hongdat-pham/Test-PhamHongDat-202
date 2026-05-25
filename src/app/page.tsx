"use client";

import { useState, useCallback } from "react";
import { videos } from "@/data/videos";
import VideoCard from "@/components/VideoCard";
import { Sidebar, BottomNav } from "@/components/Nav";

export default function Home() {
  const [hasInteracted, setHasInteracted] = useState(false);

  const handleFirstInteraction = useCallback(() => {
    if (!hasInteracted) setHasInteracted(true);
  }, [hasInteracted]);

  return (
    <div className="app-layout" onClick={handleFirstInteraction}>
      <Sidebar activeId="home" />

      <main className="feed-container">
        {videos.map((video) => (
          <VideoCard key={video.id} video={video} hasInteracted={hasInteracted} />
        ))}
      </main>

      <BottomNav activeId="home" />
    </div>
  );
}