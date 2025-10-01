// src/lib/unsplash.ts
import { Photo } from "../types";

// cache per query+page
const searchCache: Record<string, Photo[]> = {};

export async function getPhotos(
  page: number = 1,
  per_page: number = 20,
  query: string = ""
): Promise<Photo[]> {
  const normalizedQuery = query.trim().toLowerCase();
  const cacheKey = `${normalizedQuery}-${page}`;

  // ✅ Return cached results if available
  if (searchCache[cacheKey]) {
    return [...searchCache[cacheKey]]; // shallow clone
  }

  const baseUrl = "https://api.unsplash.com";
  const clientId = process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY;

  const url = normalizedQuery
    ? `${baseUrl}/search/photos?query=${encodeURIComponent(
        normalizedQuery
      )}&per_page=${per_page}&page=${page}&client_id=${clientId}`
    : `${baseUrl}/photos?per_page=${per_page}&page=${page}&order_by=popular&client_id=${clientId}`;

  const res = await fetch(url, { cache: "no-store" });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Failed to fetch images: ${text}`);
  }

  const data = await res.json();
  const results: Photo[] = normalizedQuery ? data.results : data;

  //  Store in cache
  searchCache[cacheKey] = results;

  return [...results]; // always return a new array
}
