// src/app/page.tsx
import GetPopularPhotos from "./components/GetPopularPhotos";
import { getPhotos } from "./components/GetPhotos";

export default async function Main() {
  const photos = await getPhotos(); // fetch on server

  return <GetPopularPhotos />;
}
