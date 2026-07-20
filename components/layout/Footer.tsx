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
  { key: "branding", path: "/services" },
  { key: "graphicDesign", path: "/services" },
  { key: "printing", path: "/services" },
  { key: "webDevelopment", path: "/services" },
  { key: "ecommerce", path: "/services" },
  { key: "businessSystems", path: "/services" },
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

function getWhatsAppHref(value: string): string {
  const number = value.replace(/\D/g, "");

  return `https://wa.me/${number}`;
}

function FooterColumn({ title, links }: { title: string; links: FooterLink[] }) {
  return (
    <div className="flex flex-col gap-[var(--space-5)]">
      <Heading level={3} className="text-h5" tone="primary">
        {title}
      </Heading>
      <ul className="flex list-none flex-col gap-[var(--space-3)] p-0" role="list">
        {links.map((link) => (
          <li key={`${link.href}-${link.label}`}>
            <Link
              href={link.href}
              className="micro-link inline-flex rounded-sm text-small text-text-secondary underline-offset-4 outline-none hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-button rtl:text-ar-small"
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
  const whatsappHref = getWhatsAppHref(whatsapp);
  const socialLinks = socialPlatforms
    .map((platform) => ({
      platform,
      href: settings?.socialLinks.find((link) => link.platform === platform)?.href,
    }))
    .filter((link): link is { platform: SocialPlatform; href: string } =>
      Boolean(link.href),
    );
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
      <Container className="flex flex-col gap-[var(--space-12)] py-[var(--space-16)] md:gap-[var(--space-16)] md:py-[var(--space-20)]">
        <div className="grid gap-[var(--space-10)] md:gap-[var(--space-12)] lg:grid-cols-[1.05fr_1.45fr]">
          <div className="flex max-w-[var(--container-narrow)] flex-col gap-[var(--space-8)] text-start md:gap-[var(--space-10)]">
            <div className="flex flex-col gap-[var(--space-4)] border-s border-red-primary/50 ps-[var(--space-5)]">
              <span className="text-h3 font-semibold leading-tight text-white rtl:text-ar-h3">
                {t("brand.name")}
              </span>
              <p className="max-w-xl text-body-lg text-text-secondary rtl:text-ar-body-lg">
                {t("brand.tagline")}
              </p>
            </div>

            <address className="flex flex-col gap-[var(--space-5)] not-italic">
              <Heading level={3} className="text-h5" tone="primary">
                {t("footer.contactTitle")}
              </Heading>
              <ul
                className="grid list-none gap-[var(--space-3)] p-0 text-small text-text-secondary rtl:text-ar-small"
                role="list"
              >
                <li className="grid gap-[var(--space-1)]">
                  <span className="text-text-muted">{t("footer.emailLabel")}</span>
                  <a
                    href={`mailto:${email}`}
                    className="micro-link w-fit rounded-sm text-text-primary underline-offset-4 outline-none hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-button"
                  >
                    {email}
                  </a>
                </li>
                {phone ? (
                  <li className="grid gap-[var(--space-1)]">
                    <span className="text-text-muted">{t("footer.phoneLabel")}</span>
                    <a
                      href={`tel:${phone}`}
                      className="micro-link w-fit rounded-sm text-text-primary underline-offset-4 outline-none hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-button"
                    >
                      {phone}
                    </a>
                  </li>
                ) : null}
                <li className="grid gap-[var(--space-1)]">
                  <span className="text-text-muted">{t("footer.whatsappLabel")}</span>
                  <a
                    href={whatsappHref}
                    aria-label={`${t("footer.whatsappLabel")}: ${whatsapp}`}
                    className="micro-link w-fit rounded-sm text-text-primary underline-offset-4 outline-none hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-button"
                    rel="noreferrer"
                    target="_blank"
                  >
                    {whatsapp}
                  </a>
                </li>
                <li className="grid gap-[var(--space-1)]">
                  <span className="text-text-muted">{t("footer.addressLabel")}</span>
                  <span>{address}</span>
                </li>
                <li className="grid gap-[var(--space-1)]">
                  <span className="text-text-muted">
                    {t("footer.workingHoursLabel")}
                  </span>
                  <span>{workingHours}</span>
                </li>
              </ul>
            </address>
          </div>

          <nav
            aria-label={t("footer.navigationLabel")}
            className="grid gap-[var(--space-8)] rounded-md border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] p-[var(--space-6)] md:grid-cols-3 md:gap-[var(--space-10)] md:p-[var(--space-8)]"
          >
            <FooterColumn title={t("footer.servicesTitle")} links={serviceLinks} />
            <FooterColumn title={t("footer.companyTitle")} links={companyLinks} />
            <FooterColumn title={t("footer.legalTitle")} links={legalLinks} />
          </nav>
        </div>

        <div className="flex flex-col gap-[var(--space-8)] border-t border-[color:var(--glass-border)] pt-[var(--space-8)] lg:flex-row lg:items-end lg:justify-between">
          {socialLinks.length > 0 ? (
            <div className="flex flex-col gap-[var(--space-5)]">
              <Heading level={3} className="text-h5" tone="primary">
                {t("footer.socialTitle")}
              </Heading>
              <ul className="flex list-none flex-wrap gap-[var(--space-3)] p-0" role="list">
                {socialLinks.map((link) => (
                  <li key={link.platform}>
                    <a
                      href={link.href}
                      className="micro-pill inline-flex rounded-full border border-[color:var(--glass-border)] bg-[color:var(--glass-bg)] px-4 py-2.5 text-small font-medium text-text-secondary underline-offset-4 outline-none hover:border-border-light hover:text-white hover:underline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-red-button rtl:text-ar-small"
                      rel="noreferrer"
                      target="_blank"
                    >
                      {t(`footer.social.${link.platform}`)}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          <div className="flex flex-col items-start gap-[var(--space-4)] text-start lg:items-end lg:text-end">
            <Button
              variant="subtle"
              size="sm"
              className="cky-banner-element"
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
