import UserMenu from "@/components/common/layouts/header-user-menu";
import SearchInput from "@/components/common/layouts/search-input";
import Image from "next/image";
import Link from "next/link";

type HeaderProps = {
  showSearchInput?: boolean;
};

export default function Header({ showSearchInput = true }: HeaderProps) {
  return (
    <div className="bg-white">
      <div className="m-auto flex w-[335px] py-4 md:h-17.5 md:w-[680px] md:items-center lg:w-[1024px]">
        {/* PC, Tablet */}
        <div className="hidden w-full items-center justify-between md:flex">
          <div className="flex gap-8 lg:gap-10">
            <Link
              href="/"
              className="flex items-center"
            >
              <Image
                src="/icon/logo.svg"
                alt="로고"
                width={110}
                height={40}
              />
            </Link>
            {showSearchInput && <SearchInput className="w-85 lg:w-110" />}
          </div>
          <UserMenu />
        </div>

        {/* Mobile */}
        <div className="flex w-full flex-col gap-4 md:hidden">
          <div className="flex justify-between">
            <Link
              href="/"
              className="flex items-center"
            >
              <Image
                src="/icon/logo.svg"
                alt="로고"
                width={110}
                height={40}
              />
            </Link>
            <UserMenu />
          </div>
          {showSearchInput && <SearchInput className="w-full" />}
        </div>
      </div>
    </div>
  );
}
