"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { cn } from "@/lib/utils";

const TABS = [
  { value: "",        label: "전체",    activeStyle: "bg-teal-500 text-white" },
  { value: "timing",  label: "예매버튼", activeStyle: "bg-blue-500 text-white" },
  { value: "captcha", label: "보안문자", activeStyle: "bg-purple-500 text-white" },
  { value: "grape",   label: "포도알",  activeStyle: "bg-green-500 text-white" },
];

export function ModeFilter() {
  const searchParams = useSearchParams();
  const current = searchParams.get("mode") ?? "";

  return (
    <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
      {TABS.map(({ value, label, activeStyle }) => (
        <Link
          key={value}
          href={value ? `/ranking?mode=${value}` : "/ranking"}
          className={cn(
            "px-4 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm",
            current === value
              ? activeStyle
              : "text-gray-500 hover:text-gray-700"
          )}
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
