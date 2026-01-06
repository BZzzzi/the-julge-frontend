import Logindesign from "@/components/domain/auth/login-design";
import LoginForm from "@/components/domain/auth/login-form";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
      <div className="bg-[url('/icon/bg.jpg')] bg-cover bg-center object-cover relative w-full min-h-screen overflow-hidden flex items-center justify-center">
      <Logindesign />
      <div className="flex h-full flex-col items-center justify-center z-30 w-[500px] bg-white/25 p-15 rounded-3xl backdrop-blur-lg border border-white border-b-white/50 border-r-white/50">
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
