"use client";

import Image from "next/image";
import { useState } from "react";
import PhotoModal from "./PhotoModal";
import { Photo } from "../types";
export default function GetPopularPhotoes({ photos }: { photos: Photo[] }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);

  return (
    <>
      <main className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
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

      {selectedPhoto && (
        <PhotoModal
          photo={selectedPhoto}
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </>
  );
}
