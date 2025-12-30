"use client";

import { login } from "@/app/(auth)/login/actions";
import { Button } from "@/components/common/button";
import { Field, FieldInput } from "@/components/common/input";
import { startTransition, useActionState, useState } from "react";

export default function LoginForm() {
  const [state, formAction] = useActionState(login, null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);

  const validateEmail = (value: string) => {
    if (!value.trim()) {
      setEmailError("");
      setIsEmailValid(false);
      return false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim())) {
      setEmailError("이메일 형식으로 작성해 주세요.");
      setIsEmailValid(false);
      return false;
    }

    setEmailError("");
    setIsEmailValid(true);
    return true;
  };

  const validatePassword = (value: string) => {
    if (!value.trim()) {
      setPasswordError("");
      setIsPasswordValid(false);
      return false;
    }

    if (value.trim().length < 8) {
      setPasswordError("8자 이상 입력해 주세요.");
      setIsPasswordValid(false);
      return false;
    }

    setPasswordError("");
    setIsPasswordValid(true);
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);

    if (!emailValid || !passwordValid) return;

    startTransition(() => {
      formAction(new FormData(form));
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="mx-auto w-full max-w-md space-y-7 sm:px-[13px] md:px-0"
    >
      <Field label="이메일" htmlFor="email" required errorMessage={emailError}>
        <FieldInput
          id="email"
          name="email"
          type="email"
          placeholder="이메일 입력"
          size="lg"
          onBlur={(e) => validateEmail(e.target.value)}
        />
      </Field>

      <Field label="비밀번호" htmlFor="password" required errorMessage={passwordError}>
        <FieldInput
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호 입력"
          size="lg"
          onBlur={(e) => validatePassword(e.target.value)}
        />
      </Field>

      {/* TODO: 서버에서 내려주는 에러 메시지 모달 컴포넌트로 만들기 */}
      {state?.error && (
        <div className="text-sm text-red-600" role="alert">
          {state.error}
        </div>
      )}

      <Button
        variant="primary"
        className="mb-5 w-full"
        type="submit"
        disabled={!isEmailValid || !isPasswordValid}
      >
        로그인하기
      </Button>
    </form>
  );
}
