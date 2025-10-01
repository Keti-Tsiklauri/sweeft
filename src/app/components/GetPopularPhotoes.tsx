import Image from "next/image";
import { Photo } from "../types";
async function getPopularPhotos() {
  const res = await fetch(
    `https://api.unsplash.com/photos?per_page=20&order_by=popular&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    {
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }

  return res.json();
}

export default async function GetpopularPhotoes() {
  const photoes = await getPopularPhotos();

  return (
    <main className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photoes.map((photo: Photo) => (
        <div
          key={photo.id}
          className="overflow-hidden rounded-xl shadow-md bg-white"
        >
          <Image
            src={photo.urls.small}
            alt={photo.alt_description || "Unsplash image"}
            width={400}
            height={240}
            className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300 cursor-pointer"
          />
        </div>
      ))}
    </main>
  );
}
