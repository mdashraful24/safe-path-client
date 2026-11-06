import { HeartHandshake } from "lucide-react";
import type { Metadata } from "next";
import LegalPage from "@/components/modules/legal/legal-page";

export const metadata: Metadata = {
  title: "Community Guidelines",
  description:
    "The standards that keep SafePath reports accurate, respectful, and useful for everyone.",
};

const sections = [
  {
    id: "shared-responsibility",
    title: "Our Shared Responsibility",
    content: (
      <>
        <p>
          SafePath works because neighbors look out for one another. Every
          report, comment, and message shapes how people understand safety in
          their area. These guidelines describe the behavior we expect so the
          platform stays trustworthy and useful.
        </p>
        <p>
          By using SafePath, you agree to follow these guidelines in addition to
          our Terms of Service.
        </p>
      </>
    ),
  },
  {
    id: "report-honestly",
    title: "Report Honestly and Accurately",
    content: (
      <>
        <ul>
          <li>
            Share only what you personally observed or can reasonably verify.
          </li>
          <li>
            Choose the most accurate category, area, and date for the incident.
          </li>
          <li>Do not exaggerate, speculate, or present rumors as facts.</li>
          <li>
            Clearly distinguish what you saw from what you heard or inferred.
          </li>
          <li>
            Do not submit false reports, duplicate reports, or joke reports.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "protect-privacy",
    title: "Protect People's Privacy",
    content: (
      <>
        <p>
          Safety reporting should never expose innocent people to harm. Avoid
          sharing information that could identify victims, witnesses, or
          bystanders.
        </p>
        <ul>
          <li>
            Do not post names, faces, phone numbers, or home addresses of others
            without a lawful reason.
          </li>
          <li>
            Do not speculate about who committed an incident or accuse
            individuals publicly.
          </li>
          <li>Blur or crop identifying details in photos whenever possible.</li>
          <li>
            Report the location of a hazard, not the personal details of a
            person.
          </li>
        </ul>
      </>
    ),
  },
  {
    id: "be-respectful",
    title: "Be Respectful",
    content: (
      <>
        <p>
          People from all backgrounds use SafePath. Treat others with dignity,
          even when you disagree.
        </p>
        <ul>
          <li>No harassment, threats, bullying, or intimidation.</li>
          <li>
            No hate speech or discrimination based on identity or background.
          </li>
          <li>
            No sexual content, graphic violence, or content that glorifies harm.
          </li>
          <li>Keep comments relevant to the incident and constructive.</li>
        </ul>
      </>
    ),
  },
  {
    id: "keep-it-local",
    title: "Keep It Local and Relevant",
    content: (
      <p>
        SafePath is designed for local safety awareness. Report incidents in the
        area where they occurred, avoid unrelated political campaigning, and do
        not use incident pages as a general forum for off-topic discussion.
      </p>
    ),
  },
  {
    id: "no-spam",
    title: "No Spam, Ads, or Self-Promotion",
    content: (
      <ul>
        <li>Do not advertise products, services, or businesses.</li>
        <li>
          Do not post referral links, repetitive messages, or bulk content.
        </li>
        <li>Do not use comments to promote unrelated causes or accounts.</li>
        <li>Do not scrape or automate posting on SafePath.</li>
      </ul>
    ),
  },
  {
    id: "media-and-evidence",
    title: "Media and Evidence",
    content: (
      <>
        <p>
          Photos and videos can make a report clearer, but they must be shared
          responsibly.
        </p>
        <ul>
          <li>Only upload media you took or have permission to share.</li>
          <li>
            Do not upload content that is graphic, obscene, or exploitative.
          </li>
          <li>
            Respect copyright and do not post stolen or watermarked content.
          </li>
          <li>Remove metadata or personal details that are not needed.</li>
        </ul>
      </>
    ),
  },
  {
    id: "emergencies",
    title: "Emergency Situations",
    content: (
      <>
        <p>
          <strong>
            SafePath is not an emergency service. If someone is in immediate
            danger, call your local emergency number first.
          </strong>
        </p>
        <p>
          Posting a report does not dispatch help. Reporting after you have
          contacted the appropriate authorities helps keep the community
          informed, but it is not a substitute for emergency response.
        </p>
      </>
    ),
  },
  {
    id: "moderation",
    title: "Respect Moderation",
    content: (
      <p>
        Moderators review reports to keep the feed accurate and safe. They may
        request changes, reject submissions, hide content, or restrict accounts.
        Please do not harass moderators or repeatedly repost content that was
        removed. If you believe a decision was wrong, use the available appeal
        or support channel.
      </p>
    ),
  },
  {
    id: "consequences",
    title: "Consequences",
    content: (
      <>
        <p>Violations may lead to one or more of the following:</p>
        <ul>
          <li>A warning or a request to edit your content.</li>
          <li>Removal of a report, comment, or media item.</li>
          <li>Temporary suspension of posting privileges.</li>
          <li>
            Permanent account termination for serious or repeated violations.
          </li>
          <li>Referral to law enforcement where required or appropriate.</li>
        </ul>
      </>
    ),
  },
  {
    id: "reporting-content",
    title: "Reporting Content",
    content: (
      <p>
        If you see content that violates these guidelines, use the report option
        on the content or contact the moderation team. Include enough context
        for us to review it, but do not publicly escalate disputes in the
        comments.
      </p>
    ),
  },
  {
    id: "contact",
    title: "Questions?",
    content: (
      <p>
        If you are unsure whether something belongs on SafePath, ask before you
        post. Reach the team through the support options available in your
        account or on the platform.
      </p>
    ),
  },
];

export default function CommunityGuidelinesPage() {
  return (
    <LegalPage
      eyebrow="Community Guidelines"
      title="Safety starts with how we treat each other"
      description="These standards keep reports accurate, protect privacy, and make SafePath a respectful place for every community."
      lastUpdated="November 6, 2026"
      icon={HeartHandshake}
      accent="rose"
      sections={sections}
    />
  );
}
