import Image from "next/image";

function Logindesign() {
  return (
    <div className="pointer-events-none absolute inset-0">
          <Image
            src="/icon/trees.png"
            alt="트리"
            width={1920}
            height={1080}
            className="absolute inset-0 object-cover w-full h-full"
          />
          <Image
            src="/icon/girl.png"
            alt="소녀"
            width={476}
            height={539}
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 scale-[0.65] animate-animateGirl"
          />
          <Image
            src="/icon/leaf_01.png"
            alt="잎사귀"
            width={79}
            height={38}
            className="absolute left-[20%] animate-animate1"
          />
          <Image
            src="/icon/leaf_01.png"
            alt="잎사귀"
            width={79}
            height={38}
            className="absolute left-[85%] animate-animate2"
          />
          <Image
            src="/icon/leaf_02.png"
            alt="잎사귀"
            width={65}
            height={58}
            className="absolute left-[50%] animate-animate3"
          />
          <Image
            src="/icon/leaf_02.png"
            alt="잎사귀"
            width={65}
            height={58}
            className="absolute left-[90%] animate-animate4"
          />
          <Image
            src="/icon/leaf_03.png"
            alt="잎사귀"
            width={60}
            height={43}
            className="absolute left-[5%] animate-animate5"
          />
          <Image
            src="/icon/leaf_03.png"
            alt="잎사귀"
            width={60}
            height={43}
            className="absolute left-[15%] animate-animate6"
          />
          <Image
            src="/icon/leaf_04.png"
            alt="잎사귀"
            width={68}
            height={40}
            className="absolute left-[70%] animate-animate7"
          />
          <Image
            src="/icon/leaf_04.png"
            alt="잎사귀"
            width={68}
            height={40}
            className="absolute left-[60%] animate-animate8"
          />
        </div>
  )
}

export default Logindesign