const DISPOSABLE = new Set([
  "mailinator.com", "guerrillamail.com", "10minutemail.com", "trashmail.com",
  "tempmail.com", "yopmail.com", "throwawaymail.com", "fakeinbox.com",
  "getnada.com", "maildrop.cc", "sharklasers.com", "dispostable.com",
]);

const ROLE_ACCOUNTS = new Set([
  "info", "support", "sales", "admin", "contact", "noreply", "no-reply",
  "help", "hello", "team", "marketing", "billing", "abuse", "postmaster",
]);

function normalize(email) {
  let e = email.trim().toLowerCase();
  // Strip trailing punctuation that often clings to scraped emails
  e = e.replace(/[.,;:>"')\]]+$/, "");
  return e;
}

function syntaxValid(email) {
  // RFC 5322-ish, deliberately strict for cleaning lead lists
  return /^[a-z0-9._%+-]+@[a-z0-9](?:[a-z0-9-]*[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]*[a-z0-9])?)+$/i.test(email);
}

export default {
  name: "lead_list_cleaner",
  description: "Clean a list of email addresses for outreach. Normalizes case, strips junk characters, removes duplicates, and flags invalid syntax, disposable domains, and role-based addresses.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Email addresses, one per line or separated by commas/semicolons/whitespace" },
      drop_disposable: { type: "boolean", description: "Exclude disposable/temporary domains from the cleaned list", default: true },
      drop_role: { type: "boolean", description: "Exclude role-based addresses (info@, support@, sales@, etc.)", default: false },
    },
    required: ["input"],
  },
  async run({ input, drop_disposable = true, drop_role = false }) {
    const candidates = input.split(/[\s,;]+/).map(normalize).filter(Boolean);
    const seen = new Set();
    const valid = [];
    const invalid = [];
    const disposable = [];
    const role = [];
    for (const e of candidates) {
      if (seen.has(e)) continue;
      seen.add(e);
      if (!syntaxValid(e)) { invalid.push(e); continue; }
      const [local, domain] = e.split("@");
      const isDisp = DISPOSABLE.has(domain);
      const isRole = ROLE_ACCOUNTS.has(local);
      if (isDisp) disposable.push(e);
      if (isRole) role.push(e);
      const drop = (isDisp && drop_disposable) || (isRole && drop_role);
      if (!drop) valid.push(e);
    }
    return {
      input_count: candidates.length,
      cleaned_count: valid.length,
      removed_duplicates: candidates.length - seen.size,
      cleaned: valid,
      invalid,
      disposable,
      role_based: role,
    };
  },
};
