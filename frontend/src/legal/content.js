// ============================================================
//  JNEET+ AI — legal/content.js
//  SINGLE SOURCE for the Privacy Policy, Terms of Service and Refund
//  Policy. The React pages (/privacy /terms /refund) render this, and
//  scripts/build-legal.mjs turns it into static HTML files in public/
//  (for app-store reviewers and crawlers that don't run JavaScript).
//
//  >>> EDIT THE BUSINESS DETAILS BELOW BEFORE LAUNCH <<<
//  Anything set to null is simply left out of the pages (nothing is
//  invented). These texts are a careful draft, not legal advice: have a
//  lawyer review them, especially the children's-data and refund parts.
// ============================================================

export const BUSINESS = {
  product: "JNEET+ AI",
  website: "https://jneetai.com",
  // Who legally runs the service (your name, or your registered business name).
  operator: "Krish Upadhyay",
  // Postal address for legal notices. Set to a string to publish it, or leave null.
  address: null,
  supportEmail: "official.krishupadhyay@gmail.com",
  // IT Rules / DPDP Act: name and contact of the person who handles complaints.
  grievanceOfficer: { name: "Krish Upadhyay", email: "official.krishupadhyay@gmail.com" },
};

export const LEGAL_VERSION = "2026-10-18";
export const LEGAL_UPDATED = "18 October 2026";

const B = BUSINESS;

