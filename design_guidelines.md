# HostingAllTV Design Guidelines

## Design Approach
**Reference-Based**: Drawing from Netflix, Disney+, and HBO Max with elevated premium positioning. Cinematic immersion with sophisticated dark treatment emphasizing content over chrome.

## Typography
**Fonts**: 
- Primary: Inter (UI, metadata, descriptions) - weights 400, 500, 600, 700
- Display: Bebas Neue (hero titles, section headers) - weight 400 for impact

**Hierarchy**:
- Hero titles: Bebas Neue, 96px/1.1 desktop, 56px mobile
- Section headers: Bebas Neue, 48px/1.2 desktop, 32px mobile  
- Content titles: Inter 600, 24px/1.3
- Body text: Inter 400, 16px/1.5
- Metadata: Inter 500, 14px/1.4 (opacity 70%)

## Layout System
**Spacing Scale**: Tailwind units 2, 4, 6, 8, 12, 16, 20, 24
- Section padding: py-20 desktop, py-12 mobile
- Card gaps: gap-6 for grids
- Container: max-w-7xl with px-6

## Core Components

### Navigation
Fixed header with backdrop blur, height 80px. Logo left, search center (expandable), user profile/notifications right. Sticky on scroll with elevated shadow.

### Hero Section (Featured Content)
Full viewport height (100vh) with gradient overlay (black 0% top to 80% bottom). Content positioned bottom-left with 96px bottom padding. Display featured movie/series title (Bebas Neue), 2-line description max, metadata row (rating badge, year, duration, genre tags), dual CTA buttons with blurred backgrounds (glass-morphism effect).

### Content Rails (Horizontal Scrollers)
Multiple category rows: "Trending Now", "New Releases", "Continue Watching", "Because You Watched X". Each rail contains 6-8 items visible, smooth horizontal scroll. Aspect ratio 16:9 for thumbnails, scale on hover (1.05), show play icon overlay and title on hover.

### Content Cards
Poster-style (2:3 aspect ratio) with subtle shadow. Title overlay bottom with gradient. Progress bar for "Continue Watching" at bottom edge. Quality badge top-right (4K, HDR icons).

### Genre Navigation  
Horizontal pill navigation below header (sticky): "All", "Action", "Drama", "Comedy", "Thriller", "Sci-Fi", "Documentary". Active state with subtle highlight.

### Detail Modal/Page
Large hero backdrop (16:9), content info overlay on left third. Metadata grid (director, cast, release year), episode selector for series (grid or list toggle), "More Like This" section below.

### Search Interface
Overlay modal with large search input, recent searches, trending searches, results grid appearing below as user types. Filter chips for content type (Movies/Series), genre, year.

### Footer
Multi-column (4 columns desktop, stacked mobile): Company links, Help & Support, Legal, Social media icons. Newsletter signup embedded. Copyright and language selector at bottom.

## Images Section

**Hero Background Image**: 
Ultra-wide cinematic still from featured content, 1920x1080 minimum. Dark vignette overlay required. Position: Background cover, center-focused. Example: Epic action scene, dramatic landscape, or character closeup with depth of field.

**Content Thumbnails**:
- Landscape format (16:9): 480x270 for horizontal rails, showing key scene or promotional art
- Poster format (2:3): 300x450 for "My List" and genre browsing grids
All images should have subtle shadow and rounded corners (8px radius)

**Category Headers**: 
Full-width banners (1600x400) for major genre pages, atmospheric scenes representing the category mood. Text overlaid with strong contrast.

**Detail Page Backdrop**:
Hero-style wide image (1920x800) for movie/series detail pages, different from thumbnail to provide fresh visual context.

All images use lazy loading, progressive enhancement, and maintain cinematic color grading aligned with dark theme.