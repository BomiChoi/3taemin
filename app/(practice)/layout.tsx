import Link from "next/link";
import { ChevronLeft } from "lucide-react";

export default function PracticeLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-700 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            홈
          </Link>
          <span className="text-gray-200">|</span>
          <span className="text-sm font-bold text-blue-700">삼태민</span>
        </div>
      </header>
      <main className="flex-1 flex flex-col items-center justify-center px-4 py-10">
        {children}
      </main>
    </div>
  );
}
