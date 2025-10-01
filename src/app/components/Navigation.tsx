import Link from "next/link";
export default function Navigation() {
  return (
    <div>
      <nav className="w-[200px] flex justify-between p-4 mx-auto">
        <Link href="/" className="font-semibold">
          Main
        </Link>
        <Link href="/history" className="font-semibold">
          History
        </Link>
      </nav>
    </div>
  );
}
