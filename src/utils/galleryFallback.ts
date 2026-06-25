// Galleries are stored in Sanity (homePage.galleryImages, room.gallery) but were
// never seeded with images, so they render empty. These helpers provide a local
// fallback from the bundled photos in public/assets/images/ — the same pattern
// used by `activityImage` in ./sanity.ts. As soon as gallery images are uploaded
// in the Studio, the Sanity images take precedence and these fallbacks are ignored.
//
// We use `import.meta.glob` (resolved by Vite at build time) rather than `node:fs`
// so nothing Node-specific ends up in the Cloudflare Worker bundle. Only the glob
// *keys* (file paths) are used — the asset modules are never imported — so the
// public files are not duplicated into the build; we just derive their served URL.

const GALLERY_FILES = import.meta.glob(
  '/public/assets/images/gallery/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,avif}',
);
const ROOM_FILES = import.meta.glob(
  '/public/assets/images/rooms/*.{jpg,JPG,jpeg,JPEG,png,PNG,webp,avif}',
);

// Glob keys look like "/public/assets/images/gallery/IMG_5812.jpg"; the served
// URL drops the leading "/public".
const galleryUrls = Object.keys(GALLERY_FILES).map((k) => k.replace('/public', ''));
const roomUrls = Object.keys(ROOM_FILES).map((k) => k.replace('/public', ''));

function basename(p: string): string {
  return p.slice(p.lastIndexOf('/') + 1);
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/**
 * Random selection of photos for the homepage "Life at Kosmos Lodge" gallery,
 * drawn from public/assets/images/gallery (the curated set from the
 * "Kosmos lodge photos" library). Reshuffled on each build.
 */
export function galleryFallback(count = 9): string[] {
  return shuffle(galleryUrls).slice(0, count);
}

/**
 * Per-room photos, drawn from public/assets/images/rooms where files are named
 * `Room_<number>-*.jpg` (sourced from each room's folder in
 * "kosmos Lodge photos organised"). Excludes the `-card`/`-primary` thumbnails
 * so the gallery shows the room's other photos.
 */
export function roomGalleryFallback(roomNumber?: number): string[] {
  if (!roomNumber) return [];
  const prefix = `Room_${roomNumber}-`;
  return roomUrls
    .filter((p) => {
      const base = basename(p);
      return (
        base.startsWith(prefix) &&
        !/-card\.jpg$/i.test(base) &&
        !/-primary\.jpg$/i.test(base)
      );
    })
    .sort();
}
