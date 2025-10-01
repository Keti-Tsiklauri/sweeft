// src/lib/unsplash.ts
import { Photo } from "../types";

export async function getPhotos(page: number = 1, per_page: number = 20) {
  const res = await fetch(
    `https://api.unsplash.com/photos?per_page=${per_page}&page=${page}&order_by=popular&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    { cache: "no-store" }
  );

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch images: ${text}`);
  }

  const photos: Photo[] = await res.json();

  // Fetch stats for each photo
  const photosWithStats = await Promise.all(
    photos.map(async (photo) => {
      try {
        const statsRes = await fetch(
          `https://api.unsplash.com/photos/${photo.id}/statistics?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
        );
        const stats = statsRes.ok ? await statsRes.json() : null;
        return { ...photo, stats };
      } catch {
        return { ...photo, stats: null }; // fallback if stats fail
      }
    })
  );

  return photosWithStats;
}
