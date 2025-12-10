// lib/questions.ts
// Central place for all exams, topics and questions

import { rawQuestions } from "@/app/data/cpsdQuestions";

// ===========================
// TYPES
// ===========================

export type ExamId = "core" | "diversity";

export type Topic = {
  id: string;
  label: string;
  description: string;
  exam: ExamId;
};

export type Question = {
  id: string;
  exam: ExamId;
  topicId: string;
  stem: string;
  options: string[];
  answerIndex: number;
  explanation: string;
};

// Local view of the raw data coming from cpsdQuestions.ts
type ModuleId = "supply-management" | "supplier-diversity";

type RawQuestion = {
  id: string;
  module: ModuleId;
  domain?: string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  // allow extra fields without breaking
  [key: string]: unknown;
};

// ===========================
// SUPPLY MANAGEMENT CORE
// ===========================

export const coreTopics: Topic[] = [
  {
    id: "core-role",
    label: "Role of Supply Management",
    description: "How supply management supports organizational goals.",
    exam: "core",
  },
  {
    id: "core-strategy",
    label: "Strategy & Alignment",
    description: "Aligning supply management strategies with business needs.",
    exam: "core",
  },
  {
    id: "core-sourcing",
    label: "Sourcing Process",
    description: "Needs identification, sourcing, negotiation and award.",
    exam: "core",
  },
];

// ===========================
// SUPPLIER DIVERSITY MODULE
// ===========================

export const diversityTopics: Topic[] = [
  {
    id: "businessCase",
    label: "Business Case & Executive Support",
    description:
      "History, societal drivers, ROI, and building executive-level buy-in.",
    exam: "diversity",
  },
  {
    id: "programStrategy",
    label: "Program Development & Strategy",
    description:
      "Designing, integrating and governing a supplier diversity program.",
    exam: "diversity",
  },
  {
    id: "supplierQualification",
    label: "Supplier Qualification & Certification",
    description:
      "Certification, referrals, capability evaluation and qualification.",
    exam: "diversity",
  },
  {
    id: "dataCapture",
    label: "Capturing Diversity Data",
    description:
      "Building data structures, validation and reporting foundations.",
    exam: "diversity",
  },
  {
    id: "advocacy",
    label: "Advocacy & Senior Leadership Influence",
    description:
      "Positioning, storytelling and engagement with executives and stakeholders.",
    exam: "diversity",
  },
  {
    id: "globalLandscape",
    label: "Global Certification Landscape",
    description:
      "Key certifying bodies and how they support diverse supplier growth.",
    exam: "diversity",
  },
  {
    id: "outreach",
    label: "Outreach & Opportunity Fairs",
    description:
      "Matchmaking events, outreach strategies and sourcing team engagement.",
    exam: "diversity",
  },
  {
    id: "reporting",
    label: "Reporting & Metrics",
    description:
      "Tier 1 / Tier 2, spend accuracy, KPIs and performance dashboards.",
    exam: "diversity",
  },
  {
    id: "integration",
    label: "Integration into Sourcing",
    description:
      "Embedding supplier diversity into sourcing and category management.",
    exam: "diversity",
  },
  {
    id: "riskCompliance",
    label: "Risk, Compliance & Policy",
    description:
      "Legal frameworks, risks of non-compliance and policy design.",
    exam: "diversity",
  },
];

// ===========================
// MAPPING FROM RAW QUESTIONS
// ===========================

function mapModuleToExam(module: ModuleId): ExamId {
  return module === "supply-management" ? "core" : "diversity";
}

// Map raw `domain` strings to topic IDs
function mapDomainToTopicId(exam: ExamId, domain?: string): string {
  const key = (domain ?? "").toLowerCase().trim();

  if (exam === "core") {
    // CORE (Supply Management)
    if (key.includes("strategy") || key.includes("category"))
      return "core-strategy";
    if (key.includes("sourcing") || key.includes("rfp") || key.includes("rfq"))
      return "core-sourcing";
    return "core-role"; // default for core
  }

  // DIVERSITY (Supplier Diversity)

  // 1) Direct domain → topic mappings (based on your likely domain labels)

  // Advocacy & Senior Leadership Influence
  if (
    [
      "executive communication",
      "stakeholder engagement",
      "stakeholders",
      "governance",
      "governance & legacy",
      "foundations",
      "economic impact",
      "esg & impact",
      "impact",
      "impact storytelling",
      "training",
      "training & culture",
      "supplier experience",
      "myths",
    ].includes(key)
  ) {
    return "advocacy";
  }

  // Global Certification Landscape
  if (
    [
      "regulatory context",
      "ecosystem partnerships",
      "governance & legacy",
    ].includes(key)
  ) {
    return "globalLandscape";
  }

  // Outreach & Opportunity Fairs
  if (
    [
      "supplier development",
      "tier-2",
      "ecosystem partnerships",
    ].includes(key)
  ) {
    return "outreach";
  }

  // Reporting & Metrics
  if (
    [
      "data & reporting",
      "analytics",
      "kpis",
    ].includes(key)
  ) {
    return "reporting";
  }

  // Integration into Sourcing
  if (
    [
      "sourcing",
      "sourcing process",
      "category",
      "category management",
      "technology",
      "technology & tools",
      "contracting",
      "continuous improvement",
    ].includes(key)
  ) {
    return "integration";
  }

  // 2) Fallback substring rules
  if (key.includes("business") || key.includes("case")) return "businessCase";
  if (key.includes("strategy") || key.includes("program"))
    return "programStrategy";
  if (key.includes("qualif") || key.includes("certif"))
    return "supplierQualification";
  if (key.includes("data")) return "dataCapture";
  if (key.includes("advoc")) return "advocacy";
  if (key.includes("global")) return "globalLandscape";
  if (key.includes("outreach") || key.includes("fair")) return "outreach";
  if (key.includes("report")) return "reporting";
  if (key.includes("integrat")) return "integration";
  if (key.includes("risk") || key.includes("compliance"))
    return "riskCompliance";

  // 3) Last resort default
  return "businessCase";
}

// Build the canonical Question[] used by the rest of the app
const typedRawQuestions = rawQuestions as unknown as RawQuestion[];

export const questions: Question[] = typedRawQuestions.map((raw) => {
  const exam = mapModuleToExam(raw.module);
  const topicId = mapDomainToTopicId(exam, raw.domain);

  return {
    id: raw.id,
    exam,
    topicId,
    stem: raw.stem,
    options: raw.options,
    answerIndex: raw.correctIndex,
    explanation: raw.explanation,
  };
});
 
// Keep backwards compatibility: provide coreQuestions and diversityQuestions
export const coreQuestions: Question[] = questions.filter(
  (q) => q.exam === "core"
);

export const diversityQuestions: Question[] = questions.filter(
  (q) => q.exam === "diversity"
);

// ===========================
// HELPER FUNCTIONS
// ===========================

export function getTopicsForExam(exam: ExamId): Topic[] {
  if (exam === "core") return coreTopics;
  if (exam === "diversity") return diversityTopics;
  return [];
}

export function getQuestionsForTopic(
  exam: ExamId,
  topicId: string
): Question[] {
  return questions.filter(
    (q) => q.exam === exam && q.topicId === topicId
  );
}

export function getRandomQuestionsForTopic(
  exam: ExamId,
  topicId: string,
  count: number = 50
): Question[] {
  const all = getQuestionsForTopic(exam, topicId);
  // Simple shuffle
  const shuffled = [...all].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, all.length));
}
