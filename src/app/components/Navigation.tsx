"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navigation() {
  const pathname = usePathname();

  return (
    <div className="border-b border-[#8396a6] shadow-sm">
      <nav className="w-full max-w-[90%] md:max-w-[400px] flex justify-between p-3 md:p-4 mx-auto">
        <Link
          href="/"
          className={`font-semibold text-2xl md:text-4xl ${
            pathname === "/"
              ? "text-[#AB1717]"
              : "text-[#8396a6] hover:text-[#154c79]"
          }`}
        >
          Main
        </Link>
        <Link
          href="/history"
          className={`font-semibold text-2xl md:text-4xl ${
            pathname === "/history"
              ? "text-[#AB1717]"
              : "text-[#8396a6] hover:text-[#154c79]"
          }`}
        >
          History
        </Link>
      </nav>
    </div>
  );
}
