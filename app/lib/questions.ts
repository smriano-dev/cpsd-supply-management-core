// lib/questions.ts
// Central place for all exams, topics and questions

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
// (small starter set – you can extend later)
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

export const coreQuestions: Question[] = [
  {
    id: "core-role-1",
    exam: "core",
    topicId: "core-role",
    stem: "Which statement best describes the primary role of supply management?",
    options: [
      "To place purchase orders as cheaply as possible",
      "To ensure the right goods and services are available at the right time, cost, quality and risk level",
      "To control suppliers by enforcing penalties",
      "To move all purchasing decisions to end users",
    ],
    answerIndex: 1,
    explanation:
      "Modern supply management is about supporting organizational objectives by balancing cost, quality, risk, service and sustainability – not just issuing POs.",
  },
  {
    id: "core-role-2",
    exam: "core",
    topicId: "core-role",
    stem:
      "Which area is supply management MOST likely to influence directly?",
    options: [
      "Corporate tax policy",
      "Cost of goods sold (COGS) and operating expenses",
      "Employee income tax withholding",
      "Share price in the stock market",
    ],
    answerIndex: 1,
    explanation:
      "Supply management decisions directly impact COGS and many operating expenses through sourcing, contracts and supplier performance.",
  },
  {
    id: "core-strategy-1",
    exam: "core",
    topicId: "core-strategy",
    stem:
      "A category strategy that segments suppliers by risk and value, and defines different approaches for each segment, is an example of:",
    options: [
      "Tactical spot buying",
      "Strategic sourcing and portfolio management",
      "Invoice processing",
      "End-user self-service buying",
    ],
    answerIndex: 1,
    explanation:
      "Portfolio-based category strategies are part of strategic sourcing and help align supplier approaches with risk and value.",
  },
  {
    id: "core-sourcing-1",
    exam: "core",
    topicId: "core-sourcing",
    stem:
      "Which of the following is the BEST first step in a structured sourcing process?",
    options: [
      "Negotiate with the incumbent supplier",
      "Issue an RFP to at least three suppliers",
      "Understand business requirements and stakeholder needs",
      "Sign a short-term contract and learn later",
    ],
    answerIndex: 2,
    explanation:
      "Good sourcing starts with understanding needs: demand, specifications, service levels, constraints and success measures.",
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

// A focused but expandable question set
export const diversityQuestions: Question[] = [
  // BUSINESS CASE
  {
    id: "div-businessCase-1",
    exam: "diversity",
    topicId: "businessCase",
    stem:
      "Which statement BEST describes the modern business case for supplier diversity?",
    options: [
      "It is primarily a philanthropic donation to small businesses.",
      "It is a compliance exercise with no direct business value.",
      "It drives innovation, competitiveness and access to emerging markets while aligning with equity commitments.",
      "It mainly helps marketing produce diverse images for campaigns.",
    ],
    answerIndex: 2,
    explanation:
      "Supplier diversity supports revenue growth, innovation, resilience and brand equity, while aligning with inclusion and equity commitments.",
  },
  {
    id: "div-businessCase-2",
    exam: "diversity",
    topicId: "businessCase",
    stem:
      "An executive is skeptical and says: “We already buy from whoever is cheapest. Why change?” What is the BEST first response?",
    options: [
      "Remind them that other banks are doing it, so you should too.",
      "Explain how diverse suppliers can expand competition, reduce risk and open new client segments, not just raise costs.",
      "Say that regulations require it and there is no choice.",
      "Agree that price is the only relevant factor and drop the topic.",
    ],
    answerIndex: 1,
    explanation:
      "The most effective response connects supplier diversity to business outcomes: competition, innovation, risk mitigation and access to diverse markets.",
  },

  // PROGRAM DEVELOPMENT & STRATEGY
  {
    id: "div-programStrategy-1",
    exam: "diversity",
    topicId: "programStrategy",
    stem:
      "What is the MOST important first step when designing a supplier diversity strategy?",
    options: [
      "Selecting which advocacy councils to join.",
      "Creating a marketing campaign about the program.",
      "Understanding current spend, categories and stakeholder priorities.",
      "Immediately setting aggressive percentage targets for all categories.",
    ],
    answerIndex: 2,
    explanation:
      "A realistic strategy starts with a baseline: where spend sits today, where opportunities exist and what stakeholders need.",
  },
  {
    id: "div-programStrategy-2",
    exam: "diversity",
    topicId: "programStrategy",
    stem:
      "Which of the following BEST shows that supplier diversity is integrated into the overall procurement strategy?",
    options: [
      "The SD lead sends a quarterly newsletter to buyers.",
      "Diverse spend goals are embedded into category strategies, sourcing playbooks and buyer scorecards.",
      "The company sponsors one external diversity event each year.",
      "Suppliers are asked optional diversity questions with no follow-up.",
    ],
    answerIndex: 1,
    explanation:
      "True integration means SD goals and practices are built into category strategies, sourcing processes and KPIs.",
  },

  // SUPPLIER QUALIFICATION
  {
    id: "div-supplierQualification-1",
    exam: "diversity",
    topicId: "supplierQualification",
    stem:
      "Why is third-party certification (e.g., CAMSC, WBE, NMSDC affiliates) valuable in a supplier diversity program?",
    options: [
      "It guarantees the supplier’s prices are competitive.",
      "It confirms ownership and control meet diverse-ownership criteria and reduces internal verification effort.",
      "It replaces the need for any due diligence.",
      "It is required by law in all jurisdictions.",
    ],
    answerIndex: 1,
    explanation:
      "Certification verifies ownership/control status and gives the buyer confidence in data quality, while also reducing internal verification workload.",
  },

  // DATA CAPTURE
  {
    id: "div-dataCapture-1",
    exam: "diversity",
    topicId: "dataCapture",
    stem:
      "Which practice BEST improves the accuracy of diversity spend data?",
    options: [
      "Allowing suppliers to self-identify in free-text fields.",
      "Manually tagging suppliers based on their website photos.",
      "Linking supplier records to certification bodies and periodically refreshing data.",
      "Only tracking Tier 1 diverse suppliers and ignoring Tier 2 data.",
    ],
    answerIndex: 2,
    explanation:
      "Connecting supplier records with certifying bodies and updating them regularly improves accuracy and auditability of diversity data.",
  },

  // ADVOCACY
  {
    id: "div-advocacy-1",
    exam: "diversity",
    topicId: "advocacy",
    stem:
      "Which example BEST illustrates effective executive-level advocacy for supplier diversity?",
    options: [
      "Sending a generic diversity statement to suppliers once a year.",
      "An executive sponsors a steering committee, reviews dashboards quarterly and holds leaders accountable for progress.",
      "Creating a supplier diversity logo and posting it on the website.",
      "Leaving the topic only to ERGs and community relations.",
    ],
    answerIndex: 1,
    explanation:
      "Executive sponsorship plus governance and accountability are key to advocacy that drives change.",
  },

  // GLOBAL LANDSCAPE
  {
    id: "div-globalLandscape-1",
    exam: "diversity",
    topicId: "globalLandscape",
    stem:
      "Which statement about the global supplier diversity certification landscape is MOST accurate?",
    options: [
      "There is a single global council that certifies all diverse suppliers.",
      "Different regions have their own councils (e.g., CAMSC, MSDUK, Supply Nation) that align with the NMSDC/WBENC model.",
      "Certification exists only in the United States.",
      "Global companies should avoid local councils to keep processes simple.",
    ],
    answerIndex: 1,
    explanation:
      "Different regions have their own certifying bodies and councils; global programs typically build networks across them.",
  },

  // OUTREACH
  {
    id: "div-outreach-1",
    exam: "diversity",
    topicId: "outreach",
    stem:
      "Which activity is MOST likely to create real sourcing opportunities for diverse suppliers?",
    options: [
      "A general networking reception with no category focus.",
      "Internal/external opportunity fairs where sourcing projects and buyers are clearly matched with capable diverse suppliers.",
      "Posting a diversity statement on the intranet.",
      "A quarterly lunch-and-learn with no follow-up.",
    ],
    answerIndex: 1,
    explanation:
      "Opportunity fairs that link real projects, buyers and qualified suppliers create tangible sourcing opportunities.",
  },

  // REPORTING
  {
    id: "div-reporting-1",
    exam: "diversity",
    topicId: "reporting",
    stem:
      "Which example BEST describes Tier 2 diverse spend reporting?",
    options: [
      "Spend with diverse suppliers your company pays directly.",
      "Spend by your suppliers with their own diverse subcontractors on your behalf.",
      "All spending with small businesses regardless of ownership.",
      "Government-mandated set-aside volumes.",
    ],
    answerIndex: 1,
    explanation:
      "Tier 2 tracks spend that your prime suppliers direct to diverse firms in support of your business.",
  },

  // INTEGRATION INTO SOURCING
  {
    id: "div-integration-1",
    exam: "diversity",
    topicId: "integration",
    stem:
      "Which sourcing practice BEST supports supplier diversity?",
    options: [
      "Re-using the same incumbent supplier without market checks.",
      "Including diverse suppliers in market scans, RFx events and competitive negotiations where they are capable.",
      "Only inviting diverse suppliers for low-value spot buys.",
      "Letting suppliers self-declare diversity with no verification.",
    ],
    answerIndex: 1,
    explanation:
      "Real integration means diverse suppliers are considered wherever they are capable of competing, not only for small-value work.",
  },

  // RISK & COMPLIANCE
  {
    id: "div-riskCompliance-1",
    exam: "diversity",
    topicId: "riskCompliance",
    stem:
      "Which is a key RISK of mis-reporting diversity spend in public disclosures?",
    options: [
      "Higher travel costs for procurement staff.",
      "Minor internal inconvenience only.",
      "Regulatory scrutiny, reputational damage and potential loss of client or government contracts.",
      "Suppliers may request longer payment terms.",
    ],
    answerIndex: 2,
    explanation:
      "Mis-reporting can lead to legal, regulatory and reputational consequences, especially in regulated sectors and government work.",
  },
];

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
  const all =
    exam === "core" ? coreQuestions : diversityQuestions;
  return all.filter((q) => q.topicId === topicId);
}
