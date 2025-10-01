import { Photo } from "../types";

// src/lib/unsplash.ts
export async function getPhotoes() {
  const res = await fetch(
    `https://api.unsplash.com/photos?per_page=20&order_by=popular&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    { cache: "no-store" }
  );
  if (!res.ok) throw new Error("Failed to fetch images");

  const photos = await res.json();

  // Fetch stats for each photo
  const photosWithStats = await Promise.all(
    photos.map(async (photo: Photo) => {
      const statsRes = await fetch(
        `https://api.unsplash.com/photos/${photo.id}/statistics?client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );
      const stats = await statsRes.json();
      return { ...photo, stats };
    })
  );

  return photosWithStats;
}
