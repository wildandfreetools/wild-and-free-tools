export default {
  name: "domain_extractor",
  description: "Extract unique domains from any text containing URLs or email addresses. Returns the deduplicated list of bare domains, optionally including subdomains.",
  inputSchema: {
    type: "object",
    properties: {
      input: { type: "string", description: "Text containing URLs and/or email addresses" },
      include_subdomains: { type: "boolean", description: "Keep subdomains (e.g. api.example.com). If false, collapses to the registrable apex when possible.", default: true },
      sort: { type: "boolean", description: "Sort the result alphabetically", default: true },
    },
    required: ["input"],
  },
  async run({ input, include_subdomains = true, sort = true }) {
    const found = new Set();
    const urlRegex = /\bhttps?:\/\/([^\s/?#"'<>)]+)/gi;
    const emailRegex = /[A-Z0-9._%+-]+@([A-Z0-9.-]+\.[A-Z]{2,})/gi;
    const bareRegex = /\b([a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z]{2,}\b/gi;

    let m;
    while ((m = urlRegex.exec(input)) !== null) found.add(m[1].toLowerCase().replace(/:\d+$/, ""));
    while ((m = emailRegex.exec(input)) !== null) found.add(m[1].toLowerCase());
    while ((m = bareRegex.exec(input)) !== null) found.add(m[0].toLowerCase());

    let domains = [...found];
    if (!include_subdomains) {
      domains = domains.map((d) => {
        const parts = d.split(".");
        if (parts.length <= 2) return d;
        // naive apex: last two labels (won't handle .co.uk style TLDs)
        return parts.slice(-2).join(".");
      });
      domains = [...new Set(domains)];
    }
    if (sort) domains.sort();
    return { count: domains.length, domains };
  },
};
