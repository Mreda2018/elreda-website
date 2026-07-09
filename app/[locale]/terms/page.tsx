import type { Metadata } from "next";

import {
  generateLegalMetadata,
  LegalPage,
  type LegalPageProps,
} from "../_legal/LegalPage";

export function generateMetadata(props: LegalPageProps): Promise<Metadata> {
  return generateLegalMetadata("terms", props);
}

export default function TermsPage(props: LegalPageProps) {
  return <LegalPage pageKey="terms" {...props} />;
}
