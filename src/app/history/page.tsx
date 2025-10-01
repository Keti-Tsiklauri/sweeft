"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Photo } from "../types";
import { getPhotos } from "../components/GetPhotos";

export default function HistoryPage() {
  const [history, setHistory] = useState<string[]>([]);
  const [selectedQuery, setSelectedQuery] = useState<string>("");
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  // Load search history from localStorage
  useEffect(() => {
    const storedHistory = localStorage.getItem("searchHistory");
    if (storedHistory) setHistory(JSON.parse(storedHistory));
  }, []);

  // Load photos whenever selectedQuery or page changes
  useEffect(() => {
    if (!selectedQuery) return;

    async function loadPhotos() {
      setLoading(true);
      try {
        const newPhotos = await getPhotos(page, 20, selectedQuery);

        if (page === 1) {
          setPhotos(newPhotos);
        } else {
          setPhotos((prev) => [...prev, ...newPhotos]);
        }

        setHasMore(newPhotos.length > 0);
      } catch (err) {
        console.error(err);
        setHasMore(false);
      } finally {
        setLoading(false);
      }
    }

    loadPhotos();
  }, [selectedQuery, page]);

  // Infinite scroll
  useEffect(() => {
    function handleScroll() {
      if (
        window.innerHeight + window.scrollY >=
          document.body.offsetHeight - 100 &&
        !loading &&
        hasMore
      ) {
        setPage((prev) => prev + 1);
      }
    }

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [loading, hasMore]);

  // When selecting a query, reset page and photos
  function handleQueryClick(query: string) {
    setSelectedQuery(query);
    setPhotos([]);
    setPage(1);
    setHasMore(true);
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Search History</h1>

      {history.length === 0 && <p>No search history yet.</p>}

      <div className="flex flex-wrap gap-2 mb-6">
        {history.map((word, idx) => (
          <button
            key={idx}
            onClick={() => handleQueryClick(word)}
            className="bg-gray-200 px-3 py-1 rounded hover:bg-gray-300 cursor-pointer"
          >
            {word}
          </button>
        ))}
      </div>

      {selectedQuery && (
        <>
          <h2 className="text-xl font-semibold mb-4">
            Results for {selectedQuery}
          </h2>

          {photos.length === 0 && !loading && (
            <p>No cached results available.</p>
          )}

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {photos.map((photo, index) => (
              <div
                key={`${photo.id}-${index}`}
                className="overflow-hidden rounded-xl shadow-md bg-white cursor-pointer"
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
          </div>

          {loading && <p className="text-center mt-4">Loading...</p>}
          {!hasMore && <p className="text-center mt-4">No more images</p>}
        </>
      )}
    </div>
  );
}
