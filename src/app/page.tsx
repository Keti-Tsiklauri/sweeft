// src/app/page.tsx
import GetPopularPhotos from "./components/GetPopularPhotos";
import { getPhotos } from "./components/GetPhotos";

export default async function Main() {
  // async allowed in server component
  const photos = await getPhotos(); // fetch on server
  console.log(photos);
  return <GetPopularPhotos />;
}
