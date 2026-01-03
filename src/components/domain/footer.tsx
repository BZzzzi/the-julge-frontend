import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <div className="bg-[var(--color-gray-10)]">
      <div className="mx-auto flex h-[126px] max-w-93.75 flex-col-reverse items-start justify-start gap-7.5 pb-4 text-[var(--color-gray-50)] md:max-w-170 md:flex-row md:items-center md:justify-between md:p-0 lg:max-w-241">
        <Link
          href="https://www.google.com/aclk?sa=L&pf=1&ai=DChsSEwjq1suPnuORAxWN4BYFHbLDAEYYACICCAEQABoCdGw&co=1&ase=2&gclid=Cj0KCQiA6sjKBhCSARIsAJvYcpMXSKOEjQnoubp2NPTex83yvuN6HjidBjSux4mpROCBRa1wwRC7_tYaAjSIEALw_wcB&cid=CAASuwHkaHbZwoF7JxvMmUCrWOX_X-QuFaYZYObX2OqaZCsrQgGCfjKFbFZkL59OGRwlCTYy4HsYXeAhVWm3joQHx8JMDjN9Sr_LehSYbVC7hSwjvEAc1_bC_PFO_tyx8Qz1aktL7YWBtnuM0oJahjc6j_PjgmSTRJ01d5115k5cDchpmCUt5p50MUZvyb3qnp6lSmPNTSutu7AohvI2kZgk4fHkhqbhKfdNh5rHA2innz-Ue2pw5KOJnwf3PXLT&cce=2&category=acrcp_v1_32&sig=AOD64_2vS2nM69FZCDzg7pomArbpDK0J_A&q&nis=4&adurl=https://www.codeit.kr/?utm_source%3Dgoogle%26utm_medium%3Dpaid_search%26utm_campaign%3D%25EB%25A9%25A4%25EB%25B2%2584%25EC%258B%25AD_%25EC%2583%2581%25EC%258B%259C%26utm_term%3D%25EC%25BD%2594%25EB%2593%259C%25EC%259E%2587%26utm_content%3D%25EB%25B8%258C%25EB%259E%259C%25EB%2593%259C%26gad_source%3D1%26gad_campaignid%3D18848875162%26gbraid%3D0AAAAAC-_HnuNVlpHWmgxFf6SxMJ5Jkc83%26gclid%3DCj0KCQiA6sjKBhCSARIsAJvYcpMXSKOEjQnoubp2NPTex83yvuN6HjidBjSux4mpROCBRa1wwRC7_tYaAjSIEALw_wcB&ved=2ahUKEwih-cWPnuORAxVRi68BHUoGLI0Q0Qx6BAgLEAE"
          aria-label="코드잇 이동"
        >
          <div>
            <p>©codeit - 2023</p>
          </div>
        </Link>
        <div className="flex items-center justify-between gap-15 md:gap-41.25 lg:gap-76.75">
          <div className="flex items-center justify-center gap-7.5">
            <p>Privacy Policy</p>
            <p>FAQ</p>
          </div>
          <div className="flex items-center justify-center gap-2.5">
            <Link
              href="https://mail.google.com/mail/"
              aria-label="email로 이동"
            >
              <Image
                src="/icon/envelope.svg"
                alt="email"
                width={25}
                height={25}
              />
            </Link>
            <Link
              href="https://www.facebook.com/"
              aria-label="페이스북으로 이동"
            >
              <Image
                src="/icon/facebook.svg"
                alt="facebook"
                width={25}
                height={25}
              />
            </Link>
            <Link
              href="https://www.instagram.com/"
              aria-label="인스타그램으로 이동"
            >
              <Image
                src="/icon/instagram.svg"
                alt="instagram"
                width={25}
                height={25}
              />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Footer;
