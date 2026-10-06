import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Content policy",
  description: "What the NewIQ recommendation taxonomy includes and excludes.",
};

export default function ContentPolicyPage() {
  return (
    <LegalPage
      title="Content policy"
      lede="NewIQ recommends consensual adult pornography involving adults. It does not host that content."
    >
      <h2>What we recommend</h2>
      <p>
        The engine can only choose categories on an explicit allowlist. Each category is a
        consensual adult theme. The quiz infers a match from a few preferences. It does not accept
        a typed search.
      </p>
      <h2>What we exclude</h2>
      <p>The taxonomy excludes illegal and prohibited sexual content, including:</p>
      <ul>
        <li>Anything involving minors, or categories commonly used to seek that material</li>
        <li>Non-consensual sexual activity</li>
        <li>Trafficking or exploitation</li>
        <li>Incest involving minors</li>
        <li>Other illegal material</li>
      </ul>
      <p>
        This version also leaves out family and incest themes and age-play, even as fantasy
        labels. Safety checks reject those slug patterns, so they cannot be turned into an
        outbound link.
      </p>
      <h2>Third-party pages</h2>
      <p>
        When you continue, you leave NewIQ. The other site decides what to show. We do not review
        every video behind a category link, and a link is not an endorsement of every result on
        that page.
      </p>
    </LegalPage>
  );
}
