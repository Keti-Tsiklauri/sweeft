import "./globals.css";
import Navigation from "./components/Navigation";
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Navigation />
      <body>{children}</body>
    </html>
  );
}
