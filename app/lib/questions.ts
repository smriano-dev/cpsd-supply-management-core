// app/lib/questions.ts
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
  difficulty?: "easy" | "medium" | "hard" | string;
  stem: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  // allow extra fields without breaking
  [key: string]: unknown;
};

// ===========================
// SUPPLY MANAGEMENT CORE
// (you can expand these later if you want a CPSM-style core)
// ===========================

export const coreTopics: Topic[] = [
  {
    id: "core-role",
    label: "Role of Supply Management",
    description: "How supply management supports organisational goals.",
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
// Aligned with ISM CPSD sections
// ===========================

export const diversityTopics: Topic[] = [
  {
    id: "businessCaseExecSupport",
    label: "Developing Business Case / Executive Support",
    description:
      "History, societal drivers, ROI, value proposition and executive buy-in.",
    exam: "diversity",
  },
  {
    id: "programDevelopment",
    label: "Developing a Supplier Diversity Program",
    description:
      "Designing, integrating and governing a supplier diversity program.",
    exam: "diversity",
  },
  {
    id: "projectManagement",
    label: "Project Management for SD Professionals",
    description: "Project planning, execution and change management for SD.",
    exam: "diversity",
  },
  {
    id: "internalStakeholders",
    label: "Influencing & Partnering with Internal Stakeholders",
    description:
      "Stakeholder mapping, engagement, communications and change adoption.",
    exam: "diversity",
  },
  {
    id: "certificationProcess",
    label: "Diverse Supplier Certification Process",
    description:
      "Certification bodies, criteria, data capture and validation processes.",
    exam: "diversity",
  },
  {
    id: "qualificationProcess",
    label: "Diverse Supplier Qualification Process",
    description:
      "Capability evaluation, risk review and onboarding of diverse suppliers.",
    exam: "diversity",
  },
  {
    id: "developingSuppliers",
    label: "Developing Diverse Suppliers",
    description:
      "Supplier development, mentoring, education and capacity building.",
    exam: "diversity",
  },
  {
    id: "supplierRelationships",
    label: "Managing Relationships with Diverse Suppliers",
    description:
      "SRM, performance management and long-term relationship building.",
    exam: "diversity",
  },
  {
    id: "financeBudgeting",
    label: "Financing & Budgeting",
    description:
      "Budgeting for SD programs, business cases, funding and incentives.",
    exam: "diversity",
  },
  {
    id: "metricsReporting",
    label: "Establishing Metrics & Reporting",
    description:
      "Tier 1 / Tier 2, analytics, KPIs, dashboards and executive reporting.",
    exam: "diversity",
  },
  {
    id: "advocacyOutreach",
    label: "Advocacy & Market Outreach",
    description:
      "Market outreach, events, ecosystem partnerships and storytelling.",
    exam: "diversity",
  },
  {
    id: "sustainabilityEthics",
    label: "Sustainability, Social Responsibility & Ethics",
    description:
      "Ethical practice, ESG, inclusive policies and responsible sourcing.",
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

  // CORE (Supply Management)
  if (exam === "core") {
    if (key.includes("strategy") || key.includes("category"))
      return "core-strategy";
    if (key.includes("sourcing") || key.includes("rfp") || key.includes("rfq"))
      return "core-sourcing";
    return "core-role"; // default for core
  }

  // DIVERSITY (Supplier Diversity) – map to CPSD sections

  // 1) Very specific domain labels you already use
  // Feel free to tweak these if you change the `domain` values in cpsdQuestions.ts

  // Metrics & reporting
  if (
    ["data & reporting", "analytics", "kpis", "metrics", "reporting"].includes(
      key
    )
  ) {
    return "metricsReporting";
  }

  // Supplier development / Tier-2 / ecosystem partners
  if (
    [
      "supplier development",
      "developing suppliers",
      "tier-2",
      "ecosystem partnerships",
    ].includes(key)
  ) {
    return "developingSuppliers";
  }

  // Governance / legacy / ecosystem = program development
  if (["governance & legacy", "foundations"].includes(key)) {
    return "programDevelopment";
  }

  // Stakeholders, training & culture, myths, supplier experience = internal stakeholders / advocacy
  if (
    [
      "stakeholder engagement",
      "stakeholders",
      "training",
      "training & culture",
      "supplier experience",
    ].includes(key)
  ) {
    return "internalStakeholders";
  }
  if (["myths", "economic impact", "impact storytelling"].includes(key)) {
    return "businessCaseExecSupport";
  }

  // Technology / sourcing / category / contracting / continuous improvement = integration + metrics
  if (
    [
      "sourcing process",
      "sourcing",
      "category",
      "category management",
      "technology",
      "technology & tools",
      "contracting",
      "continuous improvement",
    ].includes(key)
  ) {
    return "programDevelopment";
  }

  // Regulatory context / ecosystem partnerships = certification + advocacy
  if (["regulatory context"].includes(key)) {
    return "certificationProcess";
  }

  // 2) Fallback substring rules (more generic)

  if (key.includes("business case") || key.includes("roi") || key.includes("executive"))
    return "businessCaseExecSupport";

  if (key.includes("program") || key.includes("strategy") || key.includes("governance"))
    return "programDevelopment";

  if (key.includes("project"))
    return "projectManagement";

  if (key.includes("stakeholder") || key.includes("internal"))
    return "internalStakeholders";

  if (key.includes("certif"))
    return "certificationProcess";

  if (key.includes("qualif"))
    return "qualificationProcess";

  if (
    key.includes("developing") ||
    key.includes("supplier development") ||
    key.includes("capacity") ||
    key.includes("mentoring")
  )
    return "developingSuppliers";

  if (
    key.includes("relationship") ||
    key.includes("srm") ||
    key.includes("relationship management")
  )
    return "supplierRelationships";

  if (key.includes("finance") || key.includes("budget"))
    return "financeBudgeting";

  if (key.includes("metric") || key.includes("kpi") || key.includes("report"))
    return "metricsReporting";

  if (key.includes("advoc") || key.includes("outreach") || key.includes("market"))
    return "advocacyOutreach";

  if (
    key.includes("sustain") ||
    key.includes("ethic") ||
    key.includes("esg") ||
    key.includes("social responsibility")
  )
    return "sustainabilityEthics";

  // 3) Last resort default
  return "businessCaseExecSupport";
}

// Build the canonical Question[] used by the rest of the app
const typedRawQuestions = rawQuestions as unknown as RawQuestion[];

export const questions: Question[] = typedRawQuestions.map((raw) => {
  const exam = mapModuleToExam(raw.module);
  const topicId = mapDomainToTopicId(exam, typeof raw.domain === "string" ? raw.domain : undefined);

  return {
    id: raw.id,
    exam,
    topicId,
    stem: raw.stem,
    options: raw.options,
    answerIndex: raw.correctIndex,
    explanation: raw.explanation ?? "",
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

// Study mode: random subset per topic
export function getRandomQuestionsForTopic(
  exam: ExamId,
  topicId: string,
  count: number = 50
): Question[] {
  const all = getQuestionsForTopic(exam, topicId);
  const shuffled = shuffleArray(all);
  const subset = shuffled.slice(0, Math.min(count, all.length));
  return shuffleOptionsForQuestions(subset);
}

// Generic shuffle
function shuffleArray<T>(array: T[]): T[] {
  const copy = [...array];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

// Shuffle options for each question while keeping the correct answer index aligned
export function shuffleOptionsForQuestions(questions: Question[]): Question[] {
  return questions.map((q) => {
    const indices = q.options.map((_, idx) => idx);
    const shuffledIndices = shuffleArray(indices);
    const shuffledOptions = shuffledIndices.map((i) => q.options[i]);
    const newAnswerIndex = shuffledIndices.indexOf(q.answerIndex);

    return {
      ...q,
      options: shuffledOptions,
      answerIndex: newAnswerIndex,
    };
  });
}

// ===========================
// MOCK EXAM GENERATION
// ===========================

// Official CPSD section blueprint for 150-question exam
const diversityExamBlueprint: Record<string, number> = {
  businessCaseExecSupport: 16,
  programDevelopment: 27,
  projectManagement: 3,
  internalStakeholders: 16,
  certificationProcess: 2,
  qualificationProcess: 12,
  developingSuppliers: 8,
  supplierRelationships: 13,
  financeBudgeting: 10,
  metricsReporting: 15,
  advocacyOutreach: 16,
  sustainabilityEthics: 12,
};

export function generateMockExam(exam: ExamId): Question[] {
  if (exam === "diversity") {
    let examQuestions: Question[] = [];

    for (const [topicId, count] of Object.entries(diversityExamBlueprint)) {
      const topicQuestions = getQuestionsForTopic(exam, topicId);
      const shuffledTopic = shuffleArray(topicQuestions);
      examQuestions.push(
        ...shuffledTopic.slice(0, Math.min(count, shuffledTopic.length))
      );
    }

    // Shuffle exam order and options inside each question
    return shuffleOptionsForQuestions(shuffleArray(examQuestions));
  }

  // For core, keep it simple: up to 150 random core questions
  const shuffledCore = shuffleArray(coreQuestions);
  const subset = shuffledCore.slice(0, Math.min(150, shuffledCore.length));
  return shuffleOptionsForQuestions(subset);
}

// ===========================
// SCORING (100–600 scale)
// ===========================

export type ExamScore = {
  exam: ExamId;
  totalQuestions: number;
  correct: number;
  rawPercent: number;
  scaledScore: number;
  passed: boolean;
};

export function scoreExam(
  exam: ExamId,
  totalQuestions: number,
  correct: number
): ExamScore {
  const rawPercent =
    totalQuestions > 0 ? (correct / totalQuestions) * 100 : 0;

  const scaledScore = scaleScore(exam, correct, totalQuestions);
  const passing = exam === "diversity" ? 480 : 400; // CPSD Essentials vs CPSM/core
  const passed = scaledScore >= passing;

  return {
    exam,
    totalQuestions,
    correct,
    rawPercent,
    scaledScore,
    passed,
  };
}

// Simple linear scaling 100–600, rounded to nearest 10
export function scaleScore(
  exam: ExamId,
  rawCorrect: number,
  totalQuestions: number
): number {
  const min = 100;
  const max = 600;

  if (totalQuestions <= 0) return min;

  const ratio = rawCorrect / totalQuestions;
  const scaled = min + ratio * (max - min);
  let rounded = Math.round(scaled / 10) * 10;

  if (rounded < min) rounded = min;
  if (rounded > max) rounded = max;

  return rounded;
}
