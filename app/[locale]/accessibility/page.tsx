import type { Metadata } from "next";

import {
  generateLegalMetadata,
  LegalPage,
  type LegalPageProps,
} from "../_legal/LegalPage";

export function generateMetadata(props: LegalPageProps): Promise<Metadata> {
  return generateLegalMetadata("accessibility", props);
}

export default function AccessibilityPage(props: LegalPageProps) {
  return <LegalPage pageKey="accessibility" {...props} />;
}
