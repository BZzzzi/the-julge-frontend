import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <div className="bg-[var(--color-gray-10)]">
      <div className="max-w-93.75 h-[126px] mx-auto text-[var(--color-gray-50)] pb-4 flex items-start justify-start flex-col-reverse gap-7.5 md:max-w-170 md:flex-row md:p-0 md:items-center md:justify-between lg:max-w-241">
        <div>
          <p>©codeit - 2023</p>
        </div>
        <div className="flex items-center justify-between gap-15  md:gap-41.25 lg:gap-76.75">
          <div className="flex items-center justify-center gap-7.5">
            <p>Privacy Policy</p>
            <p>FAQ</p>
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <Link href="/" aria-label="email로 이동">
              <Image
                src="/icon/envelope.svg"
                alt="email"
                width={25}
                height={25}
              />
            </Link>
            <Link href="/" aria-label="페이스북으로 이동">
              <Image
                src="/icon/facebook.svg"
                alt="facebook"
                width={25}
                height={25}
              />
            </Link>
            <Link href="/" aria-label="인스타그램으로 이동">
              <Image
                src="/icon/instagram.svg"
                alt="instagram"
                width={25}
                height={25}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Footer