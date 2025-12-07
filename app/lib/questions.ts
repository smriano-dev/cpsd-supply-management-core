// lib/questions.ts
// Central place for all exams, topics and questions

import type { ModuleId } from "@/app/data/cpsdQuestions";
import { rawQuestions } from "@/app/data/cpsdQuestions";

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
  if (module === "supply-management") return "core";
  return "diversity"; // "supplier-diversity"
}

// Simple mapping for now: you can refine later.
// For the app to work, each question just needs *some* topicId.
function mapDomainToTopicId(exam: ExamId, domain: string): string {
  const key = (domain ?? "").toLowerCase();

  if (exam === "core") {
    if (key.includes("strategy") || key.includes("category")) return "core-strategy";
    if (key.includes("sourcing") || key.includes("rfp") || key.includes("rfq"))
      return "core-sourcing";
    return "core-role"; // default for core
  }

  // diversity
  if (key.includes("business") || key.includes("case")) return "businessCase";
  if (key.includes("strategy") || key.includes("program")) return "programStrategy";
  if (key.includes("qualif") || key.includes("certif"))
    return "supplierQualification";
  if (key.includes("data")) return "dataCapture";
  if (key.includes("advoc")) return "advocacy";
  if (key.includes("global")) return "globalLandscape";
  if (key.includes("outreach") || key.includes("fair")) return "outreach";
  if (key.includes("report")) return "reporting";
  if (key.includes("integrat")) return "integration";
  if (key.includes("risk") || key.includes("compliance")) return "riskCompliance";

  // default for diversity
  return "businessCase";
}

// Build the canonical Question[] used by the rest of the app
export const questions: Question[] = rawQuestions.map((raw) => {
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
