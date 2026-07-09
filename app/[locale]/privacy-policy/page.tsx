import type { Metadata } from "next";

import {
  generateLegalMetadata,
  LegalPage,
  type LegalPageProps,
} from "../_legal/LegalPage";

export function generateMetadata(props: LegalPageProps): Promise<Metadata> {
  return generateLegalMetadata("privacyPolicy", props);
}

export default function PrivacyPolicyPage(props: LegalPageProps) {
  return <LegalPage pageKey="privacyPolicy" {...props} />;
}