export const LEGAL = {
  privacy: {
    path: "/privacy",
    file: "privacy.html",
    title: "Privacy Policy",
    intro: `${B.product} ("we", "us", "the app") is an AI study platform for NEET and JEE students in India. This policy explains what we collect, why, who we share it with, and the choices you and your parent or guardian have. We have tried to write it in plain language.`,
    sections: [
      {
        h: "1. Who runs JNEET+ AI",
        p: [`${B.product} is operated by ${B.operator}.${B.address ? ` Address: ${B.address}.` : ""} You can reach us at ${B.supportEmail}.`],
      },
      {
        h: "2. What we collect",
        ul: [
          "Account details: your name, email address and a password (stored only as a one-way hash — we cannot read it).",
          "Date of birth: used only to apply age rules (see section 6). We do not show it to anyone.",
          "Parent or guardian email and the approval record, if you are under 18: when the approval was given or withdrawn, the IP address and device details used, and the version of this policy shown.",
          "Your exam (NEET or JEE) and optional target-exam choices.",
          "Chat content: the questions you ask the AI mentor and its answers, saved so you can revisit them.",
          "Study activity: test answers, scores, revision progress and notes you write, used to show your progress and weak topics.",
          "AI usage records: how many AI questions you used, the model used, token counts and cost. These records do not contain the text of your questions.",
          "Technical data: IP address, browser/device type and request logs, used for security, abuse prevention and fixing problems.",
        ],
      },
      {
        h: "3. How we use it",
        ul: [
          "To run the app: sign-in, the AI mentor, tests, revision, notes and progress tracking.",
          "To keep accounts and the service secure (for example, limiting repeated login attempts and blocking abuse).",
          "To send service emails: verification codes, login codes, password-reset codes and parental-approval emails. We do not send marketing email unless you separately agree to it.",
          "To apply daily AI limits fairly and to control our costs.",
          "To meet legal obligations.",
        ],
        p2: ["We do not sell your personal data. We do not show advertising and we do not build advertising profiles of students."],
      },
      {
        h: "4. How the AI mentor handles your data",
        p: [
          "When you ask the AI mentor a question, we send that question, a few earlier messages from the same chat (so it can follow the conversation) and your exam type to our AI provider, OpenAI, through its API, to generate the reply. We identify you to the provider only with an anonymous, one-way hashed ID — not your name or email.",
          "We ask the provider not to store these requests for its own product use. Under the provider's API terms, API data is not used to train its models by default, and the provider may keep requests for a limited period for safety and abuse monitoring as set out in its terms.",
          "The AI can make mistakes. Please do not type sensitive personal information (phone numbers, addresses, ID numbers, health details) into the chat.",
        ],
      },
      {
        h: "5. Who else handles your data",
        p: ["We use a small number of service providers who process data on our behalf, only to provide the service:"],
        ul: [
          "OpenAI — generates AI mentor replies.",
          "MongoDB Atlas — database where account, chat and study data are stored.",
          "Brevo — delivers our emails (it receives your email address and the message, such as a code).",
          "Vercel and Render — host the website and the server.",
          "Razorpay — will process payments if and when paid plans launch. We will not see your card, UPI or bank details.",
        ],
        p2: ["Some of these providers store or process data outside India. We choose providers that use industry-standard safeguards. We may also disclose information if the law requires it."],
      },
      {
        h: "6. Children and parental approval",
        p: [
          "JNEET+ AI is for students aged 13 and above. If we learn that a child under 13 has an account, we will delete it.",
          "If you are under 18, you must give a parent or guardian's email address when you sign up. After you verify your own email, we email your parent or guardian a link to review and approve the AI mentor. Until they approve, the AI mentor stays locked for your account; mock tests, revision and notes still work. They can withdraw approval at any time using the link in their confirmation email, which turns the AI mentor off again.",
          "We do not track children's behaviour for advertising, and we do not show them advertisements.",
          "Email-link approval is a practical safeguard, not a legal identity check. If you are a parent or guardian and something looks wrong, write to us and we will act on it.",
        ],
      },
      {
        h: "7. Cookies and similar storage",
        p: ["We use one secure, HTTP-only cookie to keep you signed in. JavaScript cannot read it, and it is not used for advertising or cross-site tracking. Your browser's local storage keeps small preferences such as your theme and the last page you opened."],
      },
      {
        h: "8. How long we keep data",
        ul: [
          "Your account data and chats stay while your account is active.",
          "If you delete your account, it is switched off immediately and permanently erased after 30 days, including chats, notes, test history and AI usage records. (The 30 days let us restore an account that was deleted by mistake.)",
          "Sign-ups that are never verified are removed automatically after 48 hours.",
          "Payment and tax records, once paid plans exist, are kept for as long as the law requires.",
          "Server logs are kept for a short period for security and debugging.",
        ],
      },
      {
        h: "9. Security",
        p: ["Data is encrypted in transit. Passwords are stored only as salted hashes, one-time codes are stored only as hashes, sessions use secure cookies, and we rate-limit sign-in attempts. No system is perfectly secure; please use a strong, unique password and never share your codes."],
      },
      {
        h: "10. Your rights and choices",
        p: ["Under India's Digital Personal Data Protection Act, 2023 and related rules you can ask us to:"],
        ul: [
          "tell you what personal data we hold and how it is used;",
          "correct inaccurate data (you can edit your name in Profile);",
          "erase your data (use Settings → Delete account, or email us);",
          "withdraw consent (a parent can withdraw AI approval at any time);",
          "resolve a complaint — see section 12.",
        ],
        p2: ["We aim to respond within 30 days."],
      },
      {
        h: "11. Changes to this policy",
        p: [`We may update this policy. We will change the date at the top and, for significant changes, tell you in the app or by email. The current version is dated ${LEGAL_UPDATED}.`],
      },
      {
        h: "12. Contact and Grievance Officer",
        p: [
          `Questions, requests or complaints about your data: ${B.supportEmail}.`,
          `Grievance Officer: ${B.grievanceOfficer.name}, ${B.grievanceOfficer.email}. We acknowledge complaints promptly and aim to resolve them within one month.`,
        ],
      },
    ],
  },

  terms: {
    path: "/terms",
    file: "terms.html",
    title: "Terms of Service",
    intro: `These terms are an agreement between you and ${B.operator}, who runs ${B.product}. By creating an account or using the app you agree to them and to our Privacy Policy.`,
    sections: [
      {
        h: "1. Who can use JNEET+ AI",
        ul: [
          "You must be at least 13 years old.",
          "If you are under 18, you confirm that your parent or guardian knows you are using the app, and the AI mentor needs their approval (see the Privacy Policy, section 6).",
          "You must give accurate information and keep your login details private. You are responsible for activity on your account. Tell us at once if you think someone else has access.",
        ],
      },
      {
        h: "2. What the service is — and is not",
        ul: [
          `${B.product} is a study aid: AI explanations, practice tests, revision and progress tracking for NEET and JEE preparation.`,
          "The AI mentor is an AI. It can be wrong, incomplete or out of date. Check important facts, formulas and answers against your NCERT books, teachers and official sources before relying on them in an exam.",
          "We do not guarantee any score, rank or admission result.",
          "Nothing in the app is medical, psychological, legal or career-counselling advice. If you feel overwhelmed or unsafe, please talk to a trusted adult, call Tele-MANAS on 14416 (free, 24x7) or 112 in an emergency.",
          `${B.product} is an independent product. It is not affiliated with or endorsed by NTA, NMC, any IIT, or any coaching institute or government body.`,
        ],
      },
      {
        h: "3. Plans and limits",
        p: [
          "The free plan includes a daily limit on AI questions (currently 5 per day, resetting at midnight India time). Limits can change. Paid plans are not on sale yet; when they are, their price, benefits and renewal terms will be shown clearly before you pay, and our Refund Policy applies.",
        ],
      },
      {
        h: "4. Acceptable use",
        p: ["You agree not to:"],
        ul: [
          "break the law or use the app to harm, harass or deceive anyone;",
          "try to get around limits, share or sell access, create multiple accounts to get extra free questions, or use bots or scripts;",
          "probe, attack, overload or reverse-engineer the service, or try to access other users' data;",
          "ask the AI for content that is unsafe, hateful, sexual, or that helps cheat in an actual exam;",
          "copy or resell our questions, explanations or other content in bulk.",
        ],
        p2: ["We may limit, suspend or close accounts that break these rules."],
      },
      {
        h: "5. Your content",
        p: ["You own the questions and notes you write. You give us permission to store and process them, and to send them to our AI provider, only to run the service for you. You promise you have the right to submit what you submit."],
      },
      {
        h: "6. Our content",
        p: ["The app, its design, question bank, explanations and software belong to us or our licensors. You may use them for your own personal study, but not copy, resell or redistribute them."],
      },
      {
        h: "7. Availability and changes",
        p: ["We work to keep the service running, but it is provided “as is” and may be interrupted, changed or discontinued. We may update features, limits and these terms; if a change is material we will tell you, and continuing to use the app after that means you accept it."],
      },
      {
        h: "8. Ending your account",
        p: ["You can delete your account at any time in Settings. We may suspend or close an account that breaks these terms or puts others at risk. Sections that by their nature should continue (such as ownership and liability) survive."],
      },
      {
        h: "9. Liability",
        p: ["To the extent the law allows, we are not liable for indirect or consequential loss, or for decisions you make based on AI answers, and our total liability to you for any claim is limited to the amount you paid us in the 12 months before the claim (or ₹1,000 if you paid nothing). Nothing in these terms limits rights you have under Indian consumer law that cannot be limited."],
      },
      {
        h: "10. Governing law and disputes",
        p: ["These terms are governed by the laws of India. Disputes will be handled by the competent courts in India. Please contact us first — most problems can be solved by talking."],
      },
      {
        h: "11. Contact",
        p: [`${B.supportEmail}${B.address ? ` · ${B.address}` : ""}`],
      },
    ],
  },

  refund: {
    path: "/refund",
    file: "refund-policy.html",
    title: "Refund & Cancellation Policy",
    intro: `${B.product} is free to use at launch. This page explains how payments, refunds and cancellation will work once paid plans are available. No payment is taken until a paid plan is clearly shown to you at checkout.`,
    sections: [
      {
        h: "1. Free plan",
        p: ["The free plan costs nothing and has no refund because nothing is charged."],
      },
      {
        h: "2. Paid plans (when available)",
        ul: [
          "Paid plans are sold as prepaid passes for a fixed period. They do not renew automatically unless the checkout page clearly says so and you agreed to it.",
          "Prices are shown in Indian rupees, inclusive of applicable taxes, before you pay.",
          "Payments are processed by Razorpay. We never see your card, UPI or bank details.",
        ],
      },
      {
        h: "3. Refunds",
        p: ["All purchases are final: paid plans are non-refundable once purchased, and we do not give refunds for unused time or because you changed your mind. Please try the free plan first to see if JNEET+ AI suits you."],
        ul: [
          "The only exceptions are our own errors: if you were charged twice, charged the wrong amount, or paid and your plan was never activated because of a fault on our side, we will correct it or refund the affected amount in full.",
          "Nothing here limits any right you have under Indian consumer law that cannot be waived.",
        ],
        p2: ["Approved refunds go back to the original payment method and normally reach you within 5–7 working days, depending on your bank."],
      },
      {
        h: "4. Cancelling",
        p: ["If a plan is set to renew, you can turn renewal off any time before the renewal date and keep access until the paid period ends."],
      },
      {
        h: "5. How to ask",
        p: [`Email ${B.supportEmail} from your registered address with the payment reference. We reply within 2 working days.`],
      },
    ],
  },
};
