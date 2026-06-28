import { getTranslations } from "next-intl/server";

export async function Footer() {
  const t = await getTranslations("common");

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex w-full max-w-container flex-col gap-6 px-section-x py-10 sm:flex-row sm:items-end sm:justify-between">
        <div className="flex flex-col gap-2">
          <span className="text-h5 font-semibold leading-snug text-white">
            {t("brand.name")}
          </span>
          <span className="max-w-[34rem] text-small leading-relaxed text-text-secondary">
            {t("brand.tagline")}
          </span>
        </div>
        <p className="text-small leading-relaxed text-text-muted">
          {t("footer.copyright")}
        </p>
      </div>
    </footer>
  );
}
