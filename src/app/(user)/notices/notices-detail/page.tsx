function NoticesDetail() {
  return (
    <div>
      <div className="w-[964px]">
        <p className="mb-4">최근에 본 공고</p>

        {/* 여기 핵심 */}
        <div className="grid grid-cols-3 gap-3">
          <div className="h-[349px] bg-white text-black">Card1</div>
          <div className="h-[349px] bg-white text-black">Card2</div>
          <div className="h-[349px] bg-white text-black">Card3</div>
          <div className="h-[349px] bg-white text-black">Card4</div>
          <div className="h-[349px] bg-white text-black">Card5</div>
          <div className="h-[349px] bg-white text-black">Card6</div>
          {/* <div className="h-[349px] bg-white text-black">Card7</div> */}
        </div>
      </div>
    </div>
  );
}

export default NoticesDetail;
