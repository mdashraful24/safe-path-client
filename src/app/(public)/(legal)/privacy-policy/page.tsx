import { ShieldCheck } from "lucide-react";
import type { Metadata } from "next";
import LegalPage from "@/components/modules/legal/legal-page";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How SafePath collects, uses, shares, and protects your personal information.",
};

const sections = [
  {
    id: "overview",
    title: "Overview",
    content: (
      <>
        <p>
          SafePath is a community safety platform that helps people report,
          review, and follow verified local incidents. This Privacy Policy
          explains what information we collect, why we collect it, how it is
          used, and the choices you have.
        </p>
        <p>
          By using SafePath, you agree to the practices described here. If you
          do not agree, please do not use the platform.
        </p>
      </>
    ),
  },
  {
    id: "information-we-collect",
    title: "Information We Collect",
    content: (
      <>
        <p>We collect information in three main ways:</p>
        <ul>
          <li>
            <strong>Information you provide.</strong> Account details such as
            your name, email address, password, profile photo, and any incident
            reports, comments, or messages you submit.
          </li>
          <li>
            <strong>Location and report data.</strong> When you report an
            incident, you may provide an area, address, description, category,
            date, and optional coordinates. Precise coordinates are voluntary.
          </li>
          <li>
            <strong>Technical information.</strong> Device type, browser, IP
            address, approximate region, pages viewed, and timestamps, collected
            automatically to keep the service secure and reliable.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "how-we-use-information",
    title: "How We Use Your Information",
    content: (
      <>
        <p>We use your information to:</p>
        <ul>
          <li>Create and secure your account and authenticate sign-ins.</li>
          <li>
            Publish, review, moderate, and display incident reports and
            comments.
          </li>
          <li>
            Verify reports, prevent abuse, and protect the integrity of the
            public feed.
          </li>
          <li>
            Send service messages, security alerts, and responses to your
            requests.
          </li>
          <li>Analyze usage and improve features, performance, and safety.</li>
          <li>
            Comply with legal obligations and enforce our Terms of Service.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "legal-bases",
    title: "Legal Bases for Processing",
    content: (
      <>
        <p>
          Where required by law, we process personal information based on one or
          more of the following: your consent, the performance of a contract
          with you, our legitimate interests in operating a safe and reliable
          platform, and compliance with legal obligations.
        </p>
        <p>
          You may withdraw consent at any time where processing is based on
          consent, without affecting processing that already took place.
        </p>
      </>
    ),
  },
  {
    id: "how-we-share",
    title: "How We Share Information",
    content: (
      <>
        <p>
          <strong>We do not sell your personal information.</strong> We share
          information only in the following circumstances:
        </p>
        <ul>
          <li>
            <strong>Public reports.</strong> Approved incident reports and
            comments are visible to other users and visitors. Your display name
            and profile photo may appear with your contributions.
          </li>
          <li>
            <strong>Moderators and administrators.</strong> Authorized staff
            review reports and account details to verify content and enforce our
            rules.
          </li>
          <li>
            <strong>Service providers.</strong> Trusted vendors such as hosting,
            image storage, email, and analytics providers process data on our
            behalf under contractual safeguards.
          </li>
          <li>
            <strong>Legal and safety.</strong> We may disclose information when
            required by law or when we believe in good faith that disclosure is
            necessary to prevent harm, investigate fraud, or protect rights and
            safety.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "location-and-public-reports",
    title: "Location Data and Public Reports",
    content: (
      <>
        <p>
          Incident reports are designed to be shared with the community. Please
          avoid including sensitive personal details, names of uninvolved
          individuals, or precise information about your home or workplace
          unless it is necessary for the report.
        </p>
        <p>
          You control whether to include coordinates or an exact address. You
          can report an approximate area instead. Once a report is published, it
          may be copied or redistributed by others.
        </p>
      </>
    ),
  },
  {
    id: "data-retention",
    title: "Data Retention",
    content: (
      <>
        <p>
          We keep personal information only as long as necessary for the
          purposes described in this policy, including maintaining your account,
          preserving the integrity of incident records, resolving disputes, and
          meeting legal requirements.
        </p>
        <p>
          When you delete your account, we remove or anonymize associated
          personal information, except where retention is required by law or
          necessary for safety and fraud prevention. Some published reports may
          remain in an anonymized form.
        </p>
      </>
    ),
  },
  {
    id: "security",
    title: "Security",
    content: (
      <>
        <p>
          We use administrative, technical, and organizational safeguards to
          protect your information, including encryption in transit, access
          controls, and review of our systems. No method of transmission or
          storage is completely secure, so we cannot guarantee absolute
          security.
        </p>
        <p>
          Keep your login credentials confidential and notify us promptly if you
          believe your account has been compromised.
        </p>
      </>
    ),
  },
  {
    id: "your-rights",
    title: "Your Rights and Choices",
    content: (
      <>
        <p>
          Depending on where you live, you may have the right to access,
          correct, delete, or export your personal information, object to or
          restrict certain processing, and withdraw consent. You can update your
          profile from your account settings and request account deletion
          through the platform.
        </p>
        <p>
          We will respond to verified requests in accordance with applicable
          law. We may retain limited information where required for legal or
          safety reasons.
        </p>
      </>
    ),
  },
  {
    id: "children",
    title: "Children's Privacy",
    content: (
      <p>
        SafePath is not intended for children under the minimum age required by
        the laws of their jurisdiction. We do not knowingly collect personal
        information from children. If we learn that a child has provided
        personal information, we will take reasonable steps to delete it.
      </p>
    ),
  },
  {
    id: "international-transfers",
    title: "International Transfers",
    content: (
      <p>
        We may process and store information in countries other than your own.
        When we transfer personal information across borders, we use appropriate
        safeguards designed to protect it consistent with this policy and
        applicable law.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to This Policy",
    content: (
      <p>
        We may update this Privacy Policy from time to time. When we make
        material changes, we will update the date above and, where appropriate,
        provide additional notice. Continued use of SafePath after an update
        means you accept the revised policy.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact Us",
    content: (
      <p>
        If you have questions about this Privacy Policy or how your information
        is handled, contact the SafePath team through the support options
        available in your account or on the platform.
      </p>
    ),
  },
];

export default function PrivacyPolicyPage() {
  return (
    <LegalPage
      eyebrow="Privacy Policy"
      title="Your privacy, clearly explained"
      description="Learn what information SafePath collects, how it is used to keep the community safe, and the controls you have over your data."
      lastUpdated="November 6, 2026"
      icon={ShieldCheck}
      accent="emerald"
      sections={sections}
    />
  );
}
