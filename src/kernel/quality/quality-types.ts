export type QualityBand = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

export type KernelResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
  warnings?: string[];
};

export type QualityEntity = {
  id?: string;
  title?: string;
  name?: string;
  summary?: string;
  description?: string;
  reasoning?: string;
  source?: string;
  sourceType?: string;
  sourceId?: string;
  url?: string;
  sourceUrl?: string;
  canonicalId?: string;
  priority?: string;
  confidenceScore?: number;
  opportunityScore?: number;
  qualityScore?: number;
  evidenceStrength?: number;
  duplicateRisk?: number;
  missingEvidence?: string[];
  detectedEntities?: string[];
  detectedKeywords?: string[];
  tags?: string[];
  metadata?: Record<string, unknown>;
};

export type SignalQualityInput = QualityEntity & {
  rawPayload?: Record<string, unknown>;
  platform?: string;
  sentiment?: string;
  status?: string;
  occurredAt?: string;
};

export type SignalQualityResult = {
  score: number;
  band: QualityBand;
  warnings: string[];
  explanation: string;
};

export type RecommendationQualityInput = QualityEntity & {
  suggestedAction?: string;
  expectedImpact?: string;
  actionType?: string;
  recommendationType?: string;
};

export type RecommendationQualityFields = {
  confidenceScore: number;
  evidenceStrength: number;
  missingEvidence: string[];
  duplicateRisk: number;
  qualityScore: number;
  explanation: string;
  confidenceExplanation: string;
};

export type DuplicateMatch<T extends QualityEntity = QualityEntity> = {
  item: T;
  duplicateOf: T;
  similarity: number;
  duplicateRisk: number;
  reasons: string[];
};

export type OpportunityScoreInput = {
  opportunityScore?: number;
  businessValueScore?: number;
  painSeverityScore?: number;
  trendScore?: number;
  authorityGapScore?: number;
  confidenceScore?: number;
  competitionScore?: number;
  duplicateRisk?: number;
  evidenceStrength?: number;
  qualityScore?: number;
};
