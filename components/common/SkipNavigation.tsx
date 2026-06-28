import { getTranslations } from "next-intl/server";

const MAIN_CONTENT_ID = "main-content";

export async function SkipNavigation() {
  const t = await getTranslations("common.accessibility");

  return (
    <a
      href={`#${MAIN_CONTENT_ID}`}
      className="sr-only focus:not-sr-only focus:fixed focus:start-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-red-button focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:leading-snug focus:text-white focus:shadow-lg focus:outline-2 focus:outline-offset-2 focus:outline-white"
    >
      {t("skipToMainContent")}
    </a>
  );
}

export { MAIN_CONTENT_ID };
