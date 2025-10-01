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
  const [hasMore, setHasMore] = useState(true); // new
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  useEffect(() => {
    loadPhotos();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loading, hasMore]);
  async function loadPhotos() {
    if (!hasMore) return;

    setLoading(true);
    try {
      const newPhotos = await getPhotos(page);
      setPhotos((prev) => [...prev, ...newPhotos]);
    } catch (err: unknown) {
      console.error("Error fetching photos:", err);

      // Check if it's an Error object
      if (err instanceof Error) {
        // If rate limit exceeded, loop current photos
        if (err.message.includes("Rate Limit Exceeded")) {
          setPhotos((prev) => [...prev, ...prev]);
          setHasMore(true);
        } else {
          setHasMore(false); // stop on real errors
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
      <main className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo, index) => (
          <div
            key={`${photo.id}-${index}`} // unique key
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
