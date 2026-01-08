import Image from "next/image";

function LoginDesign() {
  return (
    <div className="pointer-events-none absolute inset-0">
      <Image
        src="/icon/trees.png"
        alt="트리"
        width={1920}
        height={1080}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <Image
        src="/icon/girl.png"
        alt="소녀"
        width={476}
        height={539}
        className="animate-animateGirl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[0.65] transform"
      />
      <Image
        src="/icon/leaf_01.png"
        alt="잎사귀"
        width={79}
        height={38}
        className="animate-animate1 absolute left-[20%]"
      />
      <Image
        src="/icon/leaf_01.png"
        alt="잎사귀"
        width={79}
        height={38}
        className="animate-animate2 absolute left-[85%]"
      />
      <Image
        src="/icon/leaf_02.png"
        alt="잎사귀"
        width={65}
        height={58}
        className="animate-animate3 absolute left-[50%]"
      />
      <Image
        src="/icon/leaf_02.png"
        alt="잎사귀"
        width={65}
        height={58}
        className="animate-animate4 absolute left-[90%]"
      />
      <Image
        src="/icon/leaf_03.png"
        alt="잎사귀"
        width={60}
        height={43}
        className="animate-animate5 absolute left-[5%]"
      />
      <Image
        src="/icon/leaf_03.png"
        alt="잎사귀"
        width={60}
        height={43}
        className="animate-animate6 absolute left-[15%]"
      />
      <Image
        src="/icon/leaf_04.png"
        alt="잎사귀"
        width={68}
        height={40}
        className="animate-animate7 absolute left-[70%]"
      />
      <Image
        src="/icon/leaf_04.png"
        alt="잎사귀"
        width={68}
        height={40}
        className="animate-animate8 absolute left-[60%]"
      />
    </div>
  );
}

export default LoginDesign;
