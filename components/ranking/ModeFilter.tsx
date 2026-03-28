"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "",        label: "전체" },
  { value: "timing",  label: "정각 클릭" },
  { value: "captcha", label: "보안문자" },
  { value: "grape",   label: "포도알" },
];

export function ModeFilter() {
  const searchParams = useSearchParams();
  const current = searchParams.get("mode") ?? "";

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
      {TABS.map(({ value, label }) => (
        <Link
          key={value}
          href={value ? `/ranking?mode=${value}` : "/ranking"}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
            current === value
              ? "bg-white text-blue-700 shadow-sm"
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
