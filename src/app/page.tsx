export default function Home() {
  return (
    <div className="mx-auto max-w-screen-lg space-y-16 p-6 md:p-10">
      {/* HEADER */}
      <header className="border-gray-20 border-b pb-6">
        <h1 className="mb-1 text-black">Design System Preview</h1>
        <p className="text-gray-40 text-lg">The Julge App 스타일 가이드</p>
      </header>

      {/* 1. TYPOGRAPHY */}
      <section>
        <h3 className="text-blue-20 mb-6 text-sm tracking-wider uppercase">1. Typography</h3>
        <div className="space-y-6">
          <div className="flex flex-col gap-1">
            <span className="text-gray-30 font-mono text-xs">Bold (700)</span>
            <h1 className="m-0 text-4xl">가나다라마바사 - Title Large</h1>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-30 font-mono text-xs">Medium (500)</span>
            <h2 className="m-0 text-2xl font-medium text-gray-50">가나다라마바사 - Sub Title</h2>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-gray-30 font-mono text-xs">Regular (400)</span>
            <p className="text-gray-40 text-base">가나다라마바사 - Body Text (Default)</p>
          </div>
        </div>
      </section>

      {/* 2. COLOR PALETTE */}
      <section>
        <h3 className="text-blue-20 mb-6 text-sm tracking-wider uppercase">2. Color Palette</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
          <ColorCard name="Black" bg="bg-black" text="text-white" />
          <ColorCard name="Gray 50" bg="bg-gray-50" text="text-white" />
          <ColorCard name="Gray 30" bg="bg-gray-30" />
          <ColorCard name="Gray 10" bg="bg-gray-10" />
          <ColorCard name="Red 40" bg="bg-red-40" text="text-white" />
          <ColorCard name="Blue 20" bg="bg-blue-20" text="text-white" />
          <ColorCard name="Green 20" bg="bg-green-20" text="text-white" />
          <ColorCard name="Kakao" bg="bg-kakao" text="text-black" />
        </div>
      </section>

      {/* 3. BREAKPOINT TEST */}
      <section>
        <h3 className="text-blue-20 mb-6 text-sm tracking-wider uppercase">3. Breakpoint Test</h3>
        <div className="bg-gray-5 border-gray-20 bg-red-10 md:bg-blue-10 lg:bg-green-10 rounded-xl border p-8 text-center transition-all">
          <div className="mb-2 text-xl font-bold">
            <span className="text-red-40 font-bold md:hidden">Mobile (375px ~)</span>
            <span className="text-blue-20 hidden font-bold md:inline lg:hidden">
              Tablet (744px ~)
            </span>
            <span className="text-green-20 hidden font-bold lg:inline">PC (1440px ~)</span>
          </div>
          <p className="text-gray-40 text-sm">화면 너비를 조절하면 색상과 문구가 바뀝니다.</p>
        </div>
      </section>
    </div>
  );
}

// 컬러 카드를 위한 간단한 서브 컴포넌트
function ColorCard({ name, bg, text = "text-black" }: { name: string; bg: string; text?: string }) {
  return (
    <div className="flex flex-col gap-2">
      <div className={`h-16 w-full rounded-lg shadow-inner ${bg}`} />
      <span
        className={`text-center text-[11px] font-medium uppercase ${text === "text-black" ? "text-gray-50" : ""}`}
      >
        {name}
      </span>
    </div>
  );
}
