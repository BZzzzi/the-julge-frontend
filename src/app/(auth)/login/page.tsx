import LoginForm from "@/components/domain/auth/login-form";
import Image from "next/image";
import Link from "next/link";

export default function Login() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Link href="/">
        <Image src="/icon/logo.svg" alt="로고" width={250} height={50} className="mb-[40px]" />
      </Link>
      <LoginForm />
      <p>
        회원이 아니신가요?{" "}
        <Link href="/signup" className="text-blue-800 underline hover:text-purple-800">
          회원가입 하기
        </Link>
      </p>
    </div>
  );
}
