import { getTranslations } from "next-intl/server";

export async function Header() {
  const t = await getTranslations("common.brand");

  return (
    <header className="border-b border-border bg-black/95">
      <div className="mx-auto flex min-h-20 w-full max-w-container items-center px-section-x">
        <div className="flex flex-col gap-1">
          <span className="text-h5 font-semibold leading-snug text-white">
            {t("name")}
          </span>
          <span className="max-w-[34rem] text-small leading-relaxed text-text-secondary">
            {t("tagline")}
          </span>
        </div>
      </div>
    </header>
  );
}
