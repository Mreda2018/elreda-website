import type { Metadata } from "next";

import {
  generateLegalMetadata,
  LegalPage,
  type LegalPageProps,
} from "../_legal/LegalPage";

export function generateMetadata(props: LegalPageProps): Promise<Metadata> {
  return generateLegalMetadata("cookiesPolicy", props);
}

export default function CookiesPolicyPage(props: LegalPageProps) {
  return <LegalPage pageKey="cookiesPolicy" {...props} />;
}
