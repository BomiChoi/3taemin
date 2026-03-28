"use client";

import { useEffect } from "react";
import Link from "next/link";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center flex flex-col items-center gap-4">
        <p className="text-5xl">😵</p>
        <h2 className="text-xl font-bold text-gray-900">문제가 발생했어요</h2>
        <p className="text-sm text-gray-500">{error.message || "알 수 없는 오류가 발생했습니다."}</p>
        <div className="flex gap-3">
          <button
            onClick={reset}
            className="px-4 py-2 rounded-lg bg-blue-700 text-white text-sm font-medium hover:bg-blue-800 transition-colors cursor-pointer"
          >
            다시 시도
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-lg border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 transition-colors"
          >
            홈으로
          </Link>
        </div>
      </div>
    </div>
  );
}
