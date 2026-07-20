"use client";

import { usePathname, useRouter } from "next/navigation";

import { getLocalizedHref, type Locale } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils";

export type LanguageSwitcherProps = {
  locale: Locale;
  arabicLabel: string;
  englishLabel: string;
  switchToArabicLabel: string;
  switchToEnglishLabel: string;
  className?: string;
  onNavigate?: () => void;
};

export function LanguageSwitcher({
  locale,
  arabicLabel,
  englishLabel,
  switchToArabicLabel,
  switchToEnglishLabel,
  className,
  onNavigate,
}: LanguageSwitcherProps) {
  const pathname = usePathname();
  const router = useRouter();
  const targetLocale: Locale = locale === "ar" ? "en" : "ar";
  const targetHref = getLocalizedHref(targetLocale, pathname);
  const label = targetLocale === "ar" ? arabicLabel : englishLabel;
  const accessibleLabel =
    targetLocale === "ar" ? switchToArabicLabel : switchToEnglishLabel;

  return (
    <button
      type="button"
      aria-label={accessibleLabel}
      title={accessibleLabel}
      onClick={(event) => {
        event.preventDefault();
        document.cookie = `NEXT_LOCALE=${targetLocale}; path=/; max-age=31536000; samesite=lax`;
        router.push(targetHref);
        onNavigate?.();
      }}
      className={cn(
        "micro-pill pointer-events-auto inline-flex min-h-10 cursor-pointer items-center justify-center rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-4 py-2.5 text-small font-semibold leading-none text-text-secondary outline-none hover:border-border-light hover:bg-surface-elevated hover:text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-button rtl:text-ar-small",
        className,
      )}
    >
      <span lang={targetLocale}>{label}</span>
    </button>
  );
}
