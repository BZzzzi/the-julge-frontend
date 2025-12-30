const config = {
  // 한 줄 최대 길이 (100자를 넘으면 자동 줄바꿈)
  printWidth: 100,
  bracketSameLine: false,
  singleAttributePerLine: true,

  // 문자열은 큰따옴표("") 사용 (false → 큰따옴표, true → 작은따옴표)
  singleQuote: false,

  // 문장 끝에 세미콜론(;)을 자동 추가
  semi: true,

  // 객체, 배열, 함수 인자 마지막에도 쉼표(,)를 붙여 diff 최소화
  trailingComma: "all",

  // 들여쓰기 간격 (스페이스 2칸)
  tabWidth: 2,

  // Tailwind 클래스 자동 정렬
  plugins: ["prettier-plugin-tailwindcss"],
};

export default config;
