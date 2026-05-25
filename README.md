## VibeReel – Vertical Short Video Feed

A TikTok-style vertical scroll video feed built with **Next.js 15 (App Router)** and **TypeScript** .

### Features

#### Core

- Vertical scroll layout with CSS Scroll Snap (smooth one-video-at-a-time scrolling)
- 9:16 fixed aspect ratio card on PC, fullscreen on mobile
- Click video to Play/Pause (with animated indicator)
- Author name, description, tags, and action buttons (Like, Comment, Share)

#### Bonus

- **Auto Play/Pause on scroll** – Intersection Observer API
- **Like state** – click heart to toggle red + animate, count updates instantly
- **Sidebar nav** (PC) + **Bottom nav** (mobile)
- Video progress bar
- Mute/unmute toggle

---

### How Play/Pause on Scroll Works

#### 1. CSS Scroll Snap

Each video occupies exactly one full viewport height. Scroll Snap forces the feed to always land on a video boundary, preventing mid-scroll stops.

css

```css
.feed-container {
  scroll-snap-type: y mandatory;
}
.video-slide {
  scroll-snap-align: start;
  scroll-snap-stop: always; /* prevents skipping multiple videos at once */
}
```

#### 2. Intersection Observer (auto play/pause)

Each `VideoCard` registers its own `IntersectionObserver` watching its own container `div`:

typescript

```typescript
const observer = newIntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting && entry.intersectionRatio >= 0.6) {
      vid.play(); // video covers ≥60% of viewport → play
    } else {
      vid.pause(); // scrolled out of view → pause
    }
  },
  { threshold: 0.6 },
);
observer.observe(cardRef.current);
```

**Why `threshold: 0.6`?**
A video must occupy at least 60% of the viewport before it starts playing. This prevents edge-case triggers where a partially visible video at the top or bottom of the screen starts playing unintentionally.

**Each `VideoCard` manages its own observer independently.** The observer is disconnected when the component unmounts, preventing memory leaks.

#### 3. Click to Play/Pause

typescript

```typescript
consthandleVideoClick = () => {
  if (vid.paused) {
    vid.play();
  } else {
    vid.pause();
  }
  // Shows a ▶ / ⏸ animation as visual feedback
};
```

#### 4. Auto-unmute on First Interaction

Browsers block autoplaying video with sound by default. To work around this, all videos start muted. Once the user interacts with the page for the first time (any click), a shared `hasInteracted` flag is set to `true` and passed down to every `VideoCard`, which then unmutes its video element via a `useEffect`.

---

### Tech Stack

- **Next.js 15** – App Router, Server Components
- **TypeScript** – full type safety
- **Pure CSS** – no UI library, custom design system with CSS variables
- **Intersection Observer API** – auto play/pause on scroll
- **CSS Scroll Snap** – smooth per-video vertical scrolling

### Getting Started

bash

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy

Deploy on [Vercel](https://vercel.com) – zero config required for Next.js projects.
