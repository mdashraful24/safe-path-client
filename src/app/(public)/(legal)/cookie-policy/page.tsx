import { Cookie } from "lucide-react";
import type { Metadata } from "next";
import LegalPage from "@/components/modules/legal/legal-page";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "How SafePath uses cookies and similar technologies, and how you can manage them.",
};

const sections = [
  {
    id: "what-are-cookies",
    title: "What Are Cookies?",
    content: (
      <>
        <p>
          Cookies are small text files stored on your device when you visit a
          website. They help a site remember your preferences, keep you signed
          in, and understand how the service is used. SafePath also uses similar
          technologies such as local storage and pixels, which we refer to
          collectively as &quot;cookies&quot; in this policy.
        </p>
        <p>
          Cookies can be &quot;session&quot; cookies that expire when you close
          your browser, or &quot;persistent&quot; cookies that remain for a set
          period.
        </p>
      </>
    ),
  },
  {
    id: "how-we-use-cookies",
    title: "How We Use Cookies",
    content: (
      <>
        <p>We use cookies for the following purposes:</p>
        <ul>
          <li>
            <strong>Strictly necessary.</strong> To keep you signed in, protect
            against fraud, and ensure core features such as reporting and
            commenting work.
          </li>
          <li>
            <strong>Preferences.</strong> To remember settings such as theme
            choice and display options.
          </li>
          <li>
            <strong>Performance and analytics.</strong> To understand how pages
            are used, diagnose errors, and improve reliability. Where required,
            these cookies are set only with your consent.
          </li>
          <li>
            <strong>Security.</strong> To detect abuse, rate-limit requests, and
            protect accounts and the platform.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "cookie-categories",
    title: "Categories at a Glance",
    content: (
      <ul>
        <li>
          <strong>Essential cookies</strong> — required for authentication,
          security, and basic operation. These cannot be disabled without
          breaking the service.
        </li>
        <li>
          <strong>Functional cookies</strong> — remember your preferences and
          improve your experience.
        </li>
        <li>
          <strong>Analytics cookies</strong> — help us measure usage and improve
          features. Set with consent where required.
        </li>
        <li>
          <strong>Third-party cookies</strong> — set by trusted providers for
          functions such as image delivery, email, and security.
        </li>
      </ul>
    ),
  },
  {
    id: "third-party-cookies",
    title: "Third-Party Cookies",
    content: (
      <p>
        Some cookies may be placed by service providers that help us operate
        SafePath, such as hosting, content delivery, analytics, and security
        partners. These providers are required to handle information in
        accordance with their agreements with us and applicable law. We do not
        allow third parties to use cookies for advertising on SafePath.
      </p>
    ),
  },
  {
    id: "managing-cookies",
    title: "Managing Cookies",
    content: (
      <>
        <p>
          You can control cookies through your browser settings. Most browsers
          let you block or delete cookies, and some allow you to be notified
          before a cookie is set. The exact steps vary by browser.
        </p>
        <p>
          If you disable essential cookies, you may not be able to sign in or
          use key features such as reporting an incident. Disabling other
          cookies may also affect your preferences and experience.
        </p>
      </>
    ),
  },
  {
    id: "do-not-track",
    title: "Do Not Track and Global Privacy Control",
    content: (
      <p>
        Some browsers send &quot;Do Not Track&quot; or Global Privacy Control
        signals. Because there is no consistent industry standard for responding
        to all such signals, SafePath may not respond to every one. Where
        required by law, we honor applicable opt-out preference signals.
      </p>
    ),
  },
  {
    id: "retention",
    title: "How Long Cookies Last",
    content: (
      <p>
        Session cookies are deleted when you close your browser. Persistent
        cookies remain for the period specified by their purpose, which may
        range from a few days to a year. We review cookie durations periodically
        and keep them no longer than necessary.
      </p>
    ),
  },
  {
    id: "updates",
    title: "Updates to This Policy",
    content: (
      <p>
        We may update this Cookie Policy as our services or legal requirements
        change. The date at the top of this page shows when it was last revised.
        We encourage you to review this page periodically.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        If you have questions about our use of cookies, contact the SafePath
        team through the support options available in your account or on the
        platform.
      </p>
    ),
  },
];

export default function CookiePolicyPage() {
  return (
    <LegalPage
      eyebrow="Cookie Policy"
      title="Small files, transparent choices"
      description="Understand how SafePath uses cookies and similar technologies to keep you signed in, remember preferences, and improve the platform."
      lastUpdated="November 6, 2026"
      icon={Cookie}
      accent="amber"
      sections={sections}
    />
  );
}
