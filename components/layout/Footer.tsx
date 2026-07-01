import Link from "next/link";
import { getLocale, getTranslations } from "next-intl/server";

import { Button, Container, Heading } from "@/components/ui";
import { renderLocalizedValue } from "@/lib/i18n/renderLocalizedValue";
import type { Locale } from "@/lib/i18n/routing";
import { loadFooterSettings } from "@/lib/sanity/loaders";

type FooterLink = {
  label: string;
  href: string;
};

type SocialPlatform =
  | "instagram"
  | "facebook"
  | "linkedin"
  | "behance"
  | "tiktok"
  | "youtube";

const serviceKeys = [
  { key: "branding", path: "/services/branding" },
  { key: "graphicDesign", path: "/services/graphic-design" },
  { key: "printing", path: "/services/printing" },
  { key: "webDevelopment", path: "/services/web-development" },
  { key: "ecommerce", path: "/services/ecommerce" },
  { key: "businessSystems", path: "/services/erp-systems" },
] as const;

const companyKeys = [
  "about",
  "portfolio",
  "industries",
  "blog",
  "pricing",
  "contact",
] as const;

const legalKeys = [
  "privacyPolicy",
  "terms",
  "cookiesPolicy",
  "accessibility",
] as const;

const socialPlatforms = [
  "instagram",
  "facebook",
  "linkedin",
  "behance",
  "tiktok",
  "youtube",
] as const satisfies readonly SocialPlatform[];

function getLocalizedHref(locale: Locale, path: string): string {
  if (locale === "ar") {
    return path;
  }

  return path === "/" ? "/en" : `/en${path}`;
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-[var(--space-4)]">
      <Heading level={3} className="text-h5" tone="primary">
        {title}
      </Heading>
      <ul className="flex list-none flex-col gap-[var(--space-3)] p-0" role="list">
        {links.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className="text-small text-text-secondary underline-offset-4 hover:text-white hover:underline rtl:text-ar-small"
            >
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function Footer() {
  const t = await getTranslations("common");
  const locale = (await getLocale()) as Locale;
  const settings = await loadFooterSettings(locale);
  const address =
    settings?.address
      ? renderLocalizedValue(settings.address, locale)
      : t("footer.addressFallback");
  const workingHours =
    settings?.workingHours
      ? renderLocalizedValue(settings.workingHours, locale)
      : t("footer.workingHoursFallback");
  const email = settings?.contactEmail ?? t("footer.emailFallback");
  const phone = settings?.contactPhone;
  const whatsapp = settings?.whatsappNumber ?? t("footer.whatsappFallback");
  const socialLinks = socialPlatforms.map((platform) => ({
    platform,
    href: settings?.socialLinks.find((link) => link.platform === platform)?.href,
  }));
  const serviceLinks = serviceKeys.map((item) => ({
    label: t(`footer.serviceLinks.${item.key}`),
    href: getLocalizedHref(locale, item.path),
  }));
  const companyLinks = companyKeys.map((key) => ({
    label: t(`navigation.${key}`),
    href: getLocalizedHref(locale, `/${key}`),
  }));
  const legalLinks = legalKeys.map((key) => ({
    label: t(`footer.${key}`),
    href: getLocalizedHref(locale, `/${key.replace(/[A-Z]/g, "-$&").toLowerCase()}`),
  }));

  return (
    <footer className="border-t border-[color:var(--glass-border)] bg-[color:var(--black)]">
      <Container className="flex flex-col gap-[var(--space-12)] py-[var(--space-16)]">
        <div className="grid gap-[var(--space-12)] lg:grid-cols-[1.1fr_1.4fr]">
          <div className="flex max-w-[var(--container-narrow)] flex-col gap-[var(--space-8)] text-start">
            <div className="flex flex-col gap-[var(--space-3)]">
              <span className="text-h4 font-semibold leading-snug text-white">
                {t("brand.name")}
              </span>
              <p className="text-body text-text-secondary rtl:text-ar-body">
                {t("brand.tagline")}
              </p>
            </div>

            <address className="flex flex-col gap-[var(--space-4)] not-italic">
              <Heading level={3} className="text-h5" tone="primary">
                {t("footer.contactTitle")}
              </Heading>
              <ul
                className="flex list-none flex-col gap-[var(--space-3)] p-0 text-small text-text-secondary rtl:text-ar-small"
                role="list"
              >
                <li>
                  <span className="text-text-muted">{t("footer.emailLabel")}: </span>
                  <a
                    href={`mailto:${email}`}
                    className="underline-offset-4 hover:text-white hover:underline"
                  >
                    {email}
                  </a>
                </li>
                {phone ? (
                  <li>
                    <span className="text-text-muted">
                      {t("footer.phoneLabel")}:{" "}
                    </span>
                    <a
                      href={`tel:${phone}`}
                      className="underline-offset-4 hover:text-white hover:underline"
                    >
                      {phone}
                    </a>
                  </li>
                ) : null}
                <li>
                  <span className="text-text-muted">
                    {t("footer.whatsappLabel")}:{" "}
                  </span>
                  {whatsapp}
                </li>
                <li>
                  <span className="text-text-muted">
                    {t("footer.addressLabel")}:{" "}
                  </span>
                  {address}
                </li>
                <li>
                  <span className="text-text-muted">
                    {t("footer.workingHoursLabel")}:{" "}
                  </span>
                  {workingHours}
                </li>
              </ul>
            </address>
          </div>

          <nav
            aria-label={t("footer.navigationLabel")}
            className="grid gap-[var(--space-10)] sm:grid-cols-3"
          >
            <FooterColumn title={t("footer.servicesTitle")} links={serviceLinks} />
            <FooterColumn title={t("footer.companyTitle")} links={companyLinks} />
            <FooterColumn title={t("footer.legalTitle")} links={legalLinks} />
          </nav>
        </div>

        <div className="flex flex-col gap-[var(--space-8)] border-t border-[color:var(--glass-border)] pt-[var(--space-8)] lg:flex-row lg:items-end lg:justify-between">
          <div className="flex flex-col gap-[var(--space-4)]">
            <Heading level={3} className="text-h5" tone="primary">
              {t("footer.socialTitle")}
            </Heading>
            <ul className="flex list-none flex-wrap gap-[var(--space-3)] p-0" role="list">
              {socialLinks.map((link) => (
                <li key={link.platform}>
                  {link.href ? (
                    <a
                      href={link.href}
                      className="inline-flex rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-4 py-2 text-small font-medium text-text-secondary underline-offset-4 hover:text-white hover:underline rtl:text-ar-small"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {t(`footer.social.${link.platform}`)}
                    </a>
                  ) : (
                    <span
                      aria-disabled="true"
                      className="inline-flex rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-4 py-2 text-small font-medium text-text-muted rtl:text-ar-small"
                    >
                      {t(`footer.social.${link.platform}`)}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col items-start gap-[var(--space-4)] text-start lg:items-end lg:text-end">
            <Button
              variant="subtle"
              size="sm"
              aria-disabled="true"
              tabIndex={-1}
              className="pointer-events-none opacity-50"
            >
              {t("footer.cookiePreferences")}
            </Button>
            <p className="text-small text-text-muted rtl:text-ar-small">
              {t("footer.copyright")}
            </p>
          </div>
        </div>
      </Container>
    </footer>
  );
}
