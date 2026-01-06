import Logindesign from "@/components/domain/auth/login-design";
import LoginForm from "@/components/domain/auth/login-form";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[url('/icon/bg.jpg')] bg-cover bg-center object-cover">
      <Logindesign />
      <div className="z-30 flex h-full w-[500px] flex-col items-center justify-center rounded-3xl border border-white border-r-white/50 border-b-white/50 bg-white/25 p-15 backdrop-blur-lg">
        <Link href="/">
          <Image
            src="/icon/logo.svg"
            alt="로고"
            width={250}
            height={50}
            className="mb-[40px]"
          />
        </Link>
        <LoginForm />
        <p>
          회원이 아니신가요?{" "}
          <Link
            href="/signup"
            className="text-blue-800 underline hover:text-purple-800"
          >
            회원가입 하기
          </Link>
        </p>
      </div>
    </div>
  );
}
