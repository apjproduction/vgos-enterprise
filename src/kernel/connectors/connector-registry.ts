import type { ConnectorDefinition } from "@/kernel/connectors/connector-types";

export const connectorRegistry: ConnectorDefinition[] = [
  {
    id: "google-search-console",
    name: "Google Search Console Connector",
    type: "GOOGLE_SEARCH_CONSOLE",
    provider: "Google",
    authType: "OAUTH",
    supportedSignalTypes: ["SEARCH_QUERY"],
    requiredConfig: ["siteUrl"],
    optionalConfig: ["queryFilter", "country", "device"],
    status: "MOCK",
    description: "Imports search queries, impressions, clicks, and answer visibility signals."
  },
  {
    id: "google-analytics",
    name: "Google Analytics Connector",
    type: "GOOGLE_ANALYTICS",
    provider: "Google",
    authType: "OAUTH",
    supportedSignalTypes: ["TRAFFIC_CHANGE", "REFERRAL_TRAFFIC"],
    requiredConfig: ["propertyId"],
    optionalConfig: ["conversionEvent", "defaultChannelGroup"],
    status: "MOCK",
    description: "Imports traffic movement, referral sources, and conversion signals."
  },
  {
    id: "github",
    name: "GitHub Connector",
    type: "GITHUB",
    provider: "GitHub",
    authType: "API_KEY",
    supportedSignalTypes: ["GITHUB_ISSUE", "GITHUB_RELEASE"],
    requiredConfig: ["repository"],
    optionalConfig: ["labelFilter", "releaseOnly"],
    status: "MOCK",
    description: "Imports releases, issues, and workflow signals from product development."
  },
  {
    id: "product-hunt",
    name: "Product Hunt Connector",
    type: "PRODUCT_HUNT",
    provider: "Product Hunt",
    authType: "API_KEY",
    supportedSignalTypes: ["PRODUCT_HUNT_COMMENT", "REFERRAL_TRAFFIC"],
    requiredConfig: ["postSlug"],
    optionalConfig: ["includeReplies"],
    status: "MOCK",
    description: "Imports launch comments, questions, referrals, and proof requests."
  },
  {
    id: "reddit",
    name: "Reddit Connector",
    type: "REDDIT",
    provider: "Reddit",
    authType: "OAUTH",
    supportedSignalTypes: ["COMMUNITY_THREAD", "COMMUNITY_REPLY"],
    requiredConfig: ["subreddits"],
    optionalConfig: ["keywords", "minimumScore"],
    status: "MOCK",
    description: "Imports community threads and replies from relevant subreddits."
  },
  {
    id: "linkedin",
    name: "LinkedIn Connector",
    type: "LINKEDIN",
    provider: "LinkedIn",
    authType: "OAUTH",
    supportedSignalTypes: ["SOCIAL_POST", "SOCIAL_COMMENT"],
    requiredConfig: ["organizationUrn"],
    optionalConfig: ["founderProfileUrl"],
    status: "MOCK",
    description: "Imports founder, company, and comment intelligence from LinkedIn."
  },
  {
    id: "x",
    name: "X Connector",
    type: "X",
    provider: "X",
    authType: "OAUTH",
    supportedSignalTypes: ["SOCIAL_POST", "SOCIAL_COMMENT"],
    requiredConfig: ["handle"],
    optionalConfig: ["keywordFilter"],
    status: "MOCK",
    description: "Imports X posts, threads, and replies around category language."
  },
  {
    id: "youtube",
    name: "YouTube Connector",
    type: "YOUTUBE",
    provider: "YouTube",
    authType: "OAUTH",
    supportedSignalTypes: ["SOCIAL_COMMENT", "CUSTOM_SIGNAL"],
    requiredConfig: ["channelId"],
    optionalConfig: ["videoIds"],
    status: "MOCK",
    description: "Imports video comments, topic demand, and audience questions."
  },
  {
    id: "newsletter",
    name: "Newsletter Connector",
    type: "NEWSLETTER",
    provider: "Newsletter",
    authType: "API_KEY",
    supportedSignalTypes: ["NEWSLETTER_METRIC"],
    requiredConfig: ["provider"],
    optionalConfig: ["campaignId", "linkFilter"],
    status: "MOCK",
    description: "Imports open, click, and subscriber intent signals."
  },
  {
    id: "cms",
    name: "CMS Connector",
    type: "CMS",
    provider: "VidMaker CMS",
    authType: "API_KEY",
    supportedSignalTypes: ["CMS_ARTICLE"],
    requiredConfig: ["baseUrl"],
    optionalConfig: ["collection", "author"],
    status: "MOCK",
    description: "Imports published content and article metadata."
  },
  {
    id: "manual-import",
    name: "Manual Import Connector",
    type: "MANUAL_IMPORT",
    provider: "Manual",
    authType: "MANUAL",
    supportedSignalTypes: ["BACKLINK_FOUND", "DIRECTORY_STATUS", "CUSTOM_SIGNAL"],
    requiredConfig: [],
    optionalConfig: ["csvColumns", "defaultSource"],
    status: "CONNECTED",
    description: "Imports CSV, spreadsheet, and hand-entered market intelligence."
  }
];

export function getConnectorDefinition(idOrType: string) {
  return connectorRegistry.find((connector) => connector.id === idOrType || connector.type === idOrType);
}

export function registerConnector(definition: ConnectorDefinition) {
  return [...connectorRegistry.filter((connector) => connector.id !== definition.id), definition];
}
