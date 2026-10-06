import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Terms",
  description: "Terms for using the NewIQ recommendation site.",
};

export default function TermsPage() {
  return (
    <LegalPage
      title="Terms"
      lede="These terms describe how this version of NewIQ is meant to be used. Have them reviewed by counsel before a public launch."
    >
      <h2>Adults only</h2>
      <p>
        NewIQ is for adults 18 and older. If you are under 18, leave the site. The age question is
        a confirmation, not an identity check.
      </p>
      <h2>What the service is</h2>
      <p>
        NewIQ is a recommendation layer. It does not host, upload, or stream videos or images. A
        result links to a third-party website that you choose to open.
      </p>
      <h2>No guarantee about third parties</h2>
      <p>
        Category pages on other sites can change, disappear, or show material we do not control.
        A recommendation is a best effort from the on-device quiz, not a promise about what the
        other site will display.
      </p>
      <h2>Acceptable use</h2>
      <p>
        Do not use NewIQ to look for illegal content. There is no free-text search, and the
        recommendation list only includes categories on our allowlist.
      </p>
      <h2>Changes</h2>
      <p>
        Questions, categories, and the outbound provider can change. Continued use of the site is
        use of the version you are currently visiting.
      </p>
    </LegalPage>
  );
}
