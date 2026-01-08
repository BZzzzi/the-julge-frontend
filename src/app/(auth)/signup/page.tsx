import SignupForm from "@/components/domain/auth/sighup-form";
import Image from "next/image";
import Link from "next/link";

export default function Signup() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <Link href="/">
        <Image
          src="/icon/logo.svg"
          alt="로고"
          width={250}
          height={50}
          className="mb-[40px]"
        />
      </Link>
      <SignupForm />
      <p>
        이미 가입하셨나요?{" "}
        <Link
          href="/login"
          className="text-blue-800 underline hover:text-purple-800"
        >
          로그인 하기
        </Link>
      </p>
    </div>
  );
}
