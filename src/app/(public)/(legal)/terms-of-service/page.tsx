import { ScrollText } from "lucide-react";
import type { Metadata } from "next";
import LegalPage from "@/components/modules/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms of Service",
  description:
    "The rules, responsibilities, and limitations that apply when you use SafePath.",
};

const sections = [
  {
    id: "acceptance",
    title: "Acceptance of These Terms",
    content: (
      <>
        <p>
          These Terms of Service govern your access to and use of SafePath. By
          creating an account, browsing the platform, or submitting content, you
          agree to these Terms. If you do not agree, do not use SafePath.
        </p>
        <p>
          If you use SafePath on behalf of an organization, you represent that
          you have authority to bind that organization to these Terms.
        </p>
      </>
    ),
  },
  {
    id: "eligibility-and-accounts",
    title: "Eligibility and Accounts",
    content: (
      <>
        <p>
          You must be old enough to consent to data processing in your
          jurisdiction and meet any minimum age required by local law. You are
          responsible for providing accurate registration information and for
          keeping your credentials secure.
        </p>
        <ul>
          <li>Do not share your account or password with others.</li>
          <li>
            Do not create accounts to evade restrictions or impersonate others.
          </li>
          <li>Notify us promptly if you suspect unauthorized access.</li>
        </ul>
      </>
    ),
  },
  {
    id: "not-emergency-services",
    title: "Community Platform, Not Emergency Services",
    content: (
      <>
        <p>
          SafePath is a community reporting and awareness platform. It is not a
          substitute for emergency services, law enforcement, medical care, or
          professional advice.
        </p>
        <p>
          <strong>
            If you or someone else is in immediate danger, contact your local
            emergency number right away.
          </strong>{" "}
          Do not rely on SafePath for urgent assistance, and do not delay
          contacting emergency responders to submit a report.
        </p>
      </>
    ),
  },
  {
    id: "user-content",
    title: "User Content and Incident Reports",
    content: (
      <>
        <p>
          You retain ownership of the content you submit. By posting a report,
          comment, photo, or other content, you grant SafePath a worldwide,
          non-exclusive, royalty-free license to host, store, reproduce,
          display, moderate, and distribute that content in connection with
          operating and promoting the platform.
        </p>
        <ul>
          <li>
            You must own or have permission to share any content you upload.
          </li>
          <li>
            Reports must be truthful to the best of your knowledge. Do not
            submit false, misleading, or fabricated incidents.
          </li>
          <li>
            Do not post personal information about others without a lawful
            reason and their consent where required.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "prohibited-conduct",
    title: "Prohibited Conduct",
    content: (
      <>
        <p>You may not use SafePath to:</p>
        <ul>
          <li>
            Harass, threaten, defame, or discriminate against any person or
            group.
          </li>
          <li>
            Publish doxxing content, private addresses, or identifying details
            of victims or bystanders.
          </li>
          <li>
            Submit spam, advertisements, scams, malware, or automated bulk
            content.
          </li>
          <li>
            Impersonate another person, organization, or SafePath staff member.
          </li>
          <li>
            Interfere with the security, availability, or integrity of the
            platform.
          </li>
          <li>Violate any applicable law or the rights of others.</li>
        </ul>
      </>
    ),
  },
  {
    id: "moderation",
    title: "Moderation and Enforcement",
    content: (
      <>
        <p>
          Reports and comments may be reviewed by moderators before or after
          publication. We may approve, reject, edit for clarity, limit
          visibility, or remove content that violates these Terms or our
          Community Guidelines.
        </p>
        <p>
          We may issue warnings, suspend features, or terminate accounts where
          necessary to protect users and the community. Moderation decisions are
          made at our discretion and are not a guarantee that any content is
          accurate or safe.
        </p>
      </>
    ),
  },
  {
    id: "intellectual-property",
    title: "Intellectual Property",
    content: (
      <>
        <p>
          The SafePath name, logo, design, software, and other platform content
          are owned by SafePath or its licensors and are protected by
          intellectual property laws. You may not copy, modify, distribute, or
          reverse engineer our platform except as permitted by law or with
          written permission.
        </p>
        <p>
          You may share links to public incident pages for lawful,
          non-commercial purposes.
        </p>
      </>
    ),
  },
  {
    id: "third-party-services",
    title: "Third-Party Services",
    content: (
      <p>
        SafePath may link to or integrate third-party websites and services. We
        do not control and are not responsible for their content, policies, or
        practices. Your use of third-party services is at your own risk and
        subject to their terms.
      </p>
    ),
  },
  {
    id: "disclaimers",
    title: "Disclaimers",
    content: (
      <>
        <p>
          SafePath is provided on an &quot;as is&quot; and &quot;as
          available&quot; basis. To the maximum extent permitted by law, we
          disclaim all warranties, express or implied, including
          merchantability, fitness for a particular purpose, and
          non-infringement.
        </p>
        <p>
          Community reports reflect the views of their authors, not SafePath. We
          do not guarantee the accuracy, completeness, or timeliness of any
          report or comment.
        </p>
      </>
    ),
  },
  {
    id: "limitation-of-liability",
    title: "Limitation of Liability",
    content: (
      <p>
        To the maximum extent permitted by law, SafePath and its officers,
        employees, and partners will not be liable for indirect, incidental,
        special, consequential, or punitive damages, or for any loss of data,
        profits, or goodwill arising from your use of or inability to use the
        platform. Where liability cannot be excluded, it is limited to the
        greatest extent permitted by law.
      </p>
    ),
  },
  {
    id: "indemnification",
    title: "Indemnification",
    content: (
      <p>
        You agree to indemnify and hold harmless SafePath and its affiliates
        from any claims, liabilities, damages, losses, and expenses arising out
        of your content, your use of the platform, or your violation of these
        Terms or applicable law.
      </p>
    ),
  },
  {
    id: "termination",
    title: "Termination",
    content: (
      <>
        <p>
          You may stop using SafePath at any time and may request deletion of
          your account. We may suspend or terminate your access if you violate
          these Terms, create risk for other users, or if required by law.
        </p>
        <p>
          Provisions that by their nature should survive termination, including
          ownership, disclaimers, and limitation of liability, will continue to
          apply.
        </p>
      </>
    ),
  },
  {
    id: "governing-law",
    title: "Governing Law and Disputes",
    content: (
      <p>
        These Terms are governed by the laws applicable in the jurisdiction
        where SafePath operates, without regard to conflict-of-law rules. Any
        dispute will be resolved in the competent courts of that jurisdiction,
        except where mandatory consumer protection laws provide otherwise.
      </p>
    ),
  },
  {
    id: "changes",
    title: "Changes to These Terms",
    content: (
      <p>
        We may update these Terms from time to time. Material changes will be
        reflected in the date above and, where appropriate, communicated through
        the platform. Continued use of SafePath after changes take effect
        constitutes acceptance of the revised Terms.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Contact",
    content: (
      <p>
        Questions about these Terms? Reach out to the SafePath team through the
        support options available in your account or on the platform.
      </p>
    ),
  },
];

export default function TermsOfServicePage() {
  return (
    <LegalPage
      eyebrow="Terms of Service"
      title="Clear rules for a safer community"
      description="These Terms explain your rights and responsibilities when using SafePath, including how reports are moderated and how the platform may be used."
      lastUpdated="November 6, 2026"
      icon={ScrollText}
      accent="sky"
      sections={sections}
    />
  );
}
