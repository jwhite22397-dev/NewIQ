import type { Metadata } from "next";
import { LegalPage } from "@/components/legal-page";

export const metadata: Metadata = {
  title: "Privacy",
  description: "How NewIQ handles the age check, quiz, and outbound links.",
};

export default function PrivacyPage() {
  return (
    <LegalPage
      title="Privacy"
      lede="This page describes the privacy design of this version. It is a product disclosure, not a promise that every browser, extension, or future change will behave the same way."
    >
      <h2>No account</h2>
      <p>
        NewIQ does not ask you to create an account. It does not ask for your name, email address,
        phone number, or a profile.
      </p>
      <h2>Quiz answers stay in the browser</h2>
      <p>
        The questions are processed in your browser to produce a recommendation. This version has
        no database and does not intentionally send your individual answers, or the category they
        point to, to a NewIQ server.
      </p>
      <p>
        Refreshing the page clears the quiz. We do not keep a recommendation history.
      </p>
      <h2>Age confirmation</h2>
      <p>
        If you confirm that you are 18 or older, the site stores that confirmation in local storage
        on your device so the question is not repeated every visit. That value is not sent to us.
        If storage is blocked, you can still continue for the current visit.
      </p>
      <h2>Outbound links</h2>
      <p>
        “Show Me” opens a third-party website, currently PornMD. That site has its own privacy
        practices, cookies, and content. NewIQ does not control what it collects or displays.
      </p>
      <h2>Analytics</h2>
      <p>
        This version does not send analytics. If measurement is added later, the intended events
        are quiz started, quiz completed, and external search clicked. Those events are not
        designed to include your answers or the recommended category.
      </p>
    </LegalPage>
  );
}
