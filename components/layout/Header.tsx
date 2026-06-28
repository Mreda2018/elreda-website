import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import type { Locale } from "@/lib/i18n/routing";

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

function getLocalizedHref(locale: Locale, path: "/" | `/${string}`): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}

export async function Header() {
  const t = await getTranslations("common");
  const locale = (await getLocale()) as Locale;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-[color:var(--glass-border)] bg-black/80 shadow-sm backdrop-blur-[20px]">
      <div className="mx-auto flex min-h-20 w-full max-w-container items-center justify-between gap-8 px-section-x">
        <Link
          href={getLocalizedHref(locale, "/")}
          aria-label={t("navigation.home")}
          className="flex min-w-0 items-center gap-3"
        >
          <div
            aria-hidden="true"
            className="grid size-11 shrink-0 place-items-center rounded-md border border-red-primary/40 bg-red-subtle text-h5 font-bold leading-none text-white"
          >
            {t("brand.shortName").slice(0, 1)}
          </div>
          <div className="flex min-w-0 flex-col gap-0.5">
            <span className="truncate text-h5 font-semibold leading-snug text-white">
              {t("brand.shortName")}
            </span>
            <span className="hidden max-w-64 truncate text-xs leading-relaxed text-text-secondary sm:block">
              {t("brand.tagline")}
            </span>
          </div>
        </Link>

        <nav
          aria-label={t("navigation.primaryLabel")}
          className="hidden items-center gap-1 lg:flex"
        >
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              href={getLocalizedHref(locale, item.path)}
              className="rounded-md px-3 py-2 text-small font-medium leading-none text-text-secondary"
            >
              {t(`navigation.${item.key}`)}
            </Link>
          ))}
        </nav>

        <div className="hidden shrink-0 items-center gap-3 md:flex">
          <div className="rounded-full border border-border-light bg-[color:var(--glass-bg)] px-3 py-2 text-xs font-semibold leading-none text-text-secondary">
            {t("language.ar")} / {t("language.en")}
          </div>
          <Link
            href={getLocalizedHref(locale, "/quote")}
            className="rounded-full bg-red-button px-5 py-3 text-small font-semibold leading-none text-white shadow-red"
          >
            {t("buttons.requestQuote")}
          </Link>
        </div>

        <div className="flex shrink-0 items-center md:hidden">
          <span className="rounded-full border border-border-light bg-[color:var(--glass-bg)] px-3 py-2 text-xs font-semibold leading-none text-text-secondary">
            {t("language.ar")} / {t("language.en")}
          </span>
        </div>
      </div>
    </header>
  );
}
