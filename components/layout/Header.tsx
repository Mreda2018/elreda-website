import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { HeaderNavigation } from "@/components/layout/HeaderNavigation";
import { LanguageSwitcher } from "@/components/layout/LanguageSwitcher";
import { MobileMenu } from "@/components/layout/MobileMenu";
import { buttonVariants } from "@/components/ui";
import { getLocalizedHref, type Locale } from "@/lib/i18n/routing";

type NavigationItem = {
  key: "services" | "portfolio" | "about" | "industries" | "blog" | "pricing";
  path: `/${string}`;
};

const navigationItems = [
  { key: "services", path: "/services" },
  { key: "portfolio", path: "/portfolio" },
  { key: "about", path: "/about" },
  { key: "industries", path: "/industries" },
  { key: "blog", path: "/blog" },
  { key: "pricing", path: "/pricing" },
] as const satisfies readonly NavigationItem[];

export async function Header() {
  const t = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const localizedNavigationItems = navigationItems.map((item) => ({
    label: t(`navigation.${item.key}`),
    href: getLocalizedHref(locale, item.path),
  }));

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[color:var(--glass-border)] bg-[color:color-mix(in_srgb,var(--black)_86%,transparent)] shadow-lg backdrop-blur-[20px]">
      <div className="mx-auto flex min-h-20 w-full max-w-container items-center justify-between gap-[var(--space-4)] px-section-x lg:min-h-24 lg:gap-[var(--space-8)]">
        <Link
          href={getLocalizedHref(locale, "/")}
          aria-label={t("navigation.home")}
          className="flex min-w-0 items-center gap-[var(--space-3)] rounded-md outline-none focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-button"
        >
          <div
            aria-hidden="true"
            className="grid size-10 shrink-0 place-items-center rounded-md border border-red-primary/40 bg-[image:var(--gradient-subtle)] text-h5 font-bold leading-none text-white shadow-md sm:size-12"
          >
            {t("brand.shortName").slice(0, 1)}
          </div>
          <div className="flex min-w-0 flex-col gap-[var(--space-1)]">
            <span className="truncate text-h5 font-semibold leading-tight text-white">
              {t("brand.shortName")}
            </span>
            <span className="hidden max-w-72 truncate text-small leading-relaxed text-text-secondary sm:block rtl:text-ar-small">
              {t("brand.tagline")}
            </span>
          </div>
        </Link>

        <HeaderNavigation
          ariaLabel={t("navigation.primaryLabel")}
          items={localizedNavigationItems}
        />

        <div className="hidden shrink-0 items-center gap-[var(--space-3)] lg:flex">
          <LanguageSwitcher
            locale={locale}
            arabicLabel={t("language.ar")}
            englishLabel={t("language.en")}
            switchToArabicLabel={t("language.switchToArabic")}
            switchToEnglishLabel={t("language.switchToEnglish")}
          />
          <Link
            href={getLocalizedHref(locale, "/quote")}
            className={buttonVariants({ size: "sm" })}
          >
            {t("buttons.requestQuote")}
          </Link>
        </div>

        <MobileMenu
          locale={locale}
          ariaLabel={t("navigation.primaryLabel")}
          openLabel={t("navigation.openMenu")}
          closeLabel={t("navigation.closeMenu")}
          items={localizedNavigationItems}
          quoteLabel={t("buttons.requestQuote")}
          quoteHref={getLocalizedHref(locale, "/quote")}
          arabicLabel={t("language.ar")}
          englishLabel={t("language.en")}
          switchToArabicLabel={t("language.switchToArabic")}
          switchToEnglishLabel={t("language.switchToEnglish")}
        />
      </div>
    </header>
  );
}
