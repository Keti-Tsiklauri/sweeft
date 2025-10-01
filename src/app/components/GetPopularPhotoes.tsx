// This is your main Home page in Next.js

// Fetch 20 most popular images from Unsplash
async function getPopularPhotos() {
  const res = await fetch(
    `https://api.unsplash.com/photos?per_page=20&order_by=popular&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`,
    {
      // disables Next.js fetch caching (good for dev)
      cache: "no-store",
    }
  );

  if (!res.ok) {
    throw new Error("Failed to fetch images");
  }

  return res.json();
}

// The default exported Home component
export default async function Photoes() {
  const photos = await getPopularPhotos();

  return (
    <main className="p-6 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {photos.map((photo: any) => (
        <div
          key={photo.id}
          className="overflow-hidden rounded-xl shadow-md bg-white"
        >
          <img
            src={photo.urls.small}
            alt={photo.alt_description || "Unsplash image"}
            className="w-full h-60 object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      ))}
    </main>
  );
}
