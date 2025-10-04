"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Photo } from "../types";
import { getPhotos } from "./GetPhotos";
import PhotoModal from "./PhotoModal";

export default function GetPopularPhotos() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");

  // ✅ Smooth scroll globally
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";

    function handleKeyScroll(e: KeyboardEvent) {
      const step = 50; // 👈 smaller = slower scroll
      if (e.key === "ArrowDown") {
        e.preventDefault();
        window.scrollBy({ top: step, left: 0, behavior: "smooth" });
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        window.scrollBy({ top: -step, left: 0, behavior: "smooth" });
      }
    }

    window.addEventListener("keydown", handleKeyScroll);

    return () => {
      document.documentElement.style.scrollBehavior = "auto";
      window.removeEventListener("keydown", handleKeyScroll);
    };
  }, []);

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) {
      setSearchHistory(JSON.parse(storedHistory));
    }
  }, []);

  useEffect(() => {
    loadPhotos();
  }, [page, searchTerm]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  async function loadPhotos() {
    if (!hasMore) return;

    setLoading(true);
    try {
      const newPhotos = await getPhotos(page, 20, searchTerm);
      if (page === 1) {
        setPhotos(newPhotos);
      } else {
        setPhotos((prev) => [...prev, ...newPhotos]);
      }
      setHasMore(newPhotos.length > 0);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes("Rate Limit Exceeded")) {
          setPhotos((prev) => [...prev, ...prev]);
          setHasMore(true);
        } else {
          setHasMore(false);
        }
      } else {
        setHasMore(false);
      }
    } finally {
      setLoading(false);
    }
  }

  function handleScroll() {
    if (
      window.innerHeight + window.scrollY >= document.body.offsetHeight - 100 &&
      !loading &&
      hasMore
    ) {
      setPage((prev) => prev + 1);
    }
  }

  return (
    <>
      {/* Popular  Title */}
      <p className="text-xl font-semibold mb-4 text-center mx-auto mt-6">
        Popular Images
      </p>

      {/* Search input */}
      <div className="text-center mt-6 mb-4">
        <input
          type="text"
          placeholder="Search images..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              const term = searchQuery.trim();
              if (!term) return; // ignore empty search

              setSearchTerm(term); // trigger search
              setPage(1);
              setIsSearching(true);

              // ✅ allow duplicates, but not consecutive ones
              const existingHistory = JSON.parse(
                localStorage.getItem("searchHistory") || "[]"
              ) as string[];

              if (existingHistory[0]?.toLowerCase() === term.toLowerCase()) {
                return; // skip if same as last search
              }

              const updatedHistory = [term, ...existingHistory];

              setSearchHistory(updatedHistory);
              localStorage.setItem(
                "searchHistory",
                JSON.stringify(updatedHistory)
              );
            }
          }}
          className="border border-gray-300 rounded-lg px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-[#154c79]"
        />
      </div>

      <p className="text-xl font-semibold mb-4 text-center mx-auto mt-6">
        {isSearching ? `Search Results for "${searchQuery}"` : ""}
      </p>

      {/* Images */}
      <main className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.slice(0, 20).map((photo, index) => (
          <div
            key={`${photo.id}-${index}`}
            className="overflow-hidden rounded-xl shadow-md bg-white cursor-pointer"
            onClick={() => setSelectedPhoto(photo)}
          >
            <Image
              src={photo.urls.small}
              alt={photo.alt_description || "Unsplash image"}
              width={400}
              height={240}
              className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
            />
          </div>
        ))}
      </main>

      {photos.length > 20 && (
        <>
          <p className="text-xl font-semibold mt-8 mb-4 text-center mx-auto">
            More Images
          </p>

          <main className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.slice(20).map((photo, index) => (
              <div
                key={`${photo.id}-${index + 20}`}
                className="overflow-hidden rounded-xl shadow-md bg-white cursor-pointer"
                onClick={() => setSelectedPhoto(photo)}
              >
                <Image
                  src={photo.urls.small}
                  alt={photo.alt_description || "Unsplash image"}
                  width={400}
                  height={240}
                  className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
                />
              </div>
            ))}
          </main>
        </>
      )}

      {loading && <p className="text-center mt-4">Loading...</p>}
      {!hasMore && <p className="text-center mt-4">No more images</p>}

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
