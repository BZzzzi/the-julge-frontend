import LoginForm from "@/components/domain/auth/login-form";
import Image from "next/image";

export default function Login() {
  return (
    <div>
      <Image src="/icon/logo.svg" alt="로고" width={250} height={50} />
      <LoginForm />
    </div>
  );
}
