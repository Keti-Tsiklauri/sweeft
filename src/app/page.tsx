// src/app/page.tsx
import GetPopularPhotoes from "./components/GetPopularPhotoes";
import { getPhotoes } from "./components/GetPhotoes";

export default async function Main() {
  // async allowed in server component
  const photos = await getPhotoes(); // fetch on server
  console.log(photos);
  return <GetPopularPhotoes photos={photos} />;
}
