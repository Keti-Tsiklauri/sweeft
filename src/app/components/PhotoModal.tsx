"use client";

import Image from "next/image";
import { Photo } from "../types";

interface PhotoModalProps {
  photo: Photo;
  onClose: () => void;
}

export default function PhotoModal({ photo, onClose }: PhotoModalProps) {
  if (!photo) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50"
      onClick={onClose} // close when clicking outside
    >
      <div
        className="bg-white rounded-xl max-w-3xl w-full p-4 relative"
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <button
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl cursor-pointer"
          onClick={onClose}
        >
          ✕
        </button>

        <Image
          src={photo.urls.regular}
          alt={photo.alt_description || "Unsplash image"}
          width={800}
          height={600}
          className="w-full max-w-full max-h-[80vh] object-contain rounded-lg"
        />

        <p className="mt-2 text-gray-700">
          {photo.alt_description || "No description"}
        </p>
        <p className="text-sm text-gray-500">By {photo.user.name}</p>
        <div className="mt-2 text-sm text-gray-600 flex flex-wrap gap-4">
          <span>👍 Likes: {photo.likes}</span>
          <span>👁 Views: {photo.stats?.views.total ?? "N/A"}</span>
          <span>⬇ Downloads: {photo.stats?.downloads.total ?? "N/A"}</span>
        </div>
      </div>
    </div>
  );
}
