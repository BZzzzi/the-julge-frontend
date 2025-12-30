"use client";

import { signup } from "@/app/(auth)/signup/actions";
import { Button } from "@/components/common/button";
import { Field, FieldInput } from "@/components/common/input";
import { startTransition, useActionState, useState } from "react";

export default function SignupForm() {
  const [state, formAction] = useActionState(signup, null);

  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [passwordCheckError, setPasswordCheckError] = useState("");
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [isPasswordValid, setIsPasswordValid] = useState(false);
  const [isPasswordCheckValid, setIsPasswordCheckValid] = useState(false);

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

  const validatePasswordCheck = (value: string, password: string) => {
    if (!value.trim()) {
      setPasswordCheckError("");
      setIsPasswordCheckValid(false);
      return false;
    }

    if (value !== password) {
      setPasswordCheckError("비밀번호가 일치하지 않습니다.");
      setIsPasswordCheckValid(false);
      return false;
    }

    setPasswordCheckError("");
    setIsPasswordCheckValid(true);
    return true;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const passwordCheck = (form.elements.namedItem("password-check") as HTMLInputElement).value;

    const emailValid = validateEmail(email);
    const passwordValid = validatePassword(password);
    const passwordCheckValid = validatePasswordCheck(passwordCheck, password);

    if (!emailValid || !passwordValid || !passwordCheckValid) return;

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
      <Field
        label="이메일"
        htmlFor="email"
        required
        errorMessage={emailError}
      >
        <FieldInput
          id="email"
          name="email"
          type="email"
          placeholder="이메일 입력"
          size="lg"
          onBlur={(e) => validateEmail(e.target.value)}
        />
      </Field>

      <Field
        label="비밀번호"
        htmlFor="password"
        required
        errorMessage={passwordError}
      >
        <FieldInput
          id="password"
          name="password"
          type="password"
          placeholder="비밀번호 입력"
          size="lg"
          onBlur={(e) => validatePassword(e.target.value)}
        />
      </Field>

      <Field
        label="비밀번호 확인"
        htmlFor="password-check"
        required
        errorMessage={passwordCheckError}
      >
        <FieldInput
          id="password-check"
          name="password-check"
          type="password"
          placeholder="비밀번호 확인"
          size="lg"
          onBlur={(e) => {
            const password =
              (e.currentTarget.form?.elements.namedItem("password") as HTMLInputElement)?.value ||
              "";
            validatePasswordCheck(e.target.value, password);
          }}
        />
      </Field>

      <Field
        label="회원 유형"
        htmlFor="type"
        required
      >
        <div className="flex gap-3">
          {/* 알바님 선택지 */}
          <label className="group flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E5E7EB] py-4 transition-all has-[:checked]:border-[#EA580C] has-[:checked]:text-[#EA580C]">
            <input
              id="type-employee"
              type="radio"
              name="type"
              value="employee"
              defaultChecked
              className="peer hidden" // 실제 라디오 버튼은 숨김
            />
            {/* 커스텀 체크 아이콘 원형 */}
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E5E7EB] text-white transition-all peer-checked:border-[#EA580C] peer-checked:bg-[#EA580C]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-lg font-medium text-[#374151] group-has-[:checked]:text-[#EA580C]">
              알바님
            </span>
          </label>

          {/* 사장님 선택지 */}
          <label className="group flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-[#E5E7EB] py-4 transition-all has-[:checked]:border-[#EA580C] has-[:checked]:text-[#EA580C]">
            <input
              id="type-employer"
              type="radio"
              name="type"
              value="employer"
              className="peer hidden"
            />
            <div className="flex h-5 w-5 items-center justify-center rounded-full border border-[#E5E7EB] text-white transition-all peer-checked:border-[#EA580C] peer-checked:bg-[#EA580C]">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
            </div>
            <span className="text-lg font-medium text-[#374151] group-has-[:checked]:text-[#EA580C]">
              사장님
            </span>
          </label>
        </div>
      </Field>

      {/* TODO: 서버에서 내려주는 에러 메시지 모달 컴포넌트로 만들기 */}
      {state?.error && (
        <div
          className="text-sm text-red-600"
          role="alert"
        >
          {state.error}
        </div>
      )}

      <Button
        variant="primary"
        className="mb-5 w-full"
        type="submit"
        disabled={!isEmailValid || !isPasswordValid || !isPasswordCheckValid}
      >
        가입하기
      </Button>
    </form>
  );
}
