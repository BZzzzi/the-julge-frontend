"use client";

import { login } from "@/app/(auth)/login/actions";
import { useActionState } from "react";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, null);

  return (
    <form action={formAction} className="mx-auto w-full max-w-md space-y-6">
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-black">
          이메일
        </label>
        <input
          type="email"
          name="email"
          id="email"
          required
          className="border-gray-20 placeholder:text-gray-40 focus:border-blue-20 focus:ring-blue-20/20 w-full rounded-lg border px-4 py-3 text-base text-black focus:ring-2 focus:outline-none"
          placeholder="이메일을 입력하세요"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-black">
          비밀번호
        </label>
        <input
          type="password"
          name="password"
          id="password"
          required
          className="border-gray-20 placeholder:text-gray-40 focus:border-blue-20 focus:ring-blue-20/20 w-full rounded-lg border px-4 py-3 text-base text-black focus:ring-2 focus:outline-none"
          placeholder="비밀번호를 입력하세요"
        />
      </div>

      {state?.error && (
        <div className="bg-red-10 rounded-lg px-4 py-3">
          <p className="text-red-40 text-sm">{state.error}</p>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-20 hover:bg-blue-20/90 active:bg-blue-20/80 w-full rounded-lg px-6 py-3 text-center font-medium text-white transition-colors"
      >
        로그인
      </button>
    </form>
  );
}
