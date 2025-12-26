"use client";

import { login } from "@/app/(auth)/login/actions";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, null);

  return (
    <form action={formAction}>
      <div>
        <label htmlFor="email">이메일</label>
        <input type="email" name="email" id="email" required />
      </div>

      <div>
        <label htmlFor="password">비밀번호</label>
        <input type="password" name="password" id="password" required className="" />
      </div>

      {state?.error && <p className="text-red-500">{state.error}</p>}

      <button type="submit">로그인</button>
    </form>
  );
}
