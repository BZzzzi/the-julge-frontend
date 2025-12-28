
export default function Home() {
  return (
    <div className="space-y-12 p-10">
      {/* 1. 타이포그래피 테스트 (h1~h6 및 폰트 두께) */}
      <section className="space-y-6">
        <h2 className="text-gray-40 border-b pb-2 text-sm tracking-widest uppercase">
          1. Typography & Weights
        </h2>
        <div className="space-y-4">
          <h1 className="text-4xl font-bold">h1: 스포카 한 산스 Neo Bold (700)</h1>
          <h2 className="text-3xl font-medium">h2: 스포카 한 산스 Neo Medium (500)</h2>
          <p className="font-regular text-xl">p: 스포카 한 산스 Neo Regular (400)</p>
          <p className="text-lg font-light text-gray-50">p: 스포카 한 산스 Neo Light (300)</p>
          <p className="text-gray-40 text-base font-thin">p: 스포카 한 산스 Neo Thin (100)</p>
        </div>
      </section>

      <hr className="border-gray-20" />

      {/* 2. 컬러 팔레트 테스트 */}
      <section className="space-y-6">
        <h2 className="text-gray-40 border-b pb-2 text-sm tracking-widest uppercase">
          2. Color Palette
        </h2>

        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {/* Gray Scale */}
          <div className="space-y-2">
            <p className="text-sm font-bold">Gray Scale</p>
            <div className="flex h-10 items-center bg-black px-3 text-xs text-white">Black</div>
            <div className="flex h-10 items-center bg-gray-50 px-3 text-xs">Gray 50</div>
            <div className="bg-gray-30 flex h-10 items-center px-3 text-xs">Gray 30</div>
            <div className="bg-gray-10 flex h-10 items-center px-3 text-xs">Gray 10</div>
            <div className="bg-gray-5 border-gray-20 flex h-10 items-center border px-3 text-xs text-black">
              Gray 5
            </div>
          </div>

          {/* Red Scale */}
          <div className="space-y-2">
            <p className="text-sm font-bold">Red Scale</p>
            <div className="bg-red-40 flex h-10 items-center px-3 text-xs text-white">Red 40</div>
            <div className="bg-red-30 flex h-10 items-center px-3 text-xs text-white">Red 30</div>
            <div className="bg-red-20 flex h-10 items-center px-3 text-xs">Red 20</div>
            <div className="bg-red-10 text-red-40 flex h-10 items-center px-3 text-xs">Red 10</div>
          </div>

          {/* Blue & Green */}
          <div className="space-y-2">
            <p className="text-sm font-bold">Points</p>
            <div className="bg-blue-20 flex h-10 items-center px-3 text-xs text-white">Blue 20</div>
            <div className="bg-blue-10 text-blue-20 flex h-10 items-center px-3 text-xs">
              Blue 10
            </div>
            <div className="bg-green-20 flex h-10 items-center px-3 text-xs text-white">
              Green 20
            </div>
            <div className="bg-green-10 text-green-20 flex h-10 items-center px-3 text-xs">
              Green 10
            </div>
          </div>

          {/* Brand */}
          <div className="space-y-2">
            <p className="text-sm font-bold">Brand</p>
            <div className="bg-kakao flex h-10 items-center px-3 text-xs font-bold text-black">
              Kakao Yellow
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
