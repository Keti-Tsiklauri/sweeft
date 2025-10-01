// src/lib/unsplash.ts
import { Photo } from "../types";
const searchCache: Record<string, Photo[]> = {};

export async function getPhotos(
  page: number = 1,
  per_page: number = 20,
  query: string = ""
) {
  const cacheKey = `${query}-${page}`;

  // Return cached results if available
  if (searchCache[cacheKey]) {
    return searchCache[cacheKey];
  }

  const url = query
    ? `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
        query
      )}&per_page=${per_page}&page=${page}&client_id=${
        process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY
      }`
    : `https://api.unsplash.com/photos?per_page=${per_page}&page=${page}&order_by=popular&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch images: ${text}`);
  }

  const data = await res.json();
  const results = query ? data.results : data;

  // Store in cache
  searchCache[cacheKey] = results;

  return results;
}
