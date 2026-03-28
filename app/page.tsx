import Link from "next/link";
import { Clock, KeyRound, Grape, Trophy } from "lucide-react";

const modes = [
  {
    href: "/timing",
    icon: Clock,
    title: "예매버튼 클릭",
    description: "정확히 정각에 예매 버튼을 클릭하는 연습",
    detail: "카운트다운이 0이 되는 순간 버튼을 클릭하세요. ms 단위로 반응 속도를 측정합니다.",
    badge: "반응속도",
    color: "blue",
  },
  {
    href: "/captcha",
    icon: KeyRound,
    title: "보안문자",
    description: "왜곡된 이미지의 문자를 빠르게 입력하는 연습",
    detail: "노이즈와 왜곡이 적용된 보안문자를 정확하고 빠르게 입력하세요.",
    badge: "정확도",
    color: "purple",
  },
  {
    href: "/grape",
    icon: Grape,
    title: "포도알 클릭",
    description: "좌석 그리드에서 빈 자리를 빠르게 찾아 클릭하는 연습",
    detail: "수많은 매진 좌석 중 선택 가능한 자리를 찾아 클릭하세요.",
    badge: "집중력",
    color: "green",
  },
];

const colorMap: Record<string, { icon: string; badge: string; border: string; hover: string }> = {
  blue: {
    icon: "text-blue-600 bg-blue-50",
    badge: "text-blue-700 bg-blue-100",
    border: "border-blue-100",
    hover: "hover:border-blue-300 hover:shadow-blue-100",
  },
  purple: {
    icon: "text-purple-600 bg-purple-50",
    badge: "text-purple-700 bg-purple-100",
    border: "border-purple-100",
    hover: "hover:border-purple-300 hover:shadow-purple-100",
  },
  green: {
    icon: "text-green-600 bg-green-50",
    badge: "text-green-700 bg-green-100",
    border: "border-green-100",
    hover: "hover:border-green-300 hover:shadow-green-100",
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-blue-700">삼태민</span>
            <span className="text-xs text-gray-400 font-medium">티켓팅 연습</span>
          </div>
          <Link
            href="/ranking"
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-blue-700 transition-colors"
          >
            <Trophy className="w-4 h-4" />
            랭킹
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-4 pt-12 pb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-3">
          티켓팅 3종 연습
        </h1>
        <p className="text-gray-500 text-base">
          예매버튼 클릭 · 보안문자 · 포도알 클릭, 반복 연습으로 실전에 대비하세요
        </p>
      </section>

      {/* Mode Cards */}
      <main className="max-w-4xl mx-auto px-4 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {modes.map(({ href, icon: Icon, title, description, detail, badge, color }) => {
            const c = colorMap[color];
            return (
              <Link key={href} href={href}>
                <div
                  className={`group flex flex-col h-full bg-white rounded-2xl border ${c.border} shadow-sm p-6 transition-all duration-200 ${c.hover} hover:shadow-md cursor-pointer`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`p-3 rounded-xl ${c.icon}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${c.badge}`}>
                      {badge}
                    </span>
                  </div>
                  <h2 className="text-lg font-bold text-gray-900 mb-1">{title}</h2>
                  <p className="text-sm font-medium text-gray-600 mb-2">{description}</p>
                  <p className="text-xs text-gray-400 leading-relaxed flex-1">{detail}</p>
                  <div className="mt-5 pt-4 border-t border-gray-100">
                    <span className="text-sm font-semibold text-blue-700 group-hover:underline">
                      연습하기 →
                    </span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
