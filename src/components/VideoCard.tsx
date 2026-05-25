"use client";

import { useRef, useState, useEffect, useCallback } from "react";
import { VideoData } from "@/types";

function formatCount(n: number): string {
  if (n >= 1_000_000) return (n / 1_000_000).toFixed(1) + "M";
  if (n >= 1_000) return (n / 1_000).toFixed(1) + "K";
  return String(n);
}

interface Props {
  video: VideoData;
  hasInteracted: boolean;
}

export default function VideoCard({ video, hasInteracted }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(video.likesCount);
  const [showIndicator, setShowIndicator] = useState(false);
  const [indicatorType, setIndicatorType] = useState<"play" | "pause">("play");
  const [progress, setProgress] = useState(0);
  const [likeAnimate, setLikeAnimate] = useState(false);
  const [isActive, setIsActive] = useState(false); 

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid || !hasInteracted) return;
    vid.muted = false;
    setIsMuted(false);
  }, [hasInteracted]);

  useEffect(() => {
    const el = cardRef.current;
    const vid = videoRef.current;
    if (!el || !vid) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        const isIntersecting = entry.isIntersecting && entry.intersectionRatio >= 0.6;
        
        if (isIntersecting) {
          vid.play().catch(() => {});
          setIsPlaying(true);
          setIsActive(true); 
        } else {
          vid.pause();
          setIsPlaying(false);
          setIsActive(false); 
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;

    const onTimeUpdate = () => {
      if (vid.duration) setProgress((vid.currentTime / vid.duration) * 100);
    };

    vid.addEventListener("timeupdate", onTimeUpdate);
    return () => vid.removeEventListener("timeupdate", onTimeUpdate);
  }, []);

  const handleVideoClick = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;

    if (vid.paused) {
      vid.play().catch(() => {});
      setIsPlaying(true);
      setIndicatorType("play");
    } else {
      vid.pause();
      setIsPlaying(false);
      setIndicatorType("pause");
    }

    setShowIndicator(false);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setShowIndicator(true));
    });

    setTimeout(() => setShowIndicator(false), 500);
  }, []);

  const handleLike = useCallback(() => {
    setLiked((prev) => {
      setLikesCount((c) => (prev ? c - 1 : c + 1));
      return !prev;
    });
    setLikeAnimate(true);
    setTimeout(() => setLikeAnimate(false), 350);
  }, []);

  const toggleMute = useCallback(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.muted = !vid.muted;
    setIsMuted(vid.muted);
  }, []);

  return (
    <div className={`video-slide${isActive ? " is-active" : ""}`} ref={cardRef}>
      <div className="video-card">
        <video
          ref={videoRef}
          className="video-element"
          src={video.videoUrl}
          loop
          muted
          playsInline
          preload="metadata"
          onClick={handleVideoClick}
        />

        <div className="video-overlay" />

        <div className={`play-indicator${showIndicator ? " show" : ""}`}>
          {indicatorType === "play" ? (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <polygon points="5,3 19,12 5,21" />
            </svg>
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="white">
              <rect x="6" y="4" width="4" height="16" />
              <rect x="14" y="4" width="4" height="16" />
            </svg>
          )}
        </div>

        <div className="mute-badge" onClick={toggleMute}>
          {isMuted ? (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <line x1="23" y1="9" x2="17" y2="15" />
                <line x1="17" y1="9" x2="23" y2="15" />
              </svg>
              Tắt tiếng
            </>
          ) : (
            <>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
                <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
                <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              </svg>
              Có tiếng
            </>
          )}
        </div>

        <div className="video-info">
          <div className="author-row">
            <div className="author-avatar">
              {video.authorName.charAt(0)}
            </div>
            <div>
              <div className="author-name">{video.authorName}</div>
              <div className="author-handle">{video.authorHandle}</div>
            </div>
          </div>
          <p className="video-description">{video.description}</p>
          <div className="video-tags">
            {video.tags.map((tag) => (
              <span key={tag} className="video-tag">#{tag}</span>
            ))}
          </div>
        </div>

        <div className="action-bar">
          <button
            className={`action-btn${liked ? " liked" : ""}`}
            onClick={handleLike}
            aria-label="Like"
          >
            <div className={`action-icon-wrap${likeAnimate ? " like-animate" : ""}`}>
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill={liked ? "#ff2d55" : "none"}
                stroke={liked ? "#ff2d55" : "white"}
                strokeWidth="2"
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </div>
            <span className="action-label">{formatCount(likesCount)}</span>
          </button>

          <button className="action-btn" aria-label="Comment">
            <div className="action-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </div>
            <span className="action-label">{formatCount(video.commentsCount)}</span>
          </button>

          <button className="action-btn" aria-label="Share">
            <div className="action-icon-wrap">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <circle cx="18" cy="5" r="3" />
                <circle cx="6" cy="12" r="3" />
                <circle cx="18" cy="19" r="3" />
                <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" />
                <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" />
              </svg>
            </div>
            <span className="action-label">{formatCount(video.sharesCount)}</span>
          </button>
        </div>

        <div className="progress-bar-wrap">
          <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>
    </div>
  );
}